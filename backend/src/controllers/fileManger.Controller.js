const fileModel = require("../models/file.model");
const ApiError = require("../utilities/ApiError");
const ApiResponse = require("../utilities/ApiResponse");
const imagekit = require("../services/imagekit");
const { uploadOnImagekit } = require("../services/filemanager.imagekit");
const fs = require("fs");
const { deletefromImagekit } = require("../services/filemanager.imagekit");
const { buildSortStage, buildQuery } = require("../utilities/buildQuery");

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
    "text/plain",
  ];
  if (documentTypes.includes(mimeType)) return "document";
  return "other";
}

const uploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(
          new ApiError(400, "No file uploaded", ["No file found in request"])
        );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "audio/mpeg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json(new ApiError(400, "Unsupported file type", [req.file.mimetype]));
    }

    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (req.file.size > maxSize) {
      return res
        .status(400)
        .json(
          new ApiError(400, "File too large", [
            `Max size is ${maxSize / (1024 * 1024)}MB`,
          ])
        );
    }

    // Upload to ImageKit
    const fileData = await uploadOnImagekit(req.file);
    console.log("filedata of imaegkit:", fileData);
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
      filePath: fileData.filePath,
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

const deleteFileController = async (req, res) => {
  // get the user id from user and
  // file id from params
  // find fileid in db -> valiadation
  // check ownership => file.userid === userid
  // check if fileid in imagekit => delete
  // delet from db => findbyIdanddelte

  const fileId = req.params.id;
  const userId = req.user.id;

  console.log("file id ", fileId);
  console.log("user id: ", userId);

  const file = await fileModel.findById(fileId);

  if (!file) {
    throw new ApiError(401, "File not found");
  }

  if (file.uploadedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this file");
  }

  if (file.imageKitFileId) {
    try {
      await deletefromImagekit(file.imageKitFileId);
    } catch (error) {
      console.log("Imagekit delete error", error.message);
      throw new ApiError(403, "Invalid access");
    }
  }

  await fileModel.findByIdAndDelete(fileId);

  res
    .status(200)
    .json(new ApiResponse(201, { deletedFileId: fileId }, "file deleted"));
};

const getMyFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, sort = "newest" } = req.query;
    const filter = { uploadedBy: userId, isTrashed: false };
    const sortStage = buildSortStage(sort);

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await fileModel.countDocuments(filter);

    const files = await fileModel
      .find(filter)
      .sort(sortStage)
      .skip(skip)
      .limit(limitNum)
      .select("-__v");

    return res.status(200).json({
      message: "All files fetched successfully",
      page: pageNum,
      limit: limitNum,
      total,
      hasMore: skip + files.length < total,
      files,
    });
  } catch (error) {
    console.error("Error fetching all files:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getFilterFiles = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, sort = "newest" } = req.query;

    const filter = buildQuery(req.query, userId);
    const sortStage = buildSortStage(sort);
    console.log("filter",filter);
    console.log("sortstage",sortStage);
    
    
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await fileModel.countDocuments(filter);

    const files = await fileModel
      .find(filter)
      .sort(sortStage)
      .skip(skip)
      .limit(limitNum)
      .select("-__v");

    return res.status(200).json(
      new ApiResponse(
        201,
        {
          page: pageNum,
          limit: limitNum,
          total,
          hasMore: skip + files.length < total,
          files,
        },
        "Filtered files fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching filtered files:", error);
    throw new ApiError(500, "Server error");
  }
};

const downloadFile = async (req, res) => {
  // get the userid and fileid
  // find file in filemodel
  // check ownership
  // genrate signedurl
  // send response
  try {
    const userId = req.user._id; // from auth middleware
    const fileId = req.params.id;

    // 1. Find file
    const file = await fileModel.findById(fileId);
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    // 2. Check ownership
    if (file.uploadedBy.toString() !== userId.toString()) {
      throw new ApiError(403, "Unauthorized to access this file");
    }

    // 3. Generate signed URL
    const signedUrl = imagekit.url({
      path: file.filePath, // make sure filePath is saved in upload
      signed: true,
      expireSeconds: 60 * 5, // 5 minutes
    });

    console.log("Signed URL:", signedUrl);

    // 4. Send response
    return res
      .status(200)
      .json(new ApiResponse(200, { signedUrl }, "Signed URL generated"));
  } catch (error) {
    console.error(error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Something went wrong"
        )
      );
  }
};

module.exports = {
  uploadController,
  deleteFileController,
  getMyFile,
  downloadFile,
  getFilterFiles,
};
