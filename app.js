const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const imageModel = require("./image.model");
const app = express();

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
  const newImage = new imageModel({
    name: req.body.name,
    image: req.file.filename,
  });

  newImage.save().catch((err) => console.log(err));

  // console.log('---newImage--',newImage)
  res.send("File uploaded successfully.");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
