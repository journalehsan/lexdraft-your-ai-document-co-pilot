import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthStore';

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
const THEME_STORAGE_KEY = 'lexdraft_theme';

const loadSettings = (userId: string) => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  const saved = localStorage.getItem(`lexdraft_settings_${userId}`);
  if (saved) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to parse settings', e);
    }
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  return savedTheme ? { ...DEFAULT_SETTINGS, theme: savedTheme } : DEFAULT_SETTINGS;
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [settings, setSettings] = useState<AppSettings>(() => {
    return loadSettings(userId);
  });

  useEffect(() => {
    setSettings(loadSettings(userId));
  }, [userId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(`lexdraft_settings_${userId}`, JSON.stringify(settings));
    localStorage.setItem(THEME_STORAGE_KEY, settings.theme);
    
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);
  }, [settings, userId]);

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
