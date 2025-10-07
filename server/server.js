import express from "express";
import createAuthSDK from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

const app = express();

// ✅ Enable CORS for all origins BEFORE routes
app.use(cors({
  origin: "*", // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());


connectDB();

app.use(
  "/auth",
  createAuthSDK({
    onLogin: async (req, result) => {
      console.log("User info:", result);
      console.log("Request body:", req.body);
    },

    onRegister: async (req, result) => {
      console.log("User registered:", result);
      return { id: 1, ...result };
    },

    onForgotPassword: async (req, result) => {
      console.log("Forgot password triggered for:", req.body.email);
      return { message: `Reset otp sent to ${req.body.email}` };
    },

    onChangePassword: async (req, result) => {
      console.log("Password changed:", result);
    },
  })
);


app.get('/', (req, res) => {
    return res.json('Auth SDK running on http://localhost:3000');
});


app.listen(3000, () => console.log("Auth SDK running on http://localhost:3000"));
