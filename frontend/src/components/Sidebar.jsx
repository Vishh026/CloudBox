import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-5">
      <h2 className="text-2xl font-bold mb-6">CloudBox</h2>
      <ul className="space-y-4">
        <li className="hover:bg-gray-700 px-3 py-2 rounded">📂 My Files</li>
        <li className="hover:bg-gray-700 px-3 py-2 rounded">⬆️ Uploads</li>
        <li className="hover:bg-gray-700 px-3 py-2 rounded">⭐ Favorites</li>
        <li className="hover:bg-gray-700 px-3 py-2 rounded">🗑️ Trash</li>
        <li className="hover:bg-gray-700 px-3 py-2 rounded">⚙️ Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
