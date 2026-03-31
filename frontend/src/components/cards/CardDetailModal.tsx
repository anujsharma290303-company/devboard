
import { Modal } from "../ui/Modal";
import type { Card } from "../../types/board";
import { Button } from "../ui/Button";
import { LabelBadge } from "../labels/LabelBadge";
import { CreateLabelModal } from "../labels/CreateLabelModal";
import { useState } from "react";
import { useCardComments } from "../../hooks/useCardComments";
import { CommentList } from "../comments/CommentList";
import { AddCommentForm } from "../comments/AddCommentForm";
import { useCardAttachments } from "../../hooks/useCardAttachments";
import { useDeleteAttachment } from "../../hooks/useDeleteAttachment";
import { UploadAttachmentForm } from "../attachments/UploadAttachmentForm";
import { AttachmentList } from "../attachments/AttachmentList";

type Props = {
  open: boolean;
  onClose: () => void;
  card: Card | null;
  columnTitle?: string;
  boardId: string;
};

export function CardDetailModal({ open, onClose, card, columnTitle, boardId }: Props) {
  const [isLabelModalOpen, setLabelModalOpen] = useState(false);
  // Always call hooks unconditionally
  const {
    data: comments,
    isLoading,
    error,
  } = useCardComments(card?.id ?? "");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Attachments hooks
  const {
    data: attachments,
    isLoading: attachmentsLoading,
    error: attachmentsError,
  } = useCardAttachments(card?.id ?? "");
  const deleteAttachmentMutation = useDeleteAttachment(card?.id ?? "");

  const handleDeleteAttachment = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAttachmentMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (!card) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title={card.title}>
      <div className="flex flex-col gap-6 min-w-0 w-full max-w-full sm:max-w-lg px-2 sm:px-0">
        {/* Labels Section */}
        <section>
          <div className="font-semibold text-base mb-1">Labels</div>
          {card.labels && card.labels.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-2">
              {card.labels.map((label) => (
                <LabelBadge key={label.id} name={label.name} color={label.color} />
              ))}
            </div>
          ) : (
            <div className="italic text-slate-400 mb-2">No labels added yet.</div>
          )}
          <Button
            type="button"
            variant="secondary"
            className="mt-1 py-1 px-3 text-sm"
            onClick={() => setLabelModalOpen(true)}
          >
            + Add Label
          </Button>
        </section>

        {/* Description Section */}
        <section>
          <div className="font-semibold text-base mb-1">Description</div>
          {card.description && card.description.trim() ? (
            <div className="text-slate-700 whitespace-pre-line">{card.description}</div>
          ) : (
            <div className="italic text-slate-400">No description added yet.</div>
          )}
        </section>


        {/* Comments Section */}
        <section className="pt-4 border-t border-slate-100">
          <div className="font-semibold text-base mb-3">Comments</div>
          <div className="flex flex-col gap-4">
            <AddCommentForm cardId={card.id} />
            <CommentList
              comments={comments}
              isLoading={isLoading}
              error={error instanceof Error ? error : null}
            />
          </div>
        </section>


        {/* Attachments Section */}
        <section className="pt-4 border-t border-slate-100">
          <div className="font-semibold text-base mb-3">Attachments</div>
          <UploadAttachmentForm cardId={card.id} />
          <AttachmentList
            attachments={attachments}
            isLoading={attachmentsLoading}
            error={attachmentsError instanceof Error ? attachmentsError : null}
            onDelete={handleDeleteAttachment}
            deletingId={deletingId}
          />
        </section>

        {/* Column Section */}
        <section>
          <div className="font-semibold text-base mb-1">Column</div>
          <div className="text-slate-700">{columnTitle || <span className="italic text-slate-400">Unknown</span>}</div>
        </section>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      {/* CreateLabelModal integration */}
      {/* Pass boardId from columnTitle context if available, otherwise require parent to pass boardId as prop */}
      {/* For now, assume CardDetailModal is only used from ColumnCard, so pass boardId as a prop to CardDetailModal and use it here */}
      <CreateLabelModal
        open={isLabelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        boardId={boardId}
        cardId={card.id}
      />
    </Modal>
  );
}
