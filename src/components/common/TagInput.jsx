import React from "react";

const TagInput = ({
  label,
  value,
  onChange,
  onAdd,
  placeholder,
  tags,
  onRemove,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-purple-800 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onAdd()}
          placeholder={placeholder}
          className="w-full border-2 border-purple-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={onAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((item, index) => (
          <div
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{item}</span>
            <button
              onClick={() => onRemove(item)}
              className="text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
