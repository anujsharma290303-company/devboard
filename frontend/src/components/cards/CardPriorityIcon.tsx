import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

export function CardPriorityIcon({ priority }: { priority?: string }) {
  if (!priority) return null;
  if (priority === "high")
    return <FaArrowUp className="text-priority-high" title="High Priority" />;
  if (priority === "medium")
    return <FaMinus className="text-priority-medium" title="Medium Priority" />;
  if (priority === "low")
    return <FaArrowDown className="text-primary" title="Low Priority" />;
  return null;
}
