import { useEffect, useRef, useState } from 'react';
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
  const cdnBase = `${import.meta.env.BASE_URL}vditor`;
  const containerRef = useRef<HTMLDivElement>(null);
  const vditorRef = useRef<Vditor | null>(null);
  const latestValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const isUserTypingRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  // Keep onChange ref up to date without triggering re-initialization
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!containerRef.current) return;

    const vditor = new Vditor(containerRef.current, {
      height,
      theme,
      mode: 'wysiwyg',
      placeholder: 'Start writing...',
      cdn: cdnBase,
      cache: { enable: false },
      input: (newValue: string) => {
        isUserTypingRef.current = true;
        onChangeRef.current(newValue);
        // Reset the flag after a short delay to allow external updates
        setTimeout(() => {
          isUserTypingRef.current = false;
        }, 300);
      },
      focus: () => {
        setIsReady(true);
      },
      after: () => {
        setIsReady(true);
        if (vditorRef.current && latestValueRef.current) {
          try {
            vditorRef.current.setValue(latestValueRef.current);
          } catch (error) {
            console.warn('Vditor setValue skipped during init:', error);
          }
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
        try {
          // Vditor can throw if destroy is called before internals finish mounting
          if ((vditorRef.current as any).vditor?.element) {
            vditorRef.current.destroy();
          }
        } catch (error) {
          console.warn('Vditor destroy skipped:', error);
        } finally {
          vditorRef.current = null;
        }
      }
    };
  }, [height, theme, disabled, cdnBase]);

  useEffect(() => {
    // Don't update value while user is actively typing to prevent cursor jumps and undo/redo issues
    if (isReady && vditorRef.current && !isUserTypingRef.current) {
      const currentValue = vditorRef.current.getValue();
      if (value !== currentValue) {
        // Vditor may throw if its internal md parser is not ready; guard to avoid crashes
        try {
          vditorRef.current.setValue(value);
        } catch (error) {
          console.warn('Vditor setValue skipped:', error);
        }
      }
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
