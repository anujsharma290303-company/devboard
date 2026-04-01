
import { Modal } from "../ui/Modal";
import type { Card } from "../../types/board";
import { Button } from "../ui/Button";
import { LabelBadge } from "../labels/LabelBadge";
import { CreateLabelModal } from "../labels/CreateLabelModal";
import { useState } from "react";
import { CardAssignee } from "./CardAssignee";
import { CardPriorityIcon } from "./CardPriorityIcon";
import ReactMarkdown from "react-markdown";
import { useCardComments } from "../../hooks/useCardComments";
import { CommentList } from "../comments/CommentList";
import { AddCommentForm } from "../comments/AddCommentForm";
import { useCardAttachments } from "../../hooks/useCardAttachments";
import { useDeleteAttachment } from "../../hooks/useDeleteAttachment";
import { UploadAttachmentForm } from "../attachments/UploadAttachmentForm";
import { AttachmentList } from "../attachments/AttachmentList";
import { useEffect } from "react";
import type { BoardMemberUser } from "../../types/board";
import { useUpdateCard } from "../../hooks/useUpdateCard";

type Props = {
  open: boolean;
  onClose: () => void;
  card: Card | null;
  columnTitle?: string;
  boardId: string;
};

type CardWithMeta = Card & {
  assignee?: BoardMemberUser | null;
  priority?: string;
};

export function CardDetailModal({ open, onClose, card, columnTitle, boardId }: Props) {
  const [isLabelModalOpen, setLabelModalOpen] = useState(false);
  const [isEditingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState<string>("");
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const cardId = card?.id ?? "";

  // Always call hooks unconditionally
  const {
    data: comments,
    isLoading,
    error,
  } = useCardComments(cardId);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Attachments hooks
  const {
    data: attachments,
    isLoading: attachmentsLoading,
    error: attachmentsError,
  } = useCardAttachments(cardId);
  const deleteAttachmentMutation = useDeleteAttachment(cardId);
  const updateCardMutation = useUpdateCard(boardId);

  // Ensure nested modal state is reset when parent closes.
  useEffect(() => {
    if (!open) {
      setLabelModalOpen(false);
    }
  }, [open]);

  if (!card) return null;

  // Temporary metadata until these fields are part of the shared Card type.
  const cardWithMeta = card as CardWithMeta;
  const assignee = cardWithMeta.assignee ?? null;
  const priority = cardWithMeta.priority ?? "";

  const handleDeleteAttachment = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAttachmentMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Description edit handlers (demo only, not persisted)
  const startEditDesc = () => {
    setDescValue(card.description || "");
    setEditingDesc(true);
    setShowMarkdownPreview(false);
  };
  const saveDesc = async () => {
    if (!card) return;
    await updateCardMutation.mutateAsync({
      cardId: card.id,
      payload: { description: descValue },
    });
    setEditingDesc(false);
    setShowMarkdownPreview(false);
  };
  const cancelDesc = () => {
    setEditingDesc(false);
    setShowMarkdownPreview(false);
  };

  return (
    <>
    <Modal isOpen={open} onClose={onClose} title={card.title}>
      <div className="flex flex-col lg:flex-row gap-5 min-w-0 w-full max-w-full px-0 sm:px-1">
        {/* Left: Tools */}
        <div className="flex flex-col gap-6 w-full lg:w-72 shrink-0 border border-border lg:border-r lg:border-y-0 lg:border-l-0 rounded-2xl lg:rounded-none lg:pr-5 bg-background/60 py-4 px-3">
          {/* Labels Section */}
          <section>
            <div className="font-semibold text-sm mb-1 text-text-secondary">Labels</div>
            {card.labels && card.labels.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {card.labels.map((label) => (
                  <LabelBadge key={label.id} name={label.name} color={label.color} />
                ))}
              </div>
            ) : (
              <div className="italic text-text-muted mb-2">No labels added yet.</div>
            )}
            <Button
              type="button"
              variant="secondary"
              className="mt-1 py-1 px-3 text-xs"
              onClick={() => setLabelModalOpen(true)}
            >
              + Add Label
            </Button>
          </section>

          {/* Comments Section */}
          <section>
            <div className="font-semibold text-sm mb-2 text-text-secondary">Add Comment</div>
            <AddCommentForm cardId={card.id} />
          </section>

          {/* Attachments Section */}
          <section>
            <div className="font-semibold text-sm mb-2 text-text-secondary">Add Attachment</div>
            <UploadAttachmentForm key={card.id} cardId={card.id} />
          </section>
        </div>


        {/* Right: Card Details */}
        <div className="flex-1 min-w-0 flex flex-col gap-7 py-2 px-1 sm:px-2">
          {/* Meta Section */}
          <section className="flex flex-wrap gap-6 items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-text-secondary">Assignee:</span>
              <CardAssignee user={assignee} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-text-secondary">Priority:</span>
              <CardPriorityIcon priority={priority} />
              <span className="capitalize text-xs text-text-muted">{priority || "None"}</span>
            </div>
          </section>

          {/* Description Section */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <div className="font-semibold text-sm text-text-secondary">Description</div>
              {!isEditingDesc && (
                <Button type="button" size="xs" variant="secondary" onClick={startEditDesc}>
                  Edit
                </Button>
              )}
            </div>
            {isEditingDesc ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="border rounded-xl p-3 text-sm min-h-[80px] bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  value={descValue}
                  onChange={e => setDescValue(e.target.value)}
                  placeholder="Add a description..."
                />
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void saveDesc()}
                    loading={updateCardMutation.isPending}
                  >
                    Save
                  </Button>
                  <Button type="button" size="sm" variant="secondary" onClick={cancelDesc}>Cancel</Button>
                  <Button type="button" size="sm" variant="secondary" onClick={() => setShowMarkdownPreview(v => !v)}>
                    {showMarkdownPreview ? "Hide Preview" : "Preview"}
                  </Button>
                </div>
                {showMarkdownPreview && (
                  <div className="border rounded-xl p-3 bg-background mt-2 text-text-secondary">
                    <ReactMarkdown>{descValue}</ReactMarkdown>
                  </div>
                )}
              </div>
            ) : card.description && card.description.trim() ? (
              <div className="text-text-secondary whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <ReactMarkdown>{card.description}</ReactMarkdown>
              </div>
            ) : (
              <div className="italic text-text-muted">No description added yet.</div>
            )}
          </section>

          {/* Comments List */}
          <section>
            <div className="font-semibold text-sm mb-2 text-text-secondary">All Comments</div>
            <CommentList
              comments={comments}
              isLoading={isLoading}
              error={error instanceof Error ? error : null}
            />
          </section>

          {/* Attachments List */}
          <section>
            <div className="font-semibold text-sm mb-2 text-text-secondary">All Attachments</div>
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
            <div className="font-semibold text-sm mb-1 text-text-secondary">Column</div>
            <div className="text-text-secondary">{columnTitle || <span className="italic text-text-muted">Unknown</span>}</div>
          </section>

          <div className="flex justify-end border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

      </div>
    </Modal>
    <CreateLabelModal
      open={isLabelModalOpen}
      onClose={() => setLabelModalOpen(false)}
      boardId={boardId}
      cardId={card.id}
    />
    </>
  );
}
