
import { useState } from "react";

const API_BASE = "http://localhost:8082/api";

export default function Orders({
  orders,
  onAddOrder,
  onDeleteOrder,
  onUpdateOrder,
}) {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    product: "Fiber Internet 300 Mbps",
    qty: 1,
    unitPrice: 0,
    status: "Pending",
  });

  const totalAmount = formData.qty * formData.unitPrice;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      ...formData,
      totalAmount,
      orderDate: new Date().toISOString(),
    };

    onAddOrder(newOrder); // 🔥 IMPORTANT

    setShowForm(false);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      product: "Fiber Internet 300 Mbps",
      qty: 1,
      unitPrice: 0,
      status: "Pending",
    });
  };

  return (
    <div className="p-8 bg-[#F0F1F3] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Orders</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-500 text-white px-6 py-2 rounded-lg font-bold"
        >
          Create Order
        </button>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
          No orders found.
        </div>
      ) : (
        <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-gray-50 text-[10px] uppercase text-gray-400">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-gray-100 text-sm">
                <td className="p-4">
                  {o.firstName} {o.lastName}
                </td>

                <td className="p-4">{o.product}</td>

                <td className="p-4 text-right font-bold text-teal-600">
                  ₹{o.totalAmount}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => onDeleteOrder(o.id)}
                    className="text-red-500 mr-3"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => onUpdateOrder(o)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-6">Create Order</h2>

            <div className="space-y-4">
              <input
                required
                placeholder="First Name"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />

              <input
                required
                placeholder="Last Name"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Qty"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qty: parseInt(e.target.value) || 1,
                  })
                }
              />

              <input
                type="number"
                placeholder="Unit Price"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitPrice: parseFloat(e.target.value) || 0,
                  })
                }
              />

              <div className="font-bold text-teal-600">
                Total: ₹{totalAmount}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-teal-500 text-white px-6 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}