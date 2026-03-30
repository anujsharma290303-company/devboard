import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/commentApi";
import { useAuth } from "../context/useAuth";

export function useCreateComment(cardId: string) {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: (content: string) => createComment(cardId, content, accessToken || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", cardId] });
    },
  });
}
