import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ShoppingCart, Settings, LogOut } from 'lucide-react';
const ProfessionalSidebar = () => {
  return (
    <div className="w-64 bg-gray-50 h-screen flex flex-col border-r border-gray-200">
      <div className="p-6 mb-4">
        <h1 className="text-blue-600 text-2xl font-bold tracking-tight italic">NexaPanel</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <LayoutGrid size={20} /> Dashboard
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <ShoppingCart size={20} /> Customer Orders
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm">
          <Settings size={18} /> Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default ProfessionalSidebar;