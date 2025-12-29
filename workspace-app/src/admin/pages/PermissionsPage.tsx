import React, { useState, useEffect } from 'react';
import {
  Key,
  Search,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi, type Permission } from '../api/admin';
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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const res = await adminApi.permissions.list();
      setPermissions(res.permissions);
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

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setKey(permission.key);
    setDescription(permission.description || '');
    setEditModalOpen(true);
  };

  const handleDelete = (permission: Permission) => {
    setSelectedPermission(permission);
    setDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPermission(null);
    setKey('');
    setDescription('');
    setCreateModalOpen(true);
  };

  const handleSavePermission = async () => {
    if (!key) {
      toast({
        title: 'Error',
        description: 'Permission key is required',
        variant: 'destructive',
      });
      return;
    }

    const keyPattern = /^[a-z0-9]+(:[a-z0-9]+)+$/;
    if (!keyPattern.test(key)) {
      toast({
        title: 'Error',
        description: 'Key must match format "entity:action"',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (selectedPermission) {
        await adminApi.permissions.update({ key, description });
        toast({ title: 'Success', description: 'Permission updated successfully' });
      } else {
        await adminApi.permissions.create({ key, description });
        toast({ title: 'Success', description: 'Permission created successfully' });
      }
      setEditModalOpen(false);
      setCreateModalOpen(false);
      loadPermissions();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save permission',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePermission = async () => {
    if (!selectedPermission) return;

    try {
      await adminApi.permissions.delete(selectedPermission.key);
      toast({ title: 'Success', description: 'Permission deleted successfully' });
      setDeleteModalOpen(false);
      loadPermissions();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete permission',
        variant: 'destructive',
      });
    }
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

  const filteredPermissions = (permissions || []).filter(
    (p) =>
      p.key.toLowerCase().includes(search.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const groupedPermissions = groupPermissions(filteredPermissions);

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Permissions
          </h1>
          <p className="text-muted-foreground">
            Define and manage granular permissions
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Create Permission
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedPermissions).map(([prefix, perms]) => (
          <div
            key={prefix}
            className="bg-card border border-border rounded-lg shadow-sm overflow-hidden admin-card"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/50">
              <h3 className="font-semibold text-foreground capitalize">
                {prefix}
              </h3>
              <Badge variant="secondary" className="mt-1 text-xs">
                {perms.length} {perms.length === 1 ? 'permission' : 'permissions'}
              </Badge>
            </div>
            <div className="p-4 space-y-2">
              {perms.map((permission) => (
                <div
                  key={permission.key}
                  className="flex items-start justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">
                      {permission.key}
                    </div>
                    {permission.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {permission.description}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(permission)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(permission)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={editModalOpen || createModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open && !!selectedPermission);
          setCreateModalOpen(open && !selectedPermission);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPermission ? 'Edit Permission' : 'Create Permission'}
            </DialogTitle>
            <DialogDescription>
              {selectedPermission
                ? 'Update permission details'
                : 'Create a new permission for the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Permission Key</label>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g., users:read, projects:create"
                disabled={!!selectedPermission}
              />
              <p className="text-xs text-muted-foreground">
                Format: entity:action (e.g., "users:read", "projects:create")
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this permission allows..."
                rows={3}
              />
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
            <Button onClick={handleSavePermission}>Save Permission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Permission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this permission? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              Deleting a permission will remove it from all roles that have it
              assigned.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePermission}>
              Delete Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
