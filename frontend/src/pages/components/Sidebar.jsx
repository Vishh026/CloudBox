import { useState } from "react";
import { Home, Folder, Star, Clock, Trash2, HardDrive, Plus } from "lucide-react";
import UploadComponent from "./UploadComponent";

const Sidebar = ({ onFileUploaded }) => {
  const [showUpload, setShowUpload] = useState(false);

  const menuItems = [
    { name: "Home", icon: <Home size={18} /> },
    { name: "My Drive", icon: <Folder size={18} /> },
    { name: "Recent", icon: <Clock size={18} /> },
    { name: "Starred", icon: <Star size={18} /> },
    { name: "Trash", icon: <Trash2 size={18} /> },
  ];

  return (
    <div className="w-60 h-screen bg-white border-r flex flex-col justify-between">
      <div>
        <div className="px-4 pt-5 pb-2">
          <h1 className="text-2xl font-semibold text-blue-500 tracking-wide">Cloudbox</h1>
        </div>

        <div className="px-2 py-1">
          <button
            onClick={() => setShowUpload(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
          >
            <Plus size={16} /> New
          </button>
        </div>

        <ul className="mt-4">
          {menuItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-r-full transition">
              {item.icon}
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {showUpload && <UploadComponent onClose={() => setShowUpload(false)} onSuccess={onFileUploaded} />}
    </div>
  );
};

export default Sidebar;
