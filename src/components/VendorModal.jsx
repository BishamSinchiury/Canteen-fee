import React, { useState, useRef, useEffect } from "react";
import api from "../services/api";

export default function VendorModal({ onClose, onSaved }) {
  const [name, setName] = useState("");
  const [contact_no, setContactNo] = useState("");
  const [description, setDescription] = useState("");
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name, // string
        contact_no, // optional string
        account_balance: parseFloat(balance) || 0, // number
        description, // optional string
      };
      const created = await api.createVendor(payload);
      // created contains backend response (new vendor)
      onSaved && onSaved(created); // parent will triggerRefresh()
      onClose && onClose();
    } catch (err) {
      console.error("Failed to save vendor:", err);
      alert("Failed to save vendor: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Vendor</h2>
          <button onClick={onClose} className="text-gray-600">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Contact</label>
            <input
              value={contact_no}
              onChange={(e) => setContactNo(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Balance</label>
            <input
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
