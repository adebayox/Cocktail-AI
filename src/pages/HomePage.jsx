import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import RecipeDisplay from "../components/recipe/RecipeDisplay";
import RecipeSkeleton from "../components/recipe/RecipeSkeleton";
import RecipeGenerator from "../components/recipe/RecipeGenerator";
import CollectionsView from "../components/collection/CollectionsView";
import CreateCollectionForm from "../components/collection/CreateCollectionForm";
import Overlay from "../components/common/Overlay";
import { useRecipes } from "../hooks/useRecipes";
import { useCollections } from "../hooks/useCollection";
import { useTagInput } from "../hooks/useTagInput";
import {
  X,
  Trash2,
  Menu,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

const Homepage = () => {
  const navigate = useNavigate();
  const name = useUserStore.getState().user?.username;

  // View state
  const [viewMode, setViewMode] = useState("generator");
  const [showProfile, setShowProfile] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState("Settings");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    clearAll: clearAllIngredients,
  } = useTagInput();

  const {
    tags: flavors,
    input: flavorInput,
    setInput: setFlavorInput,
    addTag: handleAddFlavor,
    removeTag: handleRemoveFlavor,
    clearAll: clearAllFlavors,
  } = useTagInput();

  const {
    tags: dietaryNeeds,
    input: dietaryInput,
    setInput: setDietaryInput,
    addTag: handleAddDietaryNeed,
    removeTag: handleRemoveDietaryNeed,
    clearAll: clearAllDietaryNeeds,
  } = useTagInput();

  const {
    generateRecipe,
    generateRecipeStreaming,
    isGenerating,
    saveRecipe,
    isSaving,
    savedRecipes,
    isLoadingSaved,
    fetchSavedRecipes,
    deleteCocktail,
    streamingRecipe,
    streamingStatus,
    resetStreamingState,
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

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  useEffect(() => {
    if (viewMode === "generator") {
      fetchSavedRecipes();
    }
  }, [viewMode, fetchSavedRecipes]);

  const { logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out");
  };

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
      setImageAnalysis(null);
      setGeneratedRecipe(null);
      resetStreamingState();
      setViewMode("recipe");

      setIngredientInput("");
      setFlavorInput("");
      setDietaryInput("");
      clearAllIngredients();
      clearAllFlavors();
      clearAllDietaryNeeds();

      const recipe = await generateRecipeStreaming(
        { ingredients, flavors, dietaryNeeds },
        {
          onStatus: (status) => console.log("Status:", status),
          onName: (name) => console.log("Recipe name:", name),
          onComplete: (recipeData) => console.log("Recipe complete:", recipeData),
          onImage: (imageUrl) => console.log("Image received:", imageUrl),
          onDone: (finalRecipe) => {
            console.log("Complete recipe with image:", finalRecipe);
            setGeneratedRecipe(finalRecipe);
          },
          onError: (error) => console.error("Generation error:", error),
        }
      );

      if (recipe && !generatedRecipe) {
        setGeneratedRecipe(recipe);
      }
    } catch (error) {
      console.error("Recipe generation error:", error);
      toast.error(error.message || "Generation failed");
      setViewMode("generator");
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

  const handleAddToCollection = (cocktail) => {
    setSelectedCocktail(cocktail);
    setShowCollectionModal(true);
  };

  const handleSelectCollection = (collection) => {
    if (!selectedCocktail) {
      toast.error("No cocktail selected");
      return;
    }
    saveToCollection({ cocktailId: selectedCocktail, collection });
    setShowCollectionModal(false);
  };

  const handleSelectedCollection = (collection) => {
    setSelectedCollection(collection);
    setViewMode("collectionDetail");
  };

  const handleImageAnalysis = (analysis, imageUrl) => {
    setUploadedImageUrl(imageUrl);
    setImageAnalysis(analysis);

    if (analysis && analysis.cocktailName) {
      const basicRecipe = {
        name: analysis.cocktailName,
        description: `${analysis.cocktailName} identified from image analysis`,
        ingredients: analysis.ingredients || [],
        instructions: ["Mix all ingredients", "Serve with appropriate garnish"],
        tags: ["AI Identified"],
        imageUrl: imageUrl,
      };
      setGeneratedRecipe(basicRecipe);
      setViewMode("recipe");
      toast.success(`Found: ${analysis.cocktailName}`);
    }
  };

  const handleSwitchToGenerator = () => {
    setViewMode("generator");
    setMobileMenuOpen(false);
  };

  const handleNavigation = (mode) => {
    setViewMode(mode);
    setMobileMenuOpen(false);
  };

  // Stats
  const stats = [
    { label: "Recipes", value: savedRecipes?.length || 0 },
    { label: "Collections", value: collections?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-brutal-white">
      {/* Navigation */}
      <nav className="bg-black border-b-4 border-brutal-accent sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <p className="font-mono text-brutal-accent text-sm uppercase">
              Hi, {name}
            </p>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {[
                { key: "generator", label: "Generate" },
                { key: "collections", label: "Collections" },
                { key: "saved", label: "Saved" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setViewMode(item.key)}
                  className={`px-4 py-2 font-mono text-sm uppercase font-bold transition-colors ${
                    viewMode === item.key
                      ? "bg-brutal-accent text-black"
                      : "text-brutal-white hover:text-brutal-accent"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-brutal-error text-white font-mono text-sm uppercase font-bold hover:bg-white hover:text-brutal-error transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-brutal-white hover:text-brutal-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t-2 border-brutal-accent/20">
            <div className="px-4 py-4 space-y-2">
              {[
                { key: "generator", label: "Generate" },
                { key: "collections", label: "Collections" },
                { key: "saved", label: "Saved" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.key)}
                  className={`w-full px-4 py-3 font-mono text-sm uppercase font-bold transition-colors ${
                    viewMode === item.key
                      ? "bg-brutal-accent text-black"
                      : "text-brutal-white hover:bg-brutal-accent/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full mt-4 px-4 py-3 bg-brutal-error text-white font-mono text-sm uppercase font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Generator View */}
        {viewMode === "generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Generator Form */}
            <div className="lg:col-span-2">
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
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-black text-brutal-white p-6 border-4 border-black shadow-brutal-accent"
                >
                  <p className="font-mono text-xs uppercase text-brutal-accent mb-1">
                    {stat.label}
                  </p>
                  <p className="font-display text-4xl font-black">
                    {stat.value}
                  </p>
                </div>
              ))}
              <div className="bg-brutal-accent p-6 border-4 border-black">
                <p className="font-display font-black uppercase text-black text-lg mb-2">
                  Quick Mix
                </p>
                <p className="font-mono text-xs text-black/70 uppercase">
                  Add ingredients, get recipes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recipe View */}
        {viewMode === "recipe" && (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleSwitchToGenerator}
              className="mb-6 flex items-center gap-2 font-mono text-sm text-brutal-disabled hover:text-black transition-colors uppercase"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Generator
            </button>
            
            {generatedRecipe ? (
              <RecipeDisplay
                recipe={generatedRecipe}
                onSave={() => saveRecipe(generatedRecipe)}
                onAddToCollection={handleAddToCollection}
                isSaving={isSaving}
                analysis={imageAnalysis}
                uploadedImageUrl={uploadedImageUrl}
                onDeleteCocktail={deleteCocktail}
                userId={useUserStore.getState().user?.id}
              />
            ) : (
              <RecipeSkeleton
                streamingRecipe={streamingRecipe}
                streamingStatus={streamingStatus}
                onCancel={() => {
                  resetStreamingState();
                  setViewMode("generator");
                }}
              />
            )}
          </div>
        )}

        {/* Collections View */}
        {viewMode === "collections" && (
          <div>
            <div className="mb-8">
              <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-black leading-[0.9] mb-2">
                Collections
              </h2>
              <p className="font-mono text-sm text-brutal-disabled uppercase">
                Organize your favorite cocktails
              </p>
            </div>
            <CollectionsView
              collections={collections}
              isLoading={isLoadingCollections}
              onCreateNew={() => setShowNewCollectionModal(true)}
              onSelectCollection={handleSelectedCollection}
              onDeleteCollection={deleteCollection}
            />
          </div>
        )}

        {/* Collection Detail View */}
        {viewMode === "collectionDetail" && selectedCollection && (
          <div>
            <button
              onClick={() => setViewMode("collections")}
              className="mb-6 flex items-center gap-2 font-mono text-sm text-brutal-disabled hover:text-black transition-colors uppercase"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Collections
            </button>
            
            <div className="mb-8">
              <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-black leading-[0.9] mb-2">
                {selectedCollection.name}
              </h2>
              <p className="font-mono text-sm text-brutal-disabled uppercase">
                {selectedCollection.cocktails?.length || 0} cocktails
              </p>
            </div>

            {selectedCollection.cocktails && selectedCollection.cocktails.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCollection.cocktails.map((cocktail) => (
                  <div
                    key={cocktail._id || cocktail.cocktailId}
                    onClick={() => setSelectedRecipe(cocktail)}
                    className="bg-brutal-white border-4 border-black p-0 shadow-brutal hover:shadow-brutal-accent hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
                  >
                    {cocktail.imageUrl ? (
                      <div className="h-48 border-b-4 border-black overflow-hidden">
                        <img
                          src={cocktail.imageUrl}
                          alt={cocktail.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-black flex items-center justify-center border-b-4 border-black">
                        <span className="font-display font-black text-brutal-accent text-xl uppercase">
                          {cocktail.name}
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-display font-bold uppercase text-black text-lg mb-1">
                        {cocktail.name}
                      </h3>
                      <p className="font-mono text-xs text-brutal-disabled line-clamp-2">
                        {cocktail.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-4 border-dashed border-black">
                <p className="font-display text-4xl font-black uppercase text-black/20 mb-4">
                  No Cocktails Yet
                </p>
                <p className="font-mono text-sm text-brutal-disabled uppercase mb-8">
                  Generate a cocktail and add it here
                </p>
                <button
                  onClick={handleSwitchToGenerator}
                  className="bg-black text-brutal-accent px-6 py-3 font-display font-bold uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors"
                >
                  Generate Recipe
                </button>
              </div>
            )}
          </div>
        )}

        {/* Saved Recipes View */}
        {viewMode === "saved" && (
          <div>
            <div className="mb-8">
              <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-black leading-[0.9] mb-2">
                Saved Recipes
              </h2>
              <p className="font-mono text-sm text-brutal-disabled uppercase">
                {savedRecipes?.length || 0} recipes saved
              </p>
            </div>

            {isLoadingSaved ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-brutal-accent border-t-transparent animate-spin mb-4 mx-auto" />
                  <p className="font-mono text-sm text-brutal-disabled uppercase">
                    Loading recipes...
                  </p>
                </div>
              </div>
            ) : savedRecipes && savedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    className="bg-brutal-white border-4 border-black shadow-brutal hover:shadow-brutal-accent hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer group"
                  >
                    <div onClick={() => setSelectedRecipe(recipe)}>
                      {recipe.imageUrl ? (
                        <div className="h-48 border-b-4 border-black overflow-hidden">
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-black flex items-center justify-center border-b-4 border-black">
                          <span className="font-display font-black text-brutal-accent text-xl uppercase text-center px-4">
                            {recipe.name}
                          </span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-display font-bold uppercase text-black text-lg mb-1">
                          {recipe.name}
                        </h3>
                        <p className="font-mono text-xs text-brutal-disabled line-clamp-2 mb-4">
                          {recipe.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCocktail(recipe._id);
                        }}
                        className="p-2 bg-brutal-error text-white border-2 border-black hover:bg-black hover:text-brutal-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-4 border-dashed border-black">
                <p className="font-display text-4xl font-black uppercase text-black/20 mb-4">
                  No Recipes Yet
                </p>
                <p className="font-mono text-sm text-brutal-disabled uppercase mb-8">
                  Generate one to get started
                </p>
                <button
                  onClick={handleSwitchToGenerator}
                  className="bg-black text-brutal-accent px-6 py-3 font-display font-bold uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors"
                >
                  Generate Recipe
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <Overlay
        isOpen={showNewCollectionModal}
        onClose={() => setShowNewCollectionModal(false)}
        zIndex="z-[60]"
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
        zIndex="z-[60]"
      >
        <div className="space-y-4">
          <h3 className="font-display text-2xl font-black uppercase text-black">
            Add to Collection
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {collections?.map((collection) => (
              <button
                key={collection._id}
                onClick={() => handleSelectCollection(collection)}
                className="w-full text-left p-4 border-4 border-black hover:bg-brutal-accent/10 hover:border-brutal-accent transition-all"
              >
                <div className="font-display font-bold uppercase text-black">
                  {collection.name}
                </div>
                <div className="font-mono text-xs text-brutal-disabled">
                  {collection.cocktails?.length || 0} cocktails
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setShowCollectionModal(false);
              setShowNewCollectionModal(true);
            }}
            className="w-full py-3 font-mono text-sm uppercase font-bold border-4 border-dashed border-black text-black hover:border-brutal-accent hover:text-brutal-accent transition-colors"
          >
            + Create New Collection
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
            onDeleteCocktail={deleteCocktail}
          />
        </Overlay>
      )}

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Homepage;
