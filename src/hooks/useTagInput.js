import { useState, useCallback } from "react";

export const useTagInput = (initialTags = []) => {
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState("");

  const addTag = useCallback(() => {
    if (input.trim() && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()]);
      setInput("");
    }
  }, [input, tags]);

  const removeTag = useCallback(
    (tagToRemove) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags]
  );

  // Add this new clearAll function
  const clearAll = useCallback(() => {
    setTags([]);
  }, []);

  return {
    tags,
    setTags,
    input,
    setInput,
    addTag,
    removeTag,
    clearAll, // Export the new clearAll function
  };
};
