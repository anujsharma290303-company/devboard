import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../api/cardApi";

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      title,
      // boardId is not needed here
    }: {
      columnId: string;
      title: string;
      // boardId: string; // not needed
    } & { boardId: string }) => createCard(columnId, { title }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["board", variables.boardId] });
    },
  });
}