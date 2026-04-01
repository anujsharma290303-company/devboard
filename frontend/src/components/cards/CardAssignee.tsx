import type { BoardMemberUser } from "../../types/board";

export function CardAssignee({ user }: { user: BoardMemberUser | null | undefined }) {
  if (!user) return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface text-xs text-text-muted font-bold border border-border shadow-sm" title="Unassigned">?
    </span>
  );
  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/30 shadow-sm" title={user.displayName || user.email}>
      {user.avatarPath ? (
        <img src={user.avatarPath} alt={user.displayName || user.email} className="w-7 h-7 rounded-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
