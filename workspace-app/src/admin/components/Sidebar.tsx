import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  ChevronRight
} from 'lucide-react';

type NavItem = 'dashboard' | 'users' | 'roles' | 'permissions';

interface SidebarProps {
  currentPage: NavItem;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { id: NavItem; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'roles', label: 'Roles', icon: Shield },
  { id: 'permissions', label: 'Permissions', icon: Settings },
];

export function Sidebar({ currentPage, isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-1 font-medium">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    navigate(`/admin/${item.id === 'dashboard' ? '' : item.id}`);
                    onClose();
                  }}
                  className={`flex items-center w-full p-2 text-foreground rounded-lg hover:bg-muted group transition-colors ${
                    currentPage === item.id
                      ? 'bg-muted text-primary font-semibold'
                      : ''
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition duration-75 ${
                      currentPage === item.id
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                  <span className="ms-3 flex-1 text-left">{item.label}</span>
                  {currentPage === item.id && (
                    <ChevronRight className="w-4 h-4 text-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
