import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../api/commentApi";

export function useComments(cardId: string | null) {
  return useQuery({
    queryKey: ["comments", cardId],
    queryFn: () => fetchComments(cardId!),
    enabled: !!cardId,
  });
}