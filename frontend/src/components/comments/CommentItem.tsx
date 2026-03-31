import type { Comment } from "../../types/comment";

type Props = {
  comment: Comment;
};

export function CommentItem({ comment }: Props) {
  const authorName = comment.user?.displayName || "Unknown user";
  const formattedDate = new Date(comment.createdAt).toLocaleString();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md px-4 py-3 shadow-lg">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{authorName}</span>
        <span className="text-xs text-slate-400">{formattedDate}</span>
      </div>
      <div className="whitespace-pre-line text-sm text-slate-300">
        {comment.content}
      </div>
    </div>
  );
}