import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/Topbar';
import '../admin.css';

type NavItem = 'dashboard' | 'users' | 'roles' | 'permissions';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();

  // Determine current page from path
  const getCurrentPage = (): NavItem => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    if (['users', 'roles', 'permissions'].includes(lastPart)) {
      return lastPart as NavItem;
    }
    return 'dashboard';
  };

  useEffect(() => {
    // Check system preference on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="admin-root min-h-screen bg-background text-foreground">
      <TopBar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <Sidebar
        currentPage={getCurrentPage()}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="p-4 lg:ml-64 pt-20 admin-main">
        <main className="min-h-[calc(100vh-6rem)]">
          {children}
        </main>
        <footer className="admin-footer">
          &copy; {new Date().getFullYear()} LexDraft AI Inc. All rights reserved. Confidential Admin
          Panel.
        </footer>
      </div>
    </div>
  );
}
