import type { Board } from "../../types/board";
import { Button } from "../ui/Button";

type BoardHeaderProps = {
  board: Board;
  onAddColumn?: () => void;
};

export function BoardHeader({ board, onAddColumn }: BoardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-1 pb-2 border-b border-slate-100 mb-2">
      <div className="flex items-start gap-4">
        <span className="text-4xl select-none drop-shadow-sm mt-1">{board.emoji || "📋"}</span>
        <div>
          <div className="font-bold text-2xl text-slate-900 mb-1 flex items-center gap-2">
            {board.name}
          </div>
          {board.description && (
            <div className="text-slate-600 text-base mb-1 max-w-2xl whitespace-pre-line">
              {board.description}
            </div>
          )}
          <div className="flex gap-6 text-sm text-slate-500 mt-1">
            <span>
              <span className="font-semibold text-slate-700">{board.columns?.length ?? 0}</span> Columns
            </span>
            <span>
              <span className="font-semibold text-slate-700">{board.members?.length ?? board._count?.members ?? 0}</span> Members
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-0">
        <Button type="button" className="rounded-xl px-5 py-2" onClick={onAddColumn}>
          + Add Column
        </Button>
      </div>
    </div>
  );
}
