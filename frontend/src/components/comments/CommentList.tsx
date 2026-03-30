
import type { Comment } from "../../types/comment";
import { CommentItem } from "./CommentItem";

type Props = {
  comments: Comment[] | undefined;
  isLoading: boolean;
  error: Error | null;
};

export function CommentList({ comments, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="text-sm text-slate-400">
        Loading comments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Failed to load comments
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-sm italic text-slate-400">
        No comments yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
