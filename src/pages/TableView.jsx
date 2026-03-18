
import { useState, useMemo } from "react";
import CreateOrderModal from "../components/CreateOrderModal";

export default function TableView({ orders, onAddOrder, onDeleteOrder, onUpdateOrder }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };
  const handleSaveOrder = (data) => {
    const totalAmount =
      parseFloat(data.qty || 0) * parseFloat(data.unitPrice || 0);

    const orderPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      product: data.product,
      qty: Number(data.qty),
      unitPrice: Number(data.unitPrice),
      totalAmount,
      date: new Date().toISOString(),
    };

    if (editingOrder) {
      onUpdateOrder({ ...editingOrder, ...orderPayload });
    } else {
      onAddOrder(orderPayload);
    }

    setIsModalOpen(false);
  };
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    return orders.filter((o) =>
      (o.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  return (
    <div className="p-8 min-h-screen bg-[#F8FAFC]">

      {/* Header */}
      <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Customer Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Database Connected Interface
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm w-72 outline-none focus:border-teal-500 bg-white"
          />

          <button
            onClick={handleOpenCreate}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-600"
          >
            + Create Order
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-400">No orders found</div>
      ) : (
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Product</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Price</th>
                <th className="p-4">Total</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="p-4">{order.email}</td>
                  <td className="p-4">{order.product}</td>
                  <td className="p-4">{order.qty}</td>
                  <td className="p-4">{order.unitPrice}</td>
                  <td className="p-4 text-teal-600 font-bold">
                    ₹{order.totalAmount}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleOpenEdit(order)}
                      className="text-blue-500 mr-3"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <CreateOrderModal
        isOpen={isModalOpen}
        initialData={editingOrder}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
      />
    </div>
  );
}