import React from "react";

const Dashboard = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>

      {/* Example content cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold">Storage Used</h3>
          <p className="mt-2 text-gray-600">120 GB of 500 GB</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold">Recent Uploads</h3>
          <p className="mt-2 text-gray-600">2 files uploaded today</p>
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-semibold">Shared Files</h3>
          <p className="mt-2 text-gray-600">5 shared this week</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
