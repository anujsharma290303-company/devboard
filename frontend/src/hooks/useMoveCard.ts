import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCard } from "../api/cardApi";

interface MoveCardParams {
  cardId: string;
  columnId: string;
  position: number;
}

export function useMoveCard(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, columnId, position }: MoveCardParams) =>
      moveCard(cardId, { columnId, position }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}
