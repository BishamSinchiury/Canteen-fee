import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function PurchasesTab() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const data = await api.getPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {purchases.map(purchase => (
            <tr key={purchase.id}>
              <td className="px-6 py-4 text-sm text-gray-900">{purchase.item?.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{purchase.unit?.unit_name}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">${purchase.price.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  purchase.payment_type === 'cash' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {purchase.payment_type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(purchase.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}