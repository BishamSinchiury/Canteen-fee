import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ExpensesTab() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await api.getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
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
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td className="px-6 py-4 text-sm font-medium text-red-600">${expense.amount.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{expense.description || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {expense.purchase ? `Purchase: ${expense.purchase.item?.name}` : 
                 expense.vendor_payment ? `Vendor: ${expense.vendor_payment.name}` : 
                 'Other'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(expense.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}