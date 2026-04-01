import type { Comment } from "../../types/comment";

type Props = {
  comment: Comment;
};

export function CommentItem({ comment }: Props) {
  const authorName = comment.user?.displayName || "Unknown user";
  const formattedDate = new Date(comment.createdAt).toLocaleString();

  return (
    <div className="rainbow-panel rounded-2xl border border-border bg-surface/75 backdrop-blur-md px-4 py-3 shadow-lg">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">{authorName}</span>
        <span className="text-xs text-text-muted">{formattedDate}</span>
      </div>
      <div className="whitespace-pre-line text-sm text-text-secondary">
        {comment.content}
      </div>
    </div>
  );
}