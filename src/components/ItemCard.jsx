import React, { useState } from 'react';

export default function ItemCard({ item, onUpdate }) {
  const [imageFailed, setImageFailed] = useState(false);

  // Determine final image source
  const imageSrc = imageFailed || !item.image ? '/placeholder.jpg' : item.image;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      <img
        src={imageSrc}
        alt={item.name}
        className="w-full h-48 object-cover"
        onError={() => {
          if (!imageFailed) {
            setImageFailed(true); // Mark as failed once
          }
        }}
        // Optional: Add loading placeholder style
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              item.veg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {item.veg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        )}

        <div className="space-y-1 mb-3">
          {Array.isArray(item.units) && item.units.length > 0 ? (
            item.units.map((unit) => (
              <div key={unit.id || unit.unit_name} className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">{unit.unit_name}</span>
                <span className="font-semibold text-gray-900">
                  ${parseFloat(unit.price).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No units available</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span
            className={`text-xs font-medium ${
              item.is_available ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {item.is_available ? 'Available' : 'Unavailable'}
          </span>
          <button
            onClick={() => onUpdate(item)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}