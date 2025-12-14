import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { privateFetch } from "../utility/fetchFunction";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";

export const useCollections = () => {
  const queryClient = useQueryClient();
  const userId = useUserStore.getState().user?.id;
  console.log(userId, "user");

  const {
    data: collections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await privateFetch.get(`collections/${userId}`);
      return response.data.collections;
    },
  });

  const createCollectionMutation = useMutation({
    mutationFn: (data) =>
      privateFetch.request({
        method: "POST",
        url: "collection",
        data: {
          name: data.name,
          userId,
        },
      }),
    onSuccess: (response) => {
      toast.success("Collection created");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      return response.data.collection;
    },
  });

  const saveToCollectionMutation = useMutation({
    mutationFn: (data) => {
      // Check if we're passing a cocktail object or just an ID
      const payload =
        typeof data.cocktailId === "object"
          ? {
              cocktail: data.cocktailId, // The entire recipe object
              collectionName: data.collection.name,
              userId,
            }
          : {
              cocktailId: data.cocktailId, // Just the ID
              collectionName: data.collection.name,
              userId,
            };

      return privateFetch.request({
        method: "POST",
        url: "cocktail/save-to-collection",
        data: payload,
      });
    },
    onSuccess: (res) => {
      if (res.data?.code === "00") {
        toast.success("Added to collection");
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        return res.data;
      }
      throw new Error("Failed to add to collection");
    },
  });

  // Add deleteCollection mutation
  const deleteCollectionMutation = useMutation({
    mutationFn: (collectionId) =>
      privateFetch.request({
        method: "DELETE",
        url: `cocktail/collection/${collectionId}`,
      }),
    onSuccess: () => {
      toast.success("Collection deleted");
      queryClient.invalidateQueries({ queryKey: ["collections"] }); // Refresh the collections list
    },
    onError: (error) => {
      toast.error("Delete failed");
      console.error("Delete collection error:", error);
    },
  });

  return {
    collections,
    isLoading,
    error,
    createCollection: createCollectionMutation.mutate,
    isCreating: createCollectionMutation.isLoading,
    saveToCollection: saveToCollectionMutation.mutate,
    isSavingToCollection: saveToCollectionMutation.isLoading,
    deleteCollection: deleteCollectionMutation.mutate, // Add this
    isDeleting: deleteCollectionMutation.isLoading, // Add this
  };
};
