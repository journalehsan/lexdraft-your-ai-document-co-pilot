import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type WorkspaceMode = 'global' | 'legal';
export type AIProvider = 'openrouter' | 'ollama';
export type Verbosity = 'concise' | 'balanced' | 'detailed';

export interface AppSettings {
  theme: Theme;
  defaultMode: WorkspaceMode;
  defaultProvider: AIProvider;
  autosaveEnabled: boolean;
  autosaveIntervalSec: 15 | 30 | 60;
  researchEnabled: boolean;
  cachingEnabled: boolean;
  verbosity: Verbosity;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  defaultMode: 'global',
  defaultProvider: 'openrouter',
  autosaveEnabled: true,
  autosaveIntervalSec: 30,
  researchEnabled: false,
  cachingEnabled: true,
  verbosity: 'balanced',
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('lexdraft_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('lexdraft_settings', JSON.stringify(settings));
    
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);
  }, [settings]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
