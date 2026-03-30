import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAttachment } from "../api/attachmentApi";
import { useAuth } from "../context/useAuth";

export function useDeleteAttachment(cardId: string) {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: (attachmentId: string) => deleteAttachment(attachmentId, accessToken || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", cardId] });
    },
  });
}
