import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/AuthStore';

interface PermissionRouteProps {
  permissions: string[];
  children: React.ReactNode;
}

export default function PermissionRoute({ permissions, children }: PermissionRouteProps) {
  const { hasAnyPermission, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!hasAnyPermission(permissions)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
