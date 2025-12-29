#!/bin/bash

# LexDraft Development Environment Manager
# Usage: ./manage.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  LexDraft Development Manager${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_requirements() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
}

start_docker() {
    print_info "Starting Docker services (nginx + postgres)..."
    if docker compose version &> /dev/null; then
        docker compose up -d
    else
        docker-compose up -d
    fi
    print_success "Docker services started"
}

stop_docker() {
    print_info "Stopping Docker services..."
    if docker compose version &> /dev/null; then
        docker compose down
    else
        docker-compose down
    fi
    print_success "Docker services stopped"
}

start_dev_servers() {
    print_info "Starting Next.js and Workspace dev servers..."
    npm run dev &
    DEV_PID=$!
    echo $DEV_PID > .dev.pid
    print_success "Dev servers starting in background (PID: $DEV_PID)"
    print_info "Waiting for servers to be ready..."
    sleep 5
}

stop_dev_servers() {
    if [ -f .dev.pid ]; then
        DEV_PID=$(cat .dev.pid)
        print_info "Stopping dev servers (PID: $DEV_PID)..."
        pkill -P $DEV_PID 2>/dev/null || true
        kill $DEV_PID 2>/dev/null || true
        rm .dev.pid
        print_success "Dev servers stopped"
    else
        print_info "No dev servers PID file found, trying to stop by process name..."
        pkill -f "next dev" 2>/dev/null || true
        pkill -f "vite" 2>/dev/null || true
        print_success "Attempted to stop dev servers"
    fi
}

start_all() {
    print_header
    check_requirements

    print_info "Starting LexDraft development environment..."
    echo ""

    # Start Docker services
    start_docker
    echo ""

    # Start dev servers
    start_dev_servers
    echo ""

    print_success "All services started!"
    echo ""
    echo -e "${GREEN}Access Points:${NC}"
    echo -e "  ${BLUE}Main Site:${NC}      http://localhost"
    echo -e "  ${BLUE}Marketing:${NC}      http://localhost (Next.js pages)"
    echo -e "  ${BLUE}Workspace:${NC}      http://localhost/app"
    echo -e "  ${BLUE}Blog:${NC}           http://localhost/blog"
    echo -e "  ${BLUE}PostgreSQL:${NC}     localhost:5432 (user: lexdraft, db: lexdraft)"
    echo ""
    echo -e "${YELLOW}Note: Dev servers are running in background.${NC}"
    echo -e "${YELLOW}Use './manage.sh logs' to view their output.${NC}"
    echo -e "${YELLOW}Use './manage.sh stop' to stop all services.${NC}"
}

stop_all() {
    print_header
    print_info "Stopping all services..."
    echo ""

    stop_dev_servers
    echo ""

    stop_docker
    echo ""

    print_success "All services stopped!"
}

restart_all() {
    print_header
    print_info "Restarting all services..."
    echo ""

    stop_all
    sleep 2
    start_all
}

show_status() {
    print_header
    echo ""

    print_info "Docker Services Status:"
    if docker compose version &> /dev/null; then
        docker compose ps
    else
        docker-compose ps
    fi
    echo ""

    print_info "Dev Servers Status:"
    if [ -f .dev.pid ]; then
        DEV_PID=$(cat .dev.pid)
        if ps -p $DEV_PID > /dev/null; then
            print_success "Dev servers running (PID: $DEV_PID)"
        else
            print_error "Dev servers not running (stale PID file)"
            rm .dev.pid
        fi
    else
        print_error "Dev servers not running"
    fi
    echo ""

    print_info "Port Status:"
    echo "  Port 80 (nginx):   $(lsof -i :80 &>/dev/null && echo '✓ In use' || echo '✗ Free')"
    echo "  Port 3000 (next):  $(lsof -i :3000 &>/dev/null && echo '✓ In use' || echo '✗ Free')"
    echo "  Port 5000 (vite):  $(lsof -i :5000 &>/dev/null && echo '✓ In use' || echo '✗ Free')"
    echo "  Port 5432 (pg):    $(lsof -i :5432 &>/dev/null && echo '✓ In use' || echo '✗ Free')"
}

show_logs() {
    print_header
    echo ""

    case "${2:-all}" in
        nginx)
            print_info "Showing nginx logs (Ctrl+C to exit)..."
            docker logs -f lexdraft-nginx
            ;;
        postgres|pg)
            print_info "Showing postgres logs (Ctrl+C to exit)..."
            docker logs -f lexdraft-postgres
            ;;
        dev|servers)
            print_info "Showing dev servers logs (Ctrl+C to exit)..."
            if [ -f .dev.pid ]; then
                tail -f nohup.out 2>/dev/null || print_error "No log file found"
            else
                print_error "Dev servers not running"
            fi
            ;;
        all)
            print_info "Showing all logs (Ctrl+C to exit)..."
            if docker compose version &> /dev/null; then
                docker compose logs -f
            else
                docker-compose logs -f
            fi
            ;;
        *)
            print_error "Unknown log type: $2"
            echo "Available: nginx, postgres, dev, all"
            ;;
    esac
}

db_shell() {
    print_header
    print_info "Connecting to PostgreSQL..."
    docker exec -it lexdraft-postgres psql -U lexdraft -d lexdraft
}

install_deps() {
    print_header
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed!"
}

show_help() {
    print_header
    echo ""
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services (nginx, postgres, dev servers)"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  status      Show status of all services"
    echo "  logs [type] Show logs (types: nginx, postgres, dev, all)"
    echo "  db          Open PostgreSQL shell"
    echo "  install     Install npm dependencies"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./manage.sh start          # Start everything"
    echo "  ./manage.sh logs nginx     # View nginx logs"
    echo "  ./manage.sh db             # Connect to database"
    echo "  ./manage.sh stop           # Stop everything"
    echo ""
}

# Main command handler
case "${1:-help}" in
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$@"
        ;;
    db|psql)
        db_shell
        ;;
    install)
        install_deps
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
