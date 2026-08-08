// Proxy for membership applications. Streams the multipart form through
// to the platform API; enforces the 4 MB CV cap before forwarding
// (Vercel's own request ceiling is 4.5 MB).
import { NextRequest, NextResponse } from 'next/server';

const MAX_CV_BYTES = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const upstream = process.env.SIGNUP_UPSTREAM_URL;
  const secret = process.env.SIGNUP_SHARED_SECRET;
  if (!upstream || !secret) {
    return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 });
  }
  const cv = form.get('cv');
  if (!(cv instanceof File) || cv.type !== 'application/pdf') {
    return NextResponse.json({ error: 'cv_not_pdf' }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: 'cv_too_large' }, { status: 413 });
  }

  try {
    const res = await fetch(`${upstream}/apply`, {
      method: 'POST',
      headers: {
        'X-OQTS-Secret': secret,
        'X-Client-IP': request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      },
      body: form,
      signal: AbortSignal.timeout(15000),
    });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'temporarily_unavailable' }, { status: 503 });
  }
}
