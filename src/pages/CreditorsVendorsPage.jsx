import { useState } from "react";
import CreditorsTab from "../components/CreditorsTab";
import VendorsTab from "../components/VendorsTab";
import CreditorModal from "../components/CreditorModal";
import VendorModal from "../components/VendorModal";

export default function CreditorsVendorsPage() {
  const [activeTab, setActiveTab] = useState("creditors");
  const [showAddCreditor, setShowAddCreditor] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);

  // simple refresh trigger to notify tabs to reload their data
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1); //what it does?

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Creditors & Vendors
      </h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("creditors")}
          className={`px-4 py-2 font-medium ${
            activeTab === "creditors"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Creditors
        </button>
        <button
          onClick={() => setActiveTab("vendors")}
          className={`px-4 py-2 font-medium ${
            activeTab === "vendors"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Vendors
        </button>

        {/* right aligned add button */}
        <div className="ml-auto mb-2">
          {activeTab === "vendors" && ( //why &&? and not used if/else instead:
            <div>
              <button
                onClick={() => setShowAddVendor(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                aria-label="Add Vendor"
              >
                Add Vendor
              </button>
            </div>
          )}

          {activeTab === "creditors" && (
            <div>
              <button
                onClick={() => setShowAddCreditor(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                aria-label="Add Creditor"
              >
                Add Creditor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* this is the tab content that will be refreshed */}
      {activeTab === "creditors" ? (
        <CreditorsTab refreshKey={refreshKey} />
      ) : (
        <VendorsTab refreshKey={refreshKey} />
      )}

      {/* Modals are page-level; they close and trigger refresh when saved */}
      <div>
        {showAddCreditor && (
          <CreditorModal
            onClose={() => setShowAddCreditor(false)}
            onSaved={() => {
              setShowAddCreditor(false);
              triggerRefresh();
            }}
          />
        )}

        {showAddVendor && (
          <VendorModal
            onClose={() => setShowAddVendor(false)}
            onSaved={() => {
              setShowAddVendor(false);
              triggerRefresh();
            }}
          />
        )}
      </div>
    </div>
  );
}
