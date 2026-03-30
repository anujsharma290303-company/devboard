import {  useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { useCreateLabel } from "../../hooks/useCreateLabel";
import { useAttachLabelToCard } from "../../hooks/useAttachLabelToCard";

type Props = {
  open: boolean;
  onClose: () => void;
  boardId: string;
  cardId: string;
};

const COLORS = [
  "#ef4444", // red
  "#f59e0b", // amber
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#64748b", // slate
];

export function CreateLabelModal({
  open,
  onClose,
  boardId,
  cardId,
}: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  const createLabelMutation = useCreateLabel();
  const attachLabelMutation = useAttachLabelToCard();



  // Reset state only when modal closes, not in effect
  const handleClose = () => {
    setName("");
    setColor(COLORS[0]);
    setError(null);
    createLabelMutation.reset();
    attachLabelMutation.reset();
    onClose();
  };

  const isLoading =
    createLabelMutation.isPending || attachLabelMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Label name is required.");
      return;
    }

    if (!color) {
      setError("Please select a color.");
      return;
    }

    try {
      const newLabel = await createLabelMutation.mutateAsync({
        boardId,
        name: trimmedName,
        color,
      });

      await attachLabelMutation.mutateAsync({
        cardId,
        labelId: newLabel.id,
      });

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create label");
    }
  };

  return (
    <Modal isOpen={open} onClose={handleClose} title="Create Label">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormError>{error || undefined}</FormError>

        <Input
          label="Label Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          autoFocus
          theme="light"
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Color
          </label>

          <div className="flex flex-wrap gap-3">
            {COLORS.map((swatch) => {
              const isSelected = color === swatch;

              return (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    isSelected
                      ? "scale-110 border-slate-900"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: swatch }}
                  aria-label={`Select color ${swatch}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}