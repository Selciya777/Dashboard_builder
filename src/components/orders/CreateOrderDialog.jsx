import { useState } from "react";

export default function ProfessionalOrderModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", city: "", state: "", zip: "", country: "United States",
    product: "", qty: 1, price: 0, status: "Pending", creator: ""
  });

  if (!isOpen) return null;

  const total = (formData.qty * formData.price).toFixed(2);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-200 overflow-hidden">

        <div className="p-5 flex justify-between items-center bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900">
          <h2 className="text-lg font-semibold">Create Order</h2>
          <button 
            onClick={onClose} 
            className="text-blue-900 hover:text-blue-700 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">

          <section>
            <h3 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-4">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {["firstName","lastName","email","phone","street","city","state","zip"].map((field, idx) => (
                <input
                  key={field}
                  type={field==="email"?"email":"text"}
                  placeholder={["firstName","lastName","email","phone","street","city","state","zip"][idx].replace(/([A-Z])/g, ' $1') + " *"}
                  className="border border-blue-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-300 outline-none transition-all hover:shadow-md"
                  required
                />
              ))}
              <select className="border border-blue-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-300 outline-none bg-white hover:shadow-md transition-all">
                <option>United States</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-4">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <select className="col-span-2 border border-blue-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none hover:shadow-md transition-all" required>
                <option value="">Choose product *</option>
                <option>VoIP Corporate Package</option>
                <option>Fiber Internet 1 Gbps</option>
              </select>
              <input 
                type="number" 
                value={formData.qty}
                onChange={(e) => setFormData({...formData, qty: e.target.value})}
                placeholder="Quantity *" 
                className="border border-blue-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-300 outline-none hover:shadow-md transition-all" 
                min="1" 
                required 
              />
              <div className="relative">
                <span className="absolute left-3 top-3 text-blue-400 text-sm">$</span>
                <input 
                  type="number" 
                  placeholder="Unit price *" 
                  className="w-full border border-blue-200 rounded-lg p-3 pl-8 text-sm focus:ring-2 focus:ring-blue-300 outline-none hover:shadow-md transition-all" 
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required 
                />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700 font-medium">
                Total amount: <span className="font-bold text-blue-900">${total}</span>
              </div>
              <select className="border border-blue-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none hover:shadow-md transition-all">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <select className="col-span-2 border border-blue-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none hover:shadow-md transition-all">
                <option value="">Created by *</option>
                <option>Mr. Michael Harris</option>
                <option>Mr. Ryan Cooper</option>
              </select>
            </div>
          </section>
        </div>

        <div className="p-6 border-t flex justify-end gap-3 bg-blue-50 rounded-b-2xl">
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-blue-200 rounded-lg text-sm font-semibold text-blue-800 hover:bg-blue-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave} 
            className="px-6 py-2 bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900 rounded-lg text-sm font-semibold hover:from-blue-300 hover:to-blue-200 transition-all shadow-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}