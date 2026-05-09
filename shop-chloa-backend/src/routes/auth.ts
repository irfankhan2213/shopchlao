import { Router } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authenticateToken } from "../middleware/authMiddleware";

const authRoutes = Router();
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";

// User Registration
authRoutes.post("/signup", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        missing: [
          !first_name && "first_name",
          !last_name && "last_name",
          !email && "email",
          !password && "password",
        ].filter(Boolean),
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    // Encrypt password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      jwtSecret,
      { expiresIn: "3h" }
    );
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.log("signup api error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      jwtSecret,
      { expiresIn: "3h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error("login api error", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Save store details
authRoutes.post("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { phone, city, address, state, shopName } = req.body;
    if (!phone || !city || !address || !state || !shopName) {
      return res.status(400).json({
        message: "Missing required fields",
        missing: [
          !phone && "phone",
          !city && "city",
          !address && "address",
          !state && "state",
          !shopName && "shopName",
        ].filter(Boolean),
      });
    }
    // Save store details to the database
    const store = await User.updateOne(
      { _id: userId },
      {
        phone: phone,
        city: city,
        address: address,
        state: state,
        shopName: shopName,
        profileCompleted: true,
      }
    );

    res.status(201).json({ message: "Store created successfully", store });
  } catch (err) {
    console.log("store creation error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// User Authentication
authRoutes.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    // Generate OTP and send it to user's email
    // const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
    const otp = "0786"; // For testing purposes, using a static OTP
    user.otp = otp;
    user.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes
    await user.save();

    // Generate an OTP token (distinct from access token)
    const token = jwt.sign({ email, type: "otp" }, jwtSecret, {
      expiresIn: "15m",
    });
    res.json({ message: "OTP sent successfully", token });
  } catch (err) {
    console.log("send api error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// User Authentication
authRoutes.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;
    const otpToken = req.headers.authorization?.split(" ")[1];
    if (!otpToken)
      return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(otpToken, jwtSecret);
    if (typeof decoded !== "object" || decoded.type !== "otp") {
      return res.status(401).json({ message: "Invalid token type" });
    }
    const email = decoded.email;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    // Verify OTP
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (user.expiresAt < new Date())
      return res.status(400).json({ message: "OTP has expired" });
    // OTP is valid, generate JWT

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      jwtSecret,
      { expiresIn: "3h" }
    );
    res.json({
      token,
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//get user details
authRoutes.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded.id).select("-otp -expiresAt");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default authRoutes;
