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


// Gemini's curated palette
const PRESET_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#84cc16", // Lime
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#f43f5e", // Rose
];

export function CreateLabelModal({
  open,
  onClose,
  boardId,
  cardId,
}: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[7]); // Default to Blue
  const [error, setError] = useState<string | null>(null);

  const createLabelMutation = useCreateLabel();
  const attachLabelMutation = useAttachLabelToCard();



  // Reset state only when modal closes, not in effect
  const handleClose = () => {
    setName("");
    setColor(PRESET_COLORS[7]);
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
          placeholder="e.g. Bug, Feature, Urgent"
        />

        <div>
          <label className="mb-3 block text-sm font-medium text-text-secondary">
            Select Color
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-6 gap-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Select color ${c}`}
                onClick={() => setColor(c)}
                className={`w-full aspect-square rounded-lg transition-all duration-200 flex items-center justify-center ${
                  color === c 
                    ? "ring-2 ring-offset-2 ring-offset-background scale-110 shadow-lg z-10" 
                    : "hover:scale-105 opacity-70 hover:opacity-100"
                }`}
                style={{ 
                  backgroundColor: c, 
                  boxShadow: color === c ? `0 0 12px ${c}66` : 'none' 
                }}
              >
                {color === c && (
                  <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} disabled={!name.trim() || isLoading}>
            Create Label
          </Button>
        </div>
      </form>
    </Modal>
  );
}