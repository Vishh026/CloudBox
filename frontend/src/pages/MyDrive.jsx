import Sidebar from "../pages/components/Sidebar";
import Topnav from "../pages/components/Topnav";
import FileList from "../pages/components/FileList";
import FilterBar from "../pages/components/FilterBar";
import { useState, useEffect } from "react";
import axios from "../axiosConfig/axios";

const MyDrive = () => {
  const [files, setFiles] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  const mapSort = (sort) => {
    switch (sort) {
      case "newest":
        return "createdAtDesc";
      case "oldest":
        return "createdAtAsc";
      case "sizeAsc":
        return "sizeAsc";
      case "sizeDesc":
        return "sizeDesc";
      default:
        return "createdAtDesc";
    }
  };

  const fetchFiles = async (newFilters = {}, reset = false) => {
    try {
      const query = { ...newFilters, page: reset ? 1 : page, limit, sort: mapSort(newFilters.sort) };
      const { data } = await axios.get("/api/files/filter", {
        params: query,
        withCredentials: true,
      });

      const fetchedFiles = data.data.files || [];
      setFiles(reset ? fetchedFiles : [...files, ...fetchedFiles]);
      setHasMore(data.data.hasMore);
      setPage(reset ? 2 : page + 1);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  // Called when filters change
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchFiles(newFilters, true); // reset page
  };

  useEffect(() => {
    fetchFiles(filters, true); // initial fetch
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-64 fixed h-screen border-r bg-white shadow">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="sticky top-0 z-10 bg-white shadow">
          <Topnav />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <FilterBar onFilter={handleFilter} />
          <FileList files={files} />
          {hasMore && (
            <button
              onClick={() => fetchFiles(filters)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDrive;
