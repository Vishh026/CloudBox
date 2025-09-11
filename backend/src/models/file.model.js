const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileName: {
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
    filePath: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true,
    },
    folderId: {
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
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    imageKitFileId: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    shareToken: {
      type:String,
      default:false
    },
    collaborators : [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type:String,
          enum:["read","edit"],
          default:"read"
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ folderId: 1})

const file = mongoose.model("File", fileSchema);

module.exports = file;
