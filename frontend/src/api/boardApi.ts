import { authApiClient } from '../lib/apiClient'
import type { Board, CreateBoardPayload, UpdateBoardPayload } from '../types/board'

export async function getBoards(): Promise<Board[]> {
  return authApiClient<Board[]>('/boards')
}

export async function getBoardById(id: string): Promise<Board> {
  return authApiClient<Board>(`/boards/${id}`)
}

export async function createBoard(payload: CreateBoardPayload): Promise<Board> {
  return authApiClient<Board>('/boards', {
    method: 'POST',
    body: payload,
  })
}

export async function updateBoard(id: string, payload: UpdateBoardPayload): Promise<Board> {
  return authApiClient<Board>(`/boards/${id}`, {
    method: 'PATCH',
    body: payload,
  })
}

export async function deleteBoard(id: string): Promise<void> {
  return authApiClient<void>(`/boards/${id}`, {
    method: 'DELETE',
  })
}