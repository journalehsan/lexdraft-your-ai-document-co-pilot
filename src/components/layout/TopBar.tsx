import { Settings as SettingsIcon, ChevronDown, User, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';

export function TopBar() {
  const [workspaceModel, setWorkspaceModel] = useState('Global AI');
  const [provider, setProvider] = useState('OpenRouter');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LD</span>
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">LexDraft</span>
        </Link>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm font-normal">
                <span className="text-muted-foreground text-xs">Model:</span>
                {workspaceModel}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              <DropdownMenuItem onClick={() => setWorkspaceModel('Global AI')}>
                Global AI
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWorkspaceModel('Legal AI')}>
                Legal AI
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm font-normal">
                <span className="text-muted-foreground text-xs">Provider:</span>
                {provider}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              <DropdownMenuItem onClick={() => setProvider('OpenRouter')}>
                OpenRouter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProvider('Ollama (On-Prem)')}>
                Ollama (On-Prem)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right: User + Settings */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          data-testid="button-theme-toggle"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/settings')} data-testid="button-settings">
          <SettingsIcon className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0" data-testid="button-account-menu">
              <Avatar className="h-8 w-8 bg-secondary">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </div>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
