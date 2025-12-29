# LexDraft Next.js Integration

This document describes the Next.js integration for LexDraft, which adds SEO-optimized marketing pages and a blog while preserving the existing React workspace.

## Architecture Overview

The project now consists of two parts:

1. **Next.js App** (root directory) - Marketing site and blog with SSR/SSG
2. **React Workspace** (`workspace-app/`) - The existing LexDraft editor application

### How It Works

- **Development**: Both servers run concurrently
  - Next.js on port 3000 (marketing pages)
  - Vite dev server on port 5000 (workspace)
  - Next.js proxies `/app/*` routes to the Vite dev server

- **Production**:
  - Build both apps separately
  - Next.js serves marketing pages
  - Workspace is proxied or served as static assets

## Project Structure

```
lexdraft/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with theme provider
│   ├── globals.css              # Global styles (Tailwind)
│   ├── page.tsx                 # Landing page (/)
│   ├── pricing/                 # Pricing page
│   ├── security/                # Security page
│   ├── privacy/                 # Privacy policy
│   ├── terms/                   # Terms of service
│   ├── blog/                    # Blog pages
│   │   ├── page.tsx            # Blog index
│   │   └── [slug]/             # Blog article pages
│   ├── rss.xml/                # RSS feed endpoint
│   └── sitemap.ts              # Sitemap generation
│
├── workspace-app/               # Existing React workspace (Vite)
│   ├── src/                    # React app source
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── stores/
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── components/                  # Next.js components
│   └── marketing/              # Marketing site components
│       ├── Header.tsx
│       └── Footer.tsx
│
├── content/                     # Content for SSG
│   └── blog/                   # Blog posts (MDX)
│       ├── welcome-to-lexdraft.mdx
│       └── ai-powered-writing-tips.mdx
│
├── lib/                        # Shared utilities
│   ├── blog.ts                # Blog post utilities
│   └── design-tokens.ts       # Shared design system
│
├── public/                     # Static assets
│   └── images/                # Marketing images
│
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript config (Next.js)
└── package.json               # Dependencies and scripts
```

## Development Workflow

### Start Development Servers

```bash
npm run dev
```

This starts both:
- Next.js dev server at http://localhost:3000
- Workspace Vite server at http://localhost:5000

The `/app` route on Next.js proxies to the workspace.

### Individual Servers

```bash
npm run dev:next       # Next.js only (port 3000)
npm run dev:workspace  # Workspace only (port 5000)
```

## Build & Deployment

### Build for Production

```bash
npm run build
```

This builds:
1. Workspace app (`workspace-app/dist`)
2. Next.js app (`.next`)

### Start Production Server

```bash
npm start
```

Starts the Next.js production server on port 3000.

## Key Features

### Marketing Pages

- **Landing Page** (`/`) - Hero, features, CTAs
- **Pricing** (`/pricing`) - Tiered pricing cards
- **Security** (`/security`) - Security features and compliance
- **Privacy** (`/privacy`) - Privacy policy
- **Terms** (`/terms`) - Terms of service

All pages include:
- Dark/light mode support via `next-themes`
- Responsive design
- Shared header and footer components
- SEO metadata

### Blog System

- **MDX Support** - Write blog posts in MDX format
- **Frontmatter** - Metadata (title, date, description, tags, author)
- **Tag System** - Automatic tag extraction and display
- **RSS Feed** - Available at `/rss.xml`
- **Sitemap** - Auto-generated at `/sitemap.xml`

#### Adding a Blog Post

1. Create a new `.mdx` file in `content/blog/`
2. Add frontmatter:

```mdx
---
title: "Your Post Title"
date: "2025-12-29"
description: "Brief description"
tags: ["tag1", "tag2"]
author: "Author Name"
---

# Your Content Here

Write your post content in Markdown/MDX.
```

3. The post will automatically appear on the blog index

### Workspace Integration

The existing React workspace runs under `/app` route:

- **Development**: Proxied to Vite dev server (port 5000)
- **Production**: Configured via Next.js rewrites
- **Auth**: Client-side auth remains unchanged
- **Routing**: React Router handles all `/app/*` routes

### Design System

- **Shared Theme**: Both apps use the same design tokens
- **Tailwind CSS**: Configured for both Next.js and workspace
- **Dark Mode**: `next-themes` for theme management
- **Typography**: Inter font family

## Environment Variables

Create `.env.local` for local development:

```env
# Optional: Configure site URL for production
NEXT_PUBLIC_SITE_URL=https://lexdraft.com
```

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both Next.js and workspace dev servers |
| `npm run dev:next` | Start Next.js dev server only |
| `npm run dev:workspace` | Start workspace Vite server only |
| `npm run build` | Build both apps for production |
| `npm run build:next` | Build Next.js only |
| `npm run build:workspace` | Build workspace only |
| `npm start` | Start Next.js production server |
| `npm run lint` | Run ESLint |

## Dependencies

### Next.js & React
- `next` - Next.js framework
- `react` & `react-dom` - React 19

### MDX & Blog
- `@next/mdx` - MDX support for Next.js
- `@mdx-js/loader` & `@mdx-js/react` - MDX processing
- `next-mdx-remote` - Remote MDX rendering
- `gray-matter` - Frontmatter parsing
- `rss` - RSS feed generation

### Styling
- `tailwindcss` - Utility-first CSS
- `next-themes` - Theme management
- `@tailwindcss/typography` - Typography styles

### Development
- `concurrently` - Run multiple dev servers
- `typescript` - TypeScript support

## Configuration Files

### next.config.mjs

Configures:
- MDX support
- Rewrites for `/app` route
- Page extensions

### tailwind.config.ts

Shared Tailwind configuration for both Next.js and workspace.

### tsconfig.json

TypeScript configuration for Next.js app. The workspace has its own `workspace-app/tsconfig.json`.

## Future Enhancements

Potential improvements:

1. **Static Export**: For `/app` in production, serve built workspace as static files
2. **Authentication**: Integrate Next.js auth with workspace auth
3. **Analytics**: Add analytics tracking
4. **Search**: Implement blog search functionality
5. **Comments**: Add comment system to blog posts
6. **Newsletter**: Email newsletter signup

## Troubleshooting

### Port Conflicts

If ports 3000 or 5000 are in use:

```bash
# Change Next.js port
npm run dev:next -- -p 3001

# Change workspace port (update next.config.mjs rewrite too)
npm run dev:workspace -- --port 5001
```

### Build Errors

Ensure all dependencies are installed:

```bash
npm install --legacy-peer-deps
```

### TypeScript Errors

Check that both TypeScript configs are properly set up:
- Root `tsconfig.json` for Next.js
- `workspace-app/tsconfig.json` for workspace

## Notes

- Marketing pages use Next.js App Router (not Pages Router)
- Workspace uses client-side React Router
- Theme is shared but managed separately in each app
- Build process is sequential (workspace first, then Next.js)
