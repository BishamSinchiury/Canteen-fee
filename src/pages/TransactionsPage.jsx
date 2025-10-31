import React, { useState } from 'react';
import SalesTab from '../components/SalesTab';
import PurchasesTab from '../components/PurchasesTab';
import IncomesTab from '../components/IncomesTab';
import ExpensesTab from '../components/ExpensesTab';

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState('sales');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Transactions</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['sales', 'purchases', 'incomes', 'expenses'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'sales' && <SalesTab />}
      {activeTab === 'purchases' && <PurchasesTab />}
      {activeTab === 'incomes' && <IncomesTab />}
      {activeTab === 'expenses' && <ExpensesTab />}
    </div>
  );
}