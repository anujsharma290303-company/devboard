import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumn } from "../api/columnApi";

export function useCreateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, title }: { boardId: string; title: string }) =>
      createColumn(boardId, { title }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
}