import { Upload, FolderPlus, FileText, Trash2, HardDrive } from "lucide-react";
import ActionBox from "../pages/components/ActionButton";
import FileCard from "../pages/components/FileCart";
import UploadComponent from "../pages/components/UploadComponent";
import { useEffect, useState } from "react";
import { getTodaysFiles } from "../services/FileService";
import FileTable from "./components/FileTable";
import RecentFiles from "./components/RecentFiles";

const Dashboard = () => {
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    try {
      const fetchedFiles = await getTodaysFiles();
      setFiles(fetchedFiles || []);
    } catch (err) {
      console.error("Error fetching today's files:", err);
      setFiles([]);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here’s what’s happening today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <UploadComponent onSuccess={loadFiles} />
        <ActionBox icon={<FolderPlus />} text="New Folder" />
        <ActionBox icon={<FileText />} text="New File" />
        <ActionBox icon={<Trash2 />} text="Trash" />
        <ActionBox icon={<HardDrive />} text="Storage" />
      </div>


      <RecentFiles />
      {/* File Table */}
      <FileTable />

      {/* Storage Usage */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Storage</h3>
        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-3 w-2/3"></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">6.5 GB of 10 GB used</p>
      </div>
    </div>
  );
};

export default Dashboard;
