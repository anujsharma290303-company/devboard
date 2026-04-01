import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCard } from "../api/cardApi";
import type { Board, Column } from "../types/board";

type MoveCardInput = {
  cardId: string;
  columnId: string;
  position: number;
  sourceColumnId: string;
  sourceIndex: number;
};

export function useMoveCard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, columnId, position }: MoveCardInput) =>
      moveCard(cardId, { columnId, position }),

    onMutate: async ({
      cardId,
      columnId: destColumnId,
      position,
      sourceColumnId,
      sourceIndex,
    }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["board", boardId] });

      // Snapshot the previous value for rollback
      const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

      if (!previousBoard?.columns) {
        console.warn("[MOVE_CARD] Missing board cache for optimistic update", {
          boardId,
          cardId,
          destColumnId,
          position,
        });
        return { previousBoard };
      }

      // Deep clone to avoid mutating cached data
      const updatedColumns: Column[] = JSON.parse(
        JSON.stringify(previousBoard.columns)
      );

      const sourceColIdx = updatedColumns.findIndex((c) => c.id === sourceColumnId);

      const destColIdx = updatedColumns.findIndex((c) => c.id === destColumnId);

      if (sourceColIdx === -1 || destColIdx === -1) {
        console.warn("[MOVE_CARD] Source or destination column not found", {
          boardId,
          cardId,
          sourceColumnId,
          destColumnId,
        });
        return { previousBoard };
      }

      const sourceCards = updatedColumns[sourceColIdx].cards;
      const fallbackSourceIndex = sourceCards.findIndex((c) => c.id === cardId);
      const sourceCardIdx =
        sourceIndex >= 0 &&
        sourceIndex < sourceCards.length &&
        sourceCards[sourceIndex]?.id === cardId
          ? sourceIndex
          : fallbackSourceIndex;

      let movedCard = null;
      [movedCard] = sourceCards.splice(sourceCardIdx, 1);

      if (!movedCard) {
        console.warn("[MOVE_CARD] Card not found in source during optimistic move", {
          boardId,
          cardId,
          sourceColumnId,
          sourceIndex,
        });
        return { previousBoard };
      }

      // Insert into destination at correct position
      const destinationCards = updatedColumns[destColIdx].cards;
      const safePosition = Math.max(0, Math.min(position, destinationCards.length));
      destinationCards.splice(safePosition, 0, {
        ...movedCard,
        columnId: destColumnId,
      });

      console.info("[MOVE_CARD] Optimistic move applied", {
        boardId,
        cardId,
        from: sourceColumnId,
        to: destColumnId,
        position: safePosition,
      });

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

      console.error("[MOVE_CARD] Failed, rolled back", {
        boardId,
        variables: _variables,
        error: _error,
      });
    },

    onSuccess: () => {
      console.info("[MOVE_CARD] Server move succeeded", { boardId });
    },

    onSettled: () => {
      // Always refetch after mutation to sync with server
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}