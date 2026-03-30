import { useQuery } from "@tanstack/react-query";
import { getCardAttachments } from "../api/attachmentApi";

export function useAttachments(cardId: string | null) {
  return useQuery({
    queryKey: ["attachments", cardId],
    queryFn: () => getCardAttachments(cardId!),
    enabled: !!cardId,
  });
}