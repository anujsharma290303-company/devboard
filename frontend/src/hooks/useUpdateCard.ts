import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "../api/cardApi";

export function useUpdateCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId: string;
      payload: Partial<{ title: string; description: string; priority: string }>;
    }) => updateCard(cardId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}