import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import api from "../services/api";
import ItemCard from "../components/ItemCard";
import ItemModal from "../components/ItemModal";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Default Items page to nonfood since this page is primarily for NonFood items
  const [modalMode, setModalMode] = useState("nonfood");
  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    unit_name: "",
    veg: "",
    is_available: "",
  });

  const loadItems = async (search = "") => {
    try {
      setLoading(true);
      const params = { ...filters };
      if (search) params.search = search;

      const data = await api.getItems(params);
      // Only show non-food items here (items that have a `quantity` field)
      const nonFoodOnly = Array.isArray(data)
        ? data.filter((i) => i.quantity !== undefined && i.quantity !== null)
        : [];
      setItems(nonFoodOnly);
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [filters]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    loadItems(term);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      min_price: "",
      max_price: "",
      unit_name: "",
      veg: "",
      is_available: "",
    });
  };

  const openEditModal = (item) => {
    // fetch full details to get created_at / updated_at and quantity
    const doOpen = async () => {
      try {
        let full = item;
        if (item?.quantity !== undefined) {
          full = await api.getNonFood(item.id);
        } else {
          full = await api.getItem(item.id);
        }
        // Ensure modal mode matches the item's type when editing
        setModalMode(full?.quantity !== undefined ? "nonfood" : "food");
        setEditingItem(full);
      } catch (err) {
        console.warn("Failed to fetch full item, using provided item", err);
        setModalMode(item?.quantity !== undefined ? "nonfood" : "food");
        setEditingItem(item);
      }
      setShowModal(true);
    };
    doOpen();
  };

  const handleDelete = async (item) => {
    try {
      if (item?.quantity !== undefined) {
        await api.deleteNonFood(item.id);
      } else {
        await api.deleteItem(item.id);
      }
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error("Delete failed", err);
      alert(
        "Failed to delete item: " + (err?.data?.detail || err?.message || err)
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-3">
        <h1 className="text-3xl font-bold text-gray-900">Items</h1>
        <div className="flex items-center gap-3">
          <select
            value={modalMode}
            onChange={(e) => setModalMode(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
            title="Select item type for Add Item modal"
          >
            <option value="food">Food</option>
            <option value="nonfood">NonFood</option>
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 min-w-0 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.min_price}
            onChange={(e) => handleFilterChange("min_price", e.target.value)}
            className="w-28 px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.max_price}
            onChange={(e) => handleFilterChange("max_price", e.target.value)}
            className="w-28 px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Unit name"
            value={filters.unit_name}
            onChange={(e) => handleFilterChange("unit_name", e.target.value)}
            className="w-36 px-3 py-2 border rounded-lg text-sm"
          />
          <select
            value={filters.veg}
            onChange={(e) => handleFilterChange("veg", e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Veg/Non-Veg</option>
            <option value="true">Veg</option>
            <option value="false">Non-Veg</option>
          </select>
          <select
            value={filters.is_available}
            onChange={(e) => handleFilterChange("is_available", e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Availability</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 border rounded-lg text-sm hover:bg-gray-200"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onUpdate={openEditModal}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No items found.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ItemModal
          mode={modalMode}
          onClose={closeModal}
          onSave={() => {
            loadItems(searchTerm);
            closeModal();
          }}
          item={editingItem}
        />
      )}
    </div>
  );
}
