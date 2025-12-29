# Repository Guidelines

## Project Structure & Module Organization
- `app/` houses the Next.js App Router marketing site and SSR pages (e.g., `app/page.tsx`, `app/blog/`).
- `workspace-app/` contains the Vite-based React workspace SPA (`workspace-app/src/`).
- `content/blog/` stores MDX blog posts with frontmatter.
- `components/` and `lib/` hold shared UI and utility modules used by the Next.js app.
- `public/` includes static assets; `public/vditor/` contains editor assets.
- `nginx/` and `docker-compose.yml` define the reverse proxy and local services.

## Build, Test, and Development Commands
- `./manage.sh start` runs nginx, Postgres, and both dev servers.
- `npm run dev` starts Next.js (`:3000`) and the Vite workspace (`:5000`) together.
- `npm run build` builds both apps (`.next/` and `workspace-app/dist/`).
- `npm run lint` runs ESLint across the repo.
- `./manage.sh db` opens a Postgres shell for local data inspection.

## Coding Style & Naming Conventions
- Use TypeScript for React components (`.tsx`) and keep components PascalCase.
- Follow existing module patterns in `workspace-app/src/components/` and `app/` routes.
- Prefer Tailwind utility classes and design tokens (`lib/design-tokens.ts`).
- Run `npm run lint` before submitting changes; fix lint errors rather than disabling rules.

## Testing Guidelines
- No automated test suite is currently defined; no `test` script or test directory is present.
- If you add tests, keep them colocated with the feature or under a new `tests/` directory, and document the command in this file.

## Commit & Pull Request Guidelines
- Commit history mixes short imperative messages (e.g., “Add Docker infrastructure”) and Conventional Commits for features (e.g., `feat(auth): add login and register pages`).
- Prefer Conventional Commits with a clear scope for new feature work; keep fixes short and descriptive.
- PRs should include a brief summary, relevant screenshots for UI changes, and any manual test steps.

## Security & Configuration Tips
- Copy `.env.example` to `.env` and keep secrets out of Git.
- Local routing assumes nginx proxying `/` to Next.js and `/app` to the Vite workspace.
