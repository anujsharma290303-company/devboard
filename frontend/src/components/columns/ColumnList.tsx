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
    <div
      className="flex gap-3 pb-4 items-start"
      style={{ overflowX: "auto", overflowY: "visible" }}
    >
      {columns.map((column) => (
        <ColumnCard
          key={column.id}
          column={column}
          dndEnabled={dndEnabled}
        />
      ))}
    </div>
  );
}