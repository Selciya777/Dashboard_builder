import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const ProfessionalOrderModalCard = ({ isOpen, onClose }) => {
  const { addOrder } = useOrders();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', product: 'Fiber Internet 300 Mbps',
    quantity: 1, unitPrice: 0, totalAmount: 0, status: 'Pending'
  });

  useEffect(() => {
    setForm(prev => ({ ...prev, totalAmount: prev.quantity * prev.unitPrice }));
  }, [form.quantity, form.unitPrice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      setError("Please fill the required fields");
      return;
    }
    addOrder(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">New Customer Order</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
          <input type="text" placeholder="First Name *" className="border p-3 rounded-xl focus:ring-2 ring-purple-300 outline-none bg-gray-50" onChange={e => setForm({...form, firstName: e.target.value})} />
          <input type="text" placeholder="Last Name *" className="border p-3 rounded-xl focus:ring-2 ring-purple-300 outline-none bg-gray-50" onChange={e => setForm({...form, lastName: e.target.value})} />
          <input type="email" placeholder="Email Address *" className="border p-3 rounded-xl col-span-2 focus:ring-2 ring-purple-300 outline-none bg-gray-50" onChange={e => setForm({...form, email: e.target.value})} />

          <div className="space-y-1 col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Product</label>
            <select className="w-full border p-3 rounded-xl bg-white focus:ring-2 ring-purple-300 outline-none" onChange={e => setForm({...form, product: e.target.value})}>
              <option>Fiber Internet 300 Mbps</option>
              <option>Fiber Internet 1 Gbps</option>
              <option>5G Unlimited Mobile</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Quantity</label>
              <input type="number" value={form.quantity} className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 ring-purple-300 outline-none" onChange={e => setForm({...form, quantity: Number(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Price</label>
              <input type="number" placeholder="$0.00" className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 ring-purple-300 outline-none" onChange={e => setForm({...form, unitPrice: Number(e.target.value)})} />
            </div>
          </div>

          <div className="col-span-2 bg-purple-50 p-4 rounded-2xl flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total Calculated Amount:</span>
            <span className="text-2xl font-bold text-purple-600">${form.totalAmount.toLocaleString()}</span>
          </div>

          {error && <p className="col-span-2 text-red-500 text-sm font-medium">⚠️ {error}</p>}

          <div className="col-span-2 flex gap-4 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-300 rounded-2xl font-semibold hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-2xl font-semibold shadow-md hover:bg-purple-700 transition">Submit Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalOrderModalCard;