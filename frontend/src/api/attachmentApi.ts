import { apiClient, API_BASE_URL } from "../lib/apiClient";
import type { Attachment } from "../types/attachment";

// GET /cards/:id/attachments
export async function getCardAttachments(cardId: string, token: string): Promise<Attachment[]> {
  return apiClient<Attachment[]>(`/cards/${cardId}/attachments`, { token });
}

// POST /cards/:id/attachments (multipart/form-data)
export async function uploadAttachment(cardId: string, file: File, token: string): Promise<Attachment> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/cards/${cardId}/attachments`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to upload attachment");
  }

  return response.json();
}

// DELETE /attachments/:id
export async function deleteAttachment(attachmentId: string, token: string): Promise<void> {
  await apiClient<void>(`/attachments/${attachmentId}`, {
    method: "DELETE",
    token,
  });
}
