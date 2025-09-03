const fileModel = require("../models/file.model");
const ApiError = require("../utilities/ApiError");
const ApiResponse = require("../utilities/ApiResponse");
const fs = require("fs");
const { uploadOnImagekit } = require("../services/imagekit");

function determineFileType(mimeType) {
  if (mimeType.startsWith("image")) return "image";
  if (mimeType.startsWith("video")) return "video";
  if (mimeType.startsWith("audio")) return "audio";

  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain"
  ];
  if (documentTypes.includes(mimeType)) return "document";
  return "other";
}

const uploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(new ApiError(400, "No file uploaded", ["No file found in request"]));
    }

    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "audio/mpeg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json(new ApiError(400, "Unsupported file type", [req.file.mimetype]));
    }

    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (req.file.size > maxSize) {
      return res
        .status(400)
        .json(new ApiError(400, "File too large", [`Max size is ${maxSize / (1024 * 1024)}MB`]));
    }

    // console.log(
    //   "Temp file exists:",
    //   await fs.stat(req.file.path).then(() => true).catch(() => false)
    // );

    // Upload to ImageKit
    const fileData = await uploadOnImagekit(req.file);
    
    // Remove temp file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
      else console.log("Temp file removed");
    });

    // Save metadata
    const savedFile = await fileModel.create({
      fileName: req.file.originalname,
      url: fileData.url,
      size: req.file.size,
       mimeType: req.file.mimetype,       
      type: determineFileType(req.file.mimetype),
      imageKitFileId: fileData.fileId,
      uploadedBy: req.user?.id || null,
      folder: req.body.folderId || null,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, savedFile, "File uploaded successfully"));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(new ApiError(500, "File upload failed", [err.message]));
  }
};

module.exports = { uploadController };
