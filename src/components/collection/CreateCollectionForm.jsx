import React, { useState } from "react";
import { toast } from "react-toastify";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-display text-2xl font-black uppercase text-black mb-6">
          Create Collection
        </h3>
        
        <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-black">
          Collection Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Summer Favorites"
          className="w-full border-4 border-black px-4 py-4 text-lg font-mono focus:outline-none focus:border-brutal-accent bg-white placeholder:text-brutal-disabled"
          required
        />
      </div>
      
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 font-mono text-sm uppercase font-bold border-4 border-black text-black hover:bg-black/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-black text-brutal-accent py-3 font-display font-bold uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateCollectionForm;
