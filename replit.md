# LexDraft - Agentic Document Builder

## Overview

LexDraft is an AI-powered document builder designed for legal professionals. It provides a split-panel interface where users can interact with an AI agent via chat to draft, refine, and export legal documents such as contracts, agreements, and NDAs. The application features project and file management, real-time document preview with markdown rendering, and multi-format export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **Styling**: Tailwind CSS with CSS variables for theming (HSL color system)
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **State Management**: React Query (@tanstack/react-query) for server state, React useState for local state
- **Routing**: React Router DOM with client-side routing

### UI Layout Pattern
The main interface uses a three-panel resizable layout:
1. **Left Sidebar**: Project and file navigation with search, status badges (Draft/Reviewed/Final)
2. **Chat Panel**: AI conversation interface with agent step indicators showing workflow progress (Ask questions → Research → Draft → Refine → Export)
3. **Preview Panel**: Real-time document preview with tabs for rendered view, diff view, and outline

### Design System
- Custom font stack: EB Garamond (serif headings), Lato (body), Fira Code (monospace)
- HSL-based color tokens defined in CSS variables
- Dark mode support via class-based theming
- 1.25rem border radius as default

### Key Design Patterns
- **Resizable Panels**: Uses react-resizable-panels for flexible workspace layouts
- **Mock Data Layer**: Currently uses static mock data in `src/data/mockData.ts` for projects, files, and chat messages
- **Component Aliases**: Path aliases configured (`@/` maps to `src/`) for clean imports

## External Dependencies

### UI Component Libraries
- Radix UI primitives (dialog, dropdown, tabs, etc.)
- shadcn/ui component system
- Lucide React for icons
- Embla Carousel for carousel functionality
- Vaul for drawer components

### Utilities
- date-fns for date formatting
- clsx + tailwind-merge for class name handling
- class-variance-authority for component variants
- cmdk for command palette functionality
- react-day-picker for calendar components
- sonner for toast notifications

### Build Tools
- Vite with React SWC plugin
- TypeScript with relaxed strict mode settings
- ESLint with React hooks and refresh plugins
- PostCSS with Tailwind and Autoprefixer

### External Services
- **Lovable**: This project was scaffolded with Lovable and includes the lovable-tagger plugin for development
- **No backend currently**: The application is frontend-only with mock data; backend/database integration would need to be added for persistence and AI functionality