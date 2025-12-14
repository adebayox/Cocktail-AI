import { useState, useCallback } from "react";
import { privateFetch } from "../utility/fetchFunction";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";

export const useRecipes = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  
  // Streaming state for progressive UI
  const [streamingRecipe, setStreamingRecipe] = useState(null);
  const [streamingStatus, setStreamingStatus] = useState("");

  // Generate a cocktail recipe (non-streaming - returns complete recipe with image)
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

  // Streaming recipe generation - progressive UI with skeleton states
  // New flow: recipe streams first, then image comes separately
  const generateRecipeStreaming = useCallback(
    async ({ ingredients, flavors, dietaryNeeds }, callbacks) => {
      setIsGenerating(true);
      setStreamingRecipe(null);
      setStreamingStatus("");

      const token = useUserStore.getState().user?.token;
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      try {
        const response = await fetch(`${baseURL}cocktail/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ingredients, flavors, dietaryNeeds }),
        });

        if (!response.ok) {
          throw new Error("Streaming not available");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let recipe = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.slice(6));

                switch (event.type) {
                  case "status":
                    setStreamingStatus(event.data);
                    callbacks?.onStatus?.(event.data);
                    break;
                  case "name":
                    recipe.name = event.data;
                    setStreamingRecipe((prev) => ({ ...prev, name: event.data }));
                    callbacks?.onName?.(event.data);
                    break;
                  case "description":
                    recipe.description = event.data;
                    setStreamingRecipe((prev) => ({ ...prev, description: event.data }));
                    callbacks?.onDescription?.(event.data);
                    break;
                  case "ingredients":
                    recipe.ingredients = event.data;
                    setStreamingRecipe((prev) => ({ ...prev, ingredients: event.data }));
                    callbacks?.onIngredients?.(event.data);
                    break;
                  case "instructions":
                    recipe.instructions = event.data;
                    setStreamingRecipe((prev) => ({ ...prev, instructions: event.data }));
                    callbacks?.onInstructions?.(event.data);
                    break;
                  case "tip":
                    recipe.tip = event.data;
                    setStreamingRecipe((prev) => ({ ...prev, tip: event.data }));
                    callbacks?.onTip?.(event.data);
                    break;
                  case "health":
                    recipe.healthRating = event.data.rating;
                    recipe.healthNotes = event.data.notes;
                    setStreamingRecipe((prev) => ({
                      ...prev,
                      healthRating: event.data.rating,
                      healthNotes: event.data.notes,
                    }));
                    callbacks?.onHealth?.(event.data);
                    break;
                  case "complete":
                    // Recipe content complete (without image yet)
                    recipe = { ...recipe, ...event.data };
                    setStreamingRecipe((prev) => ({ ...prev, ...event.data }));
                    callbacks?.onComplete?.(event.data);
                    break;
                  case "image":
                    // Image URL received
                    recipe.imageUrl = event.data;
                    setStreamingRecipe((prev) => ({ ...prev, imageUrl: event.data }));
                    callbacks?.onImage?.(event.data);
                    break;
                  case "done":
                    // Final complete recipe with image
                    recipe = event.data;
                    setStreamingRecipe(event.data);
                    callbacks?.onDone?.(event.data);
                    break;
                  case "error":
                    callbacks?.onError?.(event.data);
                    throw new Error(event.data);
                }
              } catch (parseError) {
                if (parseError.message !== "Unexpected end of JSON input") {
                  console.error("Error parsing SSE event:", parseError);
                }
              }
            }
          }
        }

        return recipe;
      } catch (error) {
        console.error("Streaming error, falling back to regular generation:", error);
        // Fallback to non-streaming if streaming fails
        callbacks?.onError?.("Streaming unavailable, using standard generation...");
        const recipe = await generateRecipe({ ingredients, flavors, dietaryNeeds });
        callbacks?.onDone?.(recipe);
        return recipe;
      } finally {
        setIsGenerating(false);
        setStreamingStatus("");
      }
    },
    [generateRecipe]
  );
  
  // Reset streaming state
  const resetStreamingState = useCallback(() => {
    setStreamingRecipe(null);
    setStreamingStatus("");
  }, []);

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
        toast.success("Recipe saved");
        // Refresh saved recipes
        fetchSavedRecipes();
        return true;
      } else {
        throw new Error(response?.data?.message || "Failed to save recipe");
      }
    } catch (error) {
      console.error("Recipe save error:", error);
      toast.error("Save failed");
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
      toast.error("Failed to load recipes");
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
        toast.success("Deleted");
        fetchSavedRecipes(); // Refresh the list
        return true;
      } else {
        throw new Error(response?.data?.message || "Failed to delete cocktail");
      }
    } catch (error) {
      console.error("Delete cocktail error:", error);
      toast.error("Delete failed");
      return false;
    }
  }, []);

  return {
    generateRecipe,
    generateRecipeStreaming,
    isGenerating,
    saveRecipe,
    isSaving,
    savedRecipes,
    isLoadingSaved,
    fetchSavedRecipes,
    deleteCocktail,
    // Streaming state
    streamingRecipe,
    streamingStatus,
    resetStreamingState,
  };
};
