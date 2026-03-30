export type BoardRole = 'owner' | 'admin' | 'editor' | 'viewer'

export type BoardMemberUser = {
  id: string
  displayName: string
  email: string
  avatarPath: string | null
}

export type BoardMember = {
  id: number
  boardId: string
  userId: string
  role: BoardRole
  invitedAt: string
  joinedAt: string | null
  user: BoardMemberUser
}

export type BoardCount = {
  columns: number
  members: number
}


export type Label = {
  id: number | string;
  boardId: string;
  name: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Card = {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  labels?: Label[];
};

export type Column = {
  id: string;
  boardId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  cards: Card[];
};

export type Board = {
  id: string;
  name: string;
  description: string | null;
  emoji: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count: BoardCount;
  members?: BoardMember[];
  columns?: Column[];
};

export type CreateBoardPayload = {
  name: string
  description?: string
  emoji?: string
}

export type UpdateBoardPayload = {
  name?: string
  description?: string
  emoji?: string
}