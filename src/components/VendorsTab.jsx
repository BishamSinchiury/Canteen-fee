import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function VendorsTab() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await api.getVendors();
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {vendors.map(vendor => (
            <tr key={vendor.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{vendor.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{vendor.contact_no || '-'}</td>
              <td className="px-6 py-4 text-sm font-medium text-orange-600">
                ${vendor.account_balance.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{vendor.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}