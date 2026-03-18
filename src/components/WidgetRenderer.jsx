
export default function WidgetRenderer({ widget, orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-gray-400 text-xs text-center italic py-6">
        Waiting for order data...
      </div>
    );
  }

  const total = orders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  switch (widget.name) {
    case "KPI Value":
      return (
        <div className="text-center">
          <p className="text-3xl font-extrabold text-blue-600">${total.toLocaleString()}</p>
          <p className="text-[9px] text-gray-500 uppercase font-semibold tracking-widest mt-1">
            Total Revenue
          </p>
        </div>
      );

    case "Bar Chart":
      const maxVal = Math.max(...orders.map(o => o.totalAmount), 1);
      return (
        <div className="flex items-end justify-between h-28 w-full gap-2 px-2">
          {orders.slice(-5).map((o, i) => (
            <div
              key={i}
              className="bg-blue-300 w-full rounded-t-lg transition-all duration-200 hover:bg-blue-400"
              style={{ height: `${(o.totalAmount / maxVal) * 100}%` }}
              title={`${o.product}: $${o.totalAmount}`}
            />
          ))}
        </div>
      );

    case "Table":
      return (
        <div className="w-full text-[10px] border border-blue-100 rounded-lg overflow-hidden">
          {orders.slice(0, 3).map((o, i) => (
            <div
              key={i}
              className={`flex justify-between items-center px-2 py-1 ${
                i % 2 === 0 ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <span className="text-gray-700">{o.product}</span>
              <span className="font-bold text-blue-600">${o.totalAmount}</span>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="text-xs text-gray-400 italic text-center py-4">
          Widget: {widget.name}
        </div>
      );
  }
}