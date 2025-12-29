import 'server-only';
import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { query } from './db';
import { getUserPermissions, getUserRoles, SessionUser } from './rbac';

export const SESSION_COOKIE = 'lexdraft_session';
const SESSION_TTL_DAYS = 7;
const SESSION_TTL_REMEMBER_DAYS = 30;

const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const createSession = async (userId: string, rememberMe: boolean) => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const days = rememberMe ? SESSION_TTL_REMEMBER_DAYS : SESSION_TTL_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt.toISOString()]
  );

  return { token, expiresAt };
};

export const destroySession = async (token: string) => {
  const tokenHash = hashToken(token);
  await query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
};

export const getSessionContext = async (req: NextRequest) => {
  const rawToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (!rawToken) {
    return null;
  }

  const tokenHash = hashToken(rawToken);
  const result = await query(
    `SELECT s.user_id, s.expires_at,
            u.id, u.org_id, u.name, u.email, u.status, u.is_super_admin,
            o.name AS org_name
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     JOIN organizations o ON o.id = u.org_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [tokenHash]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0] as SessionUser;
  const roles = await getUserRoles(user.id);
  const permissions = await getUserPermissions(user.id, user.is_super_admin);

  return {
    token: rawToken,
    user,
    roles,
    permissions,
  };
};
