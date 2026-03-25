# DevBoard Frontend — Copilot Instructions

## 1) Project Name & Purpose

**Project Name:** DevBoard  
**Purpose:** DevBoard is a collaborative Kanban board application (similar to Trello) where users can create boards, manage columns and cards, invite members with role-based permissions, upload files, and collaborate on tasks.

This frontend is built to connect to a custom backend API and must feel production-quality, clean, responsive, and scalable.

### Primary Goals
- Build a clean and maintainable React + TypeScript frontend
- Integrate securely with the DevBoard backend API
- Support role-based UI behavior
- Provide a polished Kanban experience with drag-and-drop
- Keep architecture scalable and interview-ready

---

## 2) Core Tech Stack Rules

Use the following stack consistently:

- **React 18+**
- **TypeScript**
- **React Router v6**
- **TanStack Query** for all server-state management
- **Tailwind CSS** for styling
- **Context API** only for lightweight client/global UI state (e.g. auth/session)
- **Fetch API** with a small reusable request helper for network requests
- **@hello-pangea/dnd** for drag-and-drop
- **React Hook Form** (optional if forms become repetitive)
- **Vitest + React Testing Library** for tests (optional later)

### Rules
- Do **not** use Redux, RTK Query, MobX, or Zustand unless explicitly requested later
- Do **not** use Axios as the main data architecture
- Do **not** store server-fetched board/card data in Context
- Use **TanStack Query** for fetching, caching, invalidation, and mutations
- Use environment variables for API base URL
- Avoid unnecessary dependencies

---

## 3) Frontend Architecture Rules

This project must follow a clean separation between:

### A. Server State
Managed only with **TanStack Query**

Examples:
- boards
- board details
- columns
- cards
- comments
- labels
- attachments
- members

### B. Client/UI State
Managed with:
- local `useState`
- `useReducer` if needed
- `Context API` only for small global state like auth/session or theme

Examples:
- modal open/close
- selected card
- sidebar visibility
- drag UI state
- form visibility

### C. Routing
Use **React Router v6** for:
- auth pages
- dashboard
- board pages
- profile/settings pages

---

## 4) Folder Structure Rules

Use this exact frontend structure:

```txt
src/
  api/                # raw API request functions
  components/
    ui/               # generic reusable UI components
    auth/             # auth-specific components
    board/            # board/column components
    card/             # card/detail/attachment components
    layout/           # navbar/sidebar/header/layout wrappers
    member/           # member/invite/role components
  context/            # auth/session context only
  hooks/              # TanStack Query hooks + reusable React hooks
  lib/                # query client, helpers, constants
  pages/              # route-level pages
  styles/             # global or utility styles if needed
  types/              # shared TypeScript types/interfaces
  utils/              # pure utility functions
```

### Folder Rules
- Put **route-level screens** only in `pages/`
- Put **reusable UI** only in `components/`
- Put **API request functions** only in `api/`
- Put **query hooks** only in `hooks/`
- Put **shared types** only in `types/`
- Do not place API calls directly inside components unless extremely small and justified
- Keep feature concerns grouped logically

---

## 5) Naming Conventions

Use these conventions consistently:

### Files
- Components: `PascalCase.tsx`
  - `BoardCard.tsx`
  - `CreateBoardModal.tsx`
- Hooks: `camelCase.ts`
  - `useBoards.ts`
  - `useLogin.ts`
- Context: `PascalCase.tsx`
  - `AuthContext.tsx`
- API files: `camelCase.ts`
  - `authApi.ts`
  - `boardApi.ts`
- Utility files: `camelCase.ts`
  - `formatDate.ts`

### Variables / Functions
- `camelCase`
- Use descriptive names:
  - `handleCreateBoard`
  - `fetchBoardDetails`
  - `isViewer`

### Components
- `PascalCase`
- Keep names feature-specific and meaningful

### Query Keys
Use stable array-based query keys:
- `["boards"]`
- `["board", boardId]`
- `["card", cardId]`
- `["attachments", cardId]`

---

## 6) API Usage Rules

### Base Rules
- All API requests must go through files inside `src/api/`
- Do not scatter raw `fetch()` calls across components
- Components should call **custom hooks**, not raw API functions directly when possible
- Every request must use the configured `API_BASE_URL`

