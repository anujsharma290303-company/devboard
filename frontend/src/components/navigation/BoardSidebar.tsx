import { Link, useLocation, useParams } from "react-router-dom";
import { FaTrello, FaUsers, FaCog, FaStream, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

const boardNavItems = [
  { to: "", icon: <FaTrello />, label: "Kanban Board" },
  { to: "members", icon: <FaUsers />, label: "Members" },
  { to: "settings", icon: <FaCog />, label: "Board Settings" },
  { to: "activity", icon: <FaStream />, label: "Activity Feed" },
];

export function BoardSidebar() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!id) return null;

  return (
    <aside
      className={`fixed left-16 top-0 h-screen z-30 bg-sidebar-board border-r border-border transition-all duration-200 ${collapsed ? "w-14" : "w-52"}`}
      style={{
        backgroundImage: "linear-gradient(180deg, rgb(176 107 255 / 0.12) 0%, transparent 40%)",
      }}
    >
      <div className="flex items-center justify-between px-3 py-4 border-b border-border">
        <span className={`font-bold text-text-secondary text-sm transition-all duration-200 ${collapsed ? "hidden" : "block"}`}>Board Menu</span>
        <button
          className="text-text-muted hover:text-primary p-1"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <ul className="flex flex-col gap-2 mt-4 px-2">
        {boardNavItems.map((item) => {
          const to = `/boards/${id}${item.to ? "/" + item.to : ""}`;
          const active = location.pathname === to;
          return (
            <li key={item.label}>
              <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-text-secondary transition-all duration-150 hover:text-text-primary hover:bg-primary/12 ${
                  active ? "rainbow-panel rainbow-glow text-text-primary font-bold" : ""
                } ${collapsed ? "justify-center px-2" : ""}`}
                title={item.label}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
