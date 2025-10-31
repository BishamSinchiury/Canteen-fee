// components/AddSaleModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function AddSaleModal({ onClose, onSaved }) {
  const [items, setItems] = useState([]);
  const [creditors, setCreditors] = useState([]);
  const [form, setForm] = useState({
    item_id: '',
    unit_id: '',
    payment_type: 'cash',
    creditor_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Auto-filled price (for display + payload)
  const [displayPrice, setDisplayPrice] = useState('');

  // -------------------------------------------------
  // 1. Load Items & Creditors
  // -------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setFetching(true);
      try {
        const [itemsRes, credRes] = await Promise.all([
          api.getItems(),
          api.getCreditors(),
        ]);
        setItems(itemsRes);
        setCreditors(credRes);
      } catch (err) {
        alert('Failed to load data');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  // -------------------------------------------------
  // 2. Get selected item → units
  // -------------------------------------------------
  const selectedItem = items.find(i => i.id === Number(form.item_id));
  const units = selectedItem?.units || [];

  // -------------------------------------------------
  // 3. Auto-set price when unit changes
  // -------------------------------------------------
  useEffect(() => {
    if (form.unit_id) {
      const selectedUnit = units.find(u => u.id === Number(form.unit_id));
      if (selectedUnit) {
        setDisplayPrice(selectedUnit.price);
      }
    } else {
      setDisplayPrice('');
    }
  }, [form.unit_id, units]);

  // -------------------------------------------------
  // 4. Submit - NOW INCLUDES PRICE IN PAYLOAD
  // -------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_id || !form.unit_id) return;

    setLoading(true);
    try {
      const payload = {
        item: Number(form.item_id),
        unit: Number(form.unit_id),
        price: Number(displayPrice),  // ← ADDED: Send price from unit
        payment_type: form.payment_type,
        ...(form.payment_type === 'credit' && form.creditor_id
          ? { creditor: Number(form.creditor_id) }
          : {}),
      };

      console.log('Sending payload:', payload); // Debug

      await api.createSale(payload);
      onSaved();
      onClose();
    } catch (err) {
      alert(err?.data?.detail || 'Failed to create sale');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // 5. Loading UI
  // -------------------------------------------------
  if (fetching) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Sale</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Item */}
          <div>
            <label className="block text-sm font-medium mb-1">Item *</label>
            <select
              required
              value={form.item_id}
              onChange={e => setForm({ ...form, item_id: e.target.value, unit_id: '' })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Item --</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-1">Unit *</label>
            <select
              required
              disabled={!form.item_id}
              value={form.unit_id}
              onChange={e => setForm({ ...form, unit_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Unit --</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.unit_name} – ₹{unit.price}
                </option>
              ))}
            </select>
          </div>

          {/* Price (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <div className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700 font-medium">
              {displayPrice ? `₹${Number(displayPrice).toFixed(2)}` : '—'}
            </div>
          </div>

          {/* Payment */}
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

          {/* Creditor */}
          {form.payment_type === 'credit' && (
            <div>
              <label className="block text-sm font-medium mb-1">Creditor</label>
              <select
                value={form.creditor_id}
                onChange={e => setForm({ ...form, creditor_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Select Creditor --</option>
                {creditors.map(c => (
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
              disabled={loading || !form.unit_id}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition"
            >
              {loading ? 'Saving...' : 'Save Sale'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}