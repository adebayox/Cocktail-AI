import React, { useState, useEffect } from "react";
import {
  Heart,
  FolderPlus,
  Share2,
  Trash2,
  Copy,
  ExternalLink,
  X,
  Check,
  ImageIcon,
} from "lucide-react";
import RecipeChat from "./RecipeChat";
import RatingFeedbackForm from "../RatingFeedbackForm";
import RecipeRatings from "../RecipeRatings";
import { toast } from "react-toastify";

// QR Code component
const QRCodeCanvas = ({ value, size = 180 }) => {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js";
    script.onload = () => {
      if (window.QRious) {
        new window.QRious({
          element: canvasRef.current,
          value: value,
          size: size,
          foreground: "#0a0a0a",
          background: "#f5f5f0",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [value, size]);

  return (
    <canvas ref={canvasRef} className="border-4 border-black" />
  );
};

const RecipeDisplay = ({
  recipe,
  onSave,
  onAddToCollection,
  isSaving,
  analysis,
  uploadedImageUrl,
  onDeleteCocktail,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [ratingsKey, setRatingsKey] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!recipe) {
    return (
      <div className="text-center p-8 font-mono text-brutal-disabled uppercase">
        Loading recipe...
      </div>
    );
  }

  const recipeId = recipe._id || recipe.cocktailId;

  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : recipe.instructions?.split("\n").filter((step) => step.trim()) || [];

  const handleAddToCollection = () => {
    if (recipeId) {
      onAddToCollection(recipe);
    } else {
      console.error("Cocktail ID is missing");
    }
  };

  const getHealthRatingColor = (rating) => {
    if (!rating && rating !== 0) return "bg-brutal-disabled";
    if (rating <= 3) return "bg-brutal-error";
    if (rating <= 6) return "bg-yellow-500";
    return "bg-brutal-accent";
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/home/recipe/${recipeId}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareableLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = getShareableLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleRatingSubmitted = () => {
    setRatingsKey((prev) => prev + 1);
  };

  return (
    <div
      className="max-h-screen overflow-y-auto pb-4 hide-scrollbar"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Main Recipe Card */}
      <article className="bg-brutal-white border-4 border-black p-6 sm:p-8 shadow-brutal-accent-lg mb-8 transform rotate-[-0.3deg] hover:rotate-0 transition-transform">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
          <div className="flex-1">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-black leading-[0.9] mb-3">
              {analysis?.cocktailName || recipe.name}
            </h1>
            <p className="font-mono text-sm text-brutal-disabled leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="p-3 bg-black text-brutal-accent border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors disabled:opacity-50"
              aria-label="Save recipe"
            >
              <Heart className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              onClick={handleAddToCollection}
              className="p-3 bg-black text-brutal-accent border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors"
              aria-label="Add to collection"
            >
              <FolderPlus className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-black text-brutal-accent border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors"
              aria-label="Share recipe"
            >
              <Share2 className="w-5 h-5" strokeWidth={2.5} />
            </button>
            {recipe._id && (
              <button
                onClick={() => onDeleteCocktail(recipe._id)}
                className="p-3 bg-brutal-error text-white border-4 border-black hover:bg-black hover:text-brutal-error transition-colors"
                aria-label="Delete recipe"
              >
                <Trash2 className="w-5 h-5" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="mb-8 border-4 border-black overflow-hidden">
          {uploadedImageUrl ? (
            <img
              src={uploadedImageUrl}
              alt="Uploaded Cocktail"
              className="w-full h-48 sm:h-64 lg:h-80 object-cover"
            />
          ) : recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-48 sm:h-64 lg:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-48 sm:h-64 lg:h-80 bg-brutal-black/5 flex flex-col items-center justify-center">
              <ImageIcon className="w-16 h-16 text-brutal-disabled mb-3" strokeWidth={1.5} />
              <p className="font-mono text-sm text-brutal-disabled uppercase">
                No image available
              </p>
            </div>
          )}
        </div>

        {/* Health Rating */}
        {recipe.healthRating !== undefined && (
          <div className="mb-8 border-4 border-black p-4 bg-brutal-black/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-black">
                Health Rating
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-12 h-12 flex items-center justify-center text-white font-display font-black text-xl ${getHealthRatingColor(
                    recipe.healthRating
                  )}`}
                >
                  {recipe.healthRating}
                </div>
                <span className="font-mono text-sm text-brutal-disabled">/10</span>
              </div>
            </div>
            {recipe.healthNotes && (
              <p className="mt-3 font-mono text-sm text-brutal-disabled">
                {recipe.healthNotes}
              </p>
            )}
          </div>
        )}

        {/* Ingredients and Instructions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide mb-4 text-black border-b-4 border-black pb-2">
              Ingredients
            </h2>
            <ul className="space-y-3">
              {Array.isArray(recipe.ingredients) &&
                recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-brutal-accent mt-2 flex-shrink-0" />
                    <span className="font-mono text-sm">{ingredient}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide mb-4 text-black border-b-4 border-black pb-2">
              Instructions
            </h2>
            <ol className="space-y-4">
              {instructions.map((step, idx) => (
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
          </div>
        </div>

        {/* Tip */}
        {recipe.tip && (
          <div className="mt-8 border-4 border-brutal-accent bg-brutal-accent/10 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-black mb-2">
              Pro Tip
            </h3>
            <p className="font-mono text-sm">{recipe.tip}</p>
          </div>
        )}

        {/* Tags */}
        {recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-black text-brutal-accent font-mono text-xs font-bold uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-brutal-white border-4 border-black shadow-brutal-accent-lg w-full max-w-md">
            {/* Modal Header */}
            <div className="bg-black p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-brutal-accent" strokeWidth={2.5} />
                <h3 className="font-display font-bold uppercase text-brutal-accent">
                  Share Recipe
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-brutal-white hover:text-brutal-accent transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* QR Code */}
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-wide mb-4 text-black">
                  Scan QR Code
                </p>
                <div className="flex justify-center">
                  <QRCodeCanvas value={getShareableLink()} size={160} />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-1 bg-black" />
                <span className="font-mono text-xs font-bold uppercase text-brutal-disabled">Or</span>
                <div className="flex-1 h-1 bg-black" />
              </div>

              {/* Copy Link */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-3 text-black">
                  Copy Link
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 border-4 border-black px-3 py-2 bg-brutal-black/5 font-mono text-xs truncate">
                    {getShareableLink()}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="bg-black text-brutal-accent px-4 border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      <Copy className="w-4 h-4" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Twitter Share */}
              <div className="text-center">
                <a
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20cocktail%20recipe&url=${encodeURIComponent(
                    getShareableLink()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-black hover:text-brutal-accent transition-colors underline decoration-2 underline-offset-2"
                >
                  Share on Twitter
                  <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t-4 border-black p-4">
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full bg-brutal-disabled text-white py-3 font-display font-bold uppercase hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating and Feedback */}
      <div className="space-y-8">
        <RatingFeedbackForm
          recipeId={recipeId}
          onRatingSubmitted={handleRatingSubmitted}
        />

        <RecipeRatings recipeId={recipeId} key={ratingsKey} />

        <RecipeChat recipe={recipe} />
      </div>
    </div>
  );
};

export default RecipeDisplay;
