import React, { useState } from "react";

const CreateCollectionForm = ({ onSubmit, onClose, isLoading }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a collection name");
      return;
    }
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-purple-800 mb-2">
          Collection Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter collection name"
          className="w-full border-2 border-purple-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-purple-600 hover:text-purple-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          {isLoading ? "Creating..." : "Create Collection"}
        </button>
      </div>
    </form>
  );
};

export default CreateCollectionForm;
