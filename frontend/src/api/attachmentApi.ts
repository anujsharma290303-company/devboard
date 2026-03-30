import { authApiClient, API_BASE_URL } from "../lib/apiClient";
import { getStoredSession } from "../context/authSession";
import type { Attachment } from "../types/attachment";

export async function getCardAttachments(cardId: string): Promise<Attachment[]> {
  return authApiClient<Attachment[]>(`/cards/${cardId}/attachments`);
}

export async function uploadAttachment(cardId: string, file: File): Promise<Attachment> {
  const session = getStoredSession();
  const token = session?.accessToken;
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

export async function deleteAttachment(attachmentId: string): Promise<void> {
  await authApiClient<void>(`/attachments/${attachmentId}`, {
    method: "DELETE",
  });
}