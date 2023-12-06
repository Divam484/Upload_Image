const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  name: {
    type: String
  },
  image: {
    type:String
  },
});

module.exports = Image = mongoose.model("Image", imageSchema);
