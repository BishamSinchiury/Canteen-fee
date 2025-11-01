import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  Package,
  Box,
  DollarSign,
  Users,
  UserCircle,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import ItemsPage from "../pages/ItemsPage";
import TransactionsPage from "../pages/TransactionsPage";
import CreditorsVendorsPage from "../pages/CreditorsVendorsPage";
import FoodItemsPage from "../pages/FoodItemsPage";
import LogoutConfirm from "./LogoutConfirm";

export default function Layout() {
  // make initial sidebar visibility depend on screen size
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      return window.matchMedia("(min-width: 768px)").matches;
    } catch (e) {
      return true;
    }
  });
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "food-items", name: "Food Items", icon: Package },
    { id: "items", name: "Items", icon: Box },

    { id: "transactions", name: "Transactions", icon: DollarSign },
    { id: "creditors-vendors", name: "Creditors & Vendors", icon: Users },
  ];

  // Track whether viewport is large (md and up) and auto-open/close sidebar on breakpoint change.
  const [isLarge, setIsLarge] = React.useState(() => {
    try {
      return window.matchMedia("(min-width: 768px)").matches;
    } catch (e) {
      return true;
    }
  });

  // Theme (dark/light) persisted in localStorage. We toggle the `dark` class on <html>.
  const [theme, setTheme] = React.useState(() => {
    try {
      return (
        localStorage.getItem("theme") ||
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    } catch (e) {
      return "light";
    }
  });

  const applyTheme = (t) => {
    try {
      if (t === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", t);
    } catch (e) {}
  };

  React.useEffect(() => {
    // Apply theme whenever it changes.
    applyTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    let mql;
    try {
      mql = window.matchMedia("(min-width: 768px)");
    } catch (e) {
      return undefined;
    }

    const handle = (e) => {
      setIsLarge(e.matches);
      // auto open/close when crossing breakpoint
      setSidebarOpen(e.matches);
    };

    // initial
    setIsLarge(mql.matches);
    setSidebarOpen(mql.matches);

    if (mql.addEventListener) {
      mql.addEventListener("change", handle);
    } else if (mql.addListener) {
      mql.addListener(handle);
    }

    return () => {
      if (!mql) return;
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handle);
      } else if (mql.removeListener) {
        mql.removeListener(handle);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden relative`}
      >
        <div className="p-4 sm:p-6 flex items-center justify-between">
          {/* Hide the text on very small screens, show on sm+ */}
          <h2 className="text-2xl font-bold hidden sm:block">Inventory</h2>

          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="p-2 hover:bg-gray-800 rounded-lg transition ml-2"
          >
            <X className="w-5 h-5 text-white" />
          </button>
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

        <div className="absolute bottom-0 left-0 right-0 p-4 w-full border-t border-gray-800">
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
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center w-[75%] gap-3 px-3 py-2 text-sm text-white hover:bg-red-700 rounded-lg transition"
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
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {/* Show hamburger when sidebar is closed or when viewport is small */}
              {(!sidebarOpen || !isLarge) && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Open sidebar"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Right side: date + theme toggle */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "items" && <ItemsPage />}
          {currentPage === "food-items" && <FoodItemsPage />}
          {currentPage === "transactions" && <TransactionsPage />}
          {currentPage === "creditors-vendors" && <CreditorsVendorsPage />}
        </main>
      </div>
      <LogoutConfirm
        open={showLogoutConfirm}
        onConfirm={async () => {
          setShowLogoutConfirm(false);
          try {
            await logout();
          } catch (e) {
            // logout already handles errors; just ensure modal closed
          }
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
