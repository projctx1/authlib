// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  requestOtpLogin,
  verifyOtpLogin,
  initAuth,
} from "../services/authService.js";

/**
 * Create a reusable authentication router.
 * @param {Object} handlers - Optional handler callbacks.
 * @param {Function} handlers.onLogin - Called when login route is hit.
 * @param {Function} handlers.onRegister - Called when register route is hit.
 * @param {Function} handlers.onForgotPassword - Called when forgot-password route is hit.
 * @param {Function} handlers.onResetPassword - Called when reset-password route is hit.
 * @param {Function} handlers.onChangePassword - Called when change-password route is hit.
 * @returns {Router} Express Router instance.
 */

/**
 * createAuthRoutes - Factory function to create authentication routes.
 * Allows developers to pass custom callback handlers (e.g., onLogin, onRegister)
 * for extended functionality.
 *
 * @handlers {Object} Optional callback functions for route customization.
 * @return {Router} Express Router instance containing all auth endpoints.
 */
const createAuthSDK = (handlers = {}) => {
  const router = express.Router();

  /**
   * GET /init
   * -------------------------------------------------------
   * Initializes authentication service.
   * Useful for setup or verification of auth service readiness.
   */
  router.get("/init", async (req, res) => {
    try {
      const result = await initAuth();
      res.json({
        success: true,
        message: "Auth initialized",
        data: result,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  /**
   * POST /register
   * -------------------------------------------------------
   * Handles user registration. Invokes developer-defined
   * `onRegister` callback if provided.
   */
  router.post("/register", async (req, res) => {
    try {
      const result = await register(req.body);

      if (handlers.onRegister) await handlers.onRegister(req, result);

      res.json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  /**
   * POST /login
   * -------------------------------------------------------
   * Authenticates a user. If authentication succeeds, the
   * `onLogin` callback is triggered (if defined).
   */
  router.post("/login", async (req, res) => {
    try {
      const result = await login(req.body);

      if (handlers.onLogin) await handlers.onLogin(req, result);

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });


/*  Request OTP Login
*  ----------------------------------------------------------
*  Route: POST /login/request-otp
*  Purpose: Generates a one-time password (OTP) and sends it
*           to the user's email using the Resend API.
*  Expected Input: { email }
*  Response: Success message if OTP was sent successfully.
*/
router.post("/login/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await requestOtpLogin(email);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/*  Verify OTP Login
*  ----------------------------------------------------------
*  Route: POST /login/verify-otp
*  Purpose: Verifies the one-time password (OTP) sent to
*           the user’s email and returns a JWT token on success.
*  Expected Input: { email, otp }
*  Response: JWT token if verification is successful.
*/
router.post("/login/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtpLogin(email, otp);
   if (handlers.onLogin) await handlers.onLogin(req, result);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


  /**
   * POST /forgot-password
   * -------------------------------------------------------
   * Initiates password reset process by sending a reset link
   * to the provided email. Calls `onForgotPassword` if available.
   */
  router.post("/forgot-password", async (req, res) => {
    try {
      const result = await forgotPassword(req.body);

      if (handlers.onForgotPassword)
        await handlers.onForgotPassword(req, result);

      res.json({
        success: true,
        message: "Reset link sent",
        data: result,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  /**
   * POST /reset-password
   * -------------------------------------------------------
   * Resets the user’s password after validating the reset token.
   * Triggers `onResetPassword` callback if defined.
   */
  router.post("/reset-password", async (req, res) => {
    try {
      const result = await resetPassword(req.body);

      if (handlers.onResetPassword)
        await handlers.onResetPassword(req, result);

      res.json({
        success: true,
        message: "Password reset successfully",
        data: result,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  /**
   * POST /change-password
   * -------------------------------------------------------
   * Allows a logged-in user to change their password.
   * Executes `onChangePassword` callback if supplied.
   */
  router.post("/change-password", async (req, res) => {
    try {
      const result = await changePassword(req.body);

      if (handlers.onChangePassword)
        await handlers.onChangePassword(req, result);

      res.json({
        success: true,
        message: "Password changed successfully",
        data: result,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  return router;
};


export default createAuthSDK;
