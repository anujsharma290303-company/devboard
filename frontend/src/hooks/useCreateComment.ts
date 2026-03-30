import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/commentApi";

export function useCreateComment(cardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createComment(cardId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", cardId] });
    },
  });
}