// services/file.service.js
const fileModel = require("../models/file.model");
const ApiError = require("../utilities/ApiError");

async function getFileById(fileId, userId) {
  // 1. Find file in DB
  const file = await fileModel.findById(fileId);
  if (!file) throw new ApiError(404, "File not found");

  // 2. Check ownership
  if (String(file.uploadedBy) !== String(userId)) {
    throw new ApiError(403, "You are not allowed to access this file");
  }

  return file;
}

module.exports = { getFileById };
