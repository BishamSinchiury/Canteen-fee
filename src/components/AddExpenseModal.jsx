// components/AddExpenseModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function AddExpenseModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    purchase_id: '',
    vendor_payment_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);

  React.useEffect(() => {
    api.getVendors().then(setVendors);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        amount: Number(form.amount),
        description: form.description || null,
        ...(form.purchase_id ? { purchase: Number(form.purchase_id) } : {}),
        ...(form.vendor_payment_id ? { vendor_payment: Number(form.vendor_payment_id) } : {}),
      };
      await api.createExpense(payload);
      onSaved();
      onClose();
    } catch (err) {
      alert(err?.data?.detail || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount *</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link to Purchase (optional)</label>
            <input
              type="number"
              placeholder="Purchase ID"
              value={form.purchase_id}
              onChange={e => setForm({ ...form, purchase_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vendor Payment (optional)</label>
            <select
              value={form.vendor_payment_id}
              onChange={e => setForm({ ...form, vendor_payment_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- None --</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

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