import { useState, useEffect } from "react";
import FileCard from "../components/FileCart";
import { getTodaysFiles } from "../../services/FileService";

const RecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    const fetchRecentFiles = async () => {
      const files = await getTodaysFiles();
      // Sort by latest updatedAt first (optional)
      const sorted = files.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      // Take top 5 for "recent"
      setRecentFiles(sorted.slice(0, 5));
    };
    fetchRecentFiles();
  }, []);

  return (
    <div className="my-12">
      <h2 className="text-2xl font-semibold text-white mb-4">Recent Files</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800 p-2">
        {recentFiles.length > 0 ? (
          recentFiles.map((file) => (
            <div
              key={file._id}
              className="flex-none w-48 bg-gray-900 rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer"
            >
              <FileCard
                title={file.fileName}
                type={`${file.mimeType} • ${Math.round(file.size / 1024)} KB`}
                thumbnail={file.url || "/default-file.png"}
                onClick={() => console.log("Open file:", file._id)}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-400 ml-3">No files uploaded today.</p>
        )}
      </div>
    </div>
  );
};

export default RecentFiles;
