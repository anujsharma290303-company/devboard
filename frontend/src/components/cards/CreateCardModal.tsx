import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { useCreateCard } from "../../hooks/useCreateCard";

type Props = {
  open: boolean;
  onClose: () => void;
  boardId: string;
  columnId: string;
};

export function CreateCardModal({ open, onClose, boardId, columnId }: Props) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate, status, error: mutationError, reset } = useCreateCard();


  // Remove effect, handle reset on close
  const handleClose = () => {
    setTitle("");
    setError(null);
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Card title is required.");
      return;
    }
    mutate(
      { boardId, columnId, title: trimmed },
      {
        onSuccess: handleClose,
      }
    );
  };

  const isLoading = status === "pending";
  const isError = status === "error";

  return (
    <Modal isOpen={open} onClose={handleClose} title="Create Card">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
        <FormError>
          {error || (isError && mutationError instanceof Error ? mutationError.message : undefined)}
        </FormError>
        <Input
          label="Card Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          disabled={isLoading}
          error={error ?? undefined}
          theme="light"
        />
        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Create Card
          </Button>
        </div>
      </form>
    </Modal>
  );
}
