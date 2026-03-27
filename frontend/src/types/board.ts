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

export type Board = {
  id: string
  name: string
  description: string | null
  emoji: string
  ownerId: string
  createdAt: string
  updatedAt: string
  _count: BoardCount
  members?: BoardMember[]
}

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