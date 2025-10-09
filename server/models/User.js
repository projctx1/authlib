import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    jwtToken: {
      type: String,
      required: false
    },
    resetOTP: String,
    resetOTPExpiry: Date,
    loginOTP : String,
    loginOTPExpiry : Date,
  },
  { timestamps: true }
);

export default mongoose.model("SDKUser", userSchema);
