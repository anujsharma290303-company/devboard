import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAttachment } from "../api/attachmentApi";
import { useAuth } from "../context/useAuth";

export function useUploadAttachment(cardId: string) {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: (file: File) => uploadAttachment(cardId, file, accessToken || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", cardId] });
    },
  });
}
