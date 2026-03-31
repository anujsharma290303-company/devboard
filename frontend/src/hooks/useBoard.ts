import { useQuery } from "@tanstack/react-query";
import { getBoardById } from "../api/boardApi";

export function useBoard(id: string) {
  return useQuery({
    queryKey: ["board", id],
    queryFn: () => getBoardById(id),
    enabled: !!id,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}