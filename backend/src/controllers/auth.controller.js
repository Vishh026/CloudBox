const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { username, email, password,profilePicture } = req.body;
    console.log(req.body);
    
    
    
    if (!username || !email || !password || !profilePicture) {
      return res.status(400).json({ message: "All feilds are required" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: profilePicture || "",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("TOKEN", token);

    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture ,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ message: "All feilds are required" });
    }
    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username : identifier }],
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        // profilePicture: user.profilePicture
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerController, loginController };
