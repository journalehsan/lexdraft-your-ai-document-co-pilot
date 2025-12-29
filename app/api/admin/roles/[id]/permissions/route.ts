import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAnyPermission(req, ['roles:update', 'roles:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const { permissionKeys } = await req.json();
  if (!Array.isArray(permissionKeys)) {
    return NextResponse.json({ error: 'permissionKeys must be an array.' }, { status: 400 });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const roleFilter = auth.user.is_super_admin
      ? 'id = $1'
      : 'id = $1 AND org_id = $2';
    const roleParams = auth.user.is_super_admin
      ? [id]
      : [id, auth.user.org_id];

    const roleResult = await client.query(`SELECT id FROM roles WHERE ${roleFilter}`, roleParams);
    if (roleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    }

    await client.query('DELETE FROM role_permissions WHERE role_id = $1', [id]);

    if (permissionKeys.length > 0) {
      const permissions = await client.query(
        'SELECT id FROM permissions WHERE key = ANY($1)',
        [permissionKeys]
      );

      for (const permission of permissions.rows) {
        await client.query(
          `INSERT INTO role_permissions (role_id, permission_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [id, permission.id]
        );
      }
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to update permissions.' }, { status: 400 });
  } finally {
    client.release();
  }
}
