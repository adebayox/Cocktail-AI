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

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current && isExpanded) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

  // Focus input when chat is expanded
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

    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call your API with the message and current recipe information
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

        // Add assistant response to chat
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
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
      <div className="bg-white rounded-t-xl shadow-lg">
        <button
          onClick={toggleChat}
          className="w-full flex items-center justify-between p-4 bg-purple-600 text-white rounded-t-xl"
        >
          <span className="font-medium">Ask about this recipe</span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </button>

        {isExpanded && (
          <>
            <div
              ref={chatContainerRef}
              className="p-4 h-64 overflow-y-auto flex flex-col space-y-3"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 my-auto">
                  <p>Ask any questions about this cocktail recipe!</p>
                  <p className="text-sm mt-2">Examples:</p>
                  <ul className="text-sm text-purple-600">
                    <li>"What can I substitute for lime juice?"</li>
                    <li>"Why is the health rating {recipe.healthRating}?"</li>
                    <li>"How can I make this less sweet?"</li>
                  </ul>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-3/4 p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-purple-100 ml-auto"
                        : "bg-gray-100 mr-auto"
                    }`}
                  >
                    {message.content}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="bg-gray-100 p-3 rounded-lg mr-auto flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about this recipe..."
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="w-5 h-5" />
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
