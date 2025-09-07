const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const folderModel = mongoose.model("folder", folderSchema);

module.exports = folderModel;
