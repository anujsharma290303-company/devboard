import { authApiClient } from "../lib/apiClient";
import type { Label } from "../types/board";

export async function createLabel(
  boardId: string,
  payload: { name: string; color: string }
): Promise<Label> {
  return authApiClient<Label>(`/boards/${boardId}/labels`, {
    method: "POST",
    body: payload,
  });
}

export async function attachLabelToCard(
  cardId: string,
  labelId: string | number
): Promise<void> {
  await authApiClient<void>(`/cards/${cardId}/labels`, {
    method: "POST",
    body: { labelId },
  });
}