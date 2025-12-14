import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import ImageUploader from "../ImageUploader";

// Tag component - defined outside to prevent re-renders
const Tag = ({ text, onRemove }) => (
  <div className="inline-flex items-center bg-black text-brutal-accent px-3 py-2 font-mono text-sm font-bold uppercase border-2 border-black">
    <span>{text}</span>
    <button
      onClick={() => onRemove(text)}
      className="ml-2 hover:text-brutal-error transition-colors"
    >
      <X className="w-4 h-4" strokeWidth={3} />
    </button>
  </div>
);

// Input section component - defined outside to prevent re-renders and focus loss
const InputSection = ({ label, placeholder, value, onChange, onKeyDown, onAdd, tags, onRemove }) => (
  <div className="mb-8">
    <label className="block text-xs font-bold uppercase tracking-wide mb-3 text-black">
      {label}
    </label>
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-grow border-4 border-black px-4 py-3 text-base font-mono focus:outline-none focus:border-brutal-accent bg-white placeholder:text-brutal-disabled"
      />
      <button
        type="button"
        onClick={onAdd}
        className="bg-black text-brutal-accent px-4 border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors duration-150"
      >
        <Plus className="w-5 h-5" strokeWidth={3} />
      </button>
    </div>
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag) => (
          <Tag key={tag} text={tag} onRemove={onRemove} />
        ))}
      </div>
    )}
  </div>
);

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
    onAnalysisComplete(analysisData);

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
    <div className="bg-brutal-white border-4 border-black p-6 sm:p-8 shadow-brutal-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-black leading-[0.9] mb-2">
          Generate Recipe
        </h2>
        <p className="font-mono text-sm text-brutal-disabled uppercase tracking-wide">
          Add ingredients or upload a photo
        </p>
      </div>

      {/* Image Uploader */}
      <div className="mb-8">
        <ImageUploader
          onAnalysisComplete={onAnalysisComplete}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-1 bg-black" />
        <span className="font-mono text-xs font-bold uppercase text-brutal-disabled">Or enter manually</span>
        <div className="flex-1 h-1 bg-black" />
      </div>

      {/* Ingredients */}
      <InputSection
        label="Ingredients"
        placeholder="e.g. vodka, lime, mint..."
        value={ingredientInput}
        onChange={(e) => setIngredientInput(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, "ingredient")}
        onAdd={() => {
          if (ingredientInput.trim()) {
            onAddIngredient(ingredientInput.trim());
            setIngredientInput("");
          }
        }}
        tags={ingredients}
        onRemove={onRemoveIngredient}
      />

      {/* Flavors */}
      <InputSection
        label="Flavors"
        placeholder="e.g. sweet, sour, bitter..."
        value={flavorInput}
        onChange={(e) => setFlavorInput(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, "flavor")}
        onAdd={() => {
          if (flavorInput.trim()) {
            onAddFlavor(flavorInput.trim());
            setFlavorInput("");
          }
        }}
        tags={flavors}
        onRemove={onRemoveFlavor}
      />

      {/* Dietary Needs */}
      <InputSection
        label="Dietary Needs"
        placeholder="e.g. vegan, low-sugar..."
        value={dietaryInput}
        onChange={(e) => setDietaryInput(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, "dietary")}
        onAdd={() => {
          if (dietaryInput.trim()) {
            onAddDietaryNeed(dietaryInput.trim());
            setDietaryInput("");
          }
        }}
        tags={dietaryNeeds}
        onRemove={onRemoveDietaryNeed}
      />

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || isAnalyzing}
        className="w-full bg-black text-brutal-accent py-5 px-8 text-xl font-display font-black uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors duration-150 shadow-brutal-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-brutal-accent flex items-center justify-center gap-3"
      >
        {isGenerating ? (
          <>
            <div className="w-6 h-6 border-4 border-brutal-accent border-t-transparent animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <span>Generate</span>
        )}
      </button>
    </div>
  );
};

export default RecipeGenerator;
