import React, { useState } from 'react';
import CreditorsTab from '../components/CreditorsTab';
import VendorsTab from '../components/VendorsTab';

export default function CreditorsVendorsPage() {
  const [activeTab, setActiveTab] = useState('creditors');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Creditors & Vendors</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('creditors')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'creditors'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Creditors
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'vendors'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Vendors
        </button>
      </div>

      {activeTab === 'creditors' ? <CreditorsTab /> : <VendorsTab />}
    </div>
  );
}