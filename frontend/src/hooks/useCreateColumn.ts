import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumn } from "../api/columnApi";

export type CreateColumnParams = {
  boardId: string;
  title: string;
};

export function useCreateColumn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ boardId, title }: CreateColumnParams) => {
      await createColumn(boardId, { title });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
}
