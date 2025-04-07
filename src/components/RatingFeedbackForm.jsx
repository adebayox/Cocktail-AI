import React, { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { privateFetch } from "../utility/fetchFunction";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";

const RatingFeedbackForm = ({ recipeId }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the current user's ID from the store
  const userId = useUserStore((state) => state.user?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !recipeId) {
      toast.error("Please log in to submit a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId,
        recipeId,
        rating,
        feedback: feedback.trim(),
      };

      const response = await privateFetch.request({
        method: "POST",
        url: "cocktail/ratings",
        data: payload,
      });

      if (response.data) {
        toast.success("Rating submitted successfully!");
        setRating(0);
        setFeedback("");
      }
    } catch (error) {
      console.error("Rating submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit rating. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-purple-50 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">
        Rate this recipe
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              } hover:text-yellow-500 focus:outline-none`}
            >
              <Star className="w-6 h-6" />
            </button>
          ))}
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Leave your feedback (optional)"
          className="w-full p-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          rows="3"
        />
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RatingFeedbackForm;
