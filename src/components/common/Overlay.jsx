import React from "react";
import { X } from "lucide-react";

const Overlay = ({ isOpen, onClose, children, zIndex = "z-50" }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ${zIndex}`}
    >
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
