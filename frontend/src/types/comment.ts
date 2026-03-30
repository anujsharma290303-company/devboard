export interface Comment {
  id: string;
  cardId: string;
  user: {
    id: string;
    displayName: string;
    email: string;
    avatarPath?: string | null;
  };
  content: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt?: string;
}