import { authApiClient } from "../lib/apiClient";
import type { Comment } from "../types/comment";

export async function fetchComments(cardId: string): Promise<Comment[]> {
  return authApiClient<Comment[]>(`/cards/${cardId}/comments`);
}

export async function createComment(cardId: string, content: string): Promise<Comment> {
  return authApiClient<Comment>(`/cards/${cardId}/comments`, {
    method: "POST",
    body: { content },
  });
}

export async function deleteComment(commentId: string): Promise<void> {
  await authApiClient<void>(`/comments/${commentId}`, {
    method: "DELETE",
  });
}