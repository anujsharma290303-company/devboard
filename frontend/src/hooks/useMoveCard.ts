import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCard } from "../api/cardApi";
import type { Board } from "../types/board";

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

    onMutate: async ({ cardId, columnId, position }) => {
      await queryClient.cancelQueries({ queryKey: ["board", boardId] });

      const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

      if (!previousBoard?.columns) {
        return { previousBoard };
      }

      const updatedBoard: Board = structuredClone(previousBoard);

      let sourceColumnIndex = -1;
      let sourceCardIndex = -1;


      const columns = updatedBoard.columns ?? [];
      for (let i = 0; i < columns.length; i++) {
        const cardIndex = columns[i].cards.findIndex(
          (card) => card.id === cardId
        );

        if (cardIndex !== -1) {
          sourceColumnIndex = i;
          sourceCardIndex = cardIndex;
          break;
        }
      }

      const destinationColumnIndex = columns.findIndex(
        (column) => column.id === columnId
      );

      if (sourceColumnIndex === -1 || destinationColumnIndex === -1) {
        return { previousBoard };
      }


      const sourceColumn = columns[sourceColumnIndex];
      const destinationColumn = columns[destinationColumnIndex];

      const [movedCard] = sourceColumn.cards.splice(sourceCardIndex, 1);

      if (!movedCard) {
        return { previousBoard };
      }

      destinationColumn.cards.splice(position, 0, movedCard);

      queryClient.setQueryData(["board", boardId], updatedBoard);

      return { previousBoard };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(["board", boardId], context.previousBoard);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}