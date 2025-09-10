const fileModel = require("../models/file.model");
const ApiError = require("../utilities/ApiError");
const ApiResponse = require("../utilities/ApiResponse");
const imagekit = require("../services/imagekit");
const fs = require("fs");
const {
  deletefromImagekit,
  uploadOnImagekit,
} = require("../services/filemanager.imagekit");
const {
  buildSortStage,
  buildQuery,
  fetchFiles,
} = require("../services/buildQuery.service");
const { getFileById } = require("../services/file.service");
const { determineFileType, allowedTypes } = require("../utilities/files.utils");
const { generateShareToken } = require("../utilities/TokenGenrator");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      console.log(req.file);
      return res
        .status(400)
        .json(
          new ApiError(400, "No file uploaded", ["No file found in request"])
        );
    }

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
     isPublic:false,
     shareToken: null
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

const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await getFileById(fileId, req.user._id);

    if (file.imageKitFileId) {
      try {
        await deletefromImagekit(file.imageKitFileId);
      } catch (error) {
        console.log(error);

        console.log("Imagekit delete error", error.message);
        throw new ApiError(403, "Invalid access");
      }
    }

    await fileModel.findByIdAndDelete(fileId);

    return res
      .status(200)
      .json(new ApiResponse(200, { deletedFileId: fileId }, "File deleted"));
  } catch (err) {
    console.error("Delete error:", err);
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiError(err.statusCode || 500, err.message || "Delete failed")
      );
  }
};

const getMyFile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { page, limit, sort } = req.query;
    const filter = { uploadedBy: userId, isTrashed: false };

    const sortStage = buildSortStage(sort);

    const result = await fetchFiles({ filter, page, limit, sortStage });
    return res
      .status(200)
      .json(new ApiResponse(201, result, "file fetch sucessfully"));
  } catch (error) {
    console.error("Error fetching all files:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getFilterFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const { page, limit, sort } = req.query;

    const sortStage = buildSortStage(sort);
    const filter = buildQuery(req.query, userId);

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
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

const openFile = async (req, res) => {
  try {
    const file = await getFileById(req.params.id, req.user._id);
    res
      .status(200)
      .json(new ApiResponse(200, file, "File fetched successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error in fetching file"
    );
  }
};

const downloadFile = async (req, res) => {
  // get the userid and fileid
  // find file in filemodel
  // check ownership
  // genrate signedurl
  // send response
  try {
    const fileId = req.params.id;
    const file = await getFileById(fileId, req.user._id);

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

const renameFile = async (req, res) => {
  try {
    const { newName } = req.body;

    const fileId = req.params.id;
    const file = await getFileById(fileId, req.user._id);

    // 1. Validate input
    if (!fileId || !newName || newName.trim() === "") {
      throw new ApiError(400, "File ID ad new name is required");
    }

    // 2. Check name conflict in the same folder
    const conflict = await fileModel.findOne({
      parentFolder: file.parentFolder,
      fileName: newName,
      userId: req.user._id,
    });

    if (conflict) {
      throw new ApiError(400, "A file/folder with this name already exists");
    }

    // update the filename
    file.fileName = newName;
    await file.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "File renamed sucessfully"));
  } catch (err) {
    console.log(err);
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiError(err.statusCode || 500, err.message || "Rename failed")
      );
  }
};

const togglePublic = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await getFileById(fileId, req.user._id);
    if (!file.isPublic) {
      
      (file.isPublic = true), 
      (file.shareToken = generateShareToken());
    } else {
      (file.isPublic = false), (file.shareToken = null);
    }

    await file.save();

    res.status(200).json(
      new ApiResponse(201, {
        message: `file IS NOW ${file.isPublic ? "public" : "private"}`,
        shareLink: file.isPublic
          ? `http://localhost:3000/api/file/share/${file.shareToken}`
          : null,
      })
    );
  } catch (error) {
    console.log(error)
    throw new ApiError(400, error.message);
  }
}

const getPublicFile = async (req, res,next) => {
  try {
    const shareToken = req.params.shareToken;
    console.log("shretoken", shareToken);

    const file = await fileModel.findOne({ sharetoken: shareToken });
    if (!file) {
      throw new ApiError(401, "File not found");
    }
    if (!file.isPublic) {
      throw new ApiError(401, "File has been private");
    }

    res.status(200).json(
      new ApiResponse(201, {
      fileName: file.fileName,
      url: file.url,
      size: file.size,
      type: file.type,
    },
    shareToken)
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  getMyFile,
  downloadFile,
  getFilterFiles,
  openFile,
  renameFile,
  togglePublic,
  getPublicFile,
};
