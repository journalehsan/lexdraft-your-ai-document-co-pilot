import { FileDown, FileType, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function BottomBar() {
  const [autosave, setAutosave] = useState(true);

  return (
    <footer className="h-12 border-t border-border bg-card flex items-center justify-between px-4">
      {/* Export Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
          <FileText className="h-3.5 w-3.5" />
          Export Markdown
        </Button>
        <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
          <FileType className="h-3.5 w-3.5" />
          Export LaTeX
        </Button>
        <Button variant="outline" size="sm" className="gap-2 h-8 text-xs" disabled>
          <FileDown className="h-3.5 w-3.5" />
          Export PDF
        </Button>
      </div>

      {/* Autosave Toggle */}
      <div className="flex items-center gap-2">
        <Switch
          id="autosave"
          checked={autosave}
          onCheckedChange={setAutosave}
          className="h-4 w-7"
        />
        <Label htmlFor="autosave" className="text-xs text-muted-foreground cursor-pointer">
          Autosave {autosave ? 'on' : 'off'}
        </Label>
      </div>
    </footer>
  );
}
