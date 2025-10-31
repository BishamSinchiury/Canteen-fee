// components/SalesTab.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function SalesTab({ key }) {
  const [sales, setSales] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadSales = async () => {
    try {
      const response = await api.getSales(); // ← expects { sales: [...], grand_total: X }

      // Handle both paginated and non-paginated responses
      let salesData = response.sales || response;
      let total = response.grand_total || 0;

      // If API returns flat array, calculate grand_total locally
      if (Array.isArray(response) && !response.grand_total) {
        salesData = response;
        total = response.reduce((sum, s) => sum + (s.total || s.price || 0), 0);
      }

      setSales(salesData);
      setGrandTotal(total);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [key]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading sales...</div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No sales recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => {
              const total = sale.total || sale.price || 0;
              return (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.item_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sale.unit_name || sale.unit?.unit_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{Number(sale.price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    ₹{Number(total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sale.payment_type === 'cash'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {sale.payment_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(sale.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Grand Total Footer */}
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right font-semibold text-gray-700">
                Grand Total:
              </td>
              <td className="px-6 py-4 text-sm font-bold text-blue-700">
                ₹{Number(grandTotal).toFixed(2)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}