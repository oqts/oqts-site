// Confirm a mailing-list subscription. POST only, for the same reason
// unsubscribe is: a scanner fetching the link would auto-confirm the
// address and defeat the entire point of double opt-in.
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) {
    return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  }
  const form = await request.formData().catch(() => null);
  const token = String(form?.get('token') ?? '');
  if (!token) return NextResponse.redirect(new URL('/confirm?error=1', request.url), 303);

  const res = await fetch(`${upstream}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-OQTS-Secret': secret },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });
  return NextResponse.redirect(
    new URL(res.ok ? '/confirm?done=1' : '/confirm?error=1', request.url),
    { status: 303 },
  );
}
