import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { privateFetch } from "../utility/fetchFunction"; 

const RecipeRatings = ({ recipeId }) => {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await privateFetch.request({
          method: "GET",
          url: `cocktail/ratings/${recipeId}`,
        });

        if (response.data && Array.isArray(response.data.ratings)) {
          setRatings(response.data.ratings); 
        } else {
          setRatings([]); 
        }
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [recipeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-brutal-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="font-display text-xl font-black uppercase text-black mb-6 border-b-4 border-black pb-2">
        Reviews & Ratings
      </h3>
      
      {ratings.length === 0 ? (
        <div className="text-center py-8 border-4 border-dashed border-black/20">
          <p className="font-mono text-sm text-brutal-disabled uppercase">
            No ratings yet. Be the first to rate!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div 
              key={rating._id} 
              className="bg-brutal-white border-4 border-black p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rating.rating
                          ? "fill-brutal-accent text-brutal-accent"
                          : "text-brutal-disabled"
                      }`}
                      strokeWidth={2}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs text-brutal-disabled uppercase">
                  by {rating.userId?.username || "Anonymous"}
                </span>
              </div>
              {rating.feedback && (
                <p className="font-mono text-sm text-black">
                  {rating.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeRatings;
