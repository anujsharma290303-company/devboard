import { Button } from "../ui/Button";

export function ColumnsEmptyState({ onCreateColumn }: { onCreateColumn?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[180px] py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
      <div className="text-4xl mb-2">🗂️</div>
      <div className="font-semibold text-lg mb-1">No columns yet</div>
      <div className="text-slate-500 mb-4 text-center max-w-xs">
        Start organizing this board by creating your first column.
      </div>
      <Button type="button" className="rounded-xl px-5 py-2" onClick={onCreateColumn}>
        Create First Column
      </Button>
    </div>
  );
}
