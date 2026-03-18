
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
} from "recharts";

export default function DynamicWidget({ type, data = [], onDelete, onUpdate }) {
  const safeDelete = onDelete || (() => {});
  const safeUpdate = onUpdate || (() => {});

  const COLORS = ["#22d3ee", "#6366f1", "#fbbf24", "#ef4444"];

  if (type === "totalOrders") {
    return (
      <div className="flex items-center justify-center h-full text-3xl font-bold text-teal-400">
        {data.length.toLocaleString()}
      </div>
    );
  }

  if (type === "ordersTable") {
    const [editableId, setEditableId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [filters, setFilters] = useState({ customer: "", product: "", status: "" });

    const filteredOrders = useMemo(() => {
      return data.filter((o) => {
        const matchCustomer = o.firstName.toLowerCase().includes(filters.customer.toLowerCase());
        const matchProduct = filters.product ? o.product === filters.product : true;
        const matchStatus = filters.status ? o.status === filters.status : true;
        return matchCustomer && matchProduct && matchStatus;
      });
    }, [data, filters]);

    const products = Array.from(new Set(data.map((o) => o.product)));
    const statuses = Array.from(new Set(data.map((o) => o.status || "Pending")));

    return (
      <div className="overflow-auto h-full">
        <div className="flex gap-2 p-2 border-b bg-gray-50 sticky top-0 z-10">
          <input
            type="text"
            placeholder="Filter Customer"
            value={filters.customer}
            onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
            className="border rounded px-2 py-1 text-xs flex-1"
          />
          <select
            value={filters.product}
            onChange={(e) => setFilters({ ...filters, product: e.target.value })}
            className="border rounded px-2 py-1 text-xs"
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded px-2 py-1 text-xs"
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center border-b py-2 text-xs hover:bg-gray-50 transition px-2"
          >
            <div className="flex flex-col">
              <p className="font-bold">{order.firstName}</p>
              {editableId === order.id ? (
                <input
                  className="border border-teal-300 rounded p-1 text-xs outline-none"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                <p className="text-gray-400">{order.product}</p>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-gray-500 text-xs">{order.status || "Pending"}</span>

              {editableId === order.id ? (
                <button
                  onClick={() => {
                    safeUpdate({ ...order, product: editValue });
                    setEditableId(null);
                  }}
                  className="text-blue-500 font-semibold text-xs"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditableId(order.id);
                    setEditValue(order.product);
                  }}
                  className="text-blue-500 font-semibold text-xs"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => safeDelete(order.id)}
                className="text-red-500 font-semibold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-gray-400 text-center py-4 text-xs">No orders found</div>
        )}
      </div>
    );
  }

  if (type === "productChart") {
    const chartData = useMemo(() => {
      const map = {};
      data.forEach((o) => {
        map[o.product] = (map[o.product] || 0) + 1;
      });
      return Object.keys(map).map((key) => ({ name: key, count: map[key] }));
    }, [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} />
          <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
          <Tooltip />
          <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "statusChart") {
    const chartData = useMemo(() => {
      const map = {};
      data.forEach((o) => {
        const status = o.status || "Pending";
        map[status] = (map[status] || 0) + 1;
      });
      return Object.keys(map).map((key) => ({ name: key, value: map[key] }));
    }, [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" label>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "revenueChart") {
    const chartData = useMemo(
      () => data.map((o, i) => ({ name: `Order ${i + 1}`, value: o.totalAmount || 0 })),
      [data]
    );

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} />
          <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "areaChart") {
    const chartData = useMemo(
      () => data.map((o, i) => ({ name: `Order ${i + 1}`, value: o.totalAmount || 0 })),
      [data]
    );

    return (
      <div className="w-full h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} />
            <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#10B981" fill="#A7F3D0" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "scatterChart") {
    const chartData = useMemo(
      () => data.map((o, i) => ({ x: i + 1, y: o.totalAmount || 0 })),
      [data]
    );

    return (
      <div className="w-full h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <XAxis type="number" dataKey="x" name="Order" tick={{ fontSize: 12, fill: "#475569" }} />
            <YAxis type="number" dataKey="y" name="Amount" tick={{ fontSize: 12, fill: "#475569" }} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="Orders" data={chartData} fill="#F59E0B" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-400">
      <p className="text-sm font-semibold">Configure Your Dashboard</p>
      <div className="flex gap-2">
        <button className="border border-gray-300 rounded px-4 py-2 text-xs hover:bg-gray-100">
          Add Orders Table
        </button>
        <button className="border border-gray-300 rounded px-4 py-2 text-xs hover:bg-gray-100">
          Add Product Chart
        </button>
        <button className="border border-gray-300 rounded px-4 py-2 text-xs hover:bg-gray-100">
          Add Status Chart
        </button>
      </div>
    </div>
  );
}