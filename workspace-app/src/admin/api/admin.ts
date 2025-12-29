interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  is_super_admin: boolean;
  org_id: string;
  org_name: string;
  roles: Array<{ id: string; name: string }>;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  org_id: string;
  permissions: string[];
  users: Array<{ id: string; name: string }>;
}

interface Permission {
  key: string;
  description: string | null;
}

interface ApiError {
  error: string;
}

const API_BASE = '/api/admin';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'An error occurred');
  }
  return response.json() as Promise<T>;
}

export const adminApi = {
  users: {
    list: async () => {
      const response = await fetch(`${API_BASE}/users`);
      return handleResponse<{ users: User[] }>(response);
    },

    get: async (id: string) => {
      const response = await fetch(`${API_BASE}/users/${id}`);
      return handleResponse<{ user: User }>(response);
    },

    create: async (data: {
      name: string;
      email: string;
      password: string;
      roleIds?: string[];
      orgId?: string;
    }) => {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<{ ok: true }>(response);
    },

    update: async (id: string, data: {
      name?: string;
      email?: string;
      password?: string;
      isSuperAdmin?: boolean;
    }) => {
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<{ ok: true }>(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<{ ok: true }>(response);
    },

    updateRoles: async (id: string, roleIds: string[]) => {
      const response = await fetch(`${API_BASE}/users/${id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleIds }),
      });
      return handleResponse<{ ok: true }>(response);
    },

    updateStatus: async (id: string, status: 'active' | 'disabled') => {
      const response = await fetch(`${API_BASE}/users/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return handleResponse<{ ok: true }>(response);
    },
  },

  roles: {
    list: async () => {
      const response = await fetch(`${API_BASE}/roles`);
      return handleResponse<{ roles: Role[] }>(response);
    },

    get: async (id: string) => {
      const response = await fetch(`${API_BASE}/roles/${id}`);
      return handleResponse<{ role: Role }>(response);
    },

    create: async (data: {
      name: string;
      description?: string;
      permissionKeys?: string[];
      orgId?: string;
    }) => {
      const response = await fetch(`${API_BASE}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<{ ok: true }>(response);
    },

    update: async (id: string, data: {
      name?: string;
      description?: string;
    }) => {
      const response = await fetch(`${API_BASE}/roles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<{ ok: true }>(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_BASE}/roles/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<{ ok: true }>(response);
    },

    updatePermissions: async (id: string, permissionKeys: string[]) => {
      const response = await fetch(`${API_BASE}/roles/${id}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionKeys }),
      });
      return handleResponse<{ ok: true }>(response);
    },
  },

  permissions: {
    list: async () => {
      const response = await fetch(`${API_BASE}/permissions`);
      return handleResponse<{ permissions: Permission[] }>(response);
    },

    create: async (data: { key: string; description?: string }) => {
      const response = await fetch(`${API_BASE}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<{ permission: Permission }>(response);
    },

    update: async (data: { key: string; description?: string }) => {
      const response = await fetch(`${API_BASE}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<{ ok: true }>(response);
    },

    delete: async (key: string) => {
      const response = await fetch(`${API_BASE}/permissions?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      return handleResponse<{ ok: true }>(response);
    },
  },
};

export type { User, Role, Permission };
