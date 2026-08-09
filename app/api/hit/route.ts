// Pageview proxy: forwards the anonymous beacon to the platform API.
// Fire-and-forget semantics; the client never waits on analytics.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) return new NextResponse(null, { status: 204 });

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  if (typeof body.path !== 'string' || !body.path.startsWith('/')) {
    return new NextResponse(null, { status: 204 });
  }
  try {
    await fetch(`${upstream}/hit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OQTS-Secret': secret,
        'X-Client-IP': request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      },
      body: JSON.stringify({
        path: body.path.slice(0, 200),
        referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 200) : '',
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {}
  return new NextResponse(null, { status: 204 });
}
