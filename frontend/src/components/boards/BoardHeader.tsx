import type { Board } from "../../types/board";
import { Button } from "../ui/Button";

type BoardHeaderProps = {
  board: Board;
  onAddColumn?: () => void;
};

export function BoardHeader({ board, onAddColumn }: BoardHeaderProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 py-4 rounded-2xl bg-background border border-border shadow-sm mb-2">
      <div className="flex items-start gap-4 flex-wrap">
        <span className="text-4xl select-none mt-1">{board.emoji || "📋"}</span>
        <div>
          <div className="font-bold text-2xl sm:text-3xl text-text-primary mb-1 flex items-center gap-2 flex-wrap">
            {board.name}
          </div>
          {board.description && (
            <div className="text-text-secondary text-base mb-1 max-w-xs sm:max-w-2xl whitespace-pre-line">
              {board.description}
            </div>
          )}
          <div className="flex gap-6 text-sm text-text-muted mt-1">
            <span>
              <span className="font-semibold text-text-secondary">{board.columns?.length ?? 0}</span> Columns
            </span>
            <span>
              <span className="font-semibold text-text-secondary">{board.members?.length ?? board._count?.members ?? 0}</span> Members
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 sm:mt-0 w-full sm:w-auto flex justify-end">
        <Button
          type="button"
          className="rounded-xl px-5 py-2 w-full sm:w-auto bg-primary text-white hover:bg-primary-dark shadow-md"
          onClick={onAddColumn}
        >
          + Add Column
        </Button>
      </div>
    </section>
  );
}
