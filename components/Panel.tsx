import type { ReactNode } from 'react';

export default function Panel({ children }: { children: ReactNode }) {
  return <div className="panel">{children}</div>;
}
