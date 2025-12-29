import React from 'react';
import { useAuth } from '@/stores/AuthStore';
import { Menu, Search, Moon, Sun, Bell, LogOut, User } from 'lucide-react';

interface TopBarProps {
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function TopBar({ toggleSidebar, theme, toggleTheme }: TopBarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-card border-b border-border h-16">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-2 text-sm text-muted-foreground rounded-lg lg:hidden hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="w-6 h-6" />
            </button>
            <a href="/" className="flex ms-2 md:ms-4 items-center">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md mr-3">
                <User className="w-6 h-6" />
              </div>
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-foreground">
                LexDraft <span className="text-muted-foreground font-normal">Admin</span>
              </span>
            </a>
          </div>

          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="block w-full p-2 ps-10 text-sm text-foreground border border-input rounded-lg bg-background focus:ring-ring focus:border-ring placeholder-muted-foreground"
                placeholder="Search users, roles, permissions..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              className="p-2 text-muted-foreground rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></div>
            </button>

            <div className="flex items-center ms-3 gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground">
                  {user?.name || 'Admin'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.email || 'admin@lexdraft.com'}
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 text-muted-foreground rounded-lg hover:bg-muted hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
