import React from "react";
import { Plus, Loader2, Trash2 } from "lucide-react";

const CollectionsView = ({
  collections,
  isLoading,
  onCreateNew,
  onSelectCollection,
  onDeleteCollection, // Add this prop
}) => {
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-purple-900">Your Collections</h2>
        <button
          onClick={onCreateNew}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <Plus className="w-5 h-5 mr-1" />
          Create New Collection
        </button>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections?.map((collection) => (
          <div
            key={collection._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative" // Added relative for positioning
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the parent onClick from firing
                onDeleteCollection(collection._id); // Call the delete function
              }}
              className="absolute top-2 right-2 p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* Collection Preview - Grid of cocktail images or placeholder */}
            <div
              onClick={() => onSelectCollection(collection)}
              className="grid grid-cols-2 gap-1 h-40"
            >
              {collection.cocktails && collection.cocktails.length > 0 ? (
                // Show up to 4 cocktail images
                collection.cocktails.slice(0, 4).map((cocktail, index) => (
                  <div key={index} className="h-20 overflow-hidden">
                    {cocktail.imageUrl ? (
                      <img
                        src={cocktail.imageUrl}
                        alt={cocktail.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                        <span className="text-xs text-purple-500 font-medium truncate px-2">
                          {cocktail.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Empty collection placeholder
                <div className="col-span-2 h-40 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-purple-500 font-medium">
                    Empty Collection
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold text-purple-800">
                {collection.name}
              </h3>
              <p className="text-sm text-purple-600 mt-1">
                {collection.cocktails?.length || 0} cocktails
              </p>
            </div>
          </div>
        ))}

        {/* Create New Collection Card */}
        <div
          onClick={onCreateNew}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-purple-200 flex flex-col items-center justify-center h-64"
        >
          <Plus className="w-12 h-12 text-purple-400 mb-2" />
          <p className="text-lg font-medium text-purple-600">
            Create New Collection
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollectionsView;
