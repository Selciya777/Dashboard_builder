
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TableView from "./pages/TableView";
import DashboardConfigure from "./pages/DashboardConfigure";
import DashboardView from "./pages/DashboardView";

const API_BASE = "http://localhost:8082/api";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(" Orders fetch error:", err));

    fetch(`${API_BASE}/dashboards/latest`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.layout) setLayout(JSON.parse(data.layout));
      })
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  const handleAddOrder = async (newOrder) => {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      const savedOrder = await response.json();
      setOrders((prev) => [savedOrder, ...prev]);
    } catch (err) {
      console.error(" Add order error:", err);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await fetch(`${API_BASE}/orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(" Delete order error:", err);
    }
  };

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });
      const saved = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === saved.id ? saved : o)));
    } catch (err) {
      console.error(" Update order error:", err);
    }
  };

  const handleSetLayout = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#EDF7FA] flex flex-col">
        {/* NAVBAR */}
        <nav className="bg-[#065F46] border-b border-[#BEE3DB] px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-black text-[#FAFAFA] uppercase">
              FlexiBoard
            </h1>
            <div className="flex gap-6 text-sm font-bold text-[#D9F99D]">
              <Link to="/" className="hover:text-[#10B981]">
                DASHBOARD
              </Link>
              <Link to="/orders" className="hover:text-[#10B981]">
                ORDERS
              </Link>
            </div>
          </div>
          <Link
            to="/configure"
            className="bg-[#10B981] text-[#FAFAFA] px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#059669]"
          >
            ⚙ Customize Layout
          </Link>
        </nav>

        {/* ROUTES */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<DashboardView layout={layout} orders={orders} />}
            />
            <Route
              path="/orders"
              element={
                <TableView
                  orders={orders}
                  onAddOrder={handleAddOrder}
                  onUpdateOrder={handleUpdateOrder}
                  onDeleteOrder={handleDeleteOrder}
                />
              }
            />
            <Route
              path="/configure"
              element={
                <DashboardConfigure
                  orders={orders}
                  currentLayout={layout}
                  setLayout={handleSetLayout}
                />
              }
            />
            <Route
              path="/dashboard"
              element={<DashboardView layout={layout} orders={orders} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}