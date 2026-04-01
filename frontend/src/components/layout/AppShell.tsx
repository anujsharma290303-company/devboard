import { Outlet, useMatch } from "react-router-dom";
import { Navbar } from "./Navbar";
import { GlobalSidebar } from "../navigation/GlobalSidebar";
import { BoardSidebar } from "../navigation/BoardSidebar";

export function AppShell() {
  const isBoardDetail = useMatch("/boards/:id");

  // Sidebar widths (must match sidebar classes)
  const globalSidebarWidth = 64; // w-16
  const boardSidebarWidth = isBoardDetail ? 208 : 0; // w-52

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Fixed Sidebars */}
      <GlobalSidebar />
      {isBoardDetail && <BoardSidebar />}

      {/* Main grid: navbar + content */}
      <div
        className="min-h-screen flex flex-col"
        style={{
          marginLeft: isBoardDetail
            ? `${globalSidebarWidth + boardSidebarWidth}px`
            : `${globalSidebarWidth}px`,
        }}
      >
        {/* Sticky Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main
          className={
            isBoardDetail
              ? "flex-1 flex flex-col overflow-hidden px-0 py-0"
              : "flex-1 flex flex-col mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
          }
          style={{
            minHeight: 0,
            minWidth: 0,
            background: 'inherit',
          }}
        >
          {/* Responsive inner padding for board pages */}
          <div
            className={
              isBoardDetail
                ? "w-full h-full px-4 py-4 sm:px-6 flex-1 flex flex-col"
                : "w-full h-full flex-1 flex flex-col"
            }
            style={{ minHeight: 0, minWidth: 0 }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}