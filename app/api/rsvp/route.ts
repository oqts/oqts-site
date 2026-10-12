// Proxy for dinner RSVPs. JSON through to the platform API's /rsvp, with
// the shared secret added server-side. The token in the body is the
// guest's whole credential; the API re-checks that they are still
// invited and that the dinner is not over, so nothing here needs to.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) {
    return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 });
  }

  try {
    const res = await fetch(`${upstream}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OQTS-Secret': secret,
        'X-Client-IP': request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  }
}
