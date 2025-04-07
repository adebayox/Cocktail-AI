import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { privateFetch } from "../utility/fetchFunction";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";

export const useRecipes = () => {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);

  const generateRecipeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await privateFetch.request({
        method: "POST",
        url: "cocktail",
        data: {
          ingredients: data.ingredients,
          flavors: data.flavors,
          dietaryNeeds: data.dietaryNeeds,
        },
      });

      if (response?.data?.code === "00") {
        const recipe = response.data.recipe;
        return {
          id: Date.now(),
          name: recipe.name,
          description: recipe.description,
          ingredients: Array.isArray(recipe.ingredients)
            ? recipe.ingredients
            : recipe.ingredients.map((ingredient) =>
                typeof ingredient === "string"
                  ? ingredient
                  : `${ingredient.ingredient} (${ingredient.measurement})`
              ),
          instructions: recipe.instructions,
          tags: [...data.ingredients, ...data.flavors, ...data.dietaryNeeds],
          cocktailId: recipe.cocktailId, // Preserve the cocktailId from the API response
          tip: recipe.tip, // Also preserve the tip if it exists
          healthRating: recipe.healthRating || null,
          healthNotes: recipe.healthNotes || null,
        };
      }
      throw new Error(response?.data?.message || "Failed to generate recipe");
    },
    onError: (error) => {
      console.error("Recipe generation error:", error);
      toast.error(error.message || "Failed to generate recipe");
    },
  });

  const saveRecipeMutation = useMutation({
    mutationFn: (recipe) => {
      // Add userId to the recipe payload
      const recipeWithUserId = {
        ...recipe,
        userId: userId,
        healthRating: recipe.healthRating,
        healthNotes: recipe.healthNotes,
      };

      console.log(
        "Saving recipe with data:",
        JSON.stringify(recipeWithUserId, null, 2)
      );

      return privateFetch.request({
        method: "POST",
        url: "cocktail/save",
        data: recipeWithUserId,
      });
    },
    onSuccess: (res) => {
      if (res.data?.code === "00") {
        toast.success("Recipe saved successfully!");
        queryClient.invalidateQueries({ queryKey: ["savedRecipes"] });
        return res.data;
      }
      throw new Error("Failed to save recipe");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save recipe");
    },
  });

  const {
    data: savedRecipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["savedRecipes"],
    queryFn: () =>
      privateFetch
        .get("/cocktail/save", {})
        .then((response) => response.data.savedRecipes),
  });

  // Modified to return the mutation function differently
  const generateRecipe = async (data) => {
    try {
      const result = await generateRecipeMutation.mutateAsync(data);
      return result; // This will be the transformed recipe
    } catch (error) {
      throw error;
    }
  };

  return {
    generateRecipe,
    isGenerating: generateRecipeMutation.isLoading,
    saveRecipe: saveRecipeMutation.mutate,
    isSaving: saveRecipeMutation.isLoading,
    savedRecipes,
    isLoadingSaved: isLoading,
    savedRecipesError: error,
  };
};
