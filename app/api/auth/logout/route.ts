import { NextRequest, NextResponse } from 'next/server';
import { destroySession, SESSION_COOKIE } from '@/lib/server/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await destroySession(token);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    path: '/',
    expires: new Date(0),
  });
  return response;
}
