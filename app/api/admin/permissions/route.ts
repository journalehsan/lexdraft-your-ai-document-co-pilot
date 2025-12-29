import { NextRequest, NextResponse } from 'next/server';
import { query, getClient } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const auth = await requireAnyPermission(req, ['permissions:read', 'permissions:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const result = await query('SELECT key, description FROM permissions ORDER BY key');
  return NextResponse.json({ permissions: result.rows });
}

export async function POST(req: NextRequest) {
  const auth = await requireAnyPermission(req, [
    'permissions:create',
    'permissions:manage',
  ]);
  if ('response' in auth) {
    return auth.response;
  }

  const { key, description } = await req.json();

  if (!key) {
    return NextResponse.json({ error: 'Permission key is required.' }, { status: 400 });
  }

  // Validate key format
  const keyPattern = /^[a-z0-9]+(:[a-z0-9]+)+$/;
  if (!keyPattern.test(key)) {
    return NextResponse.json(
      { error: 'Permission key must match format like "entity:action".' },
      { status: 400 }
    );
  }

  try {
    const result = await query(
      `INSERT INTO permissions (key, description)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description
       RETURNING id, key, description`,
      [key, description || null]
    );

    return NextResponse.json({ permission: result.rows[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to create permission.' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAnyPermission(req, [
    'permissions:update',
    'permissions:manage',
  ]);
  if ('response' in auth) {
    return auth.response;
  }

  const { key, description } = await req.json();

  if (!key) {
    return NextResponse.json({ error: 'Permission key is required.' }, { status: 400 });
  }

  const updates: string[] = ['updated_at = now()'];
  const values: Array<string> = [key];
  let paramIndex = 1;

  if (description !== undefined) {
    updates.push(`description = $${++paramIndex}`);
    values.push(description || null);
  }

  const result = await query(
    `UPDATE permissions SET ${updates.join(', ')} WHERE key = $1 RETURNING *`,
    values
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Permission not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAnyPermission(req, [
    'permissions:delete',
    'permissions:manage',
  ]);
  if ('response' in auth) {
    return auth.response;
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Permission key is required.' }, { status: 400 });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Check if permission is in use
    const rolePermResult = await client.query(
      'SELECT COUNT(*) as count FROM role_permissions WHERE permission_id = (SELECT id FROM permissions WHERE key = $1)',
      [key]
    );

    if (rolePermResult.rows[0].count > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Cannot delete permission that is assigned to roles.' },
        { status: 400 }
      );
    }

    const result = await client.query(
      'DELETE FROM permissions WHERE key = $1 RETURNING key',
      [key]
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Permission not found.' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to delete permission.' }, { status: 400 });
  } finally {
    client.release();
  }
}
