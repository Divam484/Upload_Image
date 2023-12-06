const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Image = require("./image.model");
const fs = require("fs");
const path = require("path");
const app = express();
const CryptoJS = require("crypto-js");

//DB connect
mongoose
  .connect("mongodb://localhost:27017/images")
  .then(() => console.log("Db connect"))
  .catch((err) => console.log(err, "it has an error"));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Route for handling file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  // Access the uploaded file information in req.file
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("-file-", req.file);
  const newImage = new imageModel({
    name: req.body.name,
    image: req.file.filename,
  });

  newImage.save().catch((err) => console.log(err));

  // console.log('---newImage--',newImage)
  res.send("File uploaded successfully.");
});
app.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if the image exists
    const existingImage = await Image.findById(id);
    if (!existingImage) {
      return res.status(404).json({ message: "Image not found" });
    }

  
    // Update only if a new image is provided
    if (req.file) {
      // Calculate checksums of the existing and new images
      const existingImageChecksum = CryptoJS.MD5(
        existingImage.image
      ).toString();
      const newImageChecksum = CryptoJS.MD5(req.file.filename).toString();

      // Check if the images are different
      if (existingImageChecksum !== newImageChecksum) {
        // Remove existing image
        if (existingImage.image) {
          const imagePath = path.join(__dirname,"uploads/", existingImage.image);
          fs.unlinkSync(imagePath);
        }

        // Update with the new image
        existingImage.image = req.file.filename;
      }
      else{
        res.json({ message: "image exist" });
      }
    }

    // Update other fields
    existingImage.name = name;
    await existingImage.save();

    res.json({ message: "updated successfully", image: existingImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
