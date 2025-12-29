import React, { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, Quote } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      {/* Mobile Header / Brand */}
      <div className="lg:hidden p-6 flex justify-between items-center border-b">
        <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            L
          </div>
          LexDraft
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-accent"
          type="button"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Left Marketing Panel (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-muted p-12 relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-2 font-semibold text-2xl tracking-tight mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-xl">
              L
            </div>
            LexDraft
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-6 max-w-lg">
            The document IDE for modern legal teams.
          </h1>

          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="text-lg text-muted-foreground">AI-powered contract analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="text-lg text-muted-foreground">Real-time collaboration</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="text-lg text-muted-foreground">Version control for documents</span>
            </div>
          </div>

          <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-border max-w-md">
            <Quote className="h-8 w-8 text-primary/40 mb-2" />
            <p className="text-lg font-medium mb-4">
              "LexDraft has completely transformed how we manage our contract workflows. It's clean, fast, and reliable."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-300"></div>
              <div>
                <div className="font-semibold">Sarah Jenkins</div>
                <div className="text-sm text-muted-foreground">General Counsel, TechFlow</div>
              </div>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>SOC2 Type II Certified & End-to-End Encrypted</span>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-0"></div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="absolute top-6 right-6 hidden lg:block">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent text-muted-foreground"
            type="button"
          >
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>

        <div className="w-full max-w-md space-y-8">
          {children}
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <a href="/terms" className="hover:underline underline-offset-4">Terms</a>
          <span className="mx-2">•</span>
          <a href="/privacy" className="hover:underline underline-offset-4">Privacy</a>
          <span className="mx-2">•</span>
          <a href="/security" className="hover:underline underline-offset-4">Security</a>
        </div>
      </div>
    </div>
  );
}
