import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { publicFetch, privateFetch } from "../utility/fetchFunction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../store/useUserStore";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Button from "../components/ui/Button";
import { Heart, Bookmark, Share2, Plus, FolderPlus, X } from "lucide-react";

const Homepage = () => {
  const queryClient = useQueryClient();
  const name = useUserStore.getState().user?.username;
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("Settings");
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [viewMode, setViewMode] = useState("generator"); // generator, collections, saved

  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);

  const [ingredients, setIngredients] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [dietaryNeeds, setDietaryNeeds] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [flavorInput, setFlavorInput] = useState("");
  const [dietaryInput, setDietaryInput] = useState("");

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput)) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  const handleAddFlavor = () => {
    if (flavorInput.trim() && !flavors.includes(flavorInput)) {
      setFlavors([...flavors, flavorInput.trim()]);
      setFlavorInput("");
    }
  };

  const handleAddDietaryNeed = () => {
    if (dietaryInput.trim() && !dietaryNeeds.includes(dietaryInput)) {
      setDietaryNeeds([...dietaryNeeds, dietaryInput.trim()]);
      setDietaryInput("");
    }
  };

  const handleRemoveItem = (list, setList, item) => {
    setList(list.filter((i) => i !== item));
  };

  // Generate recipe mutation
  const generateRecipeMutation = useMutation({
    mutationFn: (data) =>
      privateFetch.request({
        method: "POST",
        url: "cocktail",
        data: {
          ingredients: data.ingredients,
          flavors: data.flavors,
          dietaryNeeds: data.dietaryNeeds,
        },
      }),
    onSuccess: (response) => {
      console.log("API Response:", response);

      if (response?.data?.code === "00") {
        const recipe = response.data.recipe;

        const formattedRecipe = {
          id: Date.now(), // Generate a unique ID (or use one from the API if available)
          name: recipe.name,
          description: recipe.description,
          ingredients: recipe.ingredients.map(
            (ingredient) =>
              `${ingredient.ingredient} (${ingredient.measurement})`
          ),
          instructions: recipe.instructions,
          tags: [...ingredients, ...flavors, ...dietaryNeeds],
        };

        setGeneratedRecipe(formattedRecipe);
        setViewMode("recipe");
        toast.success("Recipe generated successfully!");
      } else {
        toast.error(
          response?.data?.message || "Something went wrong. Please try again"
        );
      }
    },
    onError: (error) => {
      console.error("Error generating recipe:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to generate recipe. Please try again."
      );
    },
  });

  // Save recipe mutation
  const saveRecipeMutation = useMutation({
    mutationFn: (recipe) =>
      privateFetch.request({
        method: "POST",
        url: "cocktail/save",
        data: recipe,
      }),
    onSuccess: (res) => {
      if (res.data?.code === "00") {
        toast.success("Recipe saved successfully!");
        queryClient.invalidateQueries({ queryKey: ["savedRecipes"] });
      } else {
        toast.error("Something went wrong. Please try again");
      }
    },
    onError: (error) => {
      console.error("Error saving recipe:", error);
      toast.error("Failed to save recipe. Please try again.");
    },
  });

  const createCollectionMutation = useMutation({
    mutationFn: (data) =>
      privateFetch.request({
        method: "POST",
        url: "collection",
        data: {
          name: data.name,
          userId: useUserStore.getState().user?._id,
        },
      }),
    onSuccess: (response) => {
      // Use the collection data directly from the API response
      const newCollection = response.data.collection;
      setCollections((prev) => [...prev, newCollection]);
      toast.success("Collection created successfully!");
      setShowCollectionModal(false);
      setShowNewCollectionModal(false);
    },
    onError: (error) => {
      console.error("Error creating collection:", error);
      toast.error(
        error.response?.data?.message || "Failed to create collection"
      );
    },
  });

  const fetchSavedRecipes = async () => {
    try {
      const response = await privateFetch.get("/cocktail/save", {});
      return response.data.savedRecipes;
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (viewMode === "saved") {
      fetchSavedRecipes()
        .then((data) => setSavedRecipes(data))
        .catch((error) => toast.error("Failed to fetch saved recipes"));
    }
  }, [viewMode]);

  // Save to collection mutation
  const saveToCollectionMutation = useMutation({
    mutationFn: (data) =>
      privateFetch.request({
        method: "POST",
        url: "cocktail/save-to-collection",
        data: {
          cocktailId: data.recipeId,
          collectionName: data.collection.name,
          userId: useUserStore.getState().user?._id,
        },
      }),
    onSuccess: (res) => {
      if (res.data?.code === "00") {
        toast.success("Added to collection!");
        setShowCollectionModal(false);
        queryClient.invalidateQueries({ queryKey: ["collections"] });
      } else {
        toast.error("Something went wrong. Please try again");
      }
    },
    onError: (error) => {
      console.error("Error adding to collection:", error);
      toast.error("Failed to add to collection. Please try again.");
    },
  });

  const handleGenerateRecipes = () => {
    if (
      ingredients.length === 0 &&
      flavors.length === 0 &&
      dietaryNeeds.length === 0
    ) {
      toast.error("Please add at least one preference");
      return;
    }

    generateRecipeMutation.mutate({
      ingredients,
      flavors,
      dietaryNeeds,
    });
  };

  // Add this near your other queries

  const CreateCollectionForm = ({ onClose }) => {
    const [newCollectionName, setNewCollectionName] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!newCollectionName.trim()) {
        toast.error("Please enter a collection name");
        return;
      }
      createCollectionMutation.mutate({ name: newCollectionName });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Collection Name
          </label>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Enter collection name"
            className="w-full border-2 border-purple-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-purple-600 hover:text-purple-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createCollectionMutation.isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {createCollectionMutation.isLoading
              ? "Creating..."
              : "Create Collection"}
          </button>
        </div>
      </form>
    );
  };

  const handleAddToCollection = (collectionId) => {
    if (!generatedRecipe) return;

    saveToCollectionMutation.mutate({
      recipeId: generatedRecipe.id,
      collectionId,
    });
  };

  const Overlay = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    );
  };

  const RecipeDisplay = ({ recipe }) => (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-purple-900">{recipe.name}</h3>
          <p className="text-purple-600 mt-2">{recipe.description}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => saveRecipeMutation.mutate(recipe)}
            className="text-purple-600 hover:text-purple-800"
            disabled={saveRecipeMutation.isLoading}
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowCollectionModal(true)}
            className="text-purple-600 hover:text-purple-800"
          >
            <FolderPlus className="w-6 h-6" />
          </button>
          <button className="text-purple-600 hover:text-purple-800">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-purple-800">
            Ingredients
          </h4>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-purple-800">
            Instructions
          </h4>
          <ol className="space-y-4">
            {recipe.instructions
              .split("\n") // Split the instructions string into an array of steps
              .filter((step) => step.trim()) // Remove empty steps
              .map((step, idx) => (
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

      {/* Tip Section */}
      {recipe.tip && (
        <div className="mt-6 bg-purple-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-purple-800 mb-2">Tip</h4>
          <p className="text-purple-600">{recipe.tip}</p>
        </div>
      )}

      {/* Tags Section (Optional) */}
      {recipe.tags && (
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
  );

  const CollectionsView = () => {
    const {
      data: collections,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["collections"],
      queryFn: async () => {
        const userId = useUserStore.getState().user?.id;
        const response = await privateFetch.get(`collections/${userId}`);
        return response.data.collections;
      },
    });

    if (isLoading) return <p>Loading collections...</p>;
    if (error) return <p>Error loading collections</p>;
    return (
      // Add return statement here
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections?.map((collection) => (
            <div
              key={collection._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-purple-800">
                  {collection.name}
                </h3>
                <p className="text-sm text-purple-600">
                  {collection.cocktails?.length || 0} cocktails
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-purple-50 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowNewCollectionModal(true)}
            className="border-2 border-dashed border-purple-200 rounded-lg p-6 flex flex-col items-center justify-center text-purple-400 hover:text-purple-600 hover:border-purple-400 cursor-pointer transition-colors"
          >
            <Plus className="w-12 h-12 mb-2" />
            <p className="text-lg font-medium">Create New Collection</p>
          </button>
        </div>

        {/* New Collection Modal */}
        {showNewCollectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-900">
                  Create New Collection
                </h3>
                <button
                  onClick={() => setShowNewCollectionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <CreateCollectionForm
                onClose={() => setShowNewCollectionModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const AddToCollectionModal = () => {
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-purple-900">
            Add to Collection
          </h3>
          <button
            onClick={() => setShowCollectionModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {collections?.map((collection) => (
            <button
              key={collection._id}
              onClick={() => handleAddToCollection(collection._id)}
              className="w-full text-left p-3 rounded-lg hover:bg-purple-50 transition-colors"
            >
              {collection.name} ({collection.cocktails?.length || 0} cocktails)
            </button>
          ))}
        </div>

        <div className="border-t pt-4">
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
      </div>
    </div>;
  };

  const SavedRecipesView = () => (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">Saved Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedRecipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
            onClick={() => setSelectedRecipe(recipe)} // Set the selected recipe
          >
            <h3 className="text-xl font-semibold text-purple-800">
              {recipe.name}
            </h3>
            <p className="text-sm text-purple-600 mt-2">{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6 font-sans relative">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-xl font-semibold text-black">Hey {name},</h1>
          <p className="text-2xl font-bold text-purple-800">CocktailCraft AI</p>
        </div>
        <nav className="flex space-x-6 items-center">
          <button
            onClick={() => setViewMode("generator")}
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
            onClick={() => setViewMode("saved")} // Navigate to saved recipes view
            className={`text-lg ${
              viewMode === "saved"
                ? "text-purple-800 font-semibold"
                : "text-purple-600"
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Profile
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto">
        {viewMode === "generator" && (
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-purple-900 mb-4">
              AI Cocktail Recipe Generator
            </h2>
            <p className="text-xl text-purple-700 mb-8">
              Enter your preferences to craft the perfect cocktail!
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                {/* Ingredients Input */}
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-2">
                    Ingredients
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddIngredient()
                      }
                      placeholder="e.g. vodka, strawberries, gin, rum, tequila, lime"
                      className="w-full border-2 border-purple-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleAddIngredient}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ingredients.map((item, index) => (
                      <div
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{item}</span>
                        <button
                          onClick={() =>
                            handleRemoveItem(ingredients, setIngredients, item)
                          }
                          className="text-purple-600 hover:text-purple-800"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flavors Input */}
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-2">
                    Flavors
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={flavorInput}
                      onChange={(e) => setFlavorInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddFlavor()}
                      placeholder="e.g. sweet, sour, bitter, herbal, refreshing, fresh"
                      className="w-full border-2 border-purple-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleAddFlavor}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {flavors.map((item, index) => (
                      <div
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{item}</span>
                        <button
                          onClick={() =>
                            handleRemoveItem(flavors, setFlavors, item)
                          }
                          className="text-purple-600 hover:text-purple-800"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietary Needs Input */}
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-2">
                    Dietary Needs
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={dietaryInput}
                      onChange={(e) => setDietaryInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddDietaryNeed()
                      }
                      placeholder="e.g. vegan, low-sugar, non-alcoholic, gluten free, dairy free"
                      className="w-full border-2 border-purple-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleAddDietaryNeed}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dietaryNeeds.map((item, index) => (
                      <div
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{item}</span>
                        <button
                          onClick={() =>
                            handleRemoveItem(
                              dietaryNeeds,
                              setDietaryNeeds,
                              item
                            )
                          }
                          className="text-purple-600 hover:text-purple-800"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateRecipes}
                  disabled={generateRecipeMutation.isLoading}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {generateRecipeMutation.isLoading
                    ? "Generating..."
                    : "Generate Recipes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === "recipe" && generatedRecipe && (
          <RecipeDisplay recipe={generatedRecipe} />
        )}

        {viewMode === "collections" && <CollectionsView />}

        {viewMode === "saved" && <SavedRecipesView />}
      </main>

      {showCollectionModal && <AddToCollectionModal />}

      {selectedRecipe && (
        <Overlay
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-purple-900">
              {selectedRecipe.name}
            </h3>
            <p className="text-purple-600">{selectedRecipe.description}</p>

            {/* Ingredients */}
            <div>
              <h4 className="text-lg font-semibold text-purple-800 mb-2">
                Ingredients
              </h4>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-lg font-semibold text-purple-800 mb-2">
                Instructions
              </h4>
              <ol className="space-y-4">
                {selectedRecipe.instructions
                  .split("\n")
                  .filter((step) => step.trim())
                  .map((step, idx) => (
                    <li key={idx} className="flex space-x-4">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-800 font-medium">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
              </ol>
            </div>

            {/* Tip */}
            {selectedRecipe.tip && (
              <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 mb-2">
                  Tip
                </h4>
                <p className="text-purple-600">{selectedRecipe.tip}</p>
              </div>
            )}
          </div>
        </Overlay>
      )}

      {/* Add to Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-purple-900">
                {selectedCollection ? "Add to Collection" : "Collections"}
              </h3>
              <button
                onClick={() => setShowCollectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Show existing collections */}
            <div className="space-y-2 mb-4">
              {collections.map((collection) => (
                <button
                  key={collection._id}
                  onClick={() => handleAddToCollection(collection._id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  {collection.name}
                </button>
              ))}
            </div>

            {/* Create new collection form */}
            <div className="border-t pt-4">
              <CreateCollectionForm
                onClose={() => setShowCollectionModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Profile Sidebar */}
      {showProfile && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out z-40">
          <button
            onClick={() => setShowProfile(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Profile</h2>

          <div className="flex space-x-4 border-b pb-2 mb-4">
            {["Settings", "User Info", "Collections"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 ${
                  activeTab === tab
                    ? "border-b-2 border-purple-600 text-purple-800 font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-gray-700">
            {activeTab === "Settings" && <p>Settings content here...</p>}
            {activeTab === "User Info" && <p>User information details...</p>}
            {activeTab === "Collections" && (
              <div className="space-y-4">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="p-3 bg-purple-50 rounded-lg"
                  >
                    <h4 className="font-medium text-purple-800">
                      {collection.name}
                    </h4>
                    <p className="text-sm text-purple-600">
                      {collection.recipes.length} recipes
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
