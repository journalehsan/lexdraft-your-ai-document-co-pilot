import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/stores/AuthStore';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, roles, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access if user is super admin
  if (user.isSuperAdmin) {
    return <>{children}</>;
  }

  // Check if user has admin:access permission
  if (hasPermission('admin:access')) {
    return <>{children}</>;
  }

  // Check if user has Admin role (roles can be strings or objects)
  const hasAdminRole = roles?.some((role: any) => {
    const roleName = typeof role === 'string' ? role : role?.name;
    return roleName === 'Admin' || roleName === 'admin';
  });

  if (hasAdminRole) {
    return <>{children}</>;
  }

  // Not authorized - redirect to workspace
  return <Navigate to="/" replace />;
}
