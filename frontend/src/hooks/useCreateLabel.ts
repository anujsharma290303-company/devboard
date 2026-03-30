import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLabel } from "../api/labelApi";
import type { Label } from "../types/board";

type CreateLabelParams = {
  boardId: string;
  name: string;
  color: string;
};

export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation<Label, Error, CreateLabelParams>({
    mutationFn: ({ boardId, name, color }) =>
      createLabel(boardId, { name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });
}