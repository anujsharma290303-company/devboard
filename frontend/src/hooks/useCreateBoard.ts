import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBoard } from '../api/boardApi'
import type { CreateBoardPayload } from '../types/board'

export function useCreateBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBoardPayload) => createBoard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}