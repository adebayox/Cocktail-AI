import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { privateFetch } from "../utility/fetchFunction";
import RecipeDisplay from "../components/recipe/RecipeDisplay";
import { AlertCircle } from "lucide-react";

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
      <div className="min-h-screen bg-brutal-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brutal-accent border-t-transparent animate-spin mb-6 mx-auto" />
          <p className="font-display text-2xl font-black text-brutal-accent uppercase">
            Loading Recipe
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brutal-black flex items-center justify-center p-6">
        <div className="bg-brutal-white border-4 border-black p-8 shadow-brutal-accent-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-brutal-error flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-3xl font-black uppercase text-black mb-4">
            Error
          </h2>
          <p className="font-mono text-sm text-brutal-disabled mb-8">
            {error}
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-brutal-accent px-6 py-3 font-display font-bold uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors"
          >
            Sign Up to Create Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-white">
      {/* Header */}
      <nav className="bg-black border-b-4 border-brutal-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-display font-black text-brutal-white text-lg uppercase">
              Cocktails
            </h1>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <RecipeDisplay recipe={recipe} />
        
        <div className="text-center mt-12 py-8 border-t-4 border-black">
          <p className="font-mono text-sm text-brutal-disabled uppercase mb-6">
            Want to create your own cocktails?
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-brutal-accent px-8 py-4 font-display text-xl font-black uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors shadow-brutal-accent"
          >
            Sign Up Free
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SharedRecipe;
