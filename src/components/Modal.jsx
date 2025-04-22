import React from "react";
// Replace FaTimes with your existing Lucide icons
import { X } from "lucide-react";

const Modal = ({ children, closeModal }) => {
  return (
    <div className="relative">
      {/* Window control header */}
      <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
        <div className="text-lg font-medium text-purple-900">
          {/* Title could be passed as prop if needed */}
        </div>
        <div className="flex space-x-2">
          <button
            className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500"
            aria-label="Minimize"
          />
          <button
            className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500"
            aria-label="Maximize"
          />
          <button
            onClick={closeModal}
            className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500"
            aria-label="Close modal"
          />
        </div>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
};

export default Modal;
