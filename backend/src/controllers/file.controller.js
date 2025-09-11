const fs = require("fs");
const mongoose = require("mongoose");
const imagekit = require('../services/imagekit')
const fileModel = require("../models/file.model");
const userModel = require("../models/user.model");
const { deletefromImagekit, uploadOnImagekit } = require("../services/filemanager.imagekit");
const { buildSortStage, buildQuery, fetchFiles } = require("../services/buildQuery.service");
const { getFileById } = require("../services/file.service");
const { determineFileType, allowedTypes } = require("../utilities/files.utils");
const { generateShareToken } = require("../utilities/TokenGenrator");
const ApiError = require("../utilities/ApiError");
const ApiResponse = require("../utilities/ApiResponse");

const uploadFile = async (req, res,next) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  
  try {
    const user = req.user;

    if (!req.file) throw new ApiError(400, "No file uploaded")
    if (!allowedTypes.includes(req.file.mimetype)) throw new ApiError(400, "Unsupported file type", [req.file.mimetype])

    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (req.file.size > maxSize) throw new ApiError(400, `Max file size is ${maxSize / (1024 * 1024)}MB`)


    // Calculate the file storage
    if (user.storageUsed + req.file.size > user.storageLimit) throw new ApiError(401, "Storage limit exceeded");
  
    // Upload to ImageKit
    const fileData = await uploadOnImagekit(req.file);

     // Remove temp file asynchronously
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Temp file deletion failed:", err);
    });
    

    // Save metadata
    const savedFile = await fileModel.create([{
      fileName: req.file.originalname,
      url: fileData.url,
      size: req.file.size,
      mimeType: req.file.mimetype,
      filePath: fileData.filePath,
      type: determineFileType(req.file.mimetype),
      imageKitFileId: fileData.fileId,
      uploadedBy: req.user?._id,
      folderId: req.body.folderId || null,
      isPublic: false,
      shareToken: null,
      collaborators: [],
    }],{session});

    // Update user storage
    user.storageUsed += req.file.size;
    await user.save({session});

    await session.commitTransaction()
    session.endSession()

    return res
      .status(201)
      .json(new ApiResponse(201, savedFile[0], "File uploaded successfully"));
  } catch (err) {
    next(new ApiError(err.statusCode || 500, err.message ||"File upload failed", [err.message]));
  }
};

const deleteFile = async (req, res,next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const fileId = req.params.id;
    const file = await getFileById(fileId, req.user._id);

    if (!file) throw new ApiError(404, "File not found");
    
    //Delete from Imagekit
    if (file.imageKitFileId) await deletefromImagekit(file.imageKitFileId);
      
    // Delete from database
    await fileModel.findByIdAndDelete(fileId,{session});

    // Update user
    const user = await userModel.findById(req.user._id).session(session);
    user.storageUsed  = Math.max(user.storageUsed -file.size,0)
    await user.save({session});

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(new ApiResponse(200, { deletedFileId: fileId }, "File deleted successfully"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession()
    next(new ApiError(err.statusCode || 500, err.message || "File deletion failed"));
  }
};

const getMyFile = async (req, res,next) => {
  try {
    const userId = req.user._id;
    const { page, limit, sort, folderId } = req.query;

    const filter = { 
      uploadedBy: userId, 
      isTrashed: false ,
      folderId: folderId ||null 
     };

    const sortStage = buildSortStage(sort);

    const result = await fetchFiles({ 
      filter, page, limit, sortStage
    });

  return res.status(200).json(new ApiResponse(200, result, "Files fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Fetching files failed"));
  }
};

const getFilterFiles = async (req, res,next) => {
  try {
    const userId = req.user._id;
    const { page, limit, sort } = req.query;

    const filter = buildQuery(req.query, userId);
    const sortStage = buildSortStage(sort);
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await fileModel.countDocuments(filter);

    const files = await fileModel
      .find(filter)
      .sort(sortStage)
      .skip(skip)
      .limit(limitNum)
      .select("-__v")

    return res.status(200).json(new ApiResponse(200, {
      page: pageNum,
      limit: limitNum,
      total,
      hasMore: skip + files.length < total,
      files
    }, "Filtered files fetched successfully"));
    
  } catch (error) {
      console.error(err);
    next(new ApiError(500, "Fetching filtered files failed"));
  }
};

const openFile = async (req, res) => {
  try {
    const file = await getFileById(req.params.id, req.user._id);

    return res.status(200).json(new ApiResponse(200, file, "File fetched successfully"));
    } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Error in fetching file"
    );
  }
};

