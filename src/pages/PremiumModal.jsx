import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const PremiumModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (priceId) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const { id } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to start subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Go Premium</h2>
        <p className="text-purple-600 mb-6">
          Unlock exclusive features with a premium subscription.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleSubscribe("price_monthly_id")} // Replace with your Stripe Price ID
            disabled={isLoading}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Subscribe Monthly ($10/month)"
            )}
          </button>
          <button
            onClick={() => handleSubscribe("price_yearly_id")} // Replace with your Stripe Price ID
            disabled={isLoading}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Subscribe Yearly ($100/year)"
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-purple-600 hover:text-purple-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PremiumModal;
