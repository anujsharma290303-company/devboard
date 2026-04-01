import type { Column } from "../../types/board";
import { ColumnCard } from "./ColumnCard";
import { ColumnsEmptyState } from "./ColumnsEmptyState";

type ColumnListProps = {
  columns: Column[];
  onCreateColumn?: () => void;
  dndEnabled?: boolean;
};

export function ColumnList({
  columns,
  onCreateColumn,
  dndEnabled,
}: ColumnListProps) {
  if (!columns.length) {
    return <ColumnsEmptyState onCreateColumn={onCreateColumn} />;
  }

  return (
    <div className="flex items-start gap-6 pb-2 min-w-max">
      {columns.map((column) => (
        <div key={column.id} className="w-[340px] shrink-0 flex flex-col">
          <ColumnCard column={column} dndEnabled={dndEnabled} />
        </div>
      ))}
    </div>
  );
}