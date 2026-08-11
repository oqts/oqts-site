// One-click unsubscribe (RFC 8058) plus the human fallback.
//
// POST  = actually unsubscribe. Mail clients that support one-click send
//         a POST with body "List-Unsubscribe=One-Click", and so does the
//         button on /unsubscribe.
// GET   = redirect to the page with a button. NEVER unsubscribes.
//
// The GET/POST split is not pedantry. Oxford's inbound mail gateway
// fetches every URL in incoming mail to scan it — we watched it consume
// a one-time login token two seconds after sending. A GET that
// unsubscribed would silently remove people from the list because their
// employer's scanner read their mail.
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  return NextResponse.redirect(
    new URL(`/unsubscribe?token=${encodeURIComponent(token)}`, request.url),
  );
}

export async function POST(request: NextRequest) {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) {
    return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  }

  // The token may arrive in the query string (one-click) or the form body
  // (our own page). Accept both.
  let token = request.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    const form = await request.formData().catch(() => null);
    token = String(form?.get('token') ?? '');
  }
  if (!token) return NextResponse.json({ error: 'missing_token' }, { status: 400 });

  const res = await fetch(`${upstream}/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-OQTS-Secret': secret },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  // A one-click client wants a bare 200 and shows its own confirmation;
  // our own form wants to land on a page that says what happened.
  const fromForm = request.headers.get('content-type')?.includes('form-data')
    || request.headers.get('sec-fetch-mode') === 'navigate';
  if (fromForm) {
    return NextResponse.redirect(
      new URL(res.ok ? '/unsubscribe?done=1' : '/unsubscribe?error=1', request.url),
      { status: 303 },
    );
  }
  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 400 });
}
