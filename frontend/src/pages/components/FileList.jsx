import React from "react";
import { FileText, FileImage, FileSpreadsheet, File } from "lucide-react";

const FileIcon = ({ type }) => {
  switch (type) {
    case "pdf":
      return <File className="w-6 h-6 text-red-500" />;
    case "image":
      return <FileImage className="w-6 h-6 text-green-400" />;
    case "spreadsheet":
      return <FileSpreadsheet className="w-6 h-6 text-green-300" />;
    default:
      return <FileText className="w-6 h-6 text-gray-400" />;
  }
};

const FileList = ({ files }) => {
  return (
    <div className="w-full bg-gray-950 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 px-6 py-3 text-gray-300 font-semibold border-b border-gray-800 bg-gray-900">
        <div>Name</div>
        <div>Owner</div>
        <div>Last Modified</div>
        <div>File Size</div>
      </div>

      {/* File rows */}
      <div className="divide-y divide-gray-800">
        {files.map((file) => (
          <div
            key={file._id}
            className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileIcon type={file.type} />
              <span className="text-gray-100 truncate">{file.name}</span>
            </div>
            <div className="text-gray-400">{file.owner}</div>
            <div className="text-gray-400">
              {new Date(file.lastModified).toLocaleDateString()}
            </div>
            <div className="text-gray-400">
              {file.size ? `${file.size} KB` : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
