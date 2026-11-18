// components/Navbar.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

const LINKS = [
  { href: '/services', label: 'Services', hint: 'Repairs and prices' },
  { href: '/reviews', label: 'Reviews', hint: '5.0 from 103 reviews' },
  { href: '/track', label: 'Track Repair', hint: 'Follow your repair' },
  { href: '/#visit', label: 'Visit Workshop', hint: '62 Hatton Garden' },
];

const OPEN_MINS = 10 * 60 + 30;
const CLOSE_MINS = 17 * 60 + 30;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DEFAULT_STATUS = { open: false, label: 'Monday to Friday, 10:30am to 5:30pm' };
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=62+Hatton+Garden+London+EC1N+8LR';

const display = 'font-[family-name:var(--font-display)]';
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const hoverOnly = '[@media(hover:hover)]';
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A050]';

// One gutter, shared by header and menu, that also clears landscape notches
const gutter =
  'pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] md:pl-[max(3rem,env(safe-area-inset-left))] md:pr-[max(3rem,env(safe-area-inset-right))]';

const FOCUSABLE = 'a[href],button:not([disabled])';

/* ------------------------------------------------------------------ time */

function getLondonParts() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return { day: get('weekday'), hours: Number(get('hour')), minutes: Number(get('minute')) };
}

function getWorkshopStatus() {
  const { day, hours, minutes } = getLondonParts();
  const mins = hours * 60 + minutes;
  const isWeekday = WEEKDAYS.includes(day);

  if (isWeekday && mins >= OPEN_MINS && mins < CLOSE_MINS) {
    return { open: true, label: 'Open until 5:30pm' };
  }

  let next = 'opens 10:30am';
  if (!isWeekday) next = 'opens Monday 10:30am';
  else if (mins >= CLOSE_MINS) next = day === 'Fri' ? 'opens Monday 10:30am' : 'opens tomorrow 10:30am';
  return { open: false, label: `Closed, ${next}` };
}

/* ------------------------------------------------------------- fragments */

function StatusDot({ open }) {
  return (
    <span aria-hidden="true" className="relative inline-flex h-2 w-2 shrink-0">
      {open && (
        <span className="absolute inset-0 rounded-full bg-[#C9A050]/60 animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite] motion-reduce:hidden" />
      )}
      <span
        className={`relative h-2 w-2 rounded-full ${
          open ? 'bg-[#C9A050]' : 'border border-[#F7F4EE]/45'
        }`}
      />
    </span>
  );
}

// A large dial for the mobile menu. The hands show the real London time.
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = (i * 6 * Math.PI) / 180;
  const outer = 190;
  const inner = i % 5 === 0 ? 164 : 180;
  return {
    x1: 200 + Math.sin(a) * outer,
    y1: 200 - Math.cos(a) * outer,
    x2: 200 + Math.sin(a) * inner,
    y2: 200 - Math.cos(a) * inner,
    major: i % 5 === 0,
  };
});

function DialBackdrop({ open, hourRef, minuteRef, secondRef }) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`pointer-events-none absolute -bottom-24 -right-24 w-[440px] text-[#C9A050] transition-[opacity,transform] duration-[1400px] motion-reduce:transition-none sm:-bottom-32 sm:-right-32 sm:w-[560px] ${ease} ${
        open ? 'rotate-0 scale-100 opacity-[0.16] delay-300' : '-rotate-6 scale-95 opacity-0'
      }`}
    >
      <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      {TICKS.map((t, i) => (
        <line
          key={i}
          x1={t.x1.toFixed(2)}
          y1={t.y1.toFixed(2)}
          x2={t.x2.toFixed(2)}
          y2={t.y2.toFixed(2)}
          stroke="currentColor"
          strokeWidth={t.major ? 3 : 1.2}
        />
      ))}
      <line ref={hourRef} x1="200" y1="200" x2="200" y2="112" stroke="#F7F4EE" strokeWidth="6" strokeLinecap="round" />
      <line ref={minuteRef} x1="200" y1="200" x2="200" y2="62" stroke="#F7F4EE" strokeWidth="4" strokeLinecap="round" />
      <g ref={secondRef}>
        <line x1="200" y1="226" x2="200" y2="44" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="200" cy="200" r="5" fill="currentColor" />
      </g>
      <circle cx="200" cy="200" r="8" fill="currentColor" />
    </svg>
  );
}

