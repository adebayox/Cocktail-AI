import { useState, useCallback } from "react";
import { privateFetch } from "../utility/fetchFunction";
import { toast } from "react-toastify";
import { enhanceRecipeWithImage } from "../services/cocktailService";

export const useRecipes = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Generate a cocktail recipe
  const generateRecipe = useCallback(
    async ({ ingredients, flavors, dietaryNeeds }) => {
      setIsGenerating(true);
      try {
        const response = await privateFetch.request({
          method: "POST",
          url: "cocktail",
          data: { ingredients, flavors, dietaryNeeds },
        });

        if (response?.data?.code === "00" && response?.data?.recipe) {
          // Enhance the recipe with an image
          const enhancedRecipe = await enhanceRecipeWithImage(
            response.data.recipe
          );
          return enhancedRecipe;
        } else {
          throw new Error(
            response?.data?.message || "Failed to generate recipe"
          );
        }
      } catch (error) {
        console.error("Recipe generation error:", error);
        throw new Error("Failed to generate recipe. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  // Save a recipe
  const saveRecipe = useCallback(async (recipe) => {
    setIsSaving(true);
    try {
      const response = await privateFetch.request({
        method: "POST",
        url: "cocktail/save",
        data: recipe,
      });

      if (response?.data?.code === "00") {
        toast.success("Recipe saved successfully!");
        // Refresh saved recipes
        fetchSavedRecipes();
        return true;
      } else {
        throw new Error(response?.data?.message || "Failed to save recipe");
      }
    } catch (error) {
      console.error("Recipe save error:", error);
      toast.error("Failed to save recipe. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Fetch saved recipes
  const fetchSavedRecipes = useCallback(async () => {
    setIsLoadingSaved(true);
    try {
      const response = await privateFetch.request({
        method: "GET",
        url: "cocktail/saved",
      });

      if (response?.data?.code === "00") {
        // Process recipes to ensure they all have images
        const recipes = response.data.savedRecipes || [];
        const enhancedRecipes = await Promise.all(
          recipes.map(async (recipe) => {
            if (!recipe.imageUrl) {
              return await enhanceRecipeWithImage(recipe);
            }
            return recipe;
          })
        );

        setSavedRecipes(enhancedRecipes);
      } else {
        throw new Error(
          response?.data?.message || "Failed to fetch saved recipes"
        );
      }
    } catch (error) {
      console.error("Fetch saved recipes error:", error);
      toast.error("Failed to load saved recipes");
    } finally {
      setIsLoadingSaved(false);
    }
  }, []);

  return {
    generateRecipe,
    isGenerating,
    saveRecipe,
    isSaving,
    savedRecipes,
    isLoadingSaved,
    fetchSavedRecipes,
  };
};
