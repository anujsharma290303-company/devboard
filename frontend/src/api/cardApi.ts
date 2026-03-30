// Move card to another column/position
export async function moveCard(
  cardId: string,
  payload: { columnId: string; position: number }
): Promise<void> {
  await authApiClient(`/cards/${cardId}/move`, {
    method: "PATCH",
    body: payload,
  });
}
import { authApiClient } from "../lib/apiClient";

export async function createCard(
  columnId: string,
  payload: { title: string }
): Promise<void> {
  await authApiClient(`/columns/${columnId}/cards`, {
    method: "POST",
    body: payload,
  });
}
