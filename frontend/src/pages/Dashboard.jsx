import Sidebar from "../pages/components/Sidebar";
import Topnav from "../pages/components/Topnav";
import FileList from "../pages/components/FileList";

const Dashboard = () => {
  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar - fixed */}
      <div className="fixed top-0 left-0 h-full w-60 border-r bg-white shadow-sm z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-60">
        {/* Topnav - fixed */}
        <div className="fixed top-0 left-60 right-0 h-16 border-b bg-white shadow-sm z-10">
          <Topnav />
        </div>

        {/* FileList with padding (to avoid overlap) */}
        <div className="flex-1 overflow-y-auto pt-16 p-6 bg-gray-50">
          <FileList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