const downloadFile = async (req, res,next) => {
  // get the userid and fileid
  // find file in filemodel
  // check ownership
  // genrate signedurl
  // send response
  try {
    const file = await getFileById(req.params.id, req.user._id);
    if (!file) throw new ApiError(404, "File not found");
    
    // 3. Generate signed URL
    const signedUrl = imagekit.url({
      path: file.filePath, 
      signed: true,
      expireSeconds: 60 * 5,
    });

    // 4. Send response
    return res
      .status(200)
      .json(new ApiResponse(200, { signedUrl }, "Signed URL generated"));
  } catch (error) {
    next(new ApiError(error.statusCode || 500, error.message || "Download failed"));
  }
};

const renameFile = async (req, res,next) => {
  try {
    const { newName } = req.body;
    const fileId = req.params.id;

    if (!fileId || !newName || newName.trim() === "") {
      throw new ApiError(400, "File ID ad new name is required");
    }

    const file = await getFileById(fileId, req.user._id);
    if (!file) {
      throw new ApiError(404, "File not found");
    }
    

    // Check name conflict in the same folder
    const conflict = await fileModel.findOne({
      parentFolder: file.parentFolder || null,
      fileName: newName,
      uploadedBy: req.user._id,
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
    next(new ApiError(err.statusCode || 500, err.message || "Rename failed"))  
  }
};

const togglePublic = async (req, res,next) => {
  try {
    const file = await getFileById(req.params.id, req.user._id);
    if (!file) throw new ApiError(404, "File not found");


    if (!file.isPublic) {
      (file.isPublic = true), (file.shareToken = generateShareToken());
    } else {
      (file.isPublic = false), (file.shareToken = null);
    }

    await file.save();

    return res.status(200).json(
      new ApiResponse(201, {
        message: `file IS NOW ${file.isPublic ? "public" : "private"}`,
        shareLink: file.isPublic
          ? `http://localhost:3000/api/file/share/${file.shareToken}`
          : null,
      })
    );
  } catch (error) {
    next(new ApiError(error.statusCode || 500, error.message || "Toggle public failed"));
  }
};

const getPublicFile = async (req, res, next) => {
  try {
    const shareToken = req.params.shareToken;

    const file = await fileModel.findOne({ shareToken: shareToken });  // ✅ correct field name
if (!file || !file.isPublic) {
  throw new ApiError(404, "Public File not found");                // ✅ correct status code
}


    return res.status(200).json(
      new ApiResponse(
        201,
        {
          fileName: file.fileName,
          url: file.url,
          size: file.size,
          type: file.type,
        },
        shareToken
      )
    );
  } catch (err) {
    next(new ApiError(err.statusCode || 500, err.message || "Get public file failed"));
  }
};

const addcollaborators = async (req, res,next) => {
  // fileid
  // email,role
  // find file=. validation
  // check owner => uploaded by !== user
  // find user => validation
  try {
    const { email, role } = req.body;
    const file = await getFileById(req.params.id,req.user._id)
    if (!file) {
      throw new ApiError(401, "file not found");
    }

    if (String(file.uploadedBy) !== String(req.user._id)) 
      throw new ApiError(403, "Not authorized to add collaborator");
    

    const collaboratorsUser = await userModel.findOne({ email });
    if (!collaboratorsUser) throw new ApiError(404, "User not found");

    // Check if already a collaborator
   if(file.collaborators.some(
      (c) => String(c.user) === String(collaboratorsUser._id)
    )){
      throw new ApiError(400, "User already a collaborator");
    };


    file.collaborators.push({
      user: collaboratorsUser._id,
      role: role || "read",
    });
    await file.save();

    return res
      .status(200)
      .json(new ApiResponse(201, { collaborators: file.collaborators }));
  } catch (error) {
    next(new ApiError(error.statusCode || 500, error.message || "Add collaborator failed"));
  }
};

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
  addcollaborators,
};
