import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  secondary?: boolean;
  children: ReactNode;
};

export default function Btn({ href, secondary, children }: Props) {
  const className = secondary ? 'btn secondary' : 'btn';
  if (href.startsWith('/')) {
    return <Link href={href} className={className}>{children}</Link>;
  }
  return <a href={href} className={className}>{children}</a>;
}
