import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { privateFetch } from "../../utility/fetchFunction";

const RecipeChat = ({ recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current && isExpanded) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await privateFetch.request({
        method: "POST",
        url: "cocktail/chat",
        data: {
          message: inputValue,
          recipeContext: recipe,
        },
      });

      if (response?.data?.code === "00") {
        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: response.data.message,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response?.data?.message || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 z-50 w-auto sm:w-full sm:max-w-md">
      <div className="bg-white rounded-t-xl shadow-lg border border-gray-200">
        <button
          onClick={toggleChat}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-purple-600 text-white rounded-t-xl hover:bg-purple-700 transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">
            Ask about this recipe
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {isExpanded && (
          <>
            <div
              ref={chatContainerRef}
              className="p-3 sm:p-4 h-48 sm:h-64 md:h-72 overflow-y-auto flex flex-col space-y-2 sm:space-y-3"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 my-auto px-2">
                  <p className="text-sm sm:text-base">
                    Ask any questions about this cocktail recipe!
                  </p>
                  <p className="text-xs sm:text-sm mt-2">Examples:</p>
                  <ul className="text-xs sm:text-sm text-purple-600 space-y-1">
                    <li>"What can I substitute for lime juice?"</li>
                    <li>"Why is the health rating {recipe.healthRating}?"</li>
                    <li>"How can I make this less sweet?"</li>
                  </ul>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-xs sm:max-w-sm p-2 sm:p-3 rounded-lg text-sm sm:text-base leading-relaxed ${
                      message.role === "user"
                        ? "bg-purple-100 text-purple-900 ml-auto"
                        : "bg-gray-100 text-gray-900 mr-auto"
                    }`}
                  >
                    {message.content}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg mr-auto flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 sm:p-4 border-t border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about this recipe..."
                  className="flex-1 p-2 sm:p-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="p-2 sm:p-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeChat;
