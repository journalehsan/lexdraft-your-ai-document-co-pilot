import 'server-only';
import { query } from './db';

export interface SessionUser {
  id: string;
  org_id: string;
  name: string;
  email: string;
  status: string;
  is_super_admin: boolean;
  org_name: string;
}

export const getUserRoles = async (userId: string) => {
  const result = await query(
    `SELECT r.id, r.name
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1
     ORDER BY r.name`,
    [userId]
  );

  return result.rows as Array<{ id: string; name: string }>;
};

export const getUserPermissions = async (userId: string, isSuperAdmin: boolean) => {
  if (isSuperAdmin) {
    const result = await query('SELECT key FROM permissions ORDER BY key');
    return result.rows.map((row) => row.key as string);
  }

  const result = await query(
    `SELECT DISTINCT p.key
     FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     JOIN user_roles ur ON ur.role_id = rp.role_id
     WHERE ur.user_id = $1
     ORDER BY p.key`,
    [userId]
  );

  return result.rows.map((row) => row.key as string);
};
