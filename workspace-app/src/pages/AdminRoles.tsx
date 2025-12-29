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
  description?: string | null;
  permissions: string[];
}

interface PermissionSummary {
  key: string;
  description?: string | null;
}

export default function AdminRoles() {
  const { hasAnyPermission } = useAuth();
  const canCreate = hasAnyPermission(['roles:create', 'roles:manage']);
  const canUpdate = hasAnyPermission(['roles:update', 'roles:manage']);

  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [permissions, setPermissions] = useState<PermissionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    permissionKeys: [] as string[],
  });

  const [editingRole, setEditingRole] = useState<RoleSummary | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch('/api/admin/roles', { credentials: 'include' }),
        fetch('/api/admin/permissions', { credentials: 'include' }),
      ]);

      if (!rolesRes.ok) {
        throw new Error('Failed to load roles');
      }
      if (!permissionsRes.ok) {
        throw new Error('Failed to load permissions');
      }

      const rolesData = await rolesRes.json();
      const permissionsData = await permissionsRes.json();
      const normalizedRoles = (rolesData.roles || []).map(
        (role: RoleSummary & { permissions: string[] | string }) => ({
          ...role,
          permissions: Array.isArray(role.permissions)
            ? role.permissions
            : JSON.parse(role.permissions || '[]'),
        })
      );
      setRoles(normalizedRoles);
      setPermissions(permissionsData.permissions || []);
    } catch (error) {
      toast.error('Unable to load role data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const permissionLabel = useMemo(() => {
    const map = new Map<string, string>();
    permissions.forEach((permission) => {
      map.set(permission.key, permission.description || permission.key);
    });
    return map;
  }, [permissions]);

  const togglePermissionSelection = (permissionKey: string, target: 'create' | 'edit') => {
    if (target === 'create') {
      setCreateForm((prev) => {
        const next = prev.permissionKeys.includes(permissionKey)
          ? prev.permissionKeys.filter((key) => key !== permissionKey)
          : [...prev.permissionKeys, permissionKey];
        return { ...prev, permissionKeys: next };
      });
      return;
    }

    setEditingPermissions((prev) =>
      prev.includes(permissionKey) ? prev.filter((key) => key !== permissionKey) : [...prev, permissionKey]
    );
  };

  const handleCreateRole = async () => {
    if (!createForm.name) {
      toast.error('Role name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...createForm,
          permissionKeys: createForm.permissionKeys,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create role');
      }

      toast.success('Role created successfully.');
      setCreateForm({ name: '', description: '', permissionKeys: [] });
      await loadData();
    } catch (error) {
      toast.error('Unable to create role.');
    } finally {
      setIsSaving(false);
    }
  };

  const openPermissionEditor = (role: RoleSummary) => {
    setEditingRole(role);
    setEditingPermissions(role.permissions || []);
  };

  const handlePermissionSave = async () => {
    if (!editingRole) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/roles/${editingRole.id}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ permissionKeys: editingPermissions }),
      });

      if (!response.ok) {
        throw new Error('Failed to update permissions');
      }

      toast.success('Role permissions updated.');
      setEditingRole(null);
      await loadData();
    } catch (error) {
      toast.error('Unable to update role permissions.');
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
          <h1 className="text-2xl font-semibold text-foreground">Role Management</h1>
          <p className="text-sm text-muted-foreground">
            Define role access by selecting permissions.
          </p>
        </div>

        {canCreate && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Create Role</CardTitle>
              <CardDescription>Build a custom role for your organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Role Name</Label>
                  <Input
                    value={createForm.name}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="e.g. Senior Counsel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={createForm.description}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
                    placeholder="Short summary of the role"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {permissions.map((permission) => (
                    <label key={permission.key} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={createForm.permissionKeys.includes(permission.key)}
                        onCheckedChange={() => togglePermissionSelection(permission.key, 'create')}
                      />
                      {permission.key}
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateRole} disabled={isSaving}>
                {isSaving ? 'Creating...' : 'Create role'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Current roles and their assigned permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading roles...</p>
            ) : (
              <div className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-4 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{role.name}</div>
                      {role.description && (
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {role.permissions?.length ? (
                          role.permissions.map((permission) => (
                            <Badge key={permission} variant="outline">
                              {permission}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">No permissions assigned</span>
                        )}
                      </div>
                    </div>
                    {canUpdate && (
                      <Button variant="outline" onClick={() => openPermissionEditor(role)}>
                        Edit permissions
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={Boolean(editingRole)} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {permissions.map((permission) => (
              <label key={permission.key} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={editingPermissions.includes(permission.key)}
                  onCheckedChange={() => togglePermissionSelection(permission.key, 'edit')}
                />
                <span>{permissionLabel.get(permission.key) || permission.key}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button onClick={handlePermissionSave} disabled={isSaving}>
              Save permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
