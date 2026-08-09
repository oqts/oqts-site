'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { Sponsor } from '../lib/types';

// The belt is a real horizontal scroller, so a trackpad swipe on a Mac or a
// finger swipe on a phone moves it, and a plain tap still follows the link.
// Between gestures a rAF loop nudges scrollLeft along at DRIFT so the strip
// keeps rotating by itself. The logo set is repeated GROUPS times and the
// resting position is held in the middle group, so the wrap is invisible
// (it moves by exactly one period) and even a hard flick never reaches an
// edge. Wrapping happens only while drifting, never mid-gesture: writing
// scrollLeft during momentum scrolling kills the momentum on iOS.
const REPEATS = 4; // logo set repeats within a group: keeps a group wider than any viewport
const GROUPS = 3; // identical groups: one on screen, one group of runway each way
const DRIFT = 14; // px per second
const SETTLE = 900; // ms of quiet after a gesture before the drift picks up again

export default function SponsorBelt({ sponsors }: { sponsors: Sponsor[] }) {
  const beltRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const belt = beltRef.current;
    const track = belt?.firstElementChild as HTMLElement | null;
    if (!belt || !track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)');
    let group = 0; // width of one group, i.e. the wrap period
    let pos = 0; // float mirror of scrollLeft, which some engines round
    let echo = -1; // the scrollLeft we last wrote, to tell our scrolls from theirs
    let settleAt = 0; // rAF clock: no drift until this moment
    let held = false; // pointer is down on the belt
    let hovered = false;
    let last = 0;
    let raf = 0;

    const moveTo = (x: number) => {
      pos = x;
      belt.scrollLeft = x;
      echo = belt.scrollLeft;
    };
    const settle = () => {
      settleAt = performance.now() + SETTLE;
    };

    // Logos load and reflow after mount, so the period is measured, not assumed.
    const measure = () => {
      const width = track.scrollWidth / GROUPS;
      if (!width || width === group) return;
      const first = group === 0;
      group = width;
      if (first) moveTo(group);
    };

    // Park the position in the middle group. Any correction is a whole
    // number of periods, so the logos on screen do not appear to move.
    const wrap = () => {
      const x = belt.scrollLeft;
      const wrapped = group + ((((x - group) % group) + group) % group);
      if (Math.abs(wrapped - x) > 0.5) moveTo(wrapped);
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(t - last, 100) : 0;
      last = t;
      if (!group || held || hovered || t < settleAt || reduced.matches) {
        pos = belt.scrollLeft; // someone else is driving; keep the mirror honest
        return;
      }
      wrap();
      moveTo(pos + (DRIFT * dt) / 1000);
    };

    const onScroll = () => {
      if (Math.abs(belt.scrollLeft - echo) > 1) {
        pos = belt.scrollLeft;
        settle();
      }
    };
    const onDown = () => {
      held = true;
      settle();
    };
    const onUp = () => {
      held = false;
      settle();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovered = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovered = false;
      held = false;
      settle();
    };

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    belt.addEventListener('scroll', onScroll, { passive: true });
    belt.addEventListener('wheel', settle, { passive: true });
    belt.addEventListener('pointerdown', onDown);
    belt.addEventListener('pointerup', onUp);
    belt.addEventListener('pointercancel', onUp);
    belt.addEventListener('pointerenter', onEnter);
    belt.addEventListener('pointerleave', onLeave);
    measure();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      belt.removeEventListener('scroll', onScroll);
      belt.removeEventListener('wheel', settle);
      belt.removeEventListener('pointerdown', onDown);
      belt.removeEventListener('pointerup', onUp);
      belt.removeEventListener('pointercancel', onUp);
      belt.removeEventListener('pointerenter', onEnter);
      belt.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <Link ref={beltRef} href="/sponsors" className="sponsor-banner" aria-label="Our sponsors">
      <div className="sponsor-track">
        {Array.from({ length: GROUPS }, (_, g) => (
          <div className="group" key={g} aria-hidden={g > 0}>
            {Array.from({ length: REPEATS }, (_, rep) =>
              sponsors.map((s) => (
                <img
                  key={`${rep}-${s.name}`}
                  src={s.logo}
                  alt={g === 0 && rep === 0 ? s.name : ''}
                  draggable={false}
                  style={{ height: s.banner_height ?? 20 }}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </Link>
  );
}
