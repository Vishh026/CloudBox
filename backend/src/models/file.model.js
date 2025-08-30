const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      required: true, // Cloud URL or local path
    },
    type: {
      type: String,
      enum: ["image", "document", "video", "audio", "other"],
      default: "other",
    },
    size: {
      type: Number,
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null, // null = root directory
    },
    isStarred: {
      type: Boolean,
      default: false, // user can star important files
    },
    isTrashed: {
      type: Boolean,
      default: false, // soft delete (like Google Drive Trash)
    },
  },
  {
    timestamps: true,
  }
);

const file = mongoose.model("file", fileSchema);

module.exports = file;
