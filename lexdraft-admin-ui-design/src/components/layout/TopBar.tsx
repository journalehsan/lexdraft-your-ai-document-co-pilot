import React from 'react';
import { Menu, Search, Moon, Sun, Bell, User, Gavel } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TopBarProps {
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function TopBar({ toggleSidebar, theme, toggleTheme }: TopBarProps) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-card border-b border-border h-16">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-2 text-sm text-muted-foreground rounded-lg lg:hidden hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="w-6 h-6" />
            </button>
            <a href="#" className="flex ms-2 md:ms-4 items-center">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md mr-3">
                <Gavel className="w-6 h-6" />
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
                placeholder="Search users, orgs, projects..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="p-2 text-muted-foreground rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></div>
            </button>

            <div className="flex items-center ms-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-accent rounded-full focus:ring-4 focus:ring-ring"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                    <User className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
