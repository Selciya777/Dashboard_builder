function ProfessionalOrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
      <table className="table-auto w-full border-collapse rounded-xl">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left text-gray-700 uppercase text-sm font-semibold tracking-wider">Customer</th>
            <th className="p-3 text-left text-gray-700 uppercase text-sm font-semibold tracking-wider">Product</th>
            <th className="p-3 text-left text-gray-700 uppercase text-sm font-semibold tracking-wider">Amount</th>
            <th className="p-3 text-left text-gray-700 uppercase text-sm font-semibold tracking-wider">Status</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {orders.map((order, index) => (
            <tr
              key={index}
              className="border-t border-gray-100 hover:bg-purple-50 transition-colors duration-200"
            >
              <td className="p-3 text-gray-600">{order.customer}</td>
              <td className="p-3 text-gray-600">{order.product}</td>
              <td className="p-3 text-gray-600">{order.amount}</td>
              <td className="p-3 text-gray-600">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfessionalOrdersTable;