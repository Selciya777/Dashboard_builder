
import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, BarChart, MousePointer2 } from 'lucide-react';

const DashboardConfigurator = ({ onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('Charts');

  return (
    <div className="fixed inset-0 bg-white z-[999] flex flex-col">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
            <ChevronLeft />
          </button>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Configure Dashboard</h3>
            <p className="text-xs text-gray-500">Customize your dashboard to start viewing analytics</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onCancel} 
            className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onSave} 
            className="px-8 py-2 bg-teal-500 text-white rounded-lg font-semibold text-sm shadow-md hover:bg-teal-600 transition"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-white p-6 space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">View Data For</label>
            <select className="w-full mt-2 border rounded-lg p-3 bg-gray-50 text-sm">
              <option>All time</option>
            </select>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Widget Library</p>
            {['Charts', 'Tables', 'KPIs'].map(cat => (
              <div key={cat} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveTab(cat)}
                  className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition"
                >
                  <span className="text-sm font-semibold text-gray-700">{cat}</span>
                  <ChevronDown size={16} className={`${activeTab === cat ? 'rotate-180 transform transition' : ''}`} />
                </button>
                {activeTab === cat && (
                  <div className="p-3 bg-gray-50 space-y-2">
                    <div 
                      draggable 
                      className="bg-white p-3 border rounded-lg text-xs font-medium flex items-center gap-3 cursor-grab hover:border-teal-500 transition"
                    >
                      <BarChart size={14} className="text-gray-400" /> Bar Chart
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grid Canvas */}
        <div className="flex-1 bg-gray-50 overflow-auto p-12 relative">
          <div className="absolute inset-0 grid-blueprint opacity-20 pointer-events-none" />
          <div className="relative h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <MousePointer2 size={48} />
              <p className="text-sm font-medium text-gray-500 text-center max-w-xs">
                Choose a chart type from the list. Drag to add it into the canvas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardConfigurator;