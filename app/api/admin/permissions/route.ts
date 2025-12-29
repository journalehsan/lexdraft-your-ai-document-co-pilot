import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/server/db';
import { requireAnyPermission } from '@/lib/server/guards';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const auth = await requireAnyPermission(req, ['roles:read', 'roles:manage']);
  if ('response' in auth) {
    return auth.response;
  }

  const result = await query('SELECT key, description FROM permissions ORDER BY key');
  return NextResponse.json({ permissions: result.rows });
}
