
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DynamicWidget from "../components/DynamicWidget";

export default function DashboardConfigure({ orders = [] }) {
  const navigate = useNavigate();
  const [placedWidgets, setPlacedWidgets] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [editingWidgetId, setEditingWidgetId] = useState(null);

  const ROW_HEIGHT = 40;
  const COLS = 12;

  const widgetTypeMap = {
    "Bar Chart": "productChart",
    "Line Chart": "revenueChart",
    "Pie Chart": "statusChart",
    "Area Chart": "areaChart",
    "Scatter Plot": "scatterChart",
    "Table": "ordersTable",
    "KPI Value": "totalOrders"
  };

  const library = {
    Charts: ["Bar Chart", "Line Chart", "Pie Chart", "Area Chart", "Scatter Plot"],
    Tables: ["Table"],
    KPIs: ["KPI Value"]
  };

  const activeWidget = placedWidgets.find((w) => w.id === editingWidgetId);

  const updateWidget = (id, changes) => {
    setPlacedWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, ...changes } : w))
    );
  };

  const totalRows = useMemo(() => {
    const maxRowUsed = placedWidgets.reduce((max, w) => {
      const rowEnd = Math.floor(w.pos / COLS) + w.h;
      return Math.max(max, rowEnd);
    }, 0);
    return Math.max(25, maxRowUsed + 10);
  }, [placedWidgets]);

  const gridCells = useMemo(() => Array.from({ length: totalRows * COLS }), [totalRows]);

  const handleDrop = (index) => {
    if (!draggedItem) return;
    const displayName = draggedItem.data;
    const mappedType = widgetTypeMap[displayName] || "ordersTable";
    const isChart = library.Charts.includes(displayName);

    const newWidget = {
      id: Date.now(),
      pos: index,
      name: mappedType,
      title: displayName,
      w: isChart ? 6 : 3,
      h: isChart ? 8 : 4
    };

    setPlacedWidgets(prev => [...prev, newWidget]);
    setEditingWidgetId(newWidget.id);
    setDraggedItem(null);
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/dashboards/latest");
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();
      if (data && data.layout) {
        const latest = JSON.parse(data.layout);
        setPlacedWidgets(latest);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const normalizeLayout = (widgets) => {
    let currentPos = 0;
    const normalized = widgets.map(w => {
      const widget = { ...w, pos: currentPos };
      currentPos += w.w;
      
      if (currentPos >= COLS) currentPos = 0;
      return widget;
    });
    return normalized;
  };

  const handleFinalSave = async () => {
    const cleanLayout = normalizeLayout(placedWidgets).map(w => ({
      id: w.id,
      pos: w.pos,
      name: w.name,
      title: w.title,
      w: w.w,
      h: w.h
    }));

    try {
      const response = await fetch("http://localhost:8082/api/dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout: cleanLayout })
      });

      if (!response.ok) throw new Error("Failed to save dashboard");

      alert("Dashboard saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving dashboard: " + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#F7FAFC] overflow-hidden">

      {/* LEFT PANEL */}
      <div className="w-64 bg-[#1F2937] border-r border-gray-300 p-5 shadow-xl overflow-y-auto">
        <h2 className="font-black text-[#FBBF24] text-xl mb-2 uppercase">FLEXIBOARD</h2>
        <button 
          onClick={() => navigate("/dashboard")} 
          className="text-sm text-[#D1D5DB] mb-6 hover:text-[#FBBF24] transition-colors duration-200"
        >
          ← Back
        </button>

        {Object.entries(library).map(([cat, items]) => (
          <div key={cat} className="mb-6">
            <p className="text-xs font-bold text-[#9CA3AF] mb-3 uppercase">{cat}</p>
            {items.map(item => (
              <div
                key={item}
                draggable
                onDragStart={() => setDraggedItem({ data: item })}
                className="p-3 bg-[#374151] text-white border border-gray-600 rounded-lg cursor-grab hover:border-[#FBBF24] mb-2 transition-colors duration-200"
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* CANVAS */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold text-[#1E40AF]">Configuration Canvas</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setPlacedWidgets([])} 
              className="text-red-500 hover:text-red-400 transition-colors duration-200"
            >
              Clear
            </button>
            <button 
              onClick={handleFinalSave} 
              className="bg-[#1E40AF] text-white px-6 py-2 rounded hover:bg-[#4338CA] transition-colors duration-200"
            >
              Save Dashboard
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#E5E7EB] p-4 rounded-xl overflow-auto">
          <div className="grid grid-cols-12 gap-2" style={{ gridTemplateRows: `repeat(${totalRows}, ${ROW_HEIGHT}px)` }}>
            {gridCells.map((_, i) => (
              <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(i)} className="bg-[#F3F4F6]/50 border border-gray-300 h-full" />
            ))}

            {normalizeLayout(placedWidgets).map(w => {
              const colStart = Math.min((w.pos % COLS) + 1, COLS - w.w + 1);
              const rowStart = Math.floor(w.pos / COLS) + 1;
              return (
                <div 
                  key={w.id} 
                  style={{ gridColumn: `${colStart} / span ${w.w}`, gridRow: `${rowStart} / span ${w.h}` }}
                  className="bg-white p-3 rounded shadow hover:shadow-lg transition-shadow duration-200"
                  onClick={() => setEditingWidgetId(w.id)}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-[#1E40AF]">{w.title}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPlacedWidgets(prev => prev.filter(x => x.id !== w.id)); }}
                      className="text-red-500 hover:text-red-400"
                    >✕</button>
                  </div>
                  <div className="h-full">
                    <DynamicWidget type={w.name} data={orders} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SETTINGS PANEL */}
      {activeWidget && (
        <div className="w-80 bg-[#F9FAFB] border-l border-gray-300 p-6 shadow-xl overflow-y-auto">
          <h3 className="font-bold text-lg mb-4 text-[#1E3A8A]">Widget Settings</h3>
          <div className="mb-4">
            <label className="text-xs text-gray-500">Title</label>
            <input 
              value={activeWidget.title} 
              onChange={(e) => updateWidget(activeWidget.id, { title: e.target.value })} 
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E3A8A] transition"
            />
          </div>
          <div className="mb-4">
            <label className="text-xs text-gray-500">Width</label>
            <input 
              type="number" min="1" max="12" 
              value={activeWidget.w} 
              onChange={(e) => updateWidget(activeWidget.id, { w: parseInt(e.target.value) || 1 })} 
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E3A8A] transition"
            />
          </div>
          <div className="mb-4">
            <label className="text-xs text-gray-500">Height</label>
            <input 
              type="number" min="1" max="40" 
              value={activeWidget.h} 
              onChange={(e) => updateWidget(activeWidget.id, { h: parseInt(e.target.value) || 1 })} 
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:ring-2 focus:ring-[#1E40AF] focus:border-[#1E3A8A] transition"
            />
          </div>
          <button onClick={() => setEditingWidgetId(null)} className="mt-4 text-gray-500">Close</button>
        </div>
      )}
    </div>
  );
}
