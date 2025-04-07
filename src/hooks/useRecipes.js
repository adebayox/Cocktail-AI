import { useState, useCallback } from "react";
import { privateFetch } from "../utility/fetchFunction";
import { toast } from "react-toastify";

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
          // Return the recipe directly (no enhancement needed)
          return response.data.recipe;
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
        url: "cocktail/save",
      });

      if (response?.data?.code === "00") {
        // Directly set the saved recipes (no enhancement needed)
        setSavedRecipes(response.data.savedRecipes || []);
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

  const deleteCocktail = useCallback(async (cocktailId) => {
    try {
      const response = await privateFetch.request({
        method: "DELETE",
        url: `cocktail/cocktail/${cocktailId}`,
      });

      if (response?.data?.code === "00") {
        toast.success("Cocktail deleted successfully!");
        fetchSavedRecipes(); // Refresh the list
        return true;
      } else {
        throw new Error(response?.data?.message || "Failed to delete cocktail");
      }
    } catch (error) {
      console.error("Delete cocktail error:", error);
      toast.error("Failed to delete cocktail. Please try again.");
      return false;
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
    deleteCocktail,
  };
};
