import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/server/db';
import { createSession, SESSION_COOKIE } from '@/lib/server/session';
import { getUserPermissions, getUserRoles } from '@/lib/server/rbac';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { email, password, rememberMe } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const result = await query(
    `SELECT u.id, u.org_id, u.name, u.email, u.password_hash, u.status, u.is_super_admin,
            o.name AS org_name
     FROM users u
     JOIN organizations o ON o.id = u.org_id
     WHERE u.email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const user = result.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  if (user.status !== 'active') {
    return NextResponse.json({ error: 'Account is disabled.' }, { status: 403 });
  }

  const session = await createSession(user.id, Boolean(rememberMe));
  const permissions = await getUserPermissions(user.id, user.is_super_admin);
  const roles = await getUserRoles(user.id);

  const response = NextResponse.json({
    user: {
      id: user.id,
      orgId: user.org_id,
      orgName: user.org_name,
      name: user.name,
      email: user.email,
      status: user.status,
      isSuperAdmin: user.is_super_admin,
    },
    roles,
    permissions,
  });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: session.token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: session.expiresAt,
  });

  return response;
}
