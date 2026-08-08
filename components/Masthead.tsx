'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/join', label: 'Join' },
  { href: '/team', label: 'Team' },
  { href: '/oxdaq', label: 'OXDAQ' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

export default function Masthead() {
  const pathname = usePathname();
  return (
    <header className="masthead">
      <div className="wrap bar">
        <Link href="/" className="home" aria-label="Oxford Quantitative Trading Society — home">
          <img src="/brand/logo/oqts-lockup-reverse.svg" alt="" width={182} height={62} />
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
      </div>
    </header>
  );
}
