import { authApiClient } from "../lib/apiClient";
import type { Card } from "../types/board";

export async function moveCard(
  cardId: string,
  payload: { columnId: string; position: number }
): Promise<void> {
  await authApiClient(`/cards/${cardId}/move`, {
    method: "PATCH",
    body: { targetColumnId: payload.columnId, position: payload.position },
  });
}

export async function createCard(
  columnId: string,
  payload: { title: string }
): Promise<Card> {
  return authApiClient<Card>(`/columns/${columnId}/cards`, {
    method: "POST",
    body: payload,
  });
}

export async function getCard(cardId: string): Promise<Card> {
  return authApiClient<Card>(`/cards/${cardId}`);
}

export async function updateCard(
  cardId: string,
  payload: Partial<{ title: string; description: string; priority: string; dueDate: string; assigneeId: string }>
): Promise<Card> {
  return authApiClient<Card>(`/cards/${cardId}`, {
    method: "PATCH",
    body: payload,
  });
}