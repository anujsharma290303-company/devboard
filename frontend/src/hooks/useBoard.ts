import { useQuery } from "@tanstack/react-query";
import { getBoardById } from "../api/boardApi";

export function useBoard(boardId: string) {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getBoardById(boardId),
    enabled: !!boardId,
  });
}
