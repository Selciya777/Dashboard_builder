
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicWidget from "../components/DynamicWidget";

export default function DashboardView({ orders = [] }) {
  const [widgets, setWidgets] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const navigate = useNavigate();
  const COLS = 12;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:8082/api/dashboards/latest");
        if (!res.ok) throw new Error("Failed to fetch dashboard");
        const data = await res.json();
        if (data && data.layout) {
          const parsed = JSON.parse(data.layout);
          setWidgets(normalizeLayout(parsed));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  const normalizeLayout = (widgets) => {
    let currentRow = 0;
    let currentCol = 0;
    return widgets.map((w) => {
      if (currentCol + w.w > COLS) {
        currentRow += 1;
        currentCol = 0;
      }
      const widget = { ...w, colStart: currentCol, rowStart: currentRow };
      currentCol += w.w;
      return widget;
    });
  };

  useEffect(() => {
    const now = new Date();
    const filtered = orders.filter((o) => {
      const orderDate = new Date(o.date);
      switch (dateFilter) {
        case "2":
          return orderDate >= new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
        case "5":
          return orderDate >= new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
        case "7":
          return orderDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case "week":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          return orderDate >= startOfWeek;
        case "month":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return orderDate >= startOfMonth;
        default:
          return true;
      }
    });
    setFilteredOrders(filtered);
  }, [orders, dateFilter]);

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalCustomers = new Set(filteredOrders.map((o) => o.custId)).size;
  const totalSoldQty = filteredOrders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  if (!widgets || widgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-4">
        <h2 className="text-xl font-bold text-gray-700">Dashboard Not Configured</h2>
        <p className="text-gray-500">Configure your dashboard to start viewing analytics</p>
        <button
          onClick={() => navigate("/dashboard-empty")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Configure Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-white shadow mb-4 flex items-center gap-2">
        <label className="text-gray-700 font-semibold text-sm">Filter by Date:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="2">Last 2 Days</option>
          <option value="5">Last 5 Days</option>
          <option value="7">Last 7 Days</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-12 gap-2 p-4">
        <div className="col-span-3 bg-white p-4 rounded shadow text-center">
          <div className="text-gray-500 text-sm">Total Orders</div>
          <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
        </div>
        <div className="col-span-3 bg-white p-4 rounded shadow text-center">
          <div className="text-gray-500 text-sm">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="col-span-3 bg-white p-4 rounded shadow text-center">
          <div className="text-gray-500 text-sm">Total Customers</div>
          <div className="text-2xl font-bold text-purple-600">{totalCustomers}</div>
        </div>
        <div className="col-span-3 bg-white p-4 rounded shadow text-center">
          <div className="text-gray-500 text-sm">Total Sold Qty</div>
          <div className="text-2xl font-bold text-orange-600">{totalSoldQty}</div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-12 gap-2">
          {widgets.map((w) => (
            <div
              key={w.id}
              style={{
                gridColumn: `${w.colStart + 1} / span ${w.w}`,
                gridRow: `${w.rowStart + 1} / span ${w.h}`,
              }}
              className="bg-white p-3 rounded shadow hover:shadow-lg transition-shadow duration-200 min-h-[200px] flex flex-col"
            >
              <div className="text-xs font-bold text-gray-700 mb-2">{w.title}</div>
              <div className="flex-1 min-h-[100px]">
                <div className="w-full h-full">
                  <DynamicWidget type={w.name} data={filteredOrders} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}