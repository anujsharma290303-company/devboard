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
      <div className="flex h-full gap-6 overflow-x-auto overflow-y-hidden pb-4 pt-2 snap-x snap-mandatory sm:snap-none">
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
