import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { useCreateColumn } from "../../hooks/useCreateColumn";

type Props = {
  open: boolean;
  onClose: () => void;
  boardId: string;
};

export function CreateColumnModal({ open, onClose, boardId }: Props) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate, status, error: mutationError, reset } = useCreateColumn();

  useEffect(() => {
    if (!open) {
      setTitle("");
      setError(null);
      reset();
    }
  }, [open, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Column title is required.");
      return;
    }
    mutate(
      { boardId, title: trimmed },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const isLoading = status === "pending";
  const isError = status === "error";

  return (
    <Modal isOpen={open} onClose={onClose} title="Create Column">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 w-full px-2 sm:px-0">
        <FormError>
          {error || (isError && mutationError instanceof Error ? mutationError.message : undefined)}
        </FormError>
        <Input
          label="Column Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          disabled={isLoading}
          error={error ?? undefined}
        />
        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Create Column
          </Button>
        </div>
      </form>
    </Modal>
  );
}
