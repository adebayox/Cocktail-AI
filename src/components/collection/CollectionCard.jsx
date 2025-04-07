import React from "react";

const CollectionCard = ({ collection, onSelect }) => (
  <div
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
    onClick={onSelect}
  >
    <div className="mb-4">
      <h3 className="text-xl font-semibold text-purple-800">
        {collection.name}
      </h3>
      <p className="text-sm text-purple-600">
        {collection.cocktails?.length || 0} cocktails
      </p>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="aspect-square bg-purple-50 rounded-lg"></div>
      ))}
    </div>
  </div>
);

export default CollectionCard;
