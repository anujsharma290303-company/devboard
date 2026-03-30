import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAttachment } from "../api/attachmentApi";

export function useUploadAttachment(cardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAttachment(cardId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", cardId] });
    },
  });
}