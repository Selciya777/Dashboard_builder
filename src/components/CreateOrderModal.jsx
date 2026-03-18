import { useState, useEffect } from "react";

export default function ProfessionalOrderFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "United States",
    product: "Fiber Internet 300 Mbps", qty: 1, unitPrice: 0,
    totalAmount: 0, status: "Pending", createdBy: "Mr. Michael Harris"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", city: "", state: "", zip: "", country: "United States",
        product: "Fiber Internet 300 Mbps", qty: 1, unitPrice: 0,
        totalAmount: 0, status: "Pending", createdBy: "Mr. Michael Harris"
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalAmount: Number(prev.qty) * Number(prev.unitPrice)
    }));
  }, [formData.qty, formData.unitPrice]);

  useEffect(() => {
    if (isOpen) document.getElementById("firstNameInput")?.focus();
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email address";
    if (formData.qty < 1) newErrors.qty = "Quantity must be at least 1";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        <div className="flex justify-between items-center px-8 py-5 border-b border-blue-200 bg-blue-50">
          <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Create Order</h2>
          <button onClick={onClose} className="text-blue-900 hover:text-blue-700 text-2xl transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-blue-800 border-b pb-2 uppercase tracking-wider">Customer Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">First name *</label>
                  <input
                    id="firstNameInput"
                    required
                    className="border-2 p-3 rounded-xl focus:border-blue-400 outline-none transition-all"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Last name *</label>
                  <input
                    required
                    className="border-2 p-3 rounded-xl focus:border-blue-400 outline-none transition-all"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Email *</label>
                  <input
                    required
                    type="email"
                    className={`border-2 p-3 rounded-xl outline-none ${errors.email ? 'border-red-500' : 'focus:border-blue-400'}`}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Phone *</label>
                  <input
                    required
                    className="border-2 p-3 rounded-xl focus:border-blue-400 outline-none transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Street Address *</label>
                <input
                  required
                  className="border-2 p-3 rounded-xl focus:border-blue-400 outline-none transition-all"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  placeholder="City *"
                  required
                  className="border-2 p-3 rounded-xl outline-none text-sm"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
                <input
                  placeholder="State *"
                  required
                  className="border-2 p-3 rounded-xl outline-none text-sm"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                />
                <input
                  placeholder="Zip *"
                  required
                  className="border-2 p-3 rounded-xl outline-none text-sm"
                  value={formData.zip}
                  onChange={e => setFormData({ ...formData, zip: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Country *</label>
                <select
                  className="border-2 p-3 rounded-xl bg-blue-50 outline-none focus:border-blue-400"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                >
                  {["United States", "Canada", "Australia", "Singapore", "Hong Kong"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-blue-800 border-b pb-2 uppercase tracking-wider">Order Information</h3>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Choose product *</label>
                <select
                  className="border-2 p-3 rounded-xl bg-blue-50 outline-none focus:border-blue-400"
                  value={formData.product}
                  onChange={e => setFormData({ ...formData, product: e.target.value })}
                >
                  <option>VoIP Corporate Package</option>
                  <option>Business Internet 500 Mbps</option>
                  <option>Fiber Internet 1 Gbps</option>
                  <option>5G Unlimited Mobile Plan</option>
                  <option>Fiber Internet 300 Mbps</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    className="border-2 p-3 rounded-xl outline-none focus:border-blue-400"
                    value={formData.qty}
                    onChange={e => setFormData({ ...formData, qty: Number(e.target.value) })}
                  />
                  {errors.qty && <p className="text-red-500 text-xs mt-1">{errors.qty}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Unit price ($) *</label>
                  <input
                    type="number"
                    className="border-2 p-3 rounded-xl outline-none focus:border-blue-400"
                    value={formData.unitPrice}
                    onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Total amount</label>
                <div className="bg-blue-50 p-3 rounded-xl font-black text-blue-700 border-2 border-transparent">
                  $ {formData.totalAmount.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Status *</label>
                  <select
                    className="border-2 p-3 rounded-xl bg-blue-50 outline-none focus:border-blue-400"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>Pending</option>
                    <option>In progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-blue-600 uppercase ml-1">Created by *</label>
                  <select
                    className="border-2 p-3 rounded-xl bg-blue-50 outline-none focus:border-blue-400"
                    value={formData.createdBy}
                    onChange={e => setFormData({ ...formData, createdBy: e.target.value })}
                  >
                    <option>Mr. Michael Harris</option>
                    <option>Mr. Ryan Cooper</option>
                    <option>Ms. Olivia Carter</option>
                    <option>Mr. Lucas Martin</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-blue-200">
            <button type="button" onClick={onClose} className="px-10 py-3 font-bold text-blue-800 hover:text-blue-900 transition-all">Cancel</button>
            <button type="submit" className="px-10 py-3 bg-blue-200 text-blue-900 rounded-xl font-black shadow-lg shadow-blue-200/30 hover:bg-blue-300 transition-all active:scale-95">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}