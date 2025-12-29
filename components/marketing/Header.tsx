'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          LexDraft
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/security" className="hover:text-primary transition-colors">
            Security
          </Link>
          <Link href="/app" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
            Sign In
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
