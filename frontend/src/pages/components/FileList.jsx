import { Folder, FileText } from "lucide-react";

const files = [
  { name: "portfolio", type: "folder", modified: "Feb 11, 2025" },
  { name: "SAUUU", type: "folder", modified: "Aug 24, 2025" },
  { name: "ADHAR_11zon.pdf", type: "file", modified: "Aug 12, 2025", size: "95 KB" },
  { name: "Advanced_React_Notes.md", type: "file", modified: "Jun 15, 2025", size: "8 KB" },
];

const FileList = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4 text-gray-600 text-sm font-semibold border-b pb-2">
        <span>Name</span>
        <span>Owner</span>
        <span>Last Modified</span>
        <span>File Size</span>
      </div>

      {files.map((file, idx) => (
        <div
          key={idx}
          className="grid grid-cols-4 gap-4 items-center py-3 border-b hover:bg-gray-50 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            {file.type === "folder" ? <Folder size={18} /> : <FileText size={18} />}
            <span>{file.name}</span>
          </div>
          <span>me</span>
          <span>{file.modified}</span>
          <span>{file.size || "-"}</span>
        </div>
      ))}
    </div>
  );
};

export default FileList;
