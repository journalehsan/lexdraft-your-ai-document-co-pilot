# LexDraft - AI-Powered Document Co-Pilot

Professional document builder with agentic AI, powered by OpenRouter and Ollama.

## 🚀 Quick Start

```bash
# Install dependencies
./manage.sh install

# Start everything (nginx + postgres + dev servers)
./manage.sh start
```

**Access your app:**
- **Main Site**: http://localhost
- **Workspace**: http://localhost/app
- **Blog**: http://localhost/blog

That's it! 🎉

## 📋 What You Get

### Marketing Site (Next.js - SSR/SSG)
- ✨ Landing page with features showcase
- 💰 Pricing page
- 🔒 Security & compliance info
- 📄 Privacy policy & Terms of service
- 🌓 Dark/light mode

### Blog System (MDX)
- 📝 Write posts in MDX
- 🏷️ Tag system
- 📡 RSS feed at `/rss.xml`
- 🗺️ Auto-generated sitemap

### Workspace (React SPA)
- 📄 Document editor (Vditor)
- 🤖 AI-powered drafting
- 📁 Projects & files management
- 🔄 Diff & patch viewer
- ⚙️ Settings & profile

### Database
- 🐘 PostgreSQL ready to use
- 📊 Port 5432
- 🔐 Credentials in `.env.example`

## 🛠️ Management Commands

```bash
./manage.sh start      # Start all services
./manage.sh stop       # Stop all services
./manage.sh restart    # Restart all services
./manage.sh status     # Check service status
./manage.sh logs       # View all logs
./manage.sh db         # Connect to PostgreSQL
./manage.sh help       # Show all commands
```

## 📁 Project Structure

```
lexdraft/
├── app/                    # Next.js marketing pages
│   ├── page.tsx           # Landing page
│   ├── pricing/           # Pricing
│   ├── blog/              # Blog system
│   └── [other pages]
│
├── workspace-app/          # React workspace (Vite)
│   └── src/               # Your document editor
│
├── nginx/
│   └── nginx.conf         # Reverse proxy config
│
├── docker-compose.yml     # Docker services
├── manage.sh              # Management script
└── content/blog/          # Blog posts (MDX)
```

## 🔧 Development

### Adding Blog Posts

Create `content/blog/my-post.mdx`:

```mdx
---
title: "My Post"
date: "2025-12-29"
description: "Post description"
tags: ["tag1", "tag2"]
author: "Your Name"
---

# Content here
```

### Database Access

```bash
# Open PostgreSQL shell
./manage.sh db

# Connection string
postgresql://lexdraft:lexdraft_dev_password@localhost:5432/lexdraft
```

### Environment Variables

```bash
cp .env.example .env
# Edit .env with your settings
```

## 📖 Documentation

- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Complete Docker + nginx guide ⭐
- **[NEXT_INTEGRATION.md](NEXT_INTEGRATION.md)** - Next.js integration details
- **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** - What was built

## 🏗️ Architecture

```
nginx (port 80)
  ├─ / → Next.js (port 3000)
  └─ /app → Workspace (port 5000)

PostgreSQL (port 5432)
```

nginx handles all routing - simple and production-like!

## 🔍 Troubleshooting

### Services won't start
```bash
./manage.sh stop
./manage.sh start
```

### Check what's running
```bash
./manage.sh status
```

### View logs
```bash
./manage.sh logs nginx
./manage.sh logs postgres
```

### Port conflicts
```bash
# Check what's using a port
lsof -i :80
lsof -i :3000
lsof -i :5000
```

## 🚢 Production Build

```bash
# Build both apps
npm run build

# Builds:
# - workspace-app/dist/
# - .next/
```

Use the same nginx config for production!

## 🤝 Contributing

1. Make your changes
2. Test with `./manage.sh start`
3. Build with `npm run build`
4. Submit PR

## 📝 License

[Your License]

## 🙏 Acknowledgments

- Next.js for the amazing framework
- Vite for lightning-fast development
- Vditor for the editor
- nginx for reliable proxying

---

**Need help?** Check [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed documentation.
