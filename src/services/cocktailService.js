// This is a frontend service file to handle cocktail image generation
import { privateFetch } from "../utility/fetchFunction";

// Function to generate an image for a cocktail
export const generateCocktailImage = async (cocktailName, ingredients) => {
  try {
    // Create a prompt for the image generation
    const prompt = `A professional, appetizing photo of a ${cocktailName} cocktail. 
    ${ingredients ? `Made with ${ingredients.join(", ")}.` : ""} 
    High quality, studio lighting, on a bar counter with elegant garnish, photorealistic.`;

    // Call your backend API to generate the image
    const response = await privateFetch.request({
      method: "POST",
      url: "cocktail/generate-image",
      data: { prompt },
    });

    if (response?.data?.code === "00" && response?.data?.imageUrl) {
      return response.data.imageUrl;
    } else {
      throw new Error("Failed to generate cocktail image");
    }
  } catch (error) {
    console.error("Error generating cocktail image:", error);
    // Return a fallback image URL or null
    return null;
  }
};

// Function to enhance a recipe with an image
export const enhanceRecipeWithImage = async (recipe) => {
  // Skip if recipe already has an image
  if (recipe.imageUrl) return recipe;

  try {
    const imageUrl = await generateCocktailImage(
      recipe.name,
      recipe.ingredients
    );

    if (imageUrl) {
      return {
        ...recipe,
        imageUrl,
      };
    }

    return recipe;
  } catch (error) {
    console.error("Error enhancing recipe with image:", error);
    return recipe;
  }
};
