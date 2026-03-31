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

// Update a column title
export async function updateColumn(
  columnId: string,
  payload: { title: string }
): Promise<void> {
  await authApiClient(`/columns/${columnId}`, {
    method: "PATCH",
    body: payload,
  });
}

// Batch reorder columns
export async function reorderColumns(
  columns: { id: string; position: number }[]
): Promise<void> {
  await authApiClient(`/columns/reorder`, {
    method: "PATCH",
    body: { columns },
  });
}
