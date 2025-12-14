import React from "react";
import { Plus, Trash2 } from "lucide-react";

const CollectionsView = ({
  collections,
  isLoading,
  onCreateNew,
  onSelectCollection,
  onDeleteCollection,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brutal-accent border-t-transparent animate-spin mb-4 mx-auto" />
          <p className="font-mono text-sm text-brutal-disabled uppercase">
            Loading collections...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections?.map((collection) => (
        <div
          key={collection._id}
          className="bg-brutal-white border-4 border-black shadow-brutal hover:shadow-brutal-accent hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all relative"
        >
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCollection(collection._id);
            }}
            className="absolute top-3 right-3 z-10 p-2 bg-brutal-error text-white border-2 border-black hover:bg-black hover:text-brutal-error transition-colors"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Collection Preview Images */}
          <div
            onClick={() => onSelectCollection(collection)}
            className="cursor-pointer"
          >
            <div className="grid grid-cols-2 gap-1 h-40 border-b-4 border-black">
              {collection.cocktails && collection.cocktails.length > 0 ? (
                collection.cocktails.slice(0, 4).map((cocktail, index) => (
                  <div key={index} className="h-20 overflow-hidden bg-black">
                    {cocktail.imageUrl ? (
                      <img
                        src={cocktail.imageUrl}
                        alt={cocktail.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-xs text-brutal-accent uppercase px-2 text-center">
                          {cocktail.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 h-40 bg-black/5 flex items-center justify-center">
                  <span className="font-mono text-sm text-brutal-disabled uppercase">
                    Empty Collection
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-display font-bold uppercase text-black text-xl mb-1">
                {collection.name}
              </h3>
              <p className="font-mono text-xs text-brutal-disabled uppercase">
                {collection.cocktails?.length || 0} cocktails
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Create New Collection Card */}
      <div
        onClick={onCreateNew}
        className="border-4 border-dashed border-black flex flex-col items-center justify-center h-64 cursor-pointer hover:border-brutal-accent hover:bg-brutal-accent/5 transition-all group"
      >
        <div className="w-16 h-16 bg-black flex items-center justify-center mb-4 group-hover:bg-brutal-accent transition-colors">
          <Plus className="w-8 h-8 text-brutal-accent group-hover:text-black transition-colors" strokeWidth={2.5} />
        </div>
        <p className="font-display font-bold uppercase text-black text-lg">
          New Collection
        </p>
      </div>
    </div>
  );
};

export default CollectionsView;
