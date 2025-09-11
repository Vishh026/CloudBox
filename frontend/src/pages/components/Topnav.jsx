import { Search, HelpCircle, Settings, User } from "lucide-react";

const TopNav = () => {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
      {/* Search */}
      <div className="flex items-center w-1/2 bg-gray-100 rounded-lg px-3 py-2">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search in Drive"
          className="bg-transparent outline-none px-2 w-full text-sm"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-6 text-gray-600">
        <HelpCircle className="cursor-pointer" />
        <Settings className="cursor-pointer" />
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
          <User size={18} />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
