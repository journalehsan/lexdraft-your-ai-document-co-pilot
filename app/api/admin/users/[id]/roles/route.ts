import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAnyPermission(req, ['users:update', 'users:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const { roleIds } = await req.json();

  if (!Array.isArray(roleIds)) {
    return NextResponse.json({ error: 'roleIds must be an array.' }, { status: 400 });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const userFilter = auth.user.is_super_admin
      ? 'id = $1'
      : 'id = $1 AND org_id = $2';
    const userParams = auth.user.is_super_admin
      ? [id]
      : [id, auth.user.org_id];

    const userResult = await client.query(`SELECT id FROM users WHERE ${userFilter}`, userParams);
    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);

    if (roleIds.length > 0) {
      const roleFilter = auth.user.is_super_admin
        ? 'r.id = ANY($1)'
        : 'r.id = ANY($1) AND r.org_id = $2';
      const roleParams = auth.user.is_super_admin
        ? [roleIds]
        : [roleIds, auth.user.org_id];

      const roles = await client.query(`SELECT r.id FROM roles r WHERE ${roleFilter}`, roleParams);
      for (const role of roles.rows) {
        await client.query(
          `INSERT INTO user_roles (user_id, role_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [id, role.id]
        );
      }
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to update roles.' }, { status: 400 });
  } finally {
    client.release();
  }
}
