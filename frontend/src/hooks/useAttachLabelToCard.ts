import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attachLabelToCard } from "../api/labelApi";

type AttachLabelParams = {
  cardId: string;
  labelId: string | number;
};

export function useAttachLabelToCard() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AttachLabelParams>({
    mutationFn: ({ cardId, labelId }) => attachLabelToCard(cardId, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });
}