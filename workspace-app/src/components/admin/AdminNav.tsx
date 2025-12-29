import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/stores/AuthStore';

export function AdminNav() {
  const { hasAnyPermission } = useAuth();
  const canViewUsers = hasAnyPermission(['users:read', 'users:manage']);
  const canViewRoles = hasAnyPermission(['roles:read', 'roles:manage']);

  return (
    <div className="flex items-center gap-2 border-b border-border px-6 py-3 bg-card">
      {canViewUsers && (
        <NavLink
          to="/admin/users"
          className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
          activeClassName="bg-primary/10 text-primary"
        >
          Users
        </NavLink>
      )}
      {canViewRoles && (
        <NavLink
          to="/admin/roles"
          className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
          activeClassName="bg-primary/10 text-primary"
        >
          Roles
        </NavLink>
      )}
    </div>
  );
}
