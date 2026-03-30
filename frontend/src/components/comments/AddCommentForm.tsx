import { useState } from "react";
import { useCreateComment } from "../../hooks/useCreateComment";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";

interface AddCommentFormProps {
  cardId: string;
}

export function AddCommentForm({ cardId }: AddCommentFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createComment = useCreateComment(cardId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!text.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    try {
      await createComment.mutateAsync(text);
      setText("");
    } catch (err) {
      setError((err as Error)?.message || "Failed to add comment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <textarea
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none min-h-[48px]"
        placeholder="Write a comment…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={createComment.isPending}
        maxLength={1000}
        required
      />
      {error && <FormError>{error}</FormError>}
      <div className="flex justify-end">
        <Button type="submit" disabled={createComment.isPending || !text.trim()} loading={createComment.isPending}>
          Add Comment
        </Button>
      </div>
    </form>
  );
}
