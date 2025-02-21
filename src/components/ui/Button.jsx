import React from "react";

const Button = ({ children, onClick, className, dark }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded p-3 w-full${
        dark
          ? "bg-green-500 text-white text-sm hover:bg-green-600"
          : "border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
