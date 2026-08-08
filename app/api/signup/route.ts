// Proxy to the platform signup API. The browser only ever sees this
// route; the upstream address and shared secret live in env vars.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) {
    return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  }

  let body: { email?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (typeof body.email !== 'string' || body.email.length > 254 || !body.email.includes('@')) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  try {
    const res = await fetch(`${upstream}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OQTS-Secret': secret,
        'X-Client-IP': request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      },
      body: JSON.stringify({ email: body.email, source: typeof body.source === 'string' ? body.source : 'site' }),
      signal: AbortSignal.timeout(6000),
    });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  }
}
