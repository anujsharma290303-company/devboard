import type { Comment } from "../../types/comment";

type Props = {
  comment: Comment;
};

export function CommentItem({ comment }: Props) {
  const authorName =
    comment.author?.name || "Unknown user";

  const formattedDate = new Date(comment.createdAt).toLocaleString();

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">
          {authorName}
        </span>
        <span className="text-xs text-slate-400">
          {formattedDate}
        </span>
      </div>

      <div className="whitespace-pre-line text-sm text-slate-700">
        {comment.text}
      </div>
    </div>
  );
}
