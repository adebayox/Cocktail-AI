import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import RecipeDisplay from "../components/recipe/RecipeDisplay";
import RecipeGenerator from "../components/recipe/RecipeGenerator";
import CollectionsView from "../components/collection/CollectionsView";
import CreateCollectionForm from "../components/collection/CreateCollectionForm";
import PremiumModal from "./PremiumModal";
import Overlay from "../components/common/Overlay";
import { useRecipes } from "../hooks/useRecipes";
import { useCollections } from "../hooks/useCollection";
import { useTagInput } from "../hooks/useTagInput";
import { X, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const Homepage = () => {
  const navigate = useNavigate();
  const name = useUserStore.getState().user?.username;
  // const id = useUserStore.getState().user?.id;

  // View state
  const [viewMode, setViewMode] = useState("generator"); // generator, collections, saved, recipe
  const [showProfile, setShowProfile] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("Settings");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // State for image analysis results
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  // Custom hooks
  const {
    tags: ingredients,
    input: ingredientInput,
    setInput: setIngredientInput,
    addTag: handleAddIngredient,
    removeTag: handleRemoveIngredient,
  } = useTagInput();

  const {
    tags: flavors,
    input: flavorInput,
    setInput: setFlavorInput,
    addTag: handleAddFlavor,
    removeTag: handleRemoveFlavor,
  } = useTagInput();

  const {
    tags: dietaryNeeds,
    input: dietaryInput,
    setInput: setDietaryInput,
    addTag: handleAddDietaryNeed,
    removeTag: handleRemoveDietaryNeed,
  } = useTagInput();

  const {
    generateRecipe,
    isGenerating,
    saveRecipe,
    isSaving,
    savedRecipes,
    isLoadingSaved,
    fetchSavedRecipes, // Ensure this is imported
    deleteCocktail,
  } = useRecipes();

  const {
    collections,
    isLoading: isLoadingCollections,
    createCollection,
    isCreating,
    saveToCollection,
    isSavingToCollection,
    deleteCollection,
  } = useCollections();

  // Fetch saved recipes when the "Saved" page is loaded
  useEffect(() => {
    if (viewMode === "saved") {
      fetchSavedRecipes();
    }
  }, [viewMode, fetchSavedRecipes]);

  // Handlers
  const handleGenerateRecipes = async () => {
    if (
      ingredients.length === 0 &&
      flavors.length === 0 &&
      dietaryNeeds.length === 0
    ) {
      toast.error("Please add at least one preference");
      return;
    }

    try {
      // Clear any previous image analysis when generating a new recipe manually
      setImageAnalysis(null);

      const recipe = await generateRecipe({
        ingredients,
        flavors,
        dietaryNeeds,
      });

      console.log("Generated recipe:", recipe); // Debug log

      if (recipe) {
        setGeneratedRecipe(recipe);
        setViewMode("recipe");
      }
    } catch (error) {
      console.error("Recipe generation error:", error);
      toast.error(error.message || "Failed to generate recipe");
    }
  };

  const handleCreateCollection = async (data) => {
    try {
      await createCollection(data);
      setShowNewCollectionModal(false);
      setShowCollectionModal(false);
    } catch (error) {
      toast.error("Failed to create collection");
    }
  };

  // Handle adding to collection - this function is called from RecipeDisplay
  const handleAddToCollection = (cocktail) => {
    console.log("Adding to collection:", cocktail);
    setSelectedCocktail(cocktail);
    setShowCollectionModal(true);
  };

  // When user selects a collection from the modal
  const handleSelectCollection = (collection) => {
    console.log("Selected collection:", collection);
    console.log("Selected cocktail:", selectedCocktail);

    if (!selectedCocktail) {
      toast.error("No cocktail selected");
      return;
    }

    saveToCollection({
      cocktailId: selectedCocktail, // This can be either an ID string or a full cocktail object
      collection,
    });
    setShowCollectionModal(false);
  };

  const handleSelectedCollection = (collection) => {
    setSelectedCollection(collection);
    setViewMode("collectionDetail");
  };

  // Handle image analysis results
  const handleImageAnalysis = (analysis, imageUrl) => {
    console.log("Received analysis in Homepage:", analysis);
    console.log("Uploaded Image URL in Homepage:", imageUrl); // Debug log
    setUploadedImageUrl(imageUrl); // Set the uploaded image URL
    setImageAnalysis(analysis);

    if (analysis && analysis.cocktailName) {
      const basicRecipe = {
        name: analysis.cocktailName,
        description: `${analysis.cocktailName} identified from image analysis`,
        ingredients: analysis.ingredients || [],
        instructions: ["Mix all ingredients", "Serve with appropriate garnish"],
        tags: ["AI Identified"],
        imageUrl: imageUrl, // Use the uploaded image URL directly
      };

      setGeneratedRecipe(basicRecipe);
      setViewMode("recipe");
      toast.success(`Identified as ${analysis.cocktailName}`);
    }
  };

  // Reset image analysis when switching to generator view
  const handleSwitchToGenerator = () => {
    setViewMode("generator");
    // Optional: clear image analysis when returning to generator
    // setImageAnalysis(null);
  };

  // Function to render collection items with images
  const renderCollectionItem = (cocktail) => (
    <div
      key={cocktail._id || cocktail.cocktailId}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      onClick={() => setSelectedRecipe(cocktail)}
    >
      {cocktail.imageUrl ? (
        <div className="h-40 overflow-hidden">
          <img
            src={cocktail.imageUrl}
            alt={cocktail.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center">
          <span className="text-purple-700 font-medium">{cocktail.name}</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-purple-800">
          {cocktail.name}
        </h3>
        <p className="text-sm text-purple-600 mt-2 line-clamp-2">
          {cocktail.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6 font-sans relative">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-xl font-semibold text-black">Hey {name},</h1>
          <p className="text-2xl font-bold text-purple-800">CocktailCraft AI</p>
        </div>
        <nav className="flex space-x-6 items-center">
          <button
            onClick={handleSwitchToGenerator}
            className={`text-lg ${
              viewMode === "generator"
                ? "text-purple-800 font-semibold"
                : "text-purple-600"
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setViewMode("collections")}
            className={`text-lg ${
              viewMode === "collections"
                ? "text-purple-800 font-semibold"
                : "text-purple-600"
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setViewMode("saved")}
            className={`text-lg ${
              viewMode === "saved"
                ? "text-purple-800 font-semibold"
                : "text-purple-600"
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => setShowPremiumModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Go Premium
          </button>
        </nav>
      </header>

      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}

      {/* Main Content */}
      <main className="container mx-auto">
        {viewMode === "generator" && (
          <RecipeGenerator
            ingredients={ingredients}
            flavors={flavors}
            dietaryNeeds={dietaryNeeds}
            onAddIngredient={handleAddIngredient}
            onAddFlavor={handleAddFlavor}
            onAddDietaryNeed={handleAddDietaryNeed}
            onRemoveIngredient={handleRemoveIngredient}
            onRemoveFlavor={handleRemoveFlavor}
            onRemoveDietaryNeed={handleRemoveDietaryNeed}
            onGenerate={handleGenerateRecipes}
            isGenerating={isGenerating}
            ingredientInput={ingredientInput}
            flavorInput={flavorInput}
            dietaryInput={dietaryInput}
            setIngredientInput={setIngredientInput}
            setFlavorInput={setFlavorInput}
            setDietaryInput={setDietaryInput}
            onAnalysisComplete={handleImageAnalysis}
          />
        )}

        {viewMode === "recipe" && generatedRecipe && (
          <RecipeDisplay
            recipe={generatedRecipe}
            onSave={() => saveRecipe(generatedRecipe)}
            onAddToCollection={handleAddToCollection}
            isSaving={isSaving}
            analysis={imageAnalysis}
            uploadedImageUrl={uploadedImageUrl} // Pass the uploaded image URL
            onDeleteCocktail={deleteCocktail}
            userId={useUserStore.getState().user?.id}
          />
        )}

        {viewMode === "collections" && (
          <CollectionsView
            collections={collections}
            isLoading={isLoadingCollections}
            onCreateNew={() => setShowNewCollectionModal(true)}
            onSelectCollection={handleSelectedCollection}
            onDeleteCollection={deleteCollection}
          />
        )}

        {viewMode === "collectionDetail" && selectedCollection && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-900">
                {selectedCollection.name}
              </h2>
              <button
                onClick={() => setViewMode("collections")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Back to Collections
              </button>
            </div>

            {selectedCollection.cocktails &&
            selectedCollection.cocktails.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCollection.cocktails.map(renderCollectionItem)}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-purple-700">
                  No cocktails in this collection yet.
                </p>
                <button
                  onClick={handleSwitchToGenerator}
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Create a Cocktail
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === "saved" && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">
              Saved Recipes
            </h2>
            {isLoadingSaved ? (
              <div className="text-center py-10">
                <p className="text-lg text-purple-700">
                  Loading saved recipes...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes?.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    {recipe.imageUrl ? (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center">
                        <span className="text-purple-700 font-medium">
                          {recipe.name}
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-purple-800">
                        {recipe.name}
                      </h3>
                      <p className="text-sm text-purple-600 mt-2 line-clamp-2">
                        {recipe.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the parent onClick from firing
                          deleteCocktail(recipe._id);
                        }}
                        className="mt-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <Overlay
        isOpen={showNewCollectionModal}
        onClose={() => setShowNewCollectionModal(false)}
      >
        <CreateCollectionForm
          onSubmit={handleCreateCollection}
          onClose={() => setShowNewCollectionModal(false)}
          isLoading={isCreating}
        />
      </Overlay>

      <Overlay
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
      >
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-purple-900">
            Add to Collection
          </h3>
          <div className="space-y-2">
            {collections?.map((collection) => (
              <button
                key={collection._id}
                onClick={() => handleSelectCollection(collection)}
                className="w-full text-left p-3 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {collection.name} ({collection.cocktails?.length || 0}{" "}
                cocktails)
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setShowCollectionModal(false);
              setShowNewCollectionModal(true);
            }}
            className="w-full py-2 text-purple-600 hover:text-purple-800 font-medium"
          >
            Create New Collection
          </button>
        </div>
      </Overlay>

      {selectedRecipe && (
        <Overlay
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        >
          <RecipeDisplay
            recipe={selectedRecipe}
            onSave={() => saveRecipe(selectedRecipe)}
            onAddToCollection={handleAddToCollection}
            isSaving={isSaving}
            analysis={selectedRecipe === generatedRecipe ? imageAnalysis : null}
            onDeleteCocktail={deleteCocktail} // Pass the delete function
          />
        </Overlay>
      )}
    </div>
  );
};

export default Homepage;