### Auth Rules
- Access token should be stored carefully (temporary frontend implementation can use localStorage/sessionStorage if needed)
- Attach access token to authenticated requests
- Handle unauthorized states gracefully
- Prepare architecture for refresh-token flow if backend supports it

### Error Handling Rules
- Every mutation must show meaningful error states
- Every query should handle:
  - loading
  - error
  - empty state

### Mutation Rules
After create/update/delete:
- use `invalidateQueries`
- or optimistic update when appropriate (especially drag-and-drop)

### File Upload Rules
- Use `FormData`
- Never manually set incorrect `Content-Type` for multipart uploads
- Support:
  - card attachments
  - avatar uploads

---

## 7) TanStack Query Rules

Use TanStack Query for all backend-driven state.

### Queries
Use `useQuery()` for:
- boards
- board details
- card details
- members
- comments
- attachments

### Mutations
Use `useMutation()` for:
- login
- register
- create board
- create card
- move card
- upload attachment
- invite member

### Query Hook Pattern
Every major feature should have its own hook:
- `useBoards`
- `useBoardDetails`
- `useCreateBoard`
- `useCreateCard`
- `useMoveCard`
- `useAttachments`

### Query Rules
- Keep query functions small and focused
- Keep query keys centralized and predictable
- Avoid duplicate fetch logic
- Use optimistic updates only when the UX benefit is meaningful

---

## 8) Component Design Patterns

### General Rules
- Build **small, composable, reusable components**
- Avoid giant page files with too much JSX
- Keep UI and data logic separated where possible

### Recommended Pattern
A page should:
- fetch data using hooks
- compose child components
- manage route-level state

A component should:
- receive props
- render UI
- emit callbacks upward when needed

### Avoid
- deeply nested prop chains when context or composition is better
- mixing all business logic into one component
- inline giant render blocks

### Preferred Component Style
- clean props interface
- early returns for loading/error states
- readable JSX structure
- accessible form labels/buttons

---

## 9) Styling Rules (Tailwind)

Use **Tailwind CSS** consistently.

### Styling Rules
- Prefer utility classes over custom CSS
- Use custom CSS only when utility classes become messy
- Keep spacing/layout consistent
- Prefer clean neutral UI with strong contrast and clear hierarchy

### Design Guidelines
- Use rounded cards and clean shadows
- Maintain generous spacing
- Make board UI feel modern and minimal
- Ensure responsive layout
- Prioritize usability over flashy styling

### Avoid
- inconsistent spacing
- random color usage
- overcomplicated className strings without structure

---

## 9.1) Design System Rules

The UI should follow a clean, modern, minimal product design language.

### Visual Style
- clean SaaS-style dashboard aesthetic
- soft rounded corners
- layered neutral surfaces
- subtle shadows
- strong readability and spacing
- modern but not flashy

### Radius Rules
Prefer:
- `rounded-xl`
- `rounded-2xl`

Avoid:
- sharp boxy corners unless intentional

### Shadow Rules
Prefer:
- `shadow-sm`
- `shadow-md`
- `shadow-lg` only for overlays/modals

Avoid:
- heavy, muddy shadows on everything

### Spacing Rules
Use consistent spacing scale:
- `p-4`, `p-5`, `p-6`
- `gap-3`, `gap-4`, `gap-6`
- `space-y-4`, `space-y-6`

Avoid:
- random uneven spacing
- cramped layouts

### Typography Rules
Use clear hierarchy:
- page titles should feel distinct
- section headings should be obvious
- secondary metadata should be visually quieter

### Surface Hierarchy
Use layered surfaces:
- page background
- card background
- elevated modal/dropdown background

The UI should feel structured and readable, not flat or cluttered.

---

## 10) TypeScript Rules

TypeScript must be used strictly and intentionally.

### Rules
- Type all props explicitly
- Type API responses wherever practical
- Avoid `any`
- Prefer `type` or `interface` consistently
- Create shared domain types in `src/types/`

### Example Shared Types
- `User`
- `Board`
- `Column`
- `Card`
- `Comment`
- `Attachment`
- `BoardMember`
- `Label`

### Component Rules
- Always type component props
- Always type hook returns if needed
- Always type event handlers when useful

