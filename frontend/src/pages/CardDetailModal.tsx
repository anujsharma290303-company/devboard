import { useState } from "react";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { AddCommentForm } from "../components/comments/AddCommentForm";
import { CommentList } from "../components/comments/CommentList";
import { AttachmentList } from "../components/attachments/AttachmentList";
import { UploadAttachmentForm } from "../components/attachments/UploadAttachmentForm";
import { LabelBadge } from "../components/labels/LabelBadge";
import { CreateLabelModal } from "../components/labels/CreateLabelModal";
import { useCardDetail } from "../hooks/useCardDetail";
import { useCardComments } from "../hooks/useCardComments";
import { useCardAttachments } from "../hooks/useCardAttachments";
import { useDeleteAttachment } from "../hooks/useDeleteAttachment";
import type { Card } from "../types/board";

type Props = {
  open: boolean;
  onClose: () => void;
  card: Card | null;
  columnTitle: string;
  boardId: string;
};

export function CardDetailModal({
  open,
  onClose,
  card,
  columnTitle,
  boardId,
}: Props) {
  const [isLabelModalOpen, setLabelModalOpen] = useState(false);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState<string | null>(null);


  const cardId = open && card ? card.id : "";

  const { data: cardDetail, isLoading: cardLoading } = useCardDetail(cardId);

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useCardComments(cardId);

  const {
    data: attachments,
    isLoading: attachmentsLoading,
    error: attachmentsError,
  } = useCardAttachments(cardId);

  const deleteAttachmentMutation = useDeleteAttachment(card?.id ?? "");

  const handleDeleteAttachment = async (id: string) => {
    setDeletingAttachmentId(id);
    try {
      await deleteAttachmentMutation.mutateAsync(id);
    } finally {
      setDeletingAttachmentId(null);
    }
  };

  if (!card) return null;

  const displayCard = cardDetail ?? card;

  return (
    <>
      <Modal
        isOpen={open}
        onClose={onClose}
        title={
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {columnTitle}
            </span>
            <span className="text-lg font-semibold text-slate-900">
              {displayCard.title}
            </span>
          </div>
        }
        className="!items-start !pt-8"
      >
        <div className="flex flex-col gap-6">
          {cardLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton variant="text" className="h-5 w-full" />
              <Skeleton variant="text" className="h-5 w-3/4" />
            </div>
          ) : (
            <>
              {/* Description */}
              {displayCard.description && (
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </div>
                  <p className="whitespace-pre-line text-sm text-slate-700">
                    {displayCard.description}
                  </p>
                </div>
              )}

              {/* Labels */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Labels
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-2 py-1 text-xs"
                    onClick={() => setLabelModalOpen(true)}
                  >
                    + Add Label
                  </Button>
                </div>

                {displayCard.labels && displayCard.labels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayCard.labels.map((label) => (
                      <LabelBadge
                        key={label.id}
                        name={label.name}
                        color={label.color}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-slate-400">No labels yet.</p>
                )}
              </div>

              {/* Attachments */}
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Attachments
                </div>
                <UploadAttachmentForm cardId={card.id} />
                <AttachmentList
                  attachments={attachments ?? []}
                  isLoading={attachmentsLoading}
                  error={attachmentsError as Error | null}
                  onDelete={handleDeleteAttachment}
                  deletingId={deletingAttachmentId}
                />
              </div>

              {/* Comments */}
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Comments
                </div>
                <AddCommentForm cardId={card.id} />
                <CommentList
                  comments={comments ?? []}
                  isLoading={commentsLoading}
                  error={commentsError as Error | null}
                />
              </div>
            </>
          )}
        </div>
      </Modal>

      {isLabelModalOpen && (
        <CreateLabelModal
          open={isLabelModalOpen}
          onClose={() => setLabelModalOpen(false)}
          boardId={boardId}
          cardId={card.id}
        />
      )}
    </>
  );
}