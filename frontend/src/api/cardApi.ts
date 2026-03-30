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
