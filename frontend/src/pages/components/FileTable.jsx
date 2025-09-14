import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  FileText,
  FileImage,
  Star,
  Link,
  MoreVertical,
  Download,
  Pencil,
  Trash,
  Share2,
} from "lucide-react";
import {
  deleteFileById,
  downloadFile,
  renameFile,
} from "../../services/FileService";
import ShareModal from "../components/ShareModel";
import axiosConfig from "../../axiosConfig/axios";

const FileTable = () => {
  const [files, setFiles] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [shareFile, setShareFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data } = await axiosConfig.get("/file/my-files", { withCredentials: true });
        setFiles(data.data.files);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFiles();
  }, []);

  const handleDelete = async (file) => {
    try {
      await deleteFileById(file._id);
      setFiles((prev) => prev.filter((f) => f._id !== file._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (file) => {
    try {
      await downloadFile(file._id, file.fileName);
    } catch {
      alert("Download failed!");
    }
  };

  const handleRename = async (file) => {
    const res = await renameFile(file);
    if (res) {
      setFiles((prev) =>
        prev.map((f) =>
          f._id === file._id ? { ...f, fileName: file.newName || f.fileName } : f
        )
      );
    }
  };

  const actions = {
    download: handleDownload,
    rename: handleRename,
    delete: handleDelete,
    share: (file) => setShareFile(file),
  };

  const menuItems = [
    { label: "Download", icon: Download, action: "download" },
    { label: "Rename", icon: Pencil, action: "rename" },
    { label: "Share", icon: Share2, action: "share" },
    { label: "Delete", icon: Trash, action: "delete", destructive: true },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "xlsx":
        return <FileSpreadsheet className="text-green-400" size={20} />;
      case "pdf":
        return <FileText className="text-red-400" size={20} />;
      case "png":
        return <FileImage className="text-blue-400" size={20} />;
      default:
        return <FileText className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="mt-8 relative">
      <h2 className="text-2xl font-bold text-white mb-4">All Files</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3 hidden sm:table-cell">Access</th>
              <th className="p-3 hidden md:table-cell">Modified</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file._id}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition"
              >
                <td className="p-3 flex items-center gap-3">
                  {getIcon(file.mimeType)}
                  <span className="text-white truncate">{file.fileName}</span>
                </td>
                <td className="p-3 hidden sm:table-cell text-gray-300">
                  {file.isPublic ? "Public" : file.collaborators.length ? "Shared" : "Owner"}
                </td>
                <td className="p-3 hidden md:table-cell text-gray-400">
                  {new Date(file.updatedAt).toLocaleString()}
                </td>
                <td className="p-3 flex justify-end gap-3 relative">
                  <Star className="text-gray-400 hover:text-yellow-400 cursor-pointer" size={18} />
                  <Link
                    className="text-gray-400 hover:text-blue-400 cursor-pointer"
                    size={18}
                    onClick={() => setShareFile(file)}
                  />
                  <MoreVertical
                    className="text-gray-400 hover:text-white cursor-pointer"
                    size={18}
                    onClick={() => setOpenMenu(file)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openMenu && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpenMenu(null)}
        >
          <div
            className="bg-gray-900 rounded-xl shadow-xl w-72 p-4 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold mb-3">{openMenu.fileName}</h3>
            <ul className="space-y-2">
              {menuItems.map((item, i) =>
                item.divider ? (
                  <hr key={i} className="border-gray-700 my-2" />
                ) : (
                  <li
                    key={i}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                      item.destructive
                        ? "text-red-400 hover:bg-red-600 hover:text-white"
                        : "text-gray-200 hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      actions[item.action]?.(openMenu);
                      setOpenMenu(null);
                    }}
                  >
                    <item.icon size={18} /> {item.label}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}

      {shareFile && <ShareModal file={shareFile} onClose={() => setShareFile(null)} />}
    </div>
  );
};

export default FileTable;
