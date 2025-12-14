import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { privateFetch } from "../utility/fetchFunction";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";

const RatingFeedbackForm = ({ recipeId, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        toast.success("Rating submitted");
        setRating(0);
        setFeedback("");

        if (onRatingSubmitted) {
          onRatingSubmitted();
        }
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
    <div className="bg-brutal-white border-4 border-black p-6 shadow-brutal">
      <h3 className="font-display text-xl font-black uppercase text-black mb-6">
        Rate This Recipe
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? "fill-brutal-accent text-brutal-accent"
                    : "text-brutal-disabled"
                }`}
                strokeWidth={2}
              />
            </button>
          ))}
          <span className="ml-4 font-mono text-sm text-brutal-disabled uppercase">
            {rating > 0 ? `${rating}/5` : "Select rating"}
          </span>
        </div>

        {/* Feedback */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-black">
            Feedback (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts..."
            rows="3"
            className="w-full border-4 border-black px-4 py-3 font-mono text-sm focus:outline-none focus:border-brutal-accent bg-white placeholder:text-brutal-disabled resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="bg-black text-brutal-accent px-6 py-3 font-display font-bold uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-brutal-accent border-t-transparent animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" strokeWidth={2.5} />
              <span>Submit</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RatingFeedbackForm;
