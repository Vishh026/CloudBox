const fileModel = require("../models/file.model");

const buildQuery = (query, userId) => {
  const { type, minSize, maxSize, date, search } = query;

  const filter = { uploadedBy: userId, isTrashed: false };

  if (query.name) {
  filter.fileName = { $regex: query.name, $options: "i" }; // filename only
}

if (query.search) {
  filter.$or = [
    { fileName: { $regex: query.search, $options: "i" } },
    { mimeType: { $regex: query.search, $options: "i" } },
  ];
}

if (query.type) {
  if (query.type === "image") filter.mimeType = { $regex: /^image\// };
  else if (query.type === "video") filter.mimeType = { $regex: /^video\// };
  else if (query.type === "audio") filter.mimeType = { $regex: /^audio\// };
  else if (query.type === "document")
    filter.mimeType = {
      $in: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ],
    };
}

  if (minSize || maxSize) {
    filter.size = {};
    if (minSize) filter.size.$gte = Number(minSize);
    if (maxSize) filter.size.$lte = Number(maxSize);
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    filter.createdAt = { $gte: start, $lt: end };
  }

  if (search) {
    filter.$or = [
      { fileName: { $regex: search, $options: "i" } },
      { mimeType: { $regex: search, $options: "i" } },
    ];
  }

  return filter;
};


const buildSortStage = (sort) => {
  if (sort === "oldest") return { createdAt: 1 };
  if (sort === "sizeAsc") return { size: 1 };
  if (sort === "sizeDesc") return { size: -1 };
  return { createdAt: -1 };
};

const fetchFiles = async ({ filter, page = 1, limit = 20, sortStage }) => {
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

  return {
    page: pageNum,
    limit: limitNum,
    total,
    hasMore: skip + files.length < total,
    files,
  };
};

module.exports = { buildQuery, buildSortStage, fetchFiles };
