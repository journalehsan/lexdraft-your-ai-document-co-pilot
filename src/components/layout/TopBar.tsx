import { Settings, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

export function TopBar() {
  const [workspaceModel, setWorkspaceModel] = useState('Global AI');
  const [provider, setProvider] = useState('OpenRouter');

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LD</span>
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">LexDraft</span>
        </div>

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
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8 bg-secondary">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