### Avoid
- untyped API responses
- implicit `any`
- giant inline object types repeated across files

---

## 10.1) Form UX Rules

Forms must feel clean, responsive, and user-friendly.

### Form Rules
- Every form input must have a visible label
- Required fields should be clear
- Validation errors should be shown inline
- Submit buttons should show loading states
- Disabled states should be visually obvious

### UX Rules
- Do not allow duplicate submissions
- Show meaningful success/error feedback
- Keep forms compact but breathable
- Use proper input types when possible

### Accessibility Rules
- Associate labels with inputs
- Ensure keyboard navigation works properly
- Inputs must have visible focus states

---

## 10.2) Overlay, Modal & Panel Rules

Overlays should feel polished and consistent.

### Rules
- Modals should be centered and responsive
- Large content views (e.g. card details) may use slide-over panels or large dialogs
- All overlays must support:
  - close button
  - ESC key close (if implemented)
  - outside click close when appropriate

### UX Rules
- Overlays should not overflow smaller screens
- Internal content should scroll when necessary
- Opening/closing transitions should feel smooth and quick

### Goal
Overlays should feel product-quality, not improvised.

---

## 11) Auth & RBAC UI Rules

Frontend must respect backend authorization rules.

### Roles
- owner
- admin
- editor
- viewer

### UI Rules
- Viewers should not see edit/create/delete controls
- Editors can create/edit/move cards
- Admins can manage members/settings
- Owners have full control

### Important
Frontend RBAC is only for UX.
**Backend remains the real source of authorization truth.**

Never assume hidden buttons = real security.

---

## 12) Feature Scope Rules

The frontend should support these main features:

### Authentication
- register
- login
- logout
- optional avatar upload

### Boards
- create board
- list boards
- open board
- edit/delete board (role-based)

### Columns
- create
- rename
- reorder
- delete

### Cards
- create
- edit
- delete
- move between columns
- reorder within column
- assign labels
- due date / priority / assignee

### Card Details
- comments
- attachments
- metadata editing

### Members
- invite member
- list members
- update role
- remove member

### File Uploads
- upload attachment
- list attachments
- delete attachment
- avatar upload/update

---

## 13) Drag-and-Drop Rules

Use `@hello-pangea/dnd`.

### Rules
- Drag interactions should feel smooth
- Update UI optimistically if possible
- Persist card moves via backend mutation
- Roll back UI if mutation fails
- Keep drag-and-drop logic isolated and readable

---

## 14) Code Quality Rules

Always optimize for:
- readability
- maintainability
- scalability
- consistency

### Do
- write clean and modular code
- prefer explicit over clever
- keep components focused
- extract repeated logic
- keep naming consistent

### Do Not
- create huge god-components
- mix API logic into every component
- duplicate business logic
- hardcode backend URLs in multiple places

---

## 15) Copilot Output Expectations

When generating code for this project:

- Prefer **clean, production-style React + TypeScript**
- Follow the folder structure exactly
- Use **TanStack Query** for server state
- Use **Tailwind CSS** for styling
- Keep components modular and reusable
- Keep UI clean and modern
- Respect RBAC and real project constraints
- Avoid overengineering
- Default to maintainable code over clever abstractions

When uncertain:
- choose the simpler architecture
- keep files focused
- keep code easy to debug

---

## 16) Responsive Design Rules

This application must be designed as a **fully responsive web app**.

### Required Breakpoints
Design for:
- mobile
- tablet
- laptop
- desktop

### Responsive Principles
- Mobile-first design is preferred
- Layouts must adapt cleanly across screen sizes
- Avoid fixed-width layouts unless absolutely necessary
- Use responsive Tailwind utilities consistently
- Use fluid spacing, flexible widths, and adaptive grids

### Board UI Rules
The Kanban board must remain usable on smaller screens.

Examples:
- Board lists should stack or scroll cleanly on mobile
- Columns may become horizontally scrollable when needed
- Card detail panels/modals must fit small screens properly
- Navigation/sidebar should collapse or adapt on smaller devices

### Avoid
- desktop-only layouts
- overflowing cards/modals
- tiny tap targets
- text that becomes unreadable on smaller screens

### UX Goal
The app should feel intentionally designed for multiple screen sizes, not simply “shrunk down.”

---

## 17) Motion, Interaction & Transition Rules

