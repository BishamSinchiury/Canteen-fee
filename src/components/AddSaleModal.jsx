// components/AddSaleModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function AddSaleModal({ onClose, onSaved }) {
  const [items, setItems] = useState([]);         // All items with their units
  const [creditors, setCreditors] = useState([]); // All creditors
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Show loading while fetching

  const [form, setForm] = useState({
    item_id: '',
    unit_id: '',
    payment_type: 'cash',
    creditor_id: '',
  });

  // -------------------------------------------------
  // 1. Fetch Items & Creditors on mount
  // -------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      try {
        const [itemsData, creditorsData] = await Promise.all([
          api.getItems(),        // → returns list of { id, name, units: [{id, unit_name, price}] }
          api.getCreditors(),    // → returns list of { id, name, account_balance }
        ]);
        setItems(itemsData);
        setCreditors(creditorsData);
      } catch (err) {
        console.error('Failed to load data:', err);
        alert('Failed to load items or creditors');
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, []);

  // -------------------------------------------------
  // 2. Derive units from selected item
  // -------------------------------------------------
  const selectedItem = items.find(i => i.id === Number(form.item_id));
  const units = selectedItem?.units || [];

  // -------------------------------------------------
  // 3. Submit handler
  // -------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_id || !form.unit_id) return;

    setLoading(true);
    try {
      const payload = {
        item: Number(form.item_id),
        unit: Number(form.unit_id),
        payment_type: form.payment_type,
        ...(form.payment_type === 'credit' && form.creditor_id
          ? { creditor: Number(form.creditor_id) }
          : {}),
      };

      await api.createSale(payload);
      onSaved();   // Refresh the list in parent
      onClose();   // Close modal
    } catch (err) {
      const msg = err?.data?.detail || err.message || 'Failed to create sale';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // 4. Render
  // -------------------------------------------------
  if (fetching) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">Loading items and creditors...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Sale</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Item Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Item *</label>
            <select
              required
              value={form.item_id}
              onChange={(e) => setForm({ ...form, item_id: e.target.value, unit_id: '' })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Item --</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Unit *</label>
            <select
              required
              disabled={!form.item_id}
              value={form.unit_id}
              onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Unit --</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unit_name} – ₹{unit.price}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Type</label>
            <select
              value={form.payment_type}
              onChange={(e) => setForm({ ...form, payment_type: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          {/* Creditor (only if credit) */}
          {form.payment_type === 'credit' && (
            <div>
              <label className="block text-sm font-medium mb-1">Creditor</label>
              <select
                value={form.creditor_id}
                onChange={(e) => setForm({ ...form, creditor_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Select Creditor --</option>
                {creditors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Bal: ₹{c.account_balance})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !form.item_id || !form.unit_id}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Sale'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}