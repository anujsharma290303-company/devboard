import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../api/commentApi";
import type { Comment } from "../types/comment";
import { useAuth } from "../context/useAuth";

export function useCardComments(cardId: string) {
  const { accessToken } = useAuth();
  return useQuery<Comment[]>({
    queryKey: ["comments", cardId],
    queryFn: () => fetchComments(cardId, accessToken || ""),
    enabled: !!cardId && !!accessToken,
  });
}
