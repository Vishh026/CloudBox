// src/pages/MyDrive.jsx
import { useState, useEffect } from "react";
import Sidebar from "../pages/components/Sidebar";
import Topnav from "../pages/components/Topnav";
import FilterBar from "../pages/components/FilterBar";
import FileList from "../pages/components/FileList";
import { getFilteredFiles } from "../services/fileService";

const MyDrive = () => {
  const [files, setFiles] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  // Fetch files with filters + pagination
  const fetchFiles = async (newFilters = {}, reset = false) => {
    try {
      const result = await getFilteredFiles({
        filters: newFilters,
        page: reset ? 1 : page,
        limit,
      });

      const fetchedFiles = result.files || [];
      setFiles(reset ? fetchedFiles : [...files, ...fetchedFiles]);
      setHasMore(result.hasMore);
      setPage(reset ? 2 : page + 1);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  // Called when filter is applied from FilterBar
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchFiles(newFilters, true); // reset list
  };

  // Initial load
  useEffect(() => {
    fetchFiles(filters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topnav />

        {/* Filter + File List */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left filter bar */}
          <div className="w-64 bg-gray-950 border-r border-gray-800 p-4">
            <FilterBar onFilter={handleFilter} />
          </div>

          {/* File list area */}
          <div className="flex-1 overflow-y-auto p-6">
            <FileList files={files} />

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => fetchFiles(filters)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                             hover:from-indigo-500 hover:to-purple-500 rounded-lg 
                             shadow-md text-sm font-medium transition-all"
                >
                  Load More
                </button>
              </div>
            )}

            {!hasMore && files.length > 0 && (
              <p className="text-center text-gray-400 mt-6">
                No more files to load
              </p>
            )}

            {files.length === 0 && (
              <p className="text-center text-gray-400 mt-6">
                No files found with current filters
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDrive;
