import { authApiClient } from "../lib/apiClient";

export async function createColumn(
  boardId: string,
  payload: { title: string }
): Promise<void> {
  await authApiClient(`/boards/${boardId}/columns`, {
    method: "POST",
    body: payload,
  });
}
