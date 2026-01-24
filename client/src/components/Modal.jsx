const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75"
        onClick={() => onClose && onClose()}
      />

      <div className="flex items-center justify-center min-h-screen px-4">
        {/* MODAL BOX */}
        <div
          className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative"
          onClick={(e) => e.stopPropagation()} // ⭐ IMPORTANT
        >
          {/* CLOSE BUTTON */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={() => onClose && onClose()}
          >
            ✕
          </button>

          {title && (
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
