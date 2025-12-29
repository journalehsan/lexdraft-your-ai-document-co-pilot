import { NextRequest, NextResponse } from 'next/server';
import { getClient, query } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';

export const runtime = 'nodejs';

const roleSelect = `
  SELECT r.id, r.name, r.description, r.org_id,
         COALESCE(
           json_agg(p.key) FILTER (WHERE p.id IS NOT NULL),
           '[]'
         ) AS permissions
  FROM roles r
  LEFT JOIN role_permissions rp ON rp.role_id = r.id
  LEFT JOIN permissions p ON p.id = rp.permission_id
`;

export async function GET(req: NextRequest) {
  const auth = await requireAnyPermission(req, ['roles:read', 'roles:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const params: Array<string> = [];
  let whereClause = '';
  if (!auth.user.is_super_admin) {
    params.push(auth.user.org_id);
    whereClause = 'WHERE r.org_id = $1';
  }

  const result = await query(
    `${roleSelect}
     ${whereClause}
     GROUP BY r.id
     ORDER BY r.name`,
    params
  );

  return NextResponse.json({ roles: result.rows });
}

export async function POST(req: NextRequest) {
  const auth = await requireAnyPermission(req, ['roles:create', 'roles:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const { name, description, permissionKeys, orgId } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Role name is required.' }, { status: 400 });
  }

  const targetOrgId = auth.user.is_super_admin && orgId ? orgId : auth.user.org_id;

  const client = await getClient();
  try {
    await client.query('BEGIN');
    const roleResult = await client.query(
      `INSERT INTO roles (org_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [targetOrgId, name, description || null]
    );

    if (Array.isArray(permissionKeys) && permissionKeys.length > 0) {
      const permissions = await client.query(
        'SELECT id FROM permissions WHERE key = ANY($1)',
        [permissionKeys]
      );

      for (const permission of permissions.rows) {
        await client.query(
          `INSERT INTO role_permissions (role_id, permission_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [roleResult.rows[0].id, permission.id]
        );
      }
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to create role.' }, { status: 400 });
  } finally {
    client.release();
  }
}
