import { useParams } from "react-router-dom";
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import { useBoard } from "../hooks/useBoard";
import { useMoveCard } from "../hooks/useMoveCard";

import { BoardDetailsSkeleton } from "../components/boards/BoardDetailsSkeleton";
import { BoardHeader } from "../components/boards/BoardHeader";
import { ColumnList } from "../components/columns/ColumnList";
import { CreateColumnModal } from "../components/columns/CreateColumnModal";

export default function BoardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);

  // Quick filter state (UI only, not functional yet)
  const [filter, setFilter] = useState({
    myIssues: false,
    recentlyUpdated: false,
    priority: "",
    label: "",
  });

  const { data: board, isLoading, isError, error } = useBoard(id ?? "");
  const moveCardMutation = useMoveCard(id ?? "");

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    moveCardMutation.mutate({
      cardId: draggableId,
      columnId: destination.droppableId,
      position: destination.index,
    });
  };

  if (!id) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-2 text-3xl">😕</div>
        <div className="mb-1 text-lg font-semibold text-text-primary">
          Board not found
        </div>
        <div className="text-sm text-text-muted">
          No board ID provided in the URL.
        </div>
      </div>
    );
  }

  if (isLoading || !board) return <BoardDetailsSkeleton />;

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="mb-2 text-3xl">🚫</div>
        <div className="mb-1 text-lg font-semibold text-text-primary">
          Error loading board
        </div>
        <div className="text-sm text-text-muted">
          {error instanceof Error ? error.message : "Unknown error."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col gap-4 overflow-hidden px-2 py-2">
      <BoardHeader
        board={board}
        onAddColumn={() => setColumnModalOpen(true)}
      />

      {/* Quick Filter Bar (UI only) */}
      <div className="rainbow-panel mb-2 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
        <button
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            filter.myIssues
              ? "rainbow-pill"
              : "bg-background text-text-secondary hover:bg-primary/5"
          }`}
          onClick={() => setFilter((f) => ({ ...f, myIssues: !f.myIssues }))}
        >
          Only My Issues
        </button>

        <button
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            filter.recentlyUpdated
              ? "rainbow-pill"
              : "bg-background text-text-secondary hover:bg-primary/5"
          }`}
          onClick={() =>
            setFilter((f) => ({
              ...f,
              recentlyUpdated: !f.recentlyUpdated,
            }))
          }
        >
          Recently Updated
        </button>

        <select
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-text-secondary focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-sm"
          value={filter.priority}
          onChange={(e) =>
            setFilter((f) => ({ ...f, priority: e.target.value }))
          }
        >
          <option value="">Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-text-secondary focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-sm"
          value={filter.label}
          onChange={(e) =>
            setFilter((f) => ({ ...f, label: e.target.value }))
          }
        >
          <option value="">Label</option>
        </select>
      </div>

      <div className="w-full flex-1 overflow-x-auto overflow-y-hidden bg-background rounded-2xl shadow-inner border border-border px-1 pt-2 pb-4">
        <div className="flex min-h-full justify-center">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex min-w-max flex-row gap-6 pb-2">
              <ColumnList
                columns={board.columns ?? []}
                onCreateColumn={() => setColumnModalOpen(true)}
                dndEnabled
              />
            </div>
          </DragDropContext>
        </div>
      </div>

      <CreateColumnModal
        open={isColumnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        boardId={board.id}
      />
    </div>
  );
}