import React from 'react';

export default function ItemCard({ item }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      {item.image && (
        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${item.veg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.veg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
        
        {item.description && (
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        )}

        <div className="space-y-1">
          {item.units.map(unit => (
            <div key={unit.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{unit.unit_name}</span>
              <span className="font-semibold text-gray-900">${unit.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className={`text-xs ${item.is_available ? 'text-green-600' : 'text-red-600'}`}>
            {item.is_available ? '● Available' : '● Unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
}