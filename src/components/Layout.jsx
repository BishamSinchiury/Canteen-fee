import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  Package,
  DollarSign,
  Users,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import ItemsPage from "../pages/ItemsPage";
import TransactionsPage from "../pages/TransactionsPage";
import CreditorsVendorsPage from "../pages/CreditorsVendorsPage";
import FoodItemsPage from "../pages/FoodItemsPage";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { user, logout } = useAuth();

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "food-items", name: "Food Items", icon: Package },
    { id: "items", name: "Items", icon: Package },

    { id: "transactions", name: "Transactions", icon: DollarSign },
    { id: "creditors-vendors", name: "Creditors & Vendors", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold">Inventory</h2>
        </div>

        <nav className="px-3 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                currentPage === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <UserCircle className="w-8 h-8 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "items" && <ItemsPage />}
          {currentPage === "food-items" && <FoodItemsPage />}
          {currentPage === "transactions" && <TransactionsPage />}
          {currentPage === "creditors-vendors" && <CreditorsVendorsPage />}
        </main>
      </div>
    </div>
  );
}
