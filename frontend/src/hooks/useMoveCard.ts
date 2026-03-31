import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCard } from "../api/cardApi";
import type { Board, Column } from "../types/board";

type MoveCardInput = {
  cardId: string;
  columnId: string;
  position: number;
};

export function useMoveCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, columnId, position }: MoveCardInput) =>
      moveCard(cardId, { columnId, position }),

    onMutate: async ({ cardId, columnId: destColumnId, position }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["board", boardId] });

      // Snapshot the previous value for rollback
      const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

      if (!previousBoard?.columns) {
        return { previousBoard };
      }

      // Deep clone to avoid mutating cached data
      const updatedColumns: Column[] = JSON.parse(
        JSON.stringify(previousBoard.columns)
      );

      // Find source column and card
      let movedCard = null;
      let sourceColIdx = -1;
      let sourceCardIdx = -1;

      for (let i = 0; i < updatedColumns.length; i++) {
        const cardIdx = updatedColumns[i].cards.findIndex((c) => c.id === cardId);
        if (cardIdx !== -1) {
          sourceColIdx = i;
          sourceCardIdx = cardIdx;
          break;
        }
      }

      const destColIdx = updatedColumns.findIndex((c) => c.id === destColumnId);

      if (sourceColIdx === -1 || destColIdx === -1) {
        return { previousBoard };
      }

      // Remove from source
      [movedCard] = updatedColumns[sourceColIdx].cards.splice(sourceCardIdx, 1);

      if (!movedCard) return { previousBoard };

      // Insert into destination at correct position
      updatedColumns[destColIdx].cards.splice(position, 0, movedCard);

      // Set optimistic data
      queryClient.setQueryData<Board>(["board", boardId], {
        ...previousBoard,
        columns: updatedColumns,
      });

      return { previousBoard };
    },

    onError: (_error, _variables, context) => {
      // Roll back on error
      if (context?.previousBoard) {
        queryClient.setQueryData(["board", boardId], context.previousBoard);
      }
    },

    onSettled: () => {
      // Always refetch after mutation to sync with server
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}