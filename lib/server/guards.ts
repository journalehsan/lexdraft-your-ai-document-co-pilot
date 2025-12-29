import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionContext } from './session';

export const requireAuth = async (req: NextRequest) => {
  const session = await getSessionContext(req);
  if (!session) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (session.user.status !== 'active') {
    return { response: NextResponse.json({ error: 'Account disabled' }, { status: 403 }) };
  }

  return session;
};

export const requirePermission = async (req: NextRequest, permissionKey: string) => {
  const session = await requireAuth(req);
  if ('response' in session) {
    return session;
  }

  if (session.user.is_super_admin) {
    return session;
  }

  if (!session.permissions.includes(permissionKey)) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return session;
};

export const requireAnyPermission = async (req: NextRequest, permissionKeys: string[]) => {
  const session = await requireAuth(req);
  if ('response' in session) {
    return session;
  }

  if (session.user.is_super_admin) {
    return session;
  }

  const hasPermission = permissionKeys.some((key) => session.permissions.includes(key));
  if (!hasPermission) {
    return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return session;
};
