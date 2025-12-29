import { NextRequest, NextResponse } from 'next/server';
import { getSessionContext } from '@/lib/server/session';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const session = await getSessionContext(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      orgId: session.user.org_id,
      orgName: session.user.org_name,
      name: session.user.name,
      email: session.user.email,
      status: session.user.status,
      isSuperAdmin: session.user.is_super_admin,
    },
    roles: session.roles,
    permissions: session.permissions,
  });
}
