// components/AddPurchaseModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function AddPurchaseModal({ onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    item_id: '',
    unit_id: '',
    payment_type: 'cash',
    vendor_id: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [i, v] = await Promise.all([api.getItems(), api.getVendors()]);
      setItems(i);
      setVendors(v);
    };
    load();
  }, []);

  const selectedItem = items.find(i => i.id === Number(form.item_id));
  const units = selectedItem?.units || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        item: Number(form.item_id),
        unit: Number(form.unit_id),
        payment_type: form.payment_type,
        ...(form.payment_type === 'credit' && form.vendor_id
          ? { vendor: Number(form.vendor_id) }
          : {}),
      };
      await api.createPurchase(payload);
      onSaved();
      onClose();
    } catch (err) {
      alert(err?.data?.detail || 'Failed to create purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Purchase</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item</label>
            <select
              required
              value={form.item_id}
              onChange={e => setForm({ ...form, item_id: e.target.value, unit_id: '' })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Item --</option>
              {items.map(it => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              required
              disabled={!form.item_id}
              value={form.unit_id}
              onChange={e => setForm({ ...form, unit_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Unit --</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.unit_name} – ₹{u.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment</label>
            <select
              value={form.payment_type}
              onChange={e => setForm({ ...form, payment_type: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          {form.payment_type === 'credit' && (
            <div>
              <label className="block text-sm font-medium mb-1">Vendor</label>
              <select
                value={form.vendor_id}
                onChange={e => setForm({ ...form, vendor_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Select Vendor --</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} (Bal: ₹{v.account_balance})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}