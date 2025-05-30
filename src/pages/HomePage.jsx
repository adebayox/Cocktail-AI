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
import {
  X,
  Trash2,
  Menu,
  ChevronLeft,
  Sparkles,
  Coffee,
  TrendingUp,
  Star,
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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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
    isGenerating,
    saveRecipe,
    isSaving,
    savedRecipes,
    isLoadingSaved,
    fetchSavedRecipes,
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

  useEffect(() => {
    // Fetch saved recipes when component mounts to get accurate stats
    fetchSavedRecipes();
  }, []); // Run once on mount

  // Also fetch when returning to generator view to keep stats updated
  useEffect(() => {
    if (viewMode === "generator") {
      fetchSavedRecipes();
    }
  }, [viewMode, fetchSavedRecipes]);

  const { logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
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
      // Clear any previous image analysis when generating a new recipe manually
      setImageAnalysis(null);

      const recipe = await generateRecipe({
        ingredients,
        flavors,
        dietaryNeeds,
      });

      console.log("Generated recipe:", recipe);

      if (recipe) {
        setGeneratedRecipe(recipe);
        setViewMode("recipe");

        setIngredientInput("");
        setFlavorInput("");
        setDietaryInput("");

        clearAllIngredients();
        clearAllFlavors();
        clearAllDietaryNeeds();
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
      cocktailId: selectedCocktail,
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
    console.log("Uploaded Image URL in Homepage:", imageUrl);
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
      toast.success(`Identified as ${analysis.cocktailName}`);
    }
  };

  // Reset image analysis when switching to generator view
  const handleSwitchToGenerator = () => {
    setViewMode("generator");
    setMobileMenuOpen(false);
  };

  // Handle navigation with mobile menu
  const handleNavigation = (mode) => {
    setViewMode(mode);
    setMobileMenuOpen(false);
  };

  // Function to render collection items with images
  const renderCollectionItem = (cocktail) => (
    <div
      key={cocktail._id || cocktail.cocktailId}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
      onClick={() => setSelectedRecipe(cocktail)}
    >
      {cocktail.imageUrl ? (
        <div className="h-48 overflow-hidden relative">
          <img
            src={cocktail.imageUrl}
            alt={cocktail.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 animate-pulse" />
          <span className="text-white font-bold text-lg z-10 drop-shadow-lg">
            {cocktail.name}
          </span>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition-colors">
          {cocktail.name}
        </h3>
        <p className="text-sm text-purple-600 line-clamp-2 leading-relaxed">
          {cocktail.description}
        </p>
      </div>
    </div>
  );

  // Stats cards for dashboard
  const statsCards = [
    {
      title: "Recipes Generated",
      value: savedRecipes?.length || 0,
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      bgPattern: "bg-gradient-to-br from-purple-100 to-pink-100",
    },
    {
      title: "Collections",
      value: collections?.length || 0,
      icon: Coffee,
      color: "from-blue-500 to-cyan-500",
      bgPattern: "bg-gradient-to-br from-blue-100 to-cyan-100",
    },
    {
      title: "Trending",
      value: "AI Powered",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgPattern: "bg-gradient-to-br from-green-100 to-emerald-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 font-sans relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 p-4 md:p-6">
        {/*  Header */}
        <header className="flex justify-between items-center mb-8 md:mb-12">
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-pulse">
                  Hey there, {name}! 👋
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-800 via-pink-700 to-orange-600 bg-clip-text text-transparent">
                  Cocktail Recipe Generator
                </p>
                <div className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
                  <span>AI Powered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-white/70 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/20">
            <button
              onClick={handleSwitchToGenerator}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                viewMode === "generator"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              Generate
            </button>
            <button
              onClick={() => setViewMode("collections")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                viewMode === "collections"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setViewMode("saved")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                viewMode === "saved"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                  : "text-purple-700 hover:bg-purple-100/50"
              }`}
            >
              Saved
            </button>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ml-2"
            >
              ✨ Go Premium
            </button>
            {/* Logout Button for Desktop */}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 ml-2 flex items-center space-x-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </nav>

          {/* Mobile Navigation Area - Added Logout button here */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              className="flex items-center text-purple-800 bg-white/70 backdrop-blur-md p-3 rounded-xl shadow-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Stats Dashboard desktop */}
        {viewMode === "generator" && (
          <div className="hidden md:block fixed right-6 top-32 w-80 z-30">
            <div className="space-y-4">
              {statsCards.map((stat, index) => (
                <div
                  key={stat.title}
                  className={`${stat.bgPattern} backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {stat.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/20">
            <div className="p-6 border-b border-gray-200/50 flex justify-between items-center bg-gradient-to-r from-purple-600 to-pink-600">
              <h3 className="font-bold text-white text-lg">Menu</h3>
              <div className="flex items-center space-x-2">
                {/* Logout Button in header */}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg flex items-center space-x-1"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Logout</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex flex-col h-full">
              {/* Main Nav */}
              <div className="flex-1 p-6 space-y-4">
                {[
                  { key: "generator", label: "Generate", icon: Sparkles },
                  { key: "collections", label: "Collections", icon: Coffee },
                  { key: "saved", label: "Saved", icon: Star },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item.key)}
                    className={`flex items-center space-x-3 py-4 px-6 text-left rounded-xl transition-all duration-300 w-full ${
                      viewMode === item.key
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-purple-100/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowPremiumModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-yellow-600 text-center font-semibold shadow-lg flex items-center justify-center space-x-2 w-full"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Go Premium</span>
                </button>
              </div>

              <div className="p-6 border-t border-gray-200/50 mt-auto">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {showPremiumModal && (
          <PremiumModal onClose={() => setShowPremiumModal(false)} />
        )}

        {/* Main Content */}
        <main className="container mx-auto px-0 md:px-4 md:pr-96">
          {viewMode === "generator" && (
            <div className="max-w-4xl mx-auto">
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
          )}

          {viewMode === "recipe" && generatedRecipe && (
            <div className="max-w-4xl mx-auto">
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
            </div>
          )}

          {viewMode === "collections" && (
            <div className="max-w-7xl mx-auto">
              <CollectionsView
                collections={collections}
                isLoading={isLoadingCollections}
                onCreateNew={() => setShowNewCollectionModal(true)}
                onSelectCollection={handleSelectedCollection}
                onDeleteCollection={deleteCollection}
              />
            </div>
          )}

          {viewMode === "collectionDetail" && selectedCollection && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-900 via-pink-800 to-orange-700 bg-clip-text text-transparent mb-2">
                    {selectedCollection.name}
                  </h2>
                  <p className="text-purple-600 font-medium">
                    {selectedCollection.cocktails?.length || 0} cocktails in
                    this collection
                  </p>
                </div>
                <button
                  onClick={() => setViewMode("collections")}
                  className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back to Collections
                </button>
              </div>

              {selectedCollection.cocktails &&
              selectedCollection.cocktails.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {selectedCollection.cocktails.map(renderCollectionItem)}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Coffee className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-4">
                    No cocktails yet
                  </h3>
                  <p className="text-lg text-purple-700 mb-8 max-w-md mx-auto">
                    Start building your collection by generating some amazing
                    cocktail recipes!
                  </p>
                  <button
                    onClick={handleSwitchToGenerator}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Create Your First Cocktail
                  </button>
                </div>
              )}
            </div>
          )}

          {viewMode === "saved" && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-900 via-pink-800 to-orange-700 bg-clip-text text-transparent mb-2">
                  Your Saved Recipes
                </h2>
                <p className="text-purple-600 font-medium">
                  {savedRecipes?.length || 0} recipes saved for later
                </p>
              </div>

              {isLoadingSaved ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-spin mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                  <p className="text-lg text-purple-700 font-medium">
                    Loading your recipes...
                  </p>
                </div>
              ) : savedRecipes && savedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {savedRecipes.map((recipe) => (
                    <div
                      key={recipe._id}
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      {recipe.imageUrl ? (
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 animate-pulse" />
                          <span className="text-white font-bold text-lg z-10 drop-shadow-lg">
                            {recipe.name}
                          </span>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition-colors">
                          {recipe.name}
                        </h3>
                        <p className="text-sm text-purple-600 line-clamp-2 leading-relaxed mb-4">
                          {recipe.description}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCocktail(recipe._id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Star className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-4">
                    No saved recipes yet
                  </h3>
                  <p className="text-lg text-purple-700 mb-8 max-w-md mx-auto">
                    Generate some cocktail recipes and save your favorites to
                    see them here!
                  </p>
                  <button
                    onClick={handleSwitchToGenerator}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Generate Your First Recipe
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
          <div className="space-y-6 bg-white/95 backdrop-blur-xl rounded-2xl p-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-900 to-pink-800 bg-clip-text text-transparent">
              Add to Collection
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {collections?.map((collection) => (
                <button
                  key={collection._id}
                  onClick={() => handleSelectCollection(collection)}
                  className="w-full text-left p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-purple-100 hover:border-purple-300 hover:shadow-md"
                >
                  <div className="font-semibold text-purple-800">
                    {collection.name}
                  </div>
                  <div className="text-sm text-purple-600">
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
              className="w-full py-3 text-purple-600 hover:text-purple-800 font-semibold hover:bg-purple-50 rounded-xl transition-all duration-300 border-2 border-dashed border-purple-300 hover:border-purple-400"
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
              analysis={
                selectedRecipe === generatedRecipe ? imageAnalysis : null
              }
              onDeleteCocktail={deleteCocktail}
            />
          </Overlay>
        )}

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
