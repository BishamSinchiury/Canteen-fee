import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import api from "../services/api";

export default function FoodItemModal({ onClose, onSave, item = null }) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    veg: item?.veg ?? true,
    is_available: item?.is_available ?? true,
    ingredients: item?.ingredients || "",
    units:
      item?.units?.length > 0
        ? item.units.map((u) => ({ unit_name: u.unit_name, price: u.price }))
        : [{ unit_name: "", price: "" }],
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cleanUnits = formData.units
        .filter((u) => u.unit_name.trim() && u.price !== "")
        .map((u) => ({
          unit_name: u.unit_name.trim(),
          price: parseFloat(u.price),
        }));

      let payload;
      let isMultipart = false;

      if (formData.image instanceof File) {
        isMultipart = true;
        payload = new FormData();
        payload.append("name", formData.name);
        payload.append("description", formData.description);
        payload.append("veg", formData.veg ? "true" : "false");
        payload.append(
          "is_available",
          formData.is_available ? "true" : "false"
        );
        payload.append("ingredients", formData.ingredients);
        payload.append("image", formData.image);

        cleanUnits.forEach((unit, index) => {
          payload.append(`units[${index}][unit_name]`, unit.unit_name);
          payload.append(`units[${index}][price]`, unit.price);
        });
      } else {
        payload = {
          name: formData.name,
          description: formData.description,
          veg: formData.veg,
          is_available: formData.is_available,
          ingredients: formData.ingredients,
          units: cleanUnits,
        };
      }

      if (item) {
        await api.updateItem(item.id, payload, isMultipart);
      } else {
        await api.createItem(payload, isMultipart);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
      const message =
        error.response?.data?.detail || error.response?.data || error.message;
      alert("Failed to save item: " + message);
    }
  };

  const addUnit = () => {
    setFormData({
      ...formData,
      units: [...formData.units, { unit_name: "", price: "" }],
    });
  };

  const removeUnit = (index) => {
    setFormData({
      ...formData,
      units: formData.units.filter((_, i) => i !== index),
    });
  };

  const updateUnit = (index, field, value) => {
    const newUnits = [...formData.units];
    newUnits[index][field] = value;
    setFormData({ ...formData, units: newUnits });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg w-full max-h-[85vh] overflow-y-auto max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? "Edit Item" : "Add New Item"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {item?.image && !formData.image && (
                  <img
                    src={item.image}
                    alt="Current"
                    className="mt-3 w-32 h-32 object-cover rounded-lg shadow"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.veg}
                  onChange={(e) =>
                    setFormData({ ...formData, veg: e.target.checked })
                  }
                  className="mr-2 rounded"
                />
                <span className="text-sm text-gray-700">Vegetarian</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) =>
                    setFormData({ ...formData, is_available: e.target.checked })
                  }
                  className="mr-2 rounded"
                />
                <span className="text-sm text-gray-700">Available</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients
              </label>
              <textarea
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData({ ...formData, ingredients: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="e.g. Cheese, Tomato, Dough"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Units & Prices
                </label>
                <button
                  type="button"
                  onClick={addUnit}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Unit
                </button>
              </div>

              {formData.units.map((unit, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Unit name"
                    value={unit.unit_name}
                    onChange={(e) =>
                      updateUnit(index, "unit_name", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={unit.price}
                    onChange={(e) => updateUnit(index, "price", e.target.value)}
                    className="w-28 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formData.units.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {item ? "Update" : "Create"} Item
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
