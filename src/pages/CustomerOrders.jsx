
import { useEffect, useState } from "react";
import OrderTable from "../components/order/OrderTable";
import CreateOrderDialog from "../components/order/CreateOrderDialog";
import { getOrders, createOrder } from "./services/api";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (order) => {
    try {
      await createOrder(order);
      fetchOrders();           
      setIsDialogOpen(false);  
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Customer Orders</h1>

      {/* Create Order Button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
      >
        Create Order
      </button>

      {/* Create Order Dialog */}
      <CreateOrderDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateOrder}
      />

      {/* Orders Table or Loading State */}
      {loading ? (
        <p className="mt-4 text-gray-400 text-sm">Loading orders...</p>
      ) : (
        <div className="mt-4">
          <OrderTable orders={orders} />
        </div>
      )}
    </div>
  );
}