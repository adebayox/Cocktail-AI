import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { privateFetch } from "../utility/fetchFunction";
import RecipeDisplay from "../components/recipe/RecipeDisplay";
import { Loader2 } from "lucide-react";

const SharedRecipe = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await privateFetch.request({
          method: "GET",
          url: `cocktail/shared/${recipeId}`,
        });

        if (response.data?.recipe) {
          setRecipe(response.data.recipe);
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Oops!</h2>
          <p className="text-purple-600 mb-6">{error}</p>
          <Link
            to="/signup"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 inline-block"
          >
            Sign up to create your own recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <RecipeDisplay recipe={recipe} />
        <div className="text-center mt-8">
          <Link
            to="/"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 inline-block"
          >
            Sign up to create your own recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedRecipe;
