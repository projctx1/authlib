import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

let config = {};


/**
 * Initialize the Auth SDK
 */
export function initAuth({
  mongoUri,
  jwtSecret,
  baseUrl,
}) {
  config.mongoUri = mongoUri;
  config.jwtSecret = jwtSecret;
  config.baseUrl = baseUrl;
}

/**
 * Register a new user
 */
export async function register(email, password) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  return { message: "User registered", id: user._id };
}

/**
 * Login user and return JWT
 */
export async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1d" });
  return { token };
}


/**
 * Request OTP Login (Email Only)
 * ------------------------------------------------------------
 * Generates a one-time OTP and sends it to the user's email.
 */
export async function requestOtpLogin(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;  

  user.loginOTP = otp;
  user.loginOTPExpiry = otpExpiry;
  await user.save();

  try {
    await resend.emails.send({
      from: "Auth Support <no-reply@securesecurity.com>",
      to: email,
      subject: "Your Login OTP Code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f9f9f9;border-radius:10px">
          <h2>🔑 Login Verification</h2>
          <p>Use this OTP to sign in to your account:</p>
          <h1 style="color:#007BFF;letter-spacing:5px;">${otp}</h1>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore the email.</p>
        </div>
      `,
    });

    return { message: "OTP sent to your email" };
  } catch (err) {
    console.error("Resend Error:", err);
    throw new Error("Failed to send login OTP");
  }
}

/**
 * Verify OTP Login (Email Only)
 * ------------------------------------------------------------
 * Validates the OTP and issues a JWT if successful.
 */
export async function verifyOtpLogin(email, otp) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (user.loginOTP !== otp || Date.now() > user.loginOTPExpiry)
    throw new Error("Invalid or expired OTP");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  user.loginOTP = undefined;
  user.loginOTPExpiry = undefined;
  await user.save();

  return { message: "Login successful", token };
}


/**
 * Forgot Password (Send OTP)
 * ------------------------------------------------------------
 * Generates a 6-digit OTP, stores it in the DB temporarily,
 * and emails it to the user.
 */
export async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;  

  user.resetOTP = otp;
  user.resetOTPExpiry = otpExpiry;
  await user.save();

  try {
    await resend.emails.send({
      from: "Auth Operation <no-reply@securesecurity.com>", 
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8f8f8;border-radius:10px">
          <h2 style="color:#333">🔐 Password Reset Verification</h2>
          <p>Hi ${user.name || "there"},</p>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing:5px;color:#007BFF">${otp}</h1>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <hr>
          <p style="font-size:12px;color:#999">© ${new Date().getFullYear()}. All rights reserved.</p>
        </div>
      `,
    });

    return { message: "OTP sent to your email" };
  } catch (err) {
    console.error(" Resend Email Error:", err);
    throw new Error("Failed to send OTP email");
  }
}

/**
 * Reset Password — Verify OTP
 * ------------------------------------------------------------
 * Verifies the OTP and securely updates the user's password.
 */
export async function resetPassword(email, otp, newPassword) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (user.resetOTP !== otp || Date.now() > user.resetOTPExpiry)
    throw new Error("Invalid or expired OTP");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.resetOTPExpiry = undefined;
  await user.save();

  try {
    await resend.emails.send({
      from: "Auth Operation <no-reply@securesecurity.com>",
      to: email,
      subject: "Password Reset Successful",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8f8f8;border-radius:10px">
          <h2 style="color:#28a745">Password Reset Successful</h2>
          <p>Your password has been updated successfully.</p>
          <p>If this wasn’t you, please contact support immediately.</p>
          <hr>
          <p style="font-size:12px;color:#999">© ${new Date().getFullYear()}. All rights reserved.</p>
        </div>
      `,
    });
  } 
  catch (err) {
    console.warn(" Failed to send confirmation email:", err.message);
  }

  return { message: "Password reset successful" };
}


/**
 * Change password (requires JWT)
 */
export async function changePassword(token, oldPassword, newPassword) {
  const decoded = jwt.verify(token, config.jwtSecret);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("Invalid token");

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new Error("Incorrect old password");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Password changed successfully" };
}
