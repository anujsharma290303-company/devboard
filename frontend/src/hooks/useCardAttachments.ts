import { useQuery } from "@tanstack/react-query";
import { getCardAttachments } from "../api/attachmentApi";
import type { Attachment } from "../types/attachment";
import { useAuth } from "../context/useAuth";

export function useCardAttachments(cardId: string) {
  const { accessToken } = useAuth();
  return useQuery<Attachment[]>({
    queryKey: ["attachments", cardId],
    queryFn: () => getCardAttachments(cardId),
    enabled: !!cardId && !!accessToken,
  });
}