/* ---------------------------------------------------------------- navbar */

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [visitInView, setVisitInView] = useState(false);

  const menuOpenRef = useRef(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const progressRef = useRef(null);
  const toggleRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  // Workshop status (London time, client only). Re-evaluated on each minute boundary
  // and whenever the tab becomes visible again.
  useEffect(() => {
    let timer;
    const tick = () => {
      const next = getWorkshopStatus();
      setStatus((prev) => (prev.open === next.open && prev.label === next.label ? prev : next));
      timer = setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer);
        tick();
      }
    };
    tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // Scroll: solid background, hide after a deliberate downward scroll, return after a
  // deliberate upward one (accumulated, so jitter never flips it), and a gold hairline
  // that fills with page progress.
  useEffect(() => {
    let lastY = Math.max(window.scrollY, 0);
    let travel = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;
      lastY = y;
      setScrolled(y > 24);

      if (menuOpenRef.current || y <= 96) {
        travel = 0;
        if (!menuOpenRef.current) setHidden(false);
      } else {
        travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
        if (travel > 14) {
          setHidden(true);
          travel = 0;
        } else if (travel < -14) {
          setHidden(false);
          travel = 0;
        }
      }

      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Mark "Visit Workshop" as current while the #visit section is on screen (home page)
  useEffect(() => {
    if (pathname !== '/') {
      setVisitInView(false);
      return;
    }
    const el = document.getElementById('visit');
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisitInView(entry.isIntersecting), {
      rootMargin: '-35% 0px -35% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  // Close the menu on navigation, and if the viewport grows into the desktop layout
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => e.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Keyboard: Escape closes, Tab stays inside header + menu while the menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes = [
        ...(headerRef.current?.querySelectorAll(FOCUSABLE) ?? []),
        ...(menuRef.current?.querySelectorAll(FOCUSABLE) ?? []),
      ].filter((n) => n.getClientRects().length > 0);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (!nodes.includes(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Move focus into the menu when it opens
  useEffect(() => {
    if (!menuOpen) return;
    const id = requestAnimationFrame(() =>
      menuRef.current?.querySelector('a[href]')?.focus({ preventScroll: true })
    );
    return () => cancelAnimationFrame(id);
  }, [menuOpen]);

  // Lock page scroll while the menu is open, without letting the layout shift
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const header = headerRef.current;
    const gap = window.innerWidth - html.clientWidth;
    const prev = {
      html: html.style.overflow,
      body: body.style.overflow,
      pad: body.style.paddingRight,
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (gap > 0) {
      body.style.paddingRight = `${gap}px`;
      if (header) header.style.paddingRight = `${gap}px`;
    }

    return () => {
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
      body.style.paddingRight = prev.pad;
      if (header) header.style.paddingRight = '';
    };
  }, [menuOpen]);

  // Dial: set to real London time, keep the hands true, sweep the second hand
  useEffect(() => {
    if (!menuOpen || !hourRef.current || !minuteRef.current || !secondRef.current) return;

    const origin = '200 200';
    const setHands = () => {
      const { hours, minutes } = getLondonParts();
      gsap.set(hourRef.current, { rotation: (hours % 12) * 30 + minutes * 0.5, svgOrigin: origin });
      gsap.set(minuteRef.current, { rotation: minutes * 6, svgOrigin: origin });
    };
    setHands();
    const handsTimer = setInterval(setHands, 1000);

    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let tween;
    if (reduceMotion) {
      gsap.set(secondRef.current, { rotation: seconds * 6, svgOrigin: origin });
    } else {
      tween = gsap.fromTo(
        secondRef.current,
        { rotation: seconds * 6, svgOrigin: origin },
        { rotation: seconds * 6 + 360, svgOrigin: origin, duration: 60, repeat: -1, ease: 'none' }
      );
    }

    return () => {
      clearInterval(handsTimer);
      tween?.kill();
    };
  }, [menuOpen]);

  const isActive = (href) => {
    if (href === '/#visit') return pathname === '/' && visitInView;
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const current = (href) => (isActive(href) ? (href.includes('#') ? 'location' : 'page') : undefined);

  const solid = scrolled && !menuOpen;
  const origin =
    'calc(100% - max(var(--g), env(safe-area-inset-right)) - 12px) calc(env(safe-area-inset-top) + 36px)';

  return (
    <>
      {/* Needs <main id="main-content"> on the page */}
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-[#C9A050] focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-[#06100C] ${focusRing}`}
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-[100] border-b pt-[env(safe-area-inset-top)] transition-[transform,background-color,border-color,backdrop-filter] duration-500 ${ease} motion-reduce:transition-none ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          solid
            ? 'border-[#C9A050]/15 bg-[#06100C]/85 backdrop-blur-xl supports-[not(backdrop-filter)]:bg-[#06100C]/95'
            : 'border-transparent bg-transparent'
        }`}
      >
        {/* Soft scrim so links stay legible over a hero image before the bar turns solid */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 -bottom-5 top-0 -z-10 bg-gradient-to-b from-[#06100C]/55 to-transparent transition-opacity duration-500 motion-reduce:transition-none ${
            solid || menuOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <div
          className={`mx-auto flex max-w-7xl items-center justify-between transition-[height] duration-500 motion-reduce:transition-none ${ease} ${gutter} h-[72px] ${
            solid ? 'lg:h-16' : 'lg:h-[72px]'
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            aria-label="The London Watchmaker, home"
            className={`group flex min-w-0 items-center gap-2.5 sm:gap-3 ${focusRing}`}
          >
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={640}
              height={625}
              priority
              sizes="44px"
              className={`h-10 w-auto shrink-0 transition-transform duration-700 motion-reduce:transition-none sm:h-11 ${hoverOnly}:group-hover:scale-[1.05] ${ease}`}
            />
            <span className="flex min-w-0 flex-col leading-none">
              <span
                className={`${display} whitespace-nowrap text-[1.0625rem] font-medium tracking-wide text-[#F7F4EE] min-[400px]:text-xl`}
              >
                The London Watchmaker
              </span>
              <span className="mt-1.5 whitespace-nowrap text-[10px] tracking-[0.2em] text-[#C9A050] min-[400px]:text-[11px]">
                HATTON GARDEN, LONDON
              </span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-8 lg:flex xl:gap-10">
            <nav aria-label="Main" className="flex items-center gap-6 xl:gap-8">
              {LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={current(link.href)}
                    className={`group relative whitespace-nowrap py-2 text-sm tracking-wide transition-colors duration-300 motion-reduce:transition-none ${focusRing} ${
                      active
                        ? 'text-[#F7F4EE]'
                        : `text-[#F7F4EE]/70 ${hoverOnly}:hover:text-[#F7F4EE]`
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-0.5 h-px bg-[#C9A050] transition-transform duration-500 motion-reduce:transition-none ${ease} ${
                        active
                          ? 'origin-left scale-x-100'
                          : `origin-right scale-x-0 ${hoverOnly}:group-hover:origin-left ${hoverOnly}:group-hover:scale-x-100`
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <span className="hidden items-center gap-2.5 whitespace-nowrap text-sm text-[#F7F4EE]/70 xl:flex">
              <StatusDot open={status.open} />
              {status.label}
            </span>

            <Link
              href="/book"
              className={`group relative inline-flex min-h-11 items-center justify-center overflow-hidden whitespace-nowrap bg-[#C9A050] px-6 text-sm font-medium text-[#06100C] transition-transform duration-300 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#F7F4EE] before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] ${hoverOnly}:hover:before:scale-x-100 active:scale-[0.98] motion-reduce:transition-none motion-reduce:before:transition-none ${focusRing}`}
            >
              <span className="relative">Book a bench visit</span>
            </Link>
          </div>

          {/* Mobile toggle: two hairlines that cross into a close mark.
              The negative margin puts the lines, not the hit area, on the gutter. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`relative -mr-[10px] h-11 w-11 shrink-0 touch-manipulation transition-transform duration-200 active:scale-90 motion-reduce:transition-none lg:hidden ${focusRing}`}
          >
            <span
              className={`absolute left-1/2 top-1/2 -ml-3 block h-px w-6 bg-[#C9A050] transition-transform duration-500 motion-reduce:transition-none ${ease}`}
              style={{ transform: menuOpen ? 'translateY(0) rotate(45deg)' : 'translateY(-4px)' }}
            />
            <span
              className={`absolute left-1/2 top-1/2 -ml-3 block h-px w-6 bg-[#C9A050] transition-transform duration-500 motion-reduce:transition-none ${ease}`}
              style={{ transform: menuOpen ? 'translateY(0) rotate(-45deg)' : 'translateY(4px)' }}
            />
          </button>
        </div>

        {/* Page progress, a single gold hairline */}
        <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px">
          <div
            ref={progressRef}
            className="h-full origin-left bg-[#C9A050]/80"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </header>

      {/* Mobile menu: opens like an iris from the toggle. It sits outside the header so the
          header's blur can never clip it. Visibility transitions with the clip, so a closed
          menu is out of the tab order and the accessibility tree, even before hydration. */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-[#06100C] transition-[clip-path,visibility] duration-700 [--g:1.5rem] [-webkit-tap-highlight-color:transparent] motion-reduce:transition-none md:[--g:3rem] lg:hidden ${ease} ${
          menuOpen ? 'visible' : 'invisible'
        }`}
        style={{
          clipPath: menuOpen ? `circle(150% at ${origin})` : `circle(0px at ${origin})`,
        }}
      >
        <DialBackdrop open={menuOpen} hourRef={hourRef} minuteRef={minuteRef} secondRef={secondRef} />

        <div
          className={`relative z-10 mx-auto flex min-h-full max-w-2xl flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(72px+env(safe-area-inset-top)+1rem)] ${gutter}`}
        >
          <nav aria-label="Mobile">
            <ul className="border-t border-[#C9A050]/15">
              {LINKS.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <li
                    key={link.href}
                    className={`border-b border-[#C9A050]/15 transition-[transform,opacity] duration-700 motion-reduce:transition-none ${ease} ${
                      menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                    style={{ transitionDelay: menuOpen ? `${250 + i * 80}ms` : '0ms' }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={current(link.href)}
                      className={`group grid touch-manipulation grid-cols-1 gap-y-1 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-x-6 [@media(min-height:700px)]:py-5 ${focusRing}`}
                    >
                      <span
                        className={`${display} text-[2rem] font-medium leading-tight transition-colors duration-300 motion-reduce:transition-none min-[400px]:text-4xl ${
                          active
                            ? 'text-[#C9A050]'
                            : 'text-[#F7F4EE] group-active:text-[#C9A050]'
                        }`}
                      >
                        {link.label}
                      </span>
                      <span className="text-sm text-[#F7F4EE]/55 sm:text-right">{link.hint}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={`mt-auto pt-10 transition-[transform,opacity] duration-700 motion-reduce:transition-none ${ease} ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? `${250 + LINKS.length * 80}ms` : '0ms' }}
          >
            <p className="flex items-center gap-2.5 text-sm text-[#F7F4EE]/75">
              <StatusDot open={status.open} />
              {status.label}
            </p>

            <Link
              href="/book"
              onClick={() => setMenuOpen(false)}
              className={`group relative mt-5 flex min-h-14 w-full touch-manipulation items-center justify-center overflow-hidden bg-[#C9A050] text-base font-medium text-[#06100C] transition-transform duration-300 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-[#F7F4EE] before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] active:before:scale-x-100 motion-reduce:transition-none motion-reduce:before:transition-none ${focusRing}`}
            >
              <span className="relative">Book a bench visit</span>
            </Link>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <a
                href="tel:+447892883885"
                className={`flex min-h-12 touch-manipulation items-center justify-center border border-[#C9A050]/35 text-sm text-[#F7F4EE] transition-colors duration-300 active:bg-[#C9A050]/10 motion-reduce:transition-none ${focusRing}`}
              >
                Call the workshop
              </a>
              <a
                href="https://wa.me/447892883885"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-12 touch-manipulation items-center justify-center border border-[#C9A050]/35 text-sm text-[#F7F4EE] transition-colors duration-300 active:bg-[#C9A050]/10 motion-reduce:transition-none ${focusRing}`}
              >
                WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 block text-sm leading-relaxed text-[#F7F4EE]/55 transition-colors duration-300 active:text-[#F7F4EE] motion-reduce:transition-none ${focusRing}`}
            >
              Unit 04, Colonial Buildings, 62 Hatton Garden, London EC1N 8LR
              <span className="sr-only"> (opens in Google Maps)</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}