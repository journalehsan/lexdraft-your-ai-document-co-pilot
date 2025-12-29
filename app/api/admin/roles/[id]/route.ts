import { NextRequest, NextResponse } from 'next/server';
import { getClient, query } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';

export const runtime = 'nodejs';

const roleSelect = `
  SELECT r.id, r.name, r.description, r.org_id,
         COALESCE(
           json_agg(DISTINCT p.key) FILTER (WHERE p.id IS NOT NULL),
           '[]'
         ) AS permissions,
         COALESCE(
           json_agg(DISTINCT json_build_object('id', u.id, 'name', u.name)) FILTER (WHERE u.id IS NOT NULL),
           '[]'
         ) AS users
  FROM roles r
  LEFT JOIN role_permissions rp ON rp.role_id = r.id
  LEFT JOIN permissions p ON p.id = rp.permission_id
  LEFT JOIN user_roles ur ON ur.role_id = r.id
  LEFT JOIN users u ON u.id = ur.user_id
`;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAnyPermission(req, ['roles:read', 'roles:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const paramsList: Array<string> = [id];
  let whereClause = 'WHERE r.id = $1';

  if (!auth.user.is_super_admin) {
    paramsList.push(auth.user.org_id);
    whereClause += ' AND r.org_id = $2';
  }

  const result = await query(
    `${roleSelect} ${whereClause} GROUP BY r.id`,
    paramsList
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
  }

  return NextResponse.json({ role: result.rows[0] });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAnyPermission(req, ['roles:update', 'roles:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const { name, description } = await req.json();

  const updates: string[] = [];
  const values: Array<string> = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name);
  }

  if (description !== undefined) {
    updates.push(`description = $${paramIndex++}`);
    values.push(description || null);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No updates provided.' }, { status: 400 });
  }

  updates.push(`updated_at = now()`);
  values.push(id);

  const paramsList: Array<string> = [...values];
  let whereClause = 'WHERE id = $' + paramIndex;

  if (!auth.user.is_super_admin) {
    paramsList.push(auth.user.org_id);
    whereClause += ' AND org_id = $' + (paramIndex + 1);
  }

  const result = await query(
    `UPDATE roles SET ${updates.join(', ')} ${whereClause} RETURNING id`,
    paramsList
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAnyPermission(req, ['roles:delete', 'roles:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Check if role has assigned users
    const userRoleResult = await client.query(
      'SELECT COUNT(*) as count FROM user_roles WHERE role_id = $1',
      [id]
    );

    if (userRoleResult.rows[0].count > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Cannot delete role with assigned users.' },
        { status: 400 }
      );
    }

    const paramsList: Array<string> = [id];
    let whereClause = 'WHERE id = $1';

    if (!auth.user.is_super_admin) {
      paramsList.push(auth.user.org_id);
      whereClause += ' AND org_id = $2';
    }

    const result = await client.query(
      `DELETE FROM roles ${whereClause}`,
      paramsList
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to delete role.' }, { status: 400 });
  } finally {
    client.release();
  }
}
