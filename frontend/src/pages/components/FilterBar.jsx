import { useState } from "react";

const FilterBar = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    type: "",
    size: "",
    date: "",
    sort: "",
    search: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    // 🔄 Convert frontend-friendly filters → backend params
    let query = { ...updated };

    if (updated.size === "small") {
      query.minSize = 0;
      query.maxSize = 1 * 1024 * 1024; // < 1MB
    } else if (updated.size === "medium") {
      query.minSize = 1 * 1024 * 1024;
      query.maxSize = 10 * 1024 * 1024; // 1MB - 10MB
    } else if (updated.size === "large") {
      query.minSize = 10 * 1024 * 1024; // > 10MB
    }

    delete query.size; // remove temp field
    onFilter(query); // send to parent
  };

  return (
    <div className="bg-white shadow-sm border-b flex gap-3 p-3 items-center">
      {/* File Type */}
      <select
        name="type"
        value={filters.type}
        onChange={handleChange}
        className="border rounded px-3 py-1 text-sm"
      >
        <option value="">File Type</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
        <option value="audio">Audio</option>
        <option value="document">Documents</option>
      </select>

      {/* Size */}
      <select
        name="size"
        value={filters.size}
        onChange={handleChange}
        className="border rounded px-3 py-1 text-sm"
      >
        <option value="">Size</option>
        <option value="small">Small (&lt;1MB)</option>
        <option value="medium">1MB - 10MB</option>
        <option value="large">&gt;10MB</option>
      </select>

      {/* Date */}
      <input
        type="date"
        name="date"
        value={filters.date}
        onChange={handleChange}
        className="border rounded px-3 py-1 text-sm"
      />

      {/* Sort */}
      <select
        name="sort"
        value={filters.sort}
        onChange={handleChange}
        className="border rounded px-3 py-1 text-sm"
      >
        <option value="">Sort By</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="sizeAsc">Size (Small → Large)</option>
        <option value="sizeDesc">Size (Large → Small)</option>
      </select>

      {/* Search */}
      <input
        type="text"
        name="search"
        placeholder="Search files..."
        value={filters.search}
        onChange={handleChange}
        className="border rounded px-3 py-1 text-sm"
      />
    </div>
  );
};

export default FilterBar;
