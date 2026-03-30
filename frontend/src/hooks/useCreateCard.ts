import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../api/cardApi";

export type CreateCardParams = {
  boardId: string;
  columnId: string;
  title: string;
};

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, columnId, title }: CreateCardParams) => {
      await createCard(columnId, { title });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
}
