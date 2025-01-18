require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const User = require("./models/User");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
// Middleware to parse JSON data
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

// avatar Upload Route
app.post("/api/upload", upload.single("avatar"), async (req, res) => {
  const { username, email } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No photo file uploaded" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "Nodejs_data", //optinal
    });

    // Remove the file from the server after upload
    fs.unlinkSync(req.file.path);

    const newUser = await User.create({
      username,
      email,
      avatar: {
        public_id: result.public_id,
        secure_url: result.secure_url,
      },
    });
    console.log(newUser);

    // await newUser.save();
    return res
      .status(201)
      .json({ newUser, message: "User registered Successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
