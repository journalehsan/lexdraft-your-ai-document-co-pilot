import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const DEFAULT_ORG_NAME = process.env.LEXDRAFT_DEFAULT_ORG_NAME || 'LexDraft';
const SUPER_ADMIN_EMAIL = process.env.LEXDRAFT_SUPER_ADMIN_EMAIL || 'admin@lexdraft.local';
const SUPER_ADMIN_PASSWORD = process.env.LEXDRAFT_SUPER_ADMIN_PASSWORD || 'lexdraft_admin';
const SUPER_ADMIN_NAME = process.env.LEXDRAFT_SUPER_ADMIN_NAME || 'LexDraft Admin';

const entities = ['users', 'roles', 'projects', 'files', 'orgs', 'audit_logs', 'providers'];
const actions = ['create', 'read', 'update', 'delete', 'manage'];

const permissions = entities.flatMap((entity) =>
  actions.map((action) => ({
    key: `${entity}:${action}`,
    description: `${action} ${entity}`,
  }))
);

const roleDefinitions = [
  {
    name: 'Admin',
    description: 'Full access to organization settings and data.',
    permissionKeys: permissions.map((permission) => permission.key),
  },
  {
    name: 'Attorney',
    description: 'Manage legal work and view operational data.',
    permissionKeys: [
      'projects:create',
      'projects:read',
      'projects:update',
      'projects:delete',
      'files:create',
      'files:read',
      'files:update',
      'files:delete',
      'users:read',
      'roles:read',
      'orgs:read',
      'audit_logs:read',
      'providers:read',
    ],
  },
  {
    name: 'Paralegal',
    description: 'Draft and update documents with limited admin access.',
    permissionKeys: [
      'projects:create',
      'projects:read',
      'projects:update',
      'files:create',
      'files:read',
      'files:update',
      'users:read',
      'roles:read',
    ],
  },
  {
    name: 'Viewer',
    description: 'Read-only access to projects and files.',
    permissionKeys: [
      'projects:read',
      'files:read',
    ],
  },
];

const ensurePermissions = async (client) => {
  for (const permission of permissions) {
    await client.query(
      `INSERT INTO permissions (key, description)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description`,
      [permission.key, permission.description]
    );
  }
};

const getOrganizationId = async (client) => {
  const result = await client.query(
    `INSERT INTO organizations (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [DEFAULT_ORG_NAME]
  );
  return result.rows[0].id;
};

const ensureRoles = async (client, orgId) => {
  const permissionRows = await client.query('SELECT id, key FROM permissions');
  const permissionIdByKey = new Map(permissionRows.rows.map((row) => [row.key, row.id]));

  for (const role of roleDefinitions) {
    const roleResult = await client.query(
      `INSERT INTO roles (org_id, name, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (org_id, name) DO UPDATE SET description = EXCLUDED.description
       RETURNING id`,
      [orgId, role.name, role.description]
    );
    const roleId = roleResult.rows[0].id;

    await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);

    const permissionIds = role.permissionKeys
      .map((key) => permissionIdByKey.get(key))
      .filter(Boolean);

    for (const permissionId of permissionIds) {
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [roleId, permissionId]
      );
    }
  }
};

const ensureSuperAdmin = async (client, orgId) => {
  const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
  const userResult = await client.query(
    `INSERT INTO users (org_id, name, email, password_hash, status, is_super_admin)
     VALUES ($1, $2, $3, $4, 'active', true)
     ON CONFLICT (email) DO UPDATE SET
       org_id = EXCLUDED.org_id,
       name = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       status = 'active',
       is_super_admin = true
     RETURNING id`,
    [orgId, SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, passwordHash]
  );

  const adminRole = await client.query(
    'SELECT id FROM roles WHERE org_id = $1 AND name = $2',
    [orgId, 'Admin']
  );
  if (adminRole.rows[0]) {
    await client.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userResult.rows[0].id, adminRole.rows[0].id]
    );
  }
};

const run = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to seed the database.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await ensurePermissions(client);
    const orgId = await getOrganizationId(client);
    await ensureRoles(client, orgId);
    await ensureSuperAdmin(client, orgId);
    await client.query('COMMIT');
    console.log('RBAC seed completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('RBAC seed failed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

run();
