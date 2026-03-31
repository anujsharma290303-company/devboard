import { Button } from "../ui/Button";

export function ColumnsEmptyState({ onCreateColumn }: { onCreateColumn?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-800 p-8 animate-[fadeIn_0.3s_ease]">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg">
        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      </div>
      <div className="font-semibold text-xl text-white mb-2 tracking-tight">No columns yet</div>
      <div className="text-slate-400 mb-6 text-center max-w-sm text-sm">
        Start building your workflow by creating the first column for this board.
      </div>
      <Button type="button" onClick={onCreateColumn} className="shadow-lg shadow-indigo-500/20">
        Create First Column
      </Button>
    </div>
  );
}
