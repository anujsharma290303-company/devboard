import { apiClient } from "../lib/apiClient";
import type { Comment } from "../types/comment";

// Accept token as parameter for all requests
export async function fetchComments(cardId: string, token: string): Promise<Comment[]> {
  return apiClient<Comment[]>(`/cards/${cardId}/comments`, {
    token,
  });
}

export async function createComment(cardId: string, content: string, token: string): Promise<Comment> {
  return apiClient<Comment>(`/cards/${cardId}/comments`, {
    method: "POST",
    body: { content },
    token,
  });
}
