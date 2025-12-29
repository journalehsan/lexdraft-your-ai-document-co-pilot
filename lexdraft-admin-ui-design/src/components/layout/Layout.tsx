import React, { useState, useEffect } from 'react';
import { Sidebar, Page } from './Sidebar';
import { TopBar } from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setPage: (page: Page) => void;
}

export function Layout({ children, currentPage, setPage }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <Sidebar 
        currentPage={currentPage} 
        setPage={(page) => {
          setPage(page);
          setIsSidebarOpen(false); // Close on mobile after selection
        }} 
        isOpen={isSidebarOpen} 
      />
      
      <div className="p-4 lg:ml-64 pt-20">
        <main className="min-h-[calc(100vh-6rem)]">
          {children}
        </main>
        <footer className="mt-8 text-center text-sm text-muted-foreground pb-4">
          &copy; {new Date().getFullYear()} LexDraft AI Inc. All rights reserved. Confidential Admin Panel.
        </footer>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
