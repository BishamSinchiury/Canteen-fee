export default function LogoutConfirm({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm logout
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
