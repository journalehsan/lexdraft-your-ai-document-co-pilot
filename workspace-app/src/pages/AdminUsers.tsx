import { useCallback, useEffect, useMemo, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/stores/AuthStore';
import { toast } from 'sonner';

interface RoleSummary {
  id: string;
  name: string;
}

interface UserSummary {
  id: string;
  name: string;
  email: string;
  status: string;
  is_super_admin: boolean;
  org_name: string;
  roles: RoleSummary[];
}

export default function AdminUsers() {
  const { hasAnyPermission } = useAuth();
  const canCreate = hasAnyPermission(['users:create', 'users:manage']);
  const canUpdate = hasAnyPermission(['users:update', 'users:manage']);

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    roleIds: [] as string[],
  });

  const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
  const [editingRoleIds, setEditingRoleIds] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersRes = await fetch('/api/admin/users', { credentials: 'include' });

      if (!usersRes.ok) {
        throw new Error('Failed to load users');
      }

      const usersData = await usersRes.json();
      const normalizedUsers = (usersData.users || []).map(
        (user: UserSummary & { roles: RoleSummary[] | string }) => ({
          ...user,
          roles: Array.isArray(user.roles) ? user.roles : JSON.parse(user.roles || '[]'),
        })
      );
      setUsers(normalizedUsers);

      if (canCreate || canUpdate) {
        const rolesRes = await fetch('/api/admin/roles', { credentials: 'include' });
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setRoles(rolesData.roles || []);
        }
      }
    } catch (error) {
      toast.error('Unable to load user data.');
    } finally {
      setIsLoading(false);
    }
  }, [canCreate, canUpdate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const roleNameById = useMemo(() => {
    const map = new Map<string, string>();
    roles.forEach((role) => map.set(role.id, role.name));
    return map;
  }, [roles]);

  const toggleRoleSelection = (roleId: string, target: 'create' | 'edit') => {
    if (target === 'create') {
      setCreateForm((prev) => {
        const next = prev.roleIds.includes(roleId)
          ? prev.roleIds.filter((id) => id !== roleId)
          : [...prev.roleIds, roleId];
        return { ...prev, roleIds: next };
      });
      return;
    }

    setEditingRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error('Name, email, and password are required.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...createForm,
          roleIds: createForm.roleIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      toast.success('User created successfully.');
      setCreateForm({ name: '', email: '', password: '', roleIds: [] });
      await loadData();
    } catch (error) {
      toast.error('Unable to create user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (userId: string, status: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('User status updated.');
      await loadData();
    } catch (error) {
      toast.error('Unable to update user status.');
    } finally {
      setIsSaving(false);
    }
  };

  const openRoleEditor = (user: UserSummary) => {
    setEditingUser(user);
    setEditingRoleIds(user.roles.map((role) => role.id));
  };

  const handleRolesSave = async () => {
    if (!editingUser) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roleIds: editingRoleIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to update roles');
      }

      toast.success('User roles updated.');
      setEditingUser(null);
      await loadData();
    } catch (error) {
      toast.error('Unable to update roles.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <AdminNav />

      <main className="flex-1 px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">User Administration</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, statuses, and role assignments.
          </p>
        </div>

        {canCreate && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Create User</CardTitle>
              <CardDescription>Invite a teammate into your organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={createForm.name}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={createForm.email}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Temporary Password</Label>
                  <Input
                    type="password"
                    value={createForm.password}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign Roles</Label>
                <div className="flex flex-wrap gap-3">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={createForm.roleIds.includes(role.id)}
                        onCheckedChange={() => toggleRoleSelection(role.id, 'create')}
                      />
                      {role.name}
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateUser} disabled={isSaving}>
                {isSaving ? 'Creating...' : 'Create user'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Current organization members and access levels.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading users...</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{user.name}</span>
                        {user.is_super_admin && <Badge variant="secondary">Super Admin</Badge>}
                        {user.status !== 'active' && <Badge variant="destructive">Disabled</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.org_name}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {user.roles.length === 0 && <span className="text-muted-foreground">No roles</span>}
                        {user.roles.map((role) => (
                          <Badge key={role.id} variant="outline">
                            {roleNameById.get(role.id) || role.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {canUpdate && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => openRoleEditor(user)}
                          disabled={isSaving}
                        >
                          Edit roles
                        </Button>
                        <Button
                          variant={user.status === 'active' ? 'destructive' : 'default'}
                          onClick={() =>
                            handleStatusChange(user.id, user.status === 'active' ? 'disabled' : 'active')
                          }
                          disabled={isSaving}
                        >
                          {user.status === 'active' ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Roles</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={editingRoleIds.includes(role.id)}
                  onCheckedChange={() => toggleRoleSelection(role.id, 'edit')}
                />
                {role.name}
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleRolesSave} disabled={isSaving}>
              Save roles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
