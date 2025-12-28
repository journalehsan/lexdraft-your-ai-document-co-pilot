# Vditor Integration for LexDraft

## Current Status

Due to network connectivity issues preventing npm package installation, a **fallback markdown editor** has been implemented in `src/components/editor/VditorEditor.tsx`.

## Upgrading to Full Vditor

When you have internet access and can install packages, follow these steps:

### 1. Install Vditor

```bash
npm install vditor
```

### 2. Replace the Fallback Component

Replace the content of `src/components/editor/VditorEditor.tsx` with the following:

```tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

interface VditorEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string | number;
  theme?: 'light' | 'dark';
  disabled?: boolean;
}

export function VditorEditor({
  value,
  onChange,
  height = '100%',
  theme = 'light',
  disabled = false,
}: VditorEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vditorRef = useRef<Vditor | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleInputChange = useCallback((newValue: string) => {
    onChange(newValue);
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const vditor = new Vditor(containerRef.current, {
      height,
      theme,
      mode: 'wysiwyg',
      placeholder: 'Start writing...',
      cache: { enable: false },
      input: handleInputChange,
      focus: () => {
        setIsReady(true);
      },
      after: () => {
        setIsReady(true);
        if (vditorRef.current && value) {
          vditorRef.current.setValue(value);
        }
      },
      toolbarConfig: {
        pin: true,
      },
      toolbar: [
        'headings',
        'bold',
        'italic',
        'strike',
        '|',
        'list',
        'ordered-list',
        'check',
        '|',
        'quote',
        'code',
        'link',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        'preview',
        'outline',
      ],
      preview: {
        theme: {
          current: theme,
        },
      },
      counter: {
        enable: true,
      },
      tab: '\t',
      upload: {
        accept: 'image/*',
      },
      disabled,
    });

    vditorRef.current = vditor;

    return () => {
      if (vditorRef.current) {
        vditorRef.current.destroy();
        vditorRef.current = null;
      }
    };
  }, [height, theme, handleInputChange, disabled]);

  useEffect(() => {
    if (isReady && vditorRef.current && value !== vditorRef.current.getValue()) {
      vditorRef.current.setValue(value);
    }
  }, [value, isReady]);

  return (
    <div className="h-full w-full overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

export function getMarkdown(content: string): string {
  return content;
}

export function setMarkdown(content: string): string {
  return content;
}
```

### 3. No Other Changes Required

The rest of the application is already configured to work with Vditor:
- `PreviewPanel` expects the same interface
- `DocumentStore` has `getMarkdown()` and `setMarkdown()` methods ready
- Dark mode support is built into the integration

## Features Provided by Full Vditor

- **WYSIWYG Mode**: What You See Is What You Get editing
- **Live Preview**: Real-time markdown rendering
- **Rich Toolbar**: Headings, formatting, lists, tables, code blocks, links, etc.
- **Syntax Highlighting**: Better code block support
- **Markdown Export**: Save as .md files
- **Keyboard Shortcuts**: Full keyboard support
- **Table Editor**: Visual table creation and editing
- **Math Formulas**: LaTeX math support
- **Emoji Picker**: Built-in emoji support
- **More Professional Output**: Better suited for legal document formatting

## Current Fallback Features

The current fallback editor provides:
- Basic markdown editing
- Toolbar with: Bold, Italic, H2, H3, List, Numbered List, Code, Quote, Horizontal Rule
- Auto-saving (500ms debounce)
- Legal document typography (serif fonts)
- Clean, minimal interface
- Works without external dependencies

The fallback allows you to test the integration immediately while waiting to install Vditor.
