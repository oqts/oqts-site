'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/team', label: 'Team' },
  { href: '/research', label: 'Research' },
  { href: '/oxdaq', label: 'OXDAQ' },
  { href: '/events', label: 'Events' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/contact', label: 'Contact' },
];

export default function Masthead() {
  const pathname = usePathname();
  return (
    <header className="masthead">
      <div className="wrap bar">
        <Link href="/" className="home" aria-label="Oxford Quantitative Trading Society, home">
          <img className="logo-full" src="/brand/logo/oqts-lockup-reverse.svg" alt="" width={182} height={62} />
          <img className="logo-mark" src="/brand/logo/oqts-mark-reverse.svg" alt="" width={48} height={48} />
        </Link>
        <nav aria-label="Primary">
          <ul>
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} aria-current={pathname === href ? 'page' : undefined}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/join"
          className="join-cta"
          aria-label="Join"
          aria-current={pathname === '/join' ? 'page' : undefined}
        >
          <span className="jmark" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
