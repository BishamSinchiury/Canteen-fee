import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import api from '../services/api';

function StatCard({ icon, title, value, bgColor }) {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    cashBalance: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalIncome: 0,
    totalExpense: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [cash, sales, purchases, incomes, expenses] = await Promise.all([
        api.getCashAccount(),
        api.getSales(),
        api.getPurchases(),
        api.getIncomes(),
        api.getExpenses(),
      ]);

      setStats({
        cashBalance: cash[0]?.balance || 0,
        totalSales: sales.reduce((sum, s) => sum + s.price, 0),
        totalPurchases: purchases.reduce((sum, p) => sum + p.price, 0),
        totalIncome: incomes.reduce((sum, i) => sum + i.amount, 0),
        totalExpense: expenses.reduce((sum, e) => sum + e.amount, 0),
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<Wallet className="w-8 h-8 text-green-600" />}
          title="Cash Balance"
          value={`$${stats.cashBalance.toFixed(2)}`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
          title="Total Sales"
          value={`$${stats.totalSales.toFixed(2)}`}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<TrendingDown className="w-8 h-8 text-red-600" />}
          title="Total Purchases"
          value={`$${stats.totalPurchases.toFixed(2)}`}
          bgColor="bg-red-50"
        />
        <StatCard
          icon={<DollarSign className="w-8 h-8 text-emerald-600" />}
          title="Total Income"
          value={`$${stats.totalIncome.toFixed(2)}`}
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon={<DollarSign className="w-8 h-8 text-orange-600" />}
          title="Total Expenses"
          value={`$${stats.totalExpense.toFixed(2)}`}
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
          title="Net Profit"
          value={`$${(stats.totalIncome - stats.totalExpense).toFixed(2)}`}
          bgColor="bg-purple-50"
        />
      </div>
    </div>
  );
}