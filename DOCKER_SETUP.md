# LexDraft Docker + nginx Setup

This is the **recommended** development setup using Docker with nginx as a reverse proxy, just like production!

## Why This Approach?

✅ **Production-like** - Same nginx config for dev and prod
✅ **Simple** - nginx handles all the routing complexity
✅ **Reliable** - No proxy issues or base path problems
✅ **Database Ready** - PostgreSQL included and ready to use
✅ **Easy Management** - Single script to control everything

## Architecture

```
┌─────────────────────────────────────────┐
│  nginx (Docker) - Port 80               │
│  ├─ / → Next.js (localhost:3000)       │
│  └─ /app → Workspace (localhost:5000)  │
└─────────────────────────────────────────┘
         ↓                    ↓
┌──────────────────┐  ┌──────────────────┐
│  Next.js         │  │  Vite + React    │
│  (Marketing)     │  │  (Workspace)     │
│  Port 3000       │  │  Port 5000       │
└──────────────────┘  └──────────────────┘

┌─────────────────────────────────────────┐
│  PostgreSQL (Docker) - Port 5432        │
│  Database: lexdraft                     │
│  User: lexdraft                         │
└─────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js & npm installed

### 1. Install Dependencies

```bash
./manage.sh install
# or
npm install
```

### 2. Start Everything

```bash
./manage.sh start
```

This will:
- Start nginx (port 80)
- Start PostgreSQL (port 5432)
- Start Next.js dev server (port 3000)
- Start Workspace dev server (port 5000)

### 3. Access Your App

- **Main Site**: http://localhost
- **Workspace**: http://localhost/app
- **Blog**: http://localhost/blog
- **Database**: localhost:5432

That's it! 🎉

## manage.sh Commands

The `manage.sh` script is your one-stop management tool:

```bash
./manage.sh start      # Start all services
./manage.sh stop       # Stop all services
./manage.sh restart    # Restart all services
./manage.sh status     # Show status of all services
./manage.sh logs       # Show all logs
./manage.sh logs nginx # Show nginx logs only
./manage.sh db         # Open PostgreSQL shell
./manage.sh help       # Show all commands
```

### Examples

```bash
# Start development environment
./manage.sh start

# Check if everything is running
./manage.sh status

# View nginx logs
./manage.sh logs nginx

# Connect to database
./manage.sh db

# Stop everything
./manage.sh stop
```

## Services

### nginx (Port 80)

Reverse proxy that routes requests:
- `/` → Next.js (port 3000)
- `/app` → Workspace (port 5000)
- Handles WebSocket for HMR (Hot Module Replacement)

**Config**: `nginx/nginx.conf`

### PostgreSQL (Port 5432)

Database service for your app.

**Credentials**:
- Host: localhost
- Port: 5432
- Database: lexdraft
- User: lexdraft
- Password: lexdraft_dev_password

**Connection String**:
```
postgresql://lexdraft:lexdraft_dev_password@localhost:5432/lexdraft
```

**Access**:
```bash
# Via manage.sh
./manage.sh db

# Direct docker exec
docker exec -it lexdraft-postgres psql -U lexdraft -d lexdraft
```

### Next.js Dev Server (Port 3000)

Marketing pages and blog (SSR/SSG).

**Not containerized** - runs locally for faster development.

### Workspace Dev Server (Port 5000)

React workspace with Vite HMR.

**Not containerized** - runs locally for faster development.

## Configuration Files

### docker-compose.yml

Defines Docker services:
- nginx
- postgres

```yaml
services:
  nginx:        # Reverse proxy on port 80
  postgres:     # Database on port 5432
```

### nginx/nginx.conf

nginx configuration for routing:
- Proxies `/app` to workspace (5000)
- Proxies everything else to Next.js (3000)
- Handles WebSocket for HMR

### .env (optional)

Create from `.env.example`:
```bash
cp .env.example .env
```

Edit database credentials if needed.

## Development Workflow

### Starting Your Day

```bash
./manage.sh start
```

### Making Changes

**Marketing Pages** (Next.js):
- Edit files in `app/`
- Changes auto-reload via HMR
- View at http://localhost

**Workspace** (React):
- Edit files in `workspace-app/src/`
- Changes auto-reload via HMR
- View at http://localhost/app

**nginx Config**:
- Edit `nginx/nginx.conf`
- Restart nginx: `docker restart lexdraft-nginx`

### Viewing Logs

```bash
# All services
./manage.sh logs

