import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const REQUEST_TIMEOUT_MS = 10000;

const fetchWithTimeout = async (input: RequestInfo, init: RequestInit = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

export interface User {
  id: string;
  name: string;
  email: string;
  orgId: string;
  orgName: string;
  status: string;
  isSuperAdmin: boolean;
}

export interface Role {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  roles: Role[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  hasPermission: (permissionKey: string) => boolean;
  hasAnyPermission: (permissionKeys: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((payload: { user: User; roles: Role[]; permissions: string[] }) => {
    setUser(payload.user);
    setRoles(payload.roles || []);
    setPermissions(payload.permissions || []);
    setIsAuthenticated(true);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setRoles([]);
    setPermissions([]);
    setIsAuthenticated(false);
  }, []);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithTimeout('/api/auth/session', { credentials: 'include' });
      if (!response.ok) {
        clearSession();
        return;
      }
      const data = await response.json();
      applySession(data);
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await fetchWithTimeout('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    applySession(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetchWithTimeout('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    await login(email, password, true);
  };

  const logout = async () => {
    await fetchWithTimeout('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    clearSession();
  };

  const hasPermission = useCallback(
    (permissionKey: string) => {
      if (!user) {
        return false;
      }
      if (user.isSuperAdmin) {
        return true;
      }
      return permissions.includes(permissionKey);
    },
    [permissions, user]
  );

  const hasAnyPermission = useCallback(
    (permissionKeys: string[]) => {
      if (!user) {
        return false;
      }
      if (user.isSuperAdmin) {
        return true;
      }
      return permissionKeys.some((key) => permissions.includes(key));
    },
    [permissions, user]
  );

  return (
    <AuthContext.Provider value={{
      user,
      roles,
      permissions,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register,
      refreshSession,
      hasPermission,
      hasAnyPermission,
    }}>
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
