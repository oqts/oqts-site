'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// First-party pageview beacon into the society's own DB: path + referrer
// hostname only. No cookies, no IDs, nothing personal.
export default function Track() {
  const pathname = usePathname();
  useEffect(() => {
    let referrer = '';
    try {
      referrer = document.referrer ? new URL(document.referrer).hostname : '';
    } catch {}
    const body = JSON.stringify({ path: pathname, referrer });
    if (!navigator.sendBeacon?.('/api/hit', new Blob([body], { type: 'application/json' }))) {
      fetch('/api/hit', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);
  return null;
}
