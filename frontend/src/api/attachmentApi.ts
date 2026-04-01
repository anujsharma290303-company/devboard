import { authApiClient } from "../lib/apiClient";
import type { Attachment } from "../types/attachment";

export async function getCardAttachments(cardId: string): Promise<Attachment[]> {
  return authApiClient<Attachment[]>(`/cards/${cardId}/attachments`);
}

export async function uploadAttachment(cardId: string, file: File): Promise<Attachment> {
  const formData = new FormData();
  formData.append("file", file);

  return authApiClient<Attachment>(`/cards/${cardId}/attachments`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteAttachment(attachmentId: string): Promise<void> {
  await authApiClient<void>(`/attachments/${attachmentId}`, {
    method: "DELETE",
  });
}