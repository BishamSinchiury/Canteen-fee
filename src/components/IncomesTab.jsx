import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function IncomesTab() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      const data = await api.getIncomes();
      setIncomes(data);
    } catch (error) {
      console.error('Failed to load incomes:', error);
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {incomes.map(income => (
            <tr key={income.id}>
              <td className="px-6 py-4 text-sm font-medium text-green-600">${income.amount.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{income.description || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {income.sale ? `Sale: ${income.sale.item?.name}` : 
                 income.creditor_payment ? `Creditor: ${income.creditor_payment.name}` : 
                 'Other'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(income.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}