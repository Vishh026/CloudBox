import { Upload, Plus, FolderPlus, Download, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="h-screen w-full bg-white text-gray-900 flex flex-col">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4 shadow-sm border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">My Drive</h1>
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Upgrade
          </button>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 font-semibold">
            VD
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Quick Actions */}
        <div className="flex gap-4 mb-6">
          <ActionButton icon={<Upload />} text="Upload or drop" />
          <ActionButton icon={<Plus />} text="Create" />
          <ActionButton icon={<FolderPlus />} text="Create folder" />
          <ActionButton icon={<Download />} text="Get the app" />
          <ActionButton icon={<Users />} text="Invite members" />
        </div>

        {/* Suggested Section */}
        <h2 className="text-lg font-semibold mb-3">Suggested for you</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <FileCard
            title="Screenshot (1)"
            type="PNG • Dropbox"
            thumbnail="https://via.placeholder.com/150"
          />
          <FileCard
            title="PRINT"
            type="PDF • Dropbox"
            thumbnail="https://via.placeholder.com/150"
          />
        </div>
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon, text }) => (
  <button className="flex flex-col items-center justify-center w-36 h-28 border rounded-xl hover:bg-gray-100 transition">
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 mb-2">
      {icon}
    </div>
    <span className="text-sm font-medium">{text}</span>
  </button>
);

// File Card Component
const FileCard = ({ title, type, thumbnail }) => (
  <div className="rounded-lg border shadow-sm hover:shadow-md transition overflow-hidden">
    <img src={thumbnail} alt={title} className="w-full h-32 object-cover" />
    <div className="p-3">
      <p className="text-sm font-medium truncate">{title}</p>
      <p className="text-xs text-gray-500">{type}</p>
    </div>
  </div>
);

export default Home;
