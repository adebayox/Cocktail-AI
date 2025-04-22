import React, { useState } from "react";
import {
  Heart,
  FolderPlus,
  Share2,
  Trash2,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";
import RecipeChat from "./RecipeChat";
import RatingFeedbackForm from "../RatingFeedbackForm";
import RecipeRatings from "../RecipeRatings";
import { toast } from "react-toastify";

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

  if (!recipe) {
    return <div className="text-center text-purple-800">Loading recipe...</div>;
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
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-purple-900">
              {analysis?.cocktailName || recipe.name}
            </h3>
            <p className="text-purple-600 mt-2">{recipe.description}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onSave}
              className="text-purple-600 hover:text-purple-800"
              disabled={isSaving}
            >
              <Heart className="w-6 h-6" />
            </button>
            <button
              onClick={handleAddToCollection}
              className="text-purple-600 hover:text-purple-800"
            >
              <FolderPlus className="w-6 h-6" />
            </button>
            <button
              onClick={handleShare}
              className="text-purple-600 hover:text-purple-800"
            >
              <Share2 className="w-6 h-6" />
            </button>
            {recipe._id && (
              <button
                onClick={() => onDeleteCocktail(recipe._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-6 h-6" />
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
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ) : recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <p className="text-purple-500 font-medium">No image available</p>
            </div>
          )}
        </div>

        {/* Health Rating Display */}
        {recipe.healthRating !== undefined && (
          <div className="mb-6 bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-purple-800">
                Health Rating
              </h4>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getHealthRatingColor(
                    recipe.healthRating
                  )}`}
                >
                  {recipe.healthRating}
                </div>
                <span className="ml-2 text-sm text-purple-600">/10</span>
              </div>
            </div>
            {recipe.healthNotes && (
              <p className="mt-2 text-purple-600">{recipe.healthNotes}</p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-800">
              Ingredients
            </h4>
            <ul className="space-y-2">
              {Array.isArray(recipe.ingredients) &&
                recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-800">
              Instructions
            </h4>
            <ol className="space-y-4">
              {instructions.map((step, idx) => (
                <li key={idx} className="flex space-x-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-medium">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.tip && (
          <div className="mt-6 bg-purple-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-purple-800 mb-2">Tip</h4>
            <p className="text-purple-600">{recipe.tip}</p>
          </div>
        )}
        {recipe.tags && Array.isArray(recipe.tags) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden max-w-md w-full mx-4">
            {/* Window control header */}
            <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
              <h3 className="text-lg font-medium text-purple-900">
                Share Recipe
              </h3>
              <div className="flex space-x-2">
                <button
                  className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500"
                  aria-label="Minimize"
                />
                <button
                  className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500"
                  aria-label="Maximize"
                />
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500"
                  aria-label="Close modal"
                />
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6">
              <div className="bg-gray-100 p-3 rounded-lg mb-4 flex items-center justify-between">
                <div className="truncate mr-2">{getShareableLink()}</div>
                <button
                  onClick={copyToClipboard}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between">
                <a
                  href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20cocktail%20recipe!&url=${encodeURIComponent(
                    getShareableLink()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 flex items-center"
                >
                  Share on Twitter <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating and Feedback Form */}
      <RatingFeedbackForm recipeId={recipeId} />

      {/* Display Ratings */}
      <RecipeRatings recipeId={recipeId} />

      <RecipeChat recipe={recipe} />
    </div>
  );
};

export default RecipeDisplay;
