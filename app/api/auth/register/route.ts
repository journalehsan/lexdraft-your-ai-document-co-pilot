import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, getClient } from '@/lib/server/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  const orgResult = await query(
    'SELECT id FROM organizations ORDER BY created_at ASC LIMIT 1'
  );

  if (orgResult.rows.length === 0) {
    return NextResponse.json({ error: 'Organization not configured.' }, { status: 500 });
  }

  const orgId = orgResult.rows[0].id;
  const passwordHash = await bcrypt.hash(password, 10);

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (org_id, name, email, password_hash, status, is_super_admin)
       VALUES ($1, $2, $3, $4, 'active', false)
       RETURNING id`,
      [orgId, name, email, passwordHash]
    );

    const viewerRole = await client.query(
      'SELECT id FROM roles WHERE org_id = $1 AND name = $2',
      [orgId, 'Viewer']
    );

    if (viewerRole.rows[0]) {
      await client.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [userResult.rows[0].id, viewerRole.rows[0].id]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Unable to register user.' }, { status: 400 });
  } finally {
    client.release();
  }
}
