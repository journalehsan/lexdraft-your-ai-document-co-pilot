import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, getClient } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';

export const runtime = 'nodejs';

const userSelect = `
  SELECT u.id, u.name, u.email, u.status, u.is_super_admin, u.org_id,
         o.name AS org_name,
         COALESCE(
           json_agg(json_build_object('id', r.id, 'name', r.name))
           FILTER (WHERE r.id IS NOT NULL),
           '[]'
         ) AS roles
  FROM users u
  JOIN organizations o ON o.id = u.org_id
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r ON r.id = ur.role_id
`;

export async function GET(req: NextRequest) {
  const auth = await requireAnyPermission(req, ['users:read', 'users:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const params: Array<string> = [];
  let whereClause = '';
  if (!auth.user.is_super_admin) {
    params.push(auth.user.org_id);
    whereClause = 'WHERE u.org_id = $1';
  }

  const result = await query(
    `${userSelect}
     ${whereClause}
     GROUP BY u.id, o.name
     ORDER BY u.created_at DESC`,
    params
  );

  return NextResponse.json({ users: result.rows });
}

export async function POST(req: NextRequest) {
  const auth = await requireAnyPermission(req, ['users:create', 'users:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const { name, email, password, roleIds, orgId } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  const targetOrgId = auth.user.is_super_admin && orgId ? orgId : auth.user.org_id;
  const passwordHash = await bcrypt.hash(password, 10);

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (org_id, name, email, password_hash, status, is_super_admin)
       VALUES ($1, $2, $3, $4, 'active', false)
       RETURNING id`,
      [targetOrgId, name, email, passwordHash]
    );

    if (Array.isArray(roleIds) && roleIds.length > 0) {
      const roleFilter = auth.user.is_super_admin
        ? 'r.id = ANY($1)'
        : 'r.id = ANY($1) AND r.org_id = $2';
      const roleParams = auth.user.is_super_admin
        ? [roleIds]
        : [roleIds, auth.user.org_id];

      const roles = await client.query(
        `SELECT r.id FROM roles r WHERE ${roleFilter}`,
        roleParams
      );

      for (const role of roles.rows) {
        await client.query(
          `INSERT INTO user_roles (user_id, role_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [userResult.rows[0].id, role.id]
        );
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to create user.' }, { status: 400 });
  } finally {
    client.release();
  }

  return NextResponse.json({ ok: true });
}
