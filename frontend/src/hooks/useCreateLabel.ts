import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLabel } from "../api/labelApi";

export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      name,
      color,
    }: {
      boardId: string;
      name: string;
      color: string;
    }) => createLabel(boardId, { name, color }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
}