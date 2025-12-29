import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Plus,
  Key as KeyIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi, type Role, type Permission } from '../api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        adminApi.roles.list(),
        adminApi.permissions.list(),
      ]);
      setRoles(
        rolesRes.roles.map((role) => ({
          ...role,
          users: role.users || [],
          permissions: role.permissions || [],
        }))
      );
      setPermissions(permissionsRes.permissions);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setName(role.name);
    setDescription(role.description || '');
    setSelectedPermissionKeys(role.permissions || []);
    setEditModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setName('');
    setDescription('');
    setSelectedPermissionKeys([]);
    setCreateModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!name) {
      toast({
        title: 'Error',
        description: 'Role name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedRole) {
        await adminApi.roles.update(selectedRole.id, { name, description });
        await adminApi.roles.updatePermissions(
          selectedRole.id,
          selectedPermissionKeys
        );
        toast({ title: 'Success', description: 'Role updated successfully' });
      } else {
        await adminApi.roles.create({ name, description });
        toast({ title: 'Success', description: 'Role created successfully' });
      }
      setEditModalOpen(false);
      setCreateModalOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save role',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      await adminApi.roles.delete(selectedRole.id);
      toast({ title: 'Success', description: 'Role deleted successfully' });
      setDeleteModalOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete role',
        variant: 'destructive',
      });
    }
  };

  const togglePermission = (key: string) => {
    setSelectedPermissionKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleAllPermissions = (
    permissionKeys: string[],
    checked: boolean
  ) => {
    setSelectedPermissionKeys((prev) => {
      const otherPermissions = (prev || []).filter(
        (k) => !permissionKeys.includes(k)
      );
      return checked
        ? [...otherPermissions, ...permissionKeys]
        : otherPermissions;
    });
  };

  const groupPermissions = (perms: Permission[] = []) => {
    const groups: Record<string, Permission[]> = {};
    perms.forEach((p) => {
      const prefix = p.key.split(':')[0];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(p);
    });
    return groups;
  };

  const filteredRoles = (roles || []).filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description &&
        r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const groupedPermissions = groupPermissions(permissions);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Roles</h1>
          <p className="text-muted-foreground">
            Manage roles and assign permissions
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Create Role
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-card border border-border rounded-lg shadow-sm p-6 admin-card hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{role.name}</h3>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {(role.permissions || []).length} permissions
                  </Badge>
                </div>
              </div>
            </div>
            {role.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {role.description}
              </p>
            )}
            {role.users && role.users.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {role.users.slice(0, 3).map((user) => (
                  <Badge key={user.id} variant="secondary" className="text-xs">
                    {user.name}
                  </Badge>
                ))}
                {role.users.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{role.users.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                Edit
              </Button>
              {(!role.users || role.users.length === 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(role)}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={editModalOpen || createModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open && !!selectedRole);
          setCreateModalOpen(open && !selectedRole);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            <DialogDescription>
              {selectedRole
                ? 'Update role details and permissions'
                : 'Create a new role and assign permissions'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Attorney, Paralegal"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this role is for..."
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Permissions</label>
                <Button variant="ghost" size="sm" className="text-xs">
                  Select All
                </Button>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {Object.keys(groupedPermissions).map((prefix) => (
                    <TabsTrigger key={prefix} value={prefix}>
                      {prefix}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all">
                  {Object.entries(groupedPermissions).map(([prefix, perms]) => (
                    <div key={prefix} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm capitalize">
                          {prefix}
                        </h4>
                        <Checkbox
                          checked={(perms || []).every((p) =>
                            selectedPermissionKeys.includes(p.key)
                          )}
                          onCheckedChange={(checked) =>
                            toggleAllPermissions(
                              (perms || []).map((p) => p.key),
                              checked as boolean
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2 ml-4">
                        {perms.map((permission) => (
                          <div
                            key={permission.key}
                            className="flex items-start gap-3 p-2 rounded hover:bg-muted"
                          >
                            <Checkbox
                              checked={selectedPermissionKeys.includes(
                                permission.key
                              )}
                              onCheckedChange={() =>
                                togglePermission(permission.key)
                              }
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {permission.key}
                              </div>
                              {permission.description && (
                                <div className="text-xs text-muted-foreground">
                                  {permission.description}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {Object.entries(groupedPermissions).map(([prefix, perms]) => (
                  <TabsContent key={prefix} value={prefix}>
                    <div className="space-y-2">
                      {perms.map((permission) => (
                        <div
                          key={permission.key}
                          className="flex items-start gap-3 p-2 rounded hover:bg-muted"
                        >
                          <Checkbox
                            checked={selectedPermissionKeys.includes(
                              permission.key
                            )}
                            onCheckedChange={() =>
                              togglePermission(permission.key)
                            }
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {permission.key}
                            </div>
                            {permission.description && (
                              <div className="text-xs text-muted-foreground">
                                {permission.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditModalOpen(false);
                setCreateModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>Save Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              Deleting a role will remove all permission associations.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
