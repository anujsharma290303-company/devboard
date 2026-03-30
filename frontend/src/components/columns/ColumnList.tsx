import type { Column } from "../../types/board";
import { ColumnCard } from "./ColumnCard";
import { ColumnsEmptyState } from "./ColumnsEmptyState";

type ColumnListProps = {
  columns: Column[];
  onCreateColumn?: () => void;
};

export function ColumnList({ columns, onCreateColumn }: ColumnListProps) {
  if (!columns.length) {
    return <ColumnsEmptyState onCreateColumn={onCreateColumn} />;
  }
  return (
    <div className="flex gap-6 min-h-[180px] pb-2 overflow-x-auto">
      {columns.map((column) => (
        <ColumnCard key={column.id} column={column} />
      ))}
    </div>
  );
}
