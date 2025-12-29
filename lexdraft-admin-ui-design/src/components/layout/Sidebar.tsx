import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FolderKanban, 
  CreditCard, 
  Scale, 
  FileText, 
  ShieldCheck, 
  Settings 
} from 'lucide-react';
import { cn } from '@/utils/cn';

export type Page = 'dashboard' | 'organizations' | 'users' | 'projects' | 'usage' | 'policy' | 'audit' | 'security' | 'settings';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  isOpen: boolean;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'usage', label: 'Usage & Costs', icon: CreditCard },
  { id: 'policy', label: 'Model Policy', icon: Scale },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, setPage, isOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 -translate-x-full transition-transform bg-card border-r border-border lg:translate-x-0",
        isOpen && "translate-x-0"
      )}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-1 font-medium">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setPage(item.id)}
                className={cn(
                  "flex items-center w-full p-2 text-foreground rounded-lg hover:bg-muted group transition-colors",
                  currentPage === item.id && "bg-muted text-primary font-semibold"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition duration-75", currentPage === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="ms-3">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
