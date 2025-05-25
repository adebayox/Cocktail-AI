import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import ImageUploader from "../ImageUploader";

const RecipeGenerator = ({
  ingredients,
  flavors,
  dietaryNeeds,
  onAddIngredient,
  onAddFlavor,
  onAddDietaryNeed,
  onRemoveIngredient,
  onRemoveFlavor,
  onRemoveDietaryNeed,
  onGenerate,
  isGenerating,
  ingredientInput,
  flavorInput,
  dietaryInput,
  setIngredientInput,
  setFlavorInput,
  setDietaryInput,
  onAnalysisComplete,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      if (type === "ingredient") {
        onAddIngredient(e.target.value.trim());
        setIngredientInput("");
      } else if (type === "flavor") {
        onAddFlavor(e.target.value.trim());
        setFlavorInput("");
      } else if (type === "dietary") {
        onAddDietaryNeed(e.target.value.trim());
        setDietaryInput("");
      }
    }
  };

  const handleImageAnalysisComplete = (analysisData) => {
    // Pass the analysis data to the parent component
    onAnalysisComplete(analysisData);

    // If ingredients were detected, add them to the ingredients list
    if (
      analysisData &&
      analysisData.ingredients &&
      analysisData.ingredients.length > 0
    ) {
      analysisData.ingredients.forEach((ingredient) => {
        if (!ingredients.includes(ingredient)) {
          onAddIngredient(ingredient);
        }
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center text-purple-900 mb-4"></h2>
      <p className="text-center text-purple-600 mb-8">
        Enter your preferences or upload an image to craft the perfect cocktail!
      </p>

      <ImageUploader
        onAnalysisComplete={onAnalysisComplete}
        isAnalyzing={isAnalyzing}
        setIsAnalyzing={setIsAnalyzing}
      />

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-purple-900 mb-2">
            Ingredients
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "ingredient")}
              placeholder="e.g. vodka, strawberries, gin, rum, tequila, lime"
              className="flex-grow p-2 border border-purple-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => {
                if (ingredientInput.trim()) {
                  onAddIngredient(ingredientInput.trim());
                  setIngredientInput("");
                }
              }}
              className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center"
              >
                <span>{ingredient}</span>
                <button
                  onClick={() => onRemoveIngredient(ingredient)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-purple-900 mb-2">
            Flavors
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={flavorInput}
              onChange={(e) => setFlavorInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "flavor")}
              placeholder="e.g. sweet, sour, bitter, herbal, refreshing, fresh"
              className="flex-grow p-2 border border-purple-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => {
                if (flavorInput.trim()) {
                  onAddFlavor(flavorInput.trim());
                  setFlavorInput("");
                }
              }}
              className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {flavors.map((flavor, index) => (
              <div
                key={index}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center"
              >
                <span>{flavor}</span>
                <button
                  onClick={() => onRemoveFlavor(flavor)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-purple-900 mb-2">
            Dietary Needs
          </label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={dietaryInput}
              onChange={(e) => setDietaryInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "dietary")}
              placeholder="e.g. vegan, low-sugar, non-alcoholic, gluten free, dairy free"
              className="flex-grow p-2 border border-purple-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => {
                if (dietaryInput.trim()) {
                  onAddDietaryNeed(dietaryInput.trim());
                  setDietaryInput("");
                }
              }}
              className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {dietaryNeeds.map((need, index) => (
              <div
                key={index}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center"
              >
                <span>{need}</span>
                <button
                  onClick={() => onRemoveDietaryNeed(need)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || isAnalyzing}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            isGenerating || isAnalyzing
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Search className="mr-2 h-5 w-5" />
              Generate Cocktail Recipe
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecipeGenerator;
