import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { privateFetch } from "../../utility/fetchFunction";
import useUserStore from "../../store/useUserStore";

const RecipeChat = ({ recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current && isExpanded) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const streamChat = async (message, recipeContext) => {
    const token = useUserStore.getState().user?.token;
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${baseURL}cocktail/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, recipeContext }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to start streaming chat");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (!data.done) {
                fullMessage += data.content;
                setStreamingMessage(fullMessage);
              }
            } catch (parseError) {
              // Skip malformed JSON
            }
          }
        }
      }

      return fullMessage;
    } catch (error) {
      if (error.name === "AbortError") {
        return null;
      }
      throw error;
    }
  };

  const regularChat = async (message, recipeContext) => {
    const response = await privateFetch.request({
      method: "POST",
      url: "cocktail/chat",
      data: { message, recipeContext },
    });

    if (response?.data?.code === "00") {
      return response.data.message;
    }
    throw new Error(response?.data?.message || "Failed to get response");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      let responseMessage;

      try {
        responseMessage = await streamChat(messageToSend, recipe);
      } catch (streamError) {
        responseMessage = await regularChat(messageToSend, recipe);
      }

      if (responseMessage) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: responseMessage,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Error. Try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  const toggleChat = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 w-auto sm:w-full sm:max-w-md">
      <div className="bg-brutal-white border-4 border-black shadow-brutal-lg">
        {/* Header */}
        <button
          onClick={toggleChat}
          className="w-full flex items-center justify-between p-4 bg-black text-brutal-accent hover:bg-brutal-accent hover:text-black transition-colors"
        >
          <span className="font-display font-bold uppercase text-sm">
            Ask About This Recipe
          </span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
          ) : (
            <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
          )}
        </button>

        {isExpanded && (
          <>
            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="p-4 h-64 overflow-y-auto flex flex-col gap-3 bg-brutal-black/5"
            >
              {messages.length === 0 && !streamingMessage ? (
                <div className="text-center my-auto">
                  <p className="font-mono text-sm text-brutal-disabled uppercase mb-3">
                    Ask about this cocktail
                  </p>
                  <div className="space-y-1 font-mono text-xs text-black/60">
                    <p>"Substitute for lime juice?"</p>
                    <p>"Make it less sweet?"</p>
                    <p>"Why this health rating?"</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[85%] p-3 font-mono text-sm ${
                        message.role === "user"
                          ? "bg-brutal-accent text-black ml-auto border-2 border-black"
                          : "bg-brutal-white text-black mr-auto border-2 border-black"
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                  {streamingMessage && (
                    <div className="max-w-[85%] p-3 font-mono text-sm bg-brutal-white text-black mr-auto border-2 border-black">
                      {streamingMessage}
                      <span className="inline-block w-2 h-4 bg-brutal-accent ml-1 animate-pulse" />
                    </div>
                  )}
                </>
              )}
              {isLoading && !streamingMessage && (
                <div className="bg-brutal-white p-3 mr-auto border-2 border-black flex items-center gap-2">
                  <div className="w-2 h-2 bg-brutal-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-brutal-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-brutal-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t-4 border-black">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 border-4 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:border-brutal-accent bg-white placeholder:text-brutal-disabled"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-black text-brutal-accent p-3 border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" strokeWidth={2.5} />
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
