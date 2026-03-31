import { Button } from "../ui/Button";

export function ColumnsEmptyState({ onCreateColumn }: { onCreateColumn?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[300px] sm:min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-6 sm:p-8 animate-[fadeIn_0.3s_ease] max-w-xs mx-auto">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-2xl bg-blue-100 flex items-center justify-center border border-blue-200 shadow-lg">
        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      </div>
      <div className="font-semibold text-lg sm:text-xl text-gray-900 mb-2 tracking-tight">No columns yet</div>
      <div className="text-gray-500 mb-5 sm:mb-6 text-center max-w-xs text-sm sm:text-base">
        Start building your workflow by creating the first column for this board.
      </div>
      <Button type="button" onClick={onCreateColumn} className="shadow-lg shadow-indigo-500/20 w-full sm:w-auto">
        Create First Column
      </Button>
    </div>
  );
}
