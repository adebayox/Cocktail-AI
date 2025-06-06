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

    // generate QR code
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js";
    script.onload = () => {
      if (window.QRious) {
        new window.QRious({
          element: canvasRef.current,
          value: value,
          size: size,
          foreground: "#7c3aed",
          background: "#ffffff",
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
    <canvas ref={canvasRef} className="border border-purple-200 rounded-lg" />
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
      <div className="text-center text-purple-800 p-4">Loading recipe...</div>
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
    if (!rating && rating !== 0) return "bg-gray-200";
    if (rating <= 3) return "bg-red-500";
    if (rating <= 6) return "bg-yellow-500";
    return "bg-green-500";
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
      // Fallback for older browsers
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
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8 mx-4 sm:mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-4 sm:space-y-0">
          <div className="flex-1 pr-0 sm:pr-4">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-900 leading-tight">
              {analysis?.cocktailName || recipe.name}
            </h3>
            <p className="text-purple-600 mt-2 text-sm sm:text-base">
              {recipe.description}
            </p>
          </div>

          <div className="flex space-x-3 sm:space-x-4 flex-shrink-0">
            <button
              onClick={onSave}
              className="text-purple-600 hover:text-purple-800 p-2 sm:p-1"
              disabled={isSaving}
              aria-label="Save recipe"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleAddToCollection}
              className="text-purple-600 hover:text-purple-800 p-2 sm:p-1"
              aria-label="Add to collection"
            >
              <FolderPlus className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleShare}
              className="text-purple-600 hover:text-purple-800 p-2 sm:p-1"
              aria-label="Share recipe"
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            {recipe._id && (
              <button
                onClick={() => onDeleteCocktail(recipe._id)}
                className="text-red-600 hover:text-red-800 p-2 sm:p-1"
                aria-label="Delete recipe"
              >
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Image section */}
        <div className="mb-6">
          {uploadedImageUrl ? (
            <img
              src={uploadedImageUrl}
              alt="Uploaded Cocktail"
              className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg shadow-md"
            />
          ) : recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <p className="text-purple-500 font-medium text-sm sm:text-base">
                No image available
              </p>
            </div>
          )}
        </div>

        {/* Health Rating Display */}
        {recipe.healthRating !== undefined && (
          <div className="mb-6 bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-base sm:text-lg font-semibold text-purple-800">
                Health Rating
              </h4>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${getHealthRatingColor(
                    recipe.healthRating
                  )}`}
                >
                  {recipe.healthRating}
                </div>
                <span className="ml-2 text-xs sm:text-sm text-purple-600">
                  /10
                </span>
              </div>
            </div>
            {recipe.healthNotes && (
              <p className="mt-2 text-purple-600 text-sm sm:text-base">
                {recipe.healthNotes}
              </p>
            )}
          </div>
        )}

        {/* Ingredients and Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="order-1">
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-purple-800">
              Ingredients
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {Array.isArray(recipe.ingredients) &&
                recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm sm:text-base leading-relaxed">
                      {ingredient}
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="order-2">
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-purple-800">
              Instructions
            </h4>
            <ol className="space-y-3 sm:space-y-4">
              {instructions.map((step, idx) => (
                <li key={idx} className="flex space-x-3 sm:space-x-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-medium text-sm mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.tip && (
          <div className="mt-6 bg-purple-50 p-4 rounded-lg">
            <h4 className="text-base sm:text-lg font-semibold text-purple-800 mb-2">
              Tip
            </h4>
            <p className="text-purple-600 text-sm sm:text-base">{recipe.tip}</p>
          </div>
        )}

        {recipe.tags && Array.isArray(recipe.tags) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal with QR Code */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white relative">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <h3 className="text-lg font-bold">Share Recipe</h3>
              </div>
              <p className="text-purple-100 mt-1 text-sm">
                Share "{analysis?.cocktailName || recipe.name}" with friends
              </p>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Scan QR Code
                </h4>
                <div className="flex justify-center mb-4">
                  <QRCodeCanvas value={getShareableLink()} size={160} />
                </div>
                <p className="text-sm text-gray-600">
                  Scan with your phone's camera to view this recipe
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-4 text-sm text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Copy Link
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg mb-4 flex items-center justify-between">
                  <div className="truncate mr-2 text-xs sm:text-sm flex-1">
                    {getShareableLink()}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1 min-w-[70px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Socials */}
              <div className="flex justify-center">
                <a
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20cocktail%20recipe!&url=${encodeURIComponent(
                    getShareableLink()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                >
                  Share on Twitter <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4">
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating and Feedback Form */}
      <div className="mx-4 sm:mx-auto max-w-4xl">
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
