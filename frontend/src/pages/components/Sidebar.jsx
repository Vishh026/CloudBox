import { useState } from "react";
import { Home, Folder, Star, Clock, Trash2, Plus, Menu } from "lucide-react";

const Sidebar = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Home", icon: <Home size={18} /> },
    { name: "My Drive", icon: <Folder size={18} /> },
    { name: "Recent", icon: <Clock size={18} /> },
    { name: "Starred", icon: <Star size={18} /> },
    { name: "Trash", icon: <Trash2 size={18} /> },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-screen fixed left-0 top-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col justify-between shadow-xl transition-all duration-300 z-50`}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CloudBox
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* New Button */}
        {!collapsed && (
          <div className="px-4 py-2">
            <button
              onClick={() => setShowUpload(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
            >
              <Plus size={16} /> New
            </button>
          </div>
        )}

        {/* Menu Items */}
        <ul className="mt-4 space-y-1">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white cursor-pointer rounded-md transition"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <UploadComponent
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
