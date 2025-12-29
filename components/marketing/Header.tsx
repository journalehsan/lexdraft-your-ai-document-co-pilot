'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Moon, Sun, Menu, X, Scale } from 'lucide-react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const buttonBaseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const primaryBtn = "bg-primary text-primary-foreground hover:bg-primary/90";
  const ghostBtn = "hover:bg-accent hover:text-accent-foreground";
  const outlineBtn = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  const btnSm = "h-9 px-3 text-sm";
  const btnMd = "h-10 px-4 py-2";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Scale className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">LexDraft</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">Templates</Link>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          <Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors">Security</Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            className={`${buttonBaseClass} ${ghostBtn} ${btnSm}`}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link href="/app/login" className={`${buttonBaseClass} ${ghostBtn} ${btnMd}`}>Sign in</Link>
          <Link href="/app" className={`${buttonBaseClass} ${primaryBtn} ${btnMd}`}>Open App</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            className={`${buttonBaseClass} ${ghostBtn} ${btnSm}`}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button className="text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <Link href="#features" className="text-foreground" onClick={() => setIsOpen(false)}>Features</Link>
            <Link href="#templates" className="text-foreground" onClick={() => setIsOpen(false)}>Templates</Link>
            <Link href="/blog" className="text-foreground" onClick={() => setIsOpen(false)}>Blog</Link>
            <Link href="/security" className="text-foreground" onClick={() => setIsOpen(false)}>Security</Link>
            <Link href="/pricing" className="text-foreground" onClick={() => setIsOpen(false)}>Pricing</Link>
          </nav>
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Link href="/app/login" className={`${buttonBaseClass} ${outlineBtn} ${btnMd} w-full`}>Sign in</Link>
            <Link href="/app" className={`${buttonBaseClass} ${primaryBtn} ${btnMd} w-full`}>Open App</Link>
          </div>
        </div>
      )}
    </header>
  );
}
