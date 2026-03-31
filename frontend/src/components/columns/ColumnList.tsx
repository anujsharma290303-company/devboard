import type { Column } from "../../types/board";
import { ColumnCard } from "./ColumnCard";
import { ColumnsEmptyState } from "./ColumnsEmptyState";

type ColumnListProps = {
  columns: Column[];
  onCreateColumn?: () => void;
  dndEnabled?: boolean;
};

export function ColumnList({ columns, onCreateColumn, dndEnabled }: ColumnListProps) {
  if (!columns.length) {
    return <ColumnsEmptyState onCreateColumn={onCreateColumn} />;
  }
    return (
      <div className="flex h-full gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden pb-4 pt-2 snap-x snap-mandatory sm:snap-none px-2 sm:px-0">
        {columns.map((column) => (
          <div
            key={column.id}
            className="min-w-[280px] sm:min-w-[320px] max-w-xs flex-shrink-0"
          >
            <ColumnCard
              column={column}
              dndEnabled={dndEnabled}
            />
          </div>
        ))}
      </div>
    );
}
