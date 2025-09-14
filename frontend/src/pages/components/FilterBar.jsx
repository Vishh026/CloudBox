// src/pages/components/FilterBar.jsx
import { useState } from "react";

const FilterBar = ({ onFilter }) => {
  const [name, setName] = useState(""); // file name search
  const [search, setSearch] = useState(""); // optional global search
  const [type, setType] = useState(""); // mime type mapping
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("newest");

  const handleApply = () => {
    onFilter({
      name: name || undefined, // filename only
      search: search || undefined, // optional: global
      type: type || undefined, // mapped to mimeType regex in backend
      minSize: minSize ? Number(minSize) * 1024 * 1024 : undefined,
      maxSize: maxSize ? Number(maxSize) * 1024 * 1024 : undefined,
      date: date ? new Date(date).toISOString() : undefined,
      sort,
    });
  };

  const handleReset = () => {
    setName("");
    setSearch("");
    setType("");
    setMinSize("");
    setMaxSize("");
    setDate("");
    setSort("newest");
    onFilter({});
  };

  return (
    <div className="space-y-4">
      {/* File Name */}
      <div>
        <label className="block text-sm mb-1">File Name</label>
        <input
          type="text"
          placeholder="Enter file name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
        />
      </div>

      {/* Global Search */}
      <div>
        <label className="block text-sm mb-1">Search (name/mime)</label>
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
        />
      </div>

      {/* Type (MIME) */}
      <div>
        <label className="block text-sm mb-1">File Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
        >
          <option value="">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="document">Documents</option>
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm mb-1">Size (MB)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minSize}
            onChange={(e) => setMinSize(e.target.value)}
            className="w-1/2 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value)}
            className="w-1/2 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm mb-1">Uploaded After</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
        />
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm mb-1">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="sizeAsc">Size: Small → Large</option>
          <option value="sizeDesc">Size: Large → Small</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={handleApply}
          className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