# Specific service
./manage.sh logs nginx
./manage.sh logs postgres
./manage.sh logs dev
```

### Ending Your Day

```bash
./manage.sh stop
```

## Database Usage

### Connect to Database

```bash
./manage.sh db
```

This opens a PostgreSQL shell where you can run SQL:

```sql
-- List tables
\dt

-- Create a table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query
SELECT * FROM users;

-- Exit
\q
```

### Use in Your App

Add to your Next.js or workspace app:

```bash
npm install pg
# or
npm install @prisma/client
```

**Connection string** (from `.env`):
```
postgresql://lexdraft:lexdraft_dev_password@localhost:5432/lexdraft
```

### Persistent Data

Database data is stored in a Docker volume: `postgres_data`

To **reset database**:
```bash
./manage.sh stop
docker volume rm lexdraft-your-ai-document-co-pilot_postgres_data
./manage.sh start
```

## Port Reference

| Service | Port | Access |
|---------|------|--------|
| nginx | 80 | http://localhost |
| Next.js | 3000 | (proxied via nginx) |
| Workspace | 5000 | (proxied via nginx) |
| PostgreSQL | 5432 | localhost:5432 |

## Troubleshooting

### Port 80 Already in Use

```bash
# Find what's using port 80
sudo lsof -i :80

# Stop it, then restart
./manage.sh restart
```

### Can't Connect to Database

```bash
# Check postgres is running
./manage.sh status

# Check logs
./manage.sh logs postgres

# Restart if needed
./manage.sh restart
```

### Workspace Not Loading at /app

```bash
# Check workspace dev server is running
./manage.sh status

# Check nginx logs
./manage.sh logs nginx

# Restart everything
./manage.sh restart
```

### Docker Services Won't Start

```bash
# Check Docker is running
docker ps

# View specific service logs
docker logs lexdraft-nginx
docker logs lexdraft-postgres

# Restart Docker, then:
./manage.sh start
```

### Dev Servers Not Starting

```bash
# Stop any existing processes
./manage.sh stop

# Check if ports are free
lsof -i :3000
lsof -i :5000

# Kill if needed
kill -9 <PID>

# Start again
./manage.sh start
```

## Production Deployment

This same nginx configuration can be used in production!

### Option 1: Docker Everything

Containerize Next.js and Workspace, update nginx to point to containers.

### Option 2: Static Build

Build both apps and serve static files via nginx:

```bash
# Build
npm run build

# Serve workspace-app/dist and .next output via nginx
```

See production deployment guide for details.

## Advanced

### Custom nginx Config

Edit `nginx/nginx.conf` to:
- Add SSL/TLS
- Configure caching
- Add rate limiting
- Set up load balancing

After editing:
```bash
docker restart lexdraft-nginx
```

### Database Backups

```bash
# Backup
docker exec lexdraft-postgres pg_dump -U lexdraft lexdraft > backup.sql

# Restore
docker exec -i lexdraft-postgres psql -U lexdraft lexdraft < backup.sql
```

### Environment Variables

Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Edit as needed, then restart:
```bash
./manage.sh restart
```

## Why Not Next.js Rewrites?

We tried Next.js rewrites initially, but:
- Base path issues with Vite
- WebSocket proxy problems
- Complex React Router configuration
- Not production-like

**nginx is simpler and works perfectly!** 👍

## Summary

This setup gives you:
- ✅ Production-like environment
- ✅ Easy management with one script
- ✅ Database ready to use
- ✅ No routing issues
- ✅ Fast development with HMR
- ✅ Same config for dev and prod

**Start developing:**
```bash
./manage.sh start
```

**That's it!** 🚀
