import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { privateFetch } from "../utility/fetchFunction"; // Your fetch utility

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

        console.log("Backend response:", response.data); // Debug log

        if (response.data && Array.isArray(response.data.ratings)) {
          setRatings(response.data.ratings); // Ensure `ratings` is an array
        } else {
          console.error("Invalid ratings data:", response.data);
          setRatings([]); // Fallback to an empty array
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
      <div className="text-center text-purple-800">Loading ratings...</div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-purple-900 mb-4">
        Ratings & Feedback
      </h3>
      {ratings.length === 0 ? (
        <p className="text-purple-600">No ratings yet. Be the first to rate!</p>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= rating.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-purple-600">
                  by {rating.userId?.username || "Anonymous"}
                </span>
              </div>
              {rating.feedback && (
                <p className="text-purple-700 mt-2">{rating.feedback}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeRatings;
