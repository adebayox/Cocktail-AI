import React from "react";
import { ArrowLeft } from "lucide-react";

// Animated skeleton pulse component
const Skeleton = ({ className = "" }) => (
  <div
    className={`bg-brutal-black/10 ${className}`}
    style={{
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  />
);

const RecipeSkeleton = ({ streamingRecipe = null, streamingStatus = "", onCancel = null }) => {
  const hasName = !!streamingRecipe?.name;
  const hasDescription = !!streamingRecipe?.description;
  const hasIngredients = !!streamingRecipe?.ingredients?.length;
  const hasInstructions = !!streamingRecipe?.instructions?.length;
  const hasHealth = streamingRecipe?.healthRating !== undefined;
  const hasTip = !!streamingRecipe?.tip;
  const hasImage = !!streamingRecipe?.imageUrl;

  return (
    <article className="bg-brutal-white border-4 border-black p-6 sm:p-8 shadow-brutal-lg">
      {/* Cancel button */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="mb-6 flex items-center gap-2 font-mono text-sm text-brutal-disabled hover:text-black transition-colors uppercase"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          <span>Cancel</span>
        </button>
      )}

      {/* Status indicator */}
      <div className="mb-8 border-4 border-brutal-accent bg-brutal-accent/10 p-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-brutal-accent animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 bg-brutal-accent animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 bg-brutal-accent animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="font-mono text-sm text-black uppercase font-bold">
            {streamingStatus || "Generating..."}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        {hasName ? (
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-black leading-[0.9] mb-3 animate-fadeIn">
            {streamingRecipe.name}
          </h1>
        ) : (
          <Skeleton className="h-12 w-3/4 mb-3" />
        )}
        
        {hasDescription ? (
          <p className="font-mono text-sm text-brutal-disabled leading-relaxed animate-fadeIn">
            {streamingRecipe.description}
          </p>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
      </div>

      {/* Image section */}
      <div className="mb-8 border-4 border-black overflow-hidden">
        {hasImage ? (
          <img
            src={streamingRecipe.imageUrl}
            alt={streamingRecipe.name}
            className="w-full h-48 sm:h-64 lg:h-80 object-cover animate-fadeIn"
          />
        ) : (
          <div className="w-full h-48 sm:h-64 lg:h-80 bg-brutal-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated loading bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-brutal-accent/20 overflow-hidden">
              <div className="h-full bg-brutal-accent animate-slide" style={{ width: "50%" }} />
            </div>
            
            <div className="text-center">
              <p className="font-display font-black uppercase text-brutal-accent text-xl sm:text-2xl mb-2">
                {streamingStatus?.toLowerCase().includes("image") 
                  ? "Creating Image" 
                  : hasInstructions 
                    ? "Almost There" 
                    : "Mixing"}
              </p>
              <p className="font-mono text-xs text-brutal-white/60 uppercase">
                {hasInstructions ? "Loading image..." : "Loading..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Health Rating */}
      {hasHealth ? (
        <div className="mb-8 border-4 border-black p-4 bg-brutal-black/5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-black">
              Health Rating
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`w-12 h-12 flex items-center justify-center text-white font-display font-black text-xl ${
                  streamingRecipe.healthRating <= 3 ? "bg-brutal-error" :
                  streamingRecipe.healthRating <= 6 ? "bg-yellow-500" : "bg-brutal-accent"
                }`}
              >
                {streamingRecipe.healthRating}
              </div>
              <span className="font-mono text-sm text-brutal-disabled">/10</span>
            </div>
          </div>
          {streamingRecipe.healthNotes && (
            <p className="mt-3 font-mono text-sm text-brutal-disabled">
              {streamingRecipe.healthNotes}
            </p>
          )}
        </div>
      ) : hasInstructions ? (
        <div className="mb-8 border-4 border-black p-4 bg-brutal-black/5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      ) : null}

      {/* Ingredients and Instructions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide mb-4 text-black border-b-4 border-black pb-2">
            Ingredients
          </h2>
          {hasIngredients ? (
            <ul className="space-y-3 animate-fadeIn">
              {streamingRecipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-brutal-accent mt-2 flex-shrink-0" />
                  <span className="font-mono text-sm">{ingredient}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-2 h-2 flex-shrink-0" />
                  <Skeleton className="h-4 flex-1" style={{ width: `${70 + Math.random() * 30}%` }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide mb-4 text-black border-b-4 border-black pb-2">
            Instructions
          </h2>
          {hasInstructions ? (
            <ol className="space-y-4 animate-fadeIn">
              {streamingRecipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-black text-brutal-accent flex items-center justify-center font-display font-bold text-sm">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-sm leading-relaxed pt-1">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-8 h-8 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tip */}
      {hasTip ? (
        <div className="mt-8 border-4 border-brutal-accent bg-brutal-accent/10 p-4 animate-fadeIn">
          <h3 className="text-xs font-bold uppercase tracking-wide text-black mb-2">
            Pro Tip
          </h3>
          <p className="font-mono text-sm">{streamingRecipe.tip}</p>
        </div>
      ) : hasInstructions ? (
        <div className="mt-8 border-4 border-black bg-brutal-black/5 p-4">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      ) : null}
    </article>
  );
};

export default RecipeSkeleton;
