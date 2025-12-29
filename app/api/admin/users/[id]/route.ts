import { NextRequest, NextResponse } from 'next/server';
import { getClient, query } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';
import bcrypt from 'bcryptjs';

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAnyPermission(req, ['users:read', 'users:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const paramsList: Array<string> = [id];
  let whereClause = 'WHERE u.id = $1';

  if (!auth.user.is_super_admin) {
    paramsList.push(auth.user.org_id);
    whereClause += ' AND u.org_id = $2';
  }

  const result = await query(
    `${userSelect} ${whereClause} GROUP BY u.id, o.name`,
    paramsList
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({ user: result.rows[0] });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAnyPermission(req, ['users:update', 'users:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const { name, email, password, isSuperAdmin } = await req.json();

  const updates: string[] = [];
  const values: Array<string | boolean> = [];
  let paramIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(name);
  }

  if (email !== undefined) {
    updates.push(`email = $${paramIndex++}`);
    values.push(email);
  }

  if (password) {
    updates.push(`password_hash = $${paramIndex++}`);
    values.push(await bcrypt.hash(password, 10));
  }

  if (isSuperAdmin !== undefined && auth.user.is_super_admin) {
    updates.push(`is_super_admin = $${paramIndex++}`);
    values.push(isSuperAdmin);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No updates provided.' }, { status: 400 });
  }

  updates.push(`updated_at = now()`);
  values.push(id);

  const paramsList: Array<string | boolean> = [...values];
  let whereClause = 'WHERE id = $' + paramIndex;

  if (!auth.user.is_super_admin) {
    paramsList.push(auth.user.org_id);
    whereClause += ' AND org_id = $' + (paramIndex + 1);
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Safety check: prevent removing last super admin
    if (isSuperAdmin === false) {
      const superAdminResult = await client.query(
        `SELECT id FROM users WHERE is_super_admin = true`
      );

      if (superAdminResult.rows.length <= 1) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Cannot remove last super admin.' },
          { status: 400 }
        );
      }
    }

    const result = await client.query(
      `UPDATE users SET ${updates.join(', ')} ${whereClause} RETURNING id`,
      paramsList
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to update user.' }, { status: 400 });
  } finally {
    client.release();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireAnyPermission(req, ['users:delete', 'users:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  // Safety check: prevent deleting the current user
  if (id === auth.user.id) {
    return NextResponse.json(
      { error: 'Cannot delete your own account.' },
      { status: 400 }
    );
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Safety check: prevent deleting the last super admin
    const superAdminResult = await client.query(
      `SELECT id FROM users WHERE is_super_admin = true`
    );

    const userToDelete = await client.query(
      `SELECT is_super_admin FROM users WHERE id = $1`,
      [id]
    );

    if (userToDelete.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (
      userToDelete.rows[0].is_super_admin &&
      superAdminResult.rows.length <= 1
    ) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Cannot delete the last super admin.' },
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
      `DELETE FROM users ${whereClause}`,
      paramsList
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to delete user.' }, { status: 400 });
  } finally {
    client.release();
  }
}
