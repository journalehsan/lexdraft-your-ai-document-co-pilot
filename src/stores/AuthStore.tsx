import { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  org?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_TOKEN_KEY = 'lexdraft_auth_token';
const STORAGE_USER_KEY = 'lexdraft_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    const savedUser = localStorage.getItem(STORAGE_USER_KEY);

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    }
  }, []);

  const login = async (email: string, _password: string, _rememberMe: boolean = false) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email) {
          const mockUser: User = {
            id: crypto.randomUUID(),
            name: email.split('@')[0],
            email,
            role: 'user',
            org: 'Default Org'
          };
          const mockToken = `mock_jwt_${Date.now()}`;

          localStorage.setItem(STORAGE_TOKEN_KEY, mockToken);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mockUser));

          setUser(mockUser);
          setIsAuthenticated(true);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const mockUser: User = {
            id: crypto.randomUUID(),
            name,
            email,
            role: 'user',
            org: 'Default Org'
          };
          const mockToken = `mock_jwt_${Date.now()}`;

          localStorage.setItem(STORAGE_TOKEN_KEY, mockToken);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mockUser));

          setUser(mockUser);
          setIsAuthenticated(true);
          resolve();
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
