import type { Attachment } from "../../types/attachment";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/Button";
// Utility for readable file size
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

type Props = {
  attachment: Attachment;
  onDelete?: (id: string) => void;
  deleting?: boolean;
};

export function AttachmentItem({ attachment, onDelete, deleting }: Props) {
  const handleDownload = () => {
    window.open(attachment.storedPath, "_blank");
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium text-slate-800 truncate">{attachment.originalName}</span>
        <span className="text-xs text-slate-500">
          {formatBytes(attachment.sizeBytes)} &middot;{" "}
          {formatDistanceToNow(new Date(attachment.createdAt), { addSuffix: true })}
        </span>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <Button
          type="button"
          variant="secondary"
          className="text-blue-600 px-2"
          onClick={handleDownload}
          title="Open/Download"
        >
          Download
        </Button>
        {onDelete && (
          <Button
            type="button"
            variant="danger"
            className="text-red-500 px-2"
            onClick={() => onDelete(attachment.id)}
            disabled={deleting}
            title="Delete"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
