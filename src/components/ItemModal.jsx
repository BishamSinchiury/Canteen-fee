import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function ItemModal({ onClose, onSave, item = null }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    veg: item?.veg ?? true,
    is_available: item?.is_available ?? true,
    ingredients: item?.ingredients || '',
    units: item?.units || [{ unit_name: '', price: '' }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item) {
        await api.updateItem(item.id, formData);
      } else {
        await api.createItem(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      alert('Failed to save item: ' + error.message);
    }
  };

  const addUnit = () => {
    setFormData({
      ...formData,
      units: [...formData.units, { unit_name: '', price: '' }],
    });
  };

  const removeUnit = (index) => {
    setFormData({
      ...formData,
      units: formData.units.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? 'Edit Item' : 'Add New Item'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.veg}
                  onChange={(e) => setFormData({ ...formData, veg: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Vegetarian</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Available</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
              <textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Units & Prices</label>
                <button
                  type="button"
                  onClick={addUnit}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Unit
                </button>
              </div>

              {formData.units.map((unit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Unit name"
                    value={unit.unit_name}
                    onChange={(e) => {
                      const newUnits = [...formData.units];
                      newUnits[index].unit_name = e.target.value;
                      setFormData({ ...formData, units: newUnits });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={unit.price}
                    onChange={(e) => {
                      const newUnits = [...formData.units];
                      newUnits[index].price = e.target.value;
                      setFormData({ ...formData, units: newUnits });
                    }}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {formData.units.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className="text-red-600 hover:text-red-700"
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
                {item ? 'Update' : 'Create'} Item
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