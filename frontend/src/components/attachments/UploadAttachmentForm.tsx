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
        className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        disabled={uploadMutation.isPending}
        aria-label="Upload file"
      />
      {error && <FormError>{error}</FormError>}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={uploadMutation.isPending}
          loading={uploadMutation.isPending}
        >
          Upload
        </Button>
      </div>
    </form>
  );
}
