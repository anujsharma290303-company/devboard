export interface Comment {
  id: string;
  cardId: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  text: string;
  createdAt: string;
  canDelete?: boolean;
}
