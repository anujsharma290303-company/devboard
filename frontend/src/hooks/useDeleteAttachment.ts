import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAttachment } from "../api/attachmentApi";

export function useDeleteAttachment(cardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) => deleteAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", cardId] });
    },
  });
}