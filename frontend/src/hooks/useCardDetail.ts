import { useQuery } from "@tanstack/react-query";
import { getCard } from "../api/cardApi";

export function useCardDetail(cardId: string | null) {
  return useQuery({
    queryKey: ["card", cardId],
    queryFn: () => getCard(cardId!),
    enabled: !!cardId,
  });
}