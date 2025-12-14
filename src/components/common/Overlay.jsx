import React from "react";
import { X } from "lucide-react";

const Overlay = ({ isOpen, onClose, children, zIndex = "z-50" }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/90 flex items-center justify-center p-4 ${zIndex}`}
      onClick={onClose}
    >
      <div 
        className="bg-brutal-white border-4 border-black shadow-brutal-accent-lg p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brutal-disabled hover:text-black hover:bg-brutal-accent/10 transition-colors"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
