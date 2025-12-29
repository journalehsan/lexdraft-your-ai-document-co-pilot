import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAnyPermission(req, ['users:update', 'users:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const { status } = await req.json();
  if (!['active', 'disabled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }

  const paramsList: Array<string> = [status, params.id];
  let whereClause = 'WHERE id = $2';

  if (!auth.user.is_super_admin) {
    paramsList.push(auth.user.org_id);
    whereClause += ' AND org_id = $3';
  }

  const result = await query(
    `UPDATE users SET status = $1, updated_at = now() ${whereClause}`,
    paramsList
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
