import { Search, HelpCircle, Settings, User, Menu } from "lucide-react";

const TopNav = ({ toggleSidebar }) => {
  return (
    <div className="fixed left-0 top-0 w-full lg:pl-64 h-14 flex items-center justify-between px-4 lg:px-6 bg-gray-900 border-b border-gray-800 shadow-sm z-40">
      {/* Left Section (Hamburger + Search) */}
      <div className="flex items-center gap-3 w-full lg:w-1/2">
        {/* Hamburger for Mobile */}
        <button
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="flex items-center flex-1 bg-gray-800 rounded-lg px-3 py-1.5">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search in Drive"
            className="bg-transparent outline-none px-2 w-full text-sm text-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Icons */}
      <div className="hidden sm:flex items-center space-x-6 text-gray-400">
        <HelpCircle className="cursor-pointer hover:text-white" />
        <Settings className="cursor-pointer hover:text-white" />
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer">
          <User size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
