import { useState } from "react";

export default function FoodItemCard({ item, onUpdate, onDelete }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Determine final image source
  const imageSrc = imageFailed || !item.image ? "/placeholder.jpg" : item.image;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="relative">
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-40 sm:h-44 md:h-48 object-cover"
          onError={() => {
            if (!imageFailed) {
              setImageFailed(true);
            }
          }}
          loading="lazy"
        />

        {onDelete && (
          <div className="absolute top-2 right-2">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen((s) => !s);
                }}
                title="Delete"
                className="w-8 h-8 bg-white/90 text-gray-700 rounded-full flex items-center justify-center shadow hover:bg-red-600 hover:text-white transition-colors z-20"
              >
                ×
              </button>

              {confirmOpen && (
                <div className="absolute top-10 right-0 z-10 w-44 bg-white border rounded-lg shadow p-2 text-sm">
                  <div className="mb-2">Delete "{item.name}"?</div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setConfirmOpen(false)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      No
                    </button>
                    <button
                      onClick={() => {
                        setConfirmOpen(false);
                        onDelete(item);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <div className="flex items-start gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                item.veg
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.veg ? "Veg" : "Non-Veg"}
            </span>
          </div>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="space-y-1 mb-3">
          {Array.isArray(item.units) && item.units.length > 0 ? (
            item.units.map((unit) => (
              <div
                key={unit.id || unit.unit_name}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-600 capitalize">
                  {unit.unit_name}
                </span>
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
              item.is_available ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.is_available ? "Available" : "Unavailable"}
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
