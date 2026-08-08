import type { ReactNode } from 'react';
import CloseRule from './CloseRule';

type Props = {
  eyebrow?: string;
  title?: string;
  id?: string;
  close?: boolean;
  textured?: boolean; // dot field in the right whitespace (brand.md §8)
  children: ReactNode;
};

export default function Section({ eyebrow, title, id, close = true, textured, children }: Props) {
  return (
    <section id={id} className={textured ? 'watermark' : undefined}>
      {(eyebrow || title) && (
        <div className="sec-head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2>{title}</h2>}
        </div>
      )}
      {children}
      {close && <CloseRule />}
    </section>
  );
}
