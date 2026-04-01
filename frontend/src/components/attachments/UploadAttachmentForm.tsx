import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import { FormError } from "../ui/FormError";
import { useUploadAttachment } from "../../hooks/useUploadAttachment";

type Props = {
  cardId: string;
};

export function UploadAttachmentForm({ cardId }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadMutation = useUploadAttachment(cardId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!cardId) {
      setError("Card is not ready yet. Please reopen the modal and try again.");
      return;
    }
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select a file.");
      return;
    }
    try {
      await uploadMutation.mutateAsync(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError((err as Error)?.message || "Failed to upload file.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <input
        ref={fileInputRef}
        type="file"
        className="block w-full rounded-xl border border-border bg-surface/80 px-3 py-2 text-sm text-text-secondary file:mr-4 file:rounded-lg file:border file:border-primary/40 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#c996ff] hover:file:bg-primary/25"
        disabled={uploadMutation.isPending || !cardId}
        aria-label="Upload file"
      />
      {error && <FormError>{error}</FormError>}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={uploadMutation.isPending || !cardId}
          loading={uploadMutation.isPending}
        >
          Upload
        </Button>
      </div>
    </form>
  );
}
