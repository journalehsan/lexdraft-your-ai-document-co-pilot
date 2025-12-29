# LexDraft - Quick Start Guide

## Installation (One Time)

```bash
# Make manage.sh executable (if needed)
chmod +x manage.sh

# Install dependencies
./manage.sh install
```

## Daily Use

### Start Development Environment

```bash
./manage.sh start
```

This starts:
- ✅ nginx (port 80) - Reverse proxy
- ✅ PostgreSQL (port 5432) - Database
- ✅ Next.js (port 3000) - Marketing site
- ✅ Workspace (port 5000) - React app

**Access:**
- http://localhost - Main site
- http://localhost/app - Workspace
- http://localhost/blog - Blog

### Stop Everything

```bash
./manage.sh stop
```

### Check Status

```bash
./manage.sh status
```

### View Logs

```bash
./manage.sh logs              # All logs
./manage.sh logs nginx        # nginx only
./manage.sh logs postgres     # postgres only
```

## Common Tasks

### Access Database

```bash
./manage.sh db
```

This opens PostgreSQL shell:
```sql
-- List tables
\dt

-- Create a table
CREATE TABLE example (id SERIAL PRIMARY KEY);

-- Exit
\q
```

### Add a Blog Post

1. Create file: `content/blog/my-post.mdx`
2. Add content:
```mdx
---
title: "My Post"
date: "2025-12-29"
description: "Description"
tags: ["tag1"]
author: "Me"
---

# Content
```
3. Refresh http://localhost/blog

### Restart After Config Changes

```bash
./manage.sh restart
```

## Troubleshooting

### Port 80 in use
```bash
# Find what's using it
sudo lsof -i :80

# Kill it or stop the service
# Then restart
./manage.sh restart
```

### Docker not starting
```bash
# Make sure Docker is running
docker ps

# Start Docker Desktop/daemon
# Then:
./manage.sh start
```

### Workspace not loading
```bash
# Check all services are running
./manage.sh status

# Check logs
./manage.sh logs nginx

# Restart if needed
./manage.sh restart
```

## File Structure

```
├── app/               # Marketing pages (edit these)
├── workspace-app/     # Workspace (edit these)
├── content/blog/      # Blog posts (add MDX here)
├── nginx/nginx.conf   # Routing config
├── manage.sh          # Control script
└── docker-compose.yml # Services config
```

## Tips

- nginx handles all routing (no base path issues!)
- PostgreSQL data persists in Docker volume
- HMR (Hot Module Reload) works for both apps
- Same nginx config works in production

## Commands Cheat Sheet

| Command | What it does |
|---------|-------------|
| `./manage.sh start` | Start everything |
| `./manage.sh stop` | Stop everything |
| `./manage.sh restart` | Restart everything |
| `./manage.sh status` | Check status |
| `./manage.sh logs` | View logs |
| `./manage.sh db` | Open database |
| `./manage.sh help` | Show all commands |

## That's It!

You're ready to develop. Run `./manage.sh start` and you're good to go! 🚀

For more details, see [DOCKER_SETUP.md](DOCKER_SETUP.md).
