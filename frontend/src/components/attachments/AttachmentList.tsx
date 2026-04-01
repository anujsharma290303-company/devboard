import type { Attachment } from "../../types/attachment";
import { AttachmentItem } from "./AttachmentItem";

type Props = {
  attachments?: Attachment[];
  isLoading: boolean;
  error: Error | null;
  onDelete?: (id: string) => void;
  deletingId?: string | null;
};

export function AttachmentList({ attachments, isLoading, error, onDelete, deletingId }: Props) {
  if (isLoading) {
    return <div className="text-sm text-text-muted">Loading attachments...</div>;
  }
  if (error) {
    return <div className="text-sm text-[#ff96b9]">Failed to load attachments</div>;
  }
  if (!attachments || attachments.length === 0) {
    return <div className="text-sm italic text-text-muted">No attachments yet.</div>;
  }
  return (
    <div className="flex flex-col gap-3">
      {attachments.map((att) => (
        <AttachmentItem
          key={att.id}
          attachment={att}
          onDelete={onDelete}
          deleting={deletingId === att.id}
        />
      ))}
    </div>
  );
}
