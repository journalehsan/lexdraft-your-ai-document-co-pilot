# LexDraft with Next.js

> **Quick Start**: Run `npm run dev` and open http://localhost:3000

## Overview

LexDraft now has a Next.js shell for SEO-optimized marketing pages and blog, while preserving the existing React workspace application.

## Architecture

```
┌─────────────────────────────────────────┐
│  Next.js (Port 3000)                    │
│  ├─ Marketing Pages (SSR/SSG)          │
│  ├─ Blog System (MDX)                  │
│  └─ Proxy /app → Workspace             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  React Workspace (Port 5000)           │
│  └─ Vite + React Router                │
└─────────────────────────────────────────┘
```

## Quick Commands

```bash
# Development (runs both servers)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
lexdraft/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page (/)
│   ├── pricing/           # /pricing
│   ├── security/          # /security
│   ├── privacy/           # /privacy
│   ├── terms/             # /terms
│   ├── blog/              # Blog system
│   │   ├── page.tsx       # /blog (index)
│   │   └── [slug]/        # /blog/[slug]
│   ├── rss.xml/           # RSS feed
│   └── sitemap.ts         # Sitemap
│
├── workspace-app/          # Your React workspace
│   ├── src/               # React app (unchanged)
│   └── vite.config.ts
│
├── components/marketing/   # Marketing components
├── content/blog/          # Blog posts (MDX)
└── lib/                   # Utilities
```

## Access Points

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Landing page |
| http://localhost:3000/pricing | Pricing page |
| http://localhost:3000/blog | Blog index |
| http://localhost:3000/app | Workspace (proxied to port 5000) |
| http://localhost:3000/rss.xml | RSS feed |
| http://localhost:3000/sitemap.xml | Sitemap |

## Features

### Marketing Pages ✅
- [x] Landing page with hero, features, CTAs
- [x] Pricing page (3 tiers)
- [x] Security page
- [x] Privacy policy
- [x] Terms of service
- [x] Responsive header with dark/light mode
- [x] Footer with links

### Blog System ✅
- [x] MDX blog posts with frontmatter
- [x] Blog index with tags
- [x] Individual article pages
- [x] RSS feed generation
- [x] Sitemap generation
- [x] SEO metadata

### Workspace Integration ✅
- [x] Existing React app preserved
- [x] Client-side routing intact
- [x] Auth system unchanged
- [x] Dev server proxying
- [x] No UI changes to workspace

## Adding Blog Posts

1. Create a new file in `content/blog/`:

```bash
touch content/blog/my-new-post.mdx
```

2. Add frontmatter and content:

```mdx
---
title: "My Post Title"
date: "2025-12-29"
description: "A brief description"
tags: ["tag1", "tag2"]
author: "Your Name"
---

# Your Content Here

Write your post in Markdown or MDX.
```

3. The post automatically appears on `/blog`

## Development Workflow

### Starting Development

```bash
npm run dev
```

This runs **both** servers concurrently:
- Next.js at http://localhost:3000
- Workspace at http://localhost:5000

### Individual Servers

```bash
# Next.js only
npm run dev:next

# Workspace only
npm run dev:workspace
```

### Making Changes

**Marketing Pages**: Edit files in `app/`
- Changes auto-reload via Next.js Fast Refresh

**Workspace**: Edit files in `workspace-app/src/`
- Changes auto-reload via Vite HMR

**Blog Posts**: Edit/add files in `content/blog/`
- Changes reflected on next page load

## Building for Production

```bash
# Build both apps
npm run build

# Or build separately
npm run build:workspace  # Builds workspace first
npm run build:next       # Then builds Next.js
```

### Output

- **Workspace**: `workspace-app/dist/`
- **Next.js**: `.next/`

### Start Production Server

```bash
npm start
```

Serves at http://localhost:3000

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js config + MDX + rewrites |
| `tailwind.config.ts` | Tailwind (shared by both apps) |
| `tsconfig.json` | TypeScript for Next.js |
| `workspace-app/tsconfig.json` | TypeScript for workspace |
| `.npmrc` | Auto-use legacy peer deps |

## Theme & Styling

### Dark/Light Mode
- Uses `next-themes` for theme management
- Toggle in header
- Synced across marketing and workspace

### Tailwind
- Shared configuration
- CSS variables for colors
- Typography plugin for blog

### Design Tokens
- Defined in `lib/design-tokens.ts`
- Fonts, colors, spacing

## SEO & Performance

### Metadata
- Page titles and descriptions
- OpenGraph tags (placeholders)
- Proper semantic HTML

### Generated Assets
- **Sitemap**: `/sitemap.xml` (auto-updated)
- **RSS Feed**: `/rss.xml` (auto-updated)

### Performance
- Next.js 16 with Turbopack (fast dev builds)
- Automatic code splitting
- Image optimization ready

## Dependencies Note

Due to React 19 and peer dependency conflicts, the project uses:
- `.npmrc` with `legacy-peer-deps=true`
- This is normal and safe for this setup

Just run `npm install` (the flag is automatic).

## Troubleshooting

### Port Already in Use

Change ports in `package.json`:

```json
"dev:next": "next dev -p 3001",
"dev:workspace": "cd workspace-app && vite --port 5001"
```

Update `next.config.mjs` rewrite destination if you change workspace port.

### Build Fails

Ensure dependencies are installed:
```bash
npm install
```

### TypeScript Errors

Check both tsconfig files:
- Root `tsconfig.json` (Next.js)
- `workspace-app/tsconfig.json` (workspace)

### Can't Access /app Routes

Make sure workspace dev server is running:
```bash
npm run dev:workspace
```

## Documentation

- **NEXT_INTEGRATION.md** - Technical details
- **INTEGRATION_SUMMARY.md** - What was built
- This file - Quick reference

## What's Next?

Optional enhancements:
1. Add analytics tracking
2. Implement blog search
3. Add newsletter signup
4. Integrate CMS for content
5. Add comment system to blog
6. Deploy to Vercel/Netlify

## Support

For issues or questions:
- Check the documentation files
- Review `next.config.mjs` for routing config
- Ensure both servers are running in dev mode

---

**Everything is ready to go!** 🚀

Run `npm run dev` and visit http://localhost:3000
