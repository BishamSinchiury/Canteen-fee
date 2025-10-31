// src/pages/TransactionsPage.jsx
import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import SalesTab from '../components/SalesTab';
import PurchasesTab from '../components/PurchasesTab';
import IncomesTab from '../components/IncomesTab';
import ExpensesTab from '../components/ExpensesTab';
import AddSaleModal from '../components/AddSaleModal';
import AddPurchaseModal from '../components/AddPurchaseModal';
import AddIncomeModal from '../components/AddIncomeModal';
import AddExpenseModal from '../components/AddExpenseModal';

export default function TransactionsPage() {
  // activeTab is just a string
  const [activeTab, setActiveTab] = useState('sales');
  const [modal, setModal] = useState(null); // null or 'sales'|'purchases'|...

  const openModal = (tab) => setModal(tab);
  const closeModal = () => setModal(null);

  // refreshKey forces the tab to reload after a save
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <div className="p-6">
      {/* Header + Add button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>

        <button
          onClick={() => openModal(activeTab)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add{' '}
          {activeTab
            .slice(0, -1)
            .charAt(0)
            .toUpperCase() + activeTab.slice(1, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['sales', 'purchases', 'incomes', 'expenses'].map((tab) => (
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

      {/* Tab content – key changes on refresh */}
      {activeTab === 'sales' && <SalesTab key={`sales-${refreshKey}`} />}
      {activeTab === 'purchases' && (
        <PurchasesTab key={`purchases-${refreshKey}`} />
      )}
      {activeTab === 'incomes' && (
        <IncomesTab key={`incomes-${refreshKey}`} />
      )}
      {activeTab === 'expenses' && (
        <ExpensesTab key={`expenses-${refreshKey}`} />
      )}

      {/* Modals */}
      {modal === 'sales' && (
        <AddSaleModal onClose={closeModal} onSaved={refresh} />
      )}
      {modal === 'purchases' && (
        <AddPurchaseModal onClose={closeModal} onSaved={refresh} />
      )}
      {modal === 'incomes' && (
        <AddIncomeModal onClose={closeModal} onSaved={refresh} />
      )}
      {modal === 'expenses' && (
        <AddExpenseModal onClose={closeModal} onSaved={refresh} />
      )}
    </div>
  );
}