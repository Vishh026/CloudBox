import React from "react";

const TopNav = () => {
  return (
    <div className="w-full h-14 bg-white shadow-md flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-3 py-1 text-sm"
        />
        <img
          src="https://via.placeholder.com/35"
          alt="avatar"
          className="w-9 h-9 rounded-full"
        />
      </div>
    </div>
  );
};

export default TopNav;
