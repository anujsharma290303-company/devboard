import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaColumns, FaUserCircle, FaCogs } from "react-icons/fa";

const navItems = [
  { to: "/dashboard", icon: <FaTachometerAlt />, label: "My Work" },
  { to: "/boards", icon: <FaColumns />, label: "Boards" },
  { to: "/profile", icon: <FaUserCircle />, label: "Profile" },
  { to: "/admin", icon: <FaCogs />, label: "Admin" },
];

export function GlobalSidebar() {
  const location = useLocation();
  return (
    <nav
      className="fixed left-0 top-0 h-screen w-16 bg-sidebar flex flex-col items-center py-4 z-40 shadow-lg border-r border-border"
      style={{
        backgroundImage: "linear-gradient(180deg, rgb(87 178 255 / 0.16) 0%, transparent 34%)",
      }}
    >
      <div className="mb-8 mt-2">
        <Link to="/boards">
          <img src="/logo192.png" alt="DevBoard" className="w-10 h-10 rounded-xl shadow" />
        </Link>
      </div>
      <ul className="flex flex-col gap-6 flex-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`flex flex-col items-center rounded-xl px-2 py-1.5 transition-all duration-150 ${
                location.pathname.startsWith(item.to)
                  ? "rainbow-panel rainbow-glow text-text-primary"
                  : "text-text-muted hover:text-text-primary hover:bg-primary/12"
              }`}
              title={item.label}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