The frontend should feel **smooth, modern, and polished**.

### UI Motion Principles
Use subtle motion to improve perceived quality and usability.

### Preferred Motion Areas
- modal open/close
- dropdowns
- hover states
- button interactions
- card hover/focus states
- board transitions
- loading skeleton transitions
- drag-and-drop interaction polish

### Rules
- Keep animations subtle and fast
- Prioritize smoothness over flashy effects
- Use transitions to reinforce UI state changes
- Motion should support UX, not distract from it

### Tailwind / Motion Guidance
- Use Tailwind transitions where possible
- Use utility classes like:
  - `transition-all`
  - `duration-200`
  - `ease-in-out`
- If animation becomes more advanced later, Framer Motion may be introduced selectively

### Avoid
- slow animations
- random bouncing effects
- excessive transforms everywhere
- inconsistent motion patterns

### UX Goal
The UI should feel responsive, interactive, and modern — not static or abrupt.

---

## 18) Dynamic UI Behavior Rules

The interface should feel dynamic and state-aware.

### Every screen should account for:
- loading states
- empty states
- error states
- success states
- disabled states

### Required UX Patterns
- Buttons should show disabled/loading states during actions
- Queries should show skeletons or loading indicators
- Empty collections should have useful empty states
- Mutations should update the UI immediately where appropriate
- Interactive elements should visibly respond to user actions

### Goal
The UI should feel alive and informative, not passive or blank.

---

## 18.1) Loading, Empty & Error Presentation Rules

These states should be visually intentional.

### Loading Rules
- Prefer skeletons or subtle loading placeholders over raw text when possible
- Loading states should preserve layout structure

### Empty State Rules
- Empty states should explain what is missing
- Empty states should often include a clear next action

Examples:
- "No boards yet"
- "Create your first board"

### Error State Rules
- Errors should be readable and actionable
- Avoid vague generic text when better context is available

### Goal
Non-happy states should still feel designed and helpful.

---

## 19) Agent-Oriented Development Rules

This project follows an **agent-assisted development workflow**.

### Development Philosophy
Do not build features randomly or in isolation.
Every major feature should first be planned, then executed by specialized agents.

### Agent Workflow
1. Planner Agent defines the feature breakdown
2. Specialized agents execute their part
3. Final implementation must still follow project-wide architecture rules

### Agent Roles
The project should use the following agents:

- **Planner Agent**
  - breaks features into implementation steps
  - defines file-by-file build plan
  - assigns work areas to other agents
  - identifies dependencies before implementation

- **Component Agent**
  - builds reusable UI components
  - ensures clean props and composition

- **CSS / Responsive Agent**
  - handles Tailwind styling
  - ensures responsive layouts
  - ensures visual polish and spacing consistency

- **Data Agent**
  - handles API functions, TanStack Query hooks, and mutation/query architecture

- **Page Agent**
  - assembles route-level pages using components and hooks

- **State Agent** (optional when needed)
  - handles auth/session context and complex local UI state

### Important Rule
All generated code must still follow:
- folder structure rules
- TypeScript rules
- naming conventions
- TanStack Query rules
- responsive design rules

---

## 19.1) Agent Output Format Rules

When agents generate implementation plans or code suggestions, they should structure output clearly.

### Required Planning Format
When planning a feature, agents should provide:

1. Feature goal
2. Required files
3. Responsibilities per file
4. Build order
5. Dependencies / assumptions
6. UI states to support
7. API hooks / mutations needed

### Required Build Behavior
Agents should:
- avoid rewriting unrelated files
- avoid introducing unnecessary abstractions
- prefer extending the existing architecture
- keep files focused and feature-specific

### Goal
Agent outputs should feel like structured engineering work, not generic code dumps.

---

## 20) Workflow & Git Discipline Rules

Development should follow a clean, incremental workflow.

### Rules
- Build one feature at a time
- Prefer small, reviewable changes
- Avoid mixing unrelated features in one implementation step
- Keep file additions intentional and minimal

### Commit Guidance
Commits should be meaningful and feature-focused.

Examples:
- `feat(auth): add login page and auth mutation`
- `feat(board): build board card grid`
- `feat(cards): add create card modal`

### Goal
The project should remain easy to reason about as it grows.