// app/opengraph-image.jsx
import { ImageResponse } from 'next/og';

export const alt = 'The London Watchmaker | Master Watch Repair in Hatton Garden';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Fonts live in app/fonts/ (static .woff files; satori cannot use woff2 or variable fonts)
//   cormorant-garamond-500.woff  (headline + wordmark)
//   jost-400.woff              (small supporting text, echoes dial lettering)
// Each URL must be a plain string literal so the bundler can find the file at build time.
const loadCormorant = () =>
  fetch(new URL('./fonts/cormorant-garamond-500.woff', import.meta.url)).then((r) =>
    r.arrayBuffer()
  );
const loadJost = () =>
  fetch(new URL('./fonts/jost-400.woff', import.meta.url)).then((r) => r.arrayBuffer());

const GOLD = '#C9A050';
const CREAM = '#F7F4EE';
const GREEN = '#0C1E17';
const GREEN_LIGHT = '#112A20';

// Dial geometry (a watch dial set to 10:10, the classic display position)
const DIAL = 520;
const C = DIAL / 2;
const R = 258;
const point = (angleDeg, length) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: C + length * Math.sin(a), y: C - length * Math.cos(a) };
};
const hourTip = point(305, 150);
const minuteTip = point(60, 215);

export default async function OpenGraphImage() {
  const [cormorant, jost] = await Promise.all([
    loadCormorant(),
    loadJost(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: GREEN,
          overflow: 'hidden',
        }}
      >
        {/* Single hairline frame */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: '1px solid rgba(201, 160, 80, 0.35)',
            display: 'flex',
          }}
        />

        {/* The one memorable element: a dial, drawn in gold hairlines */}
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: 55,
            width: DIAL,
            height: DIAL,
            display: 'flex',
          }}
        >
          <svg width={DIAL} height={DIAL} viewBox={`0 0 ${DIAL} ${DIAL}`}>
            <circle cx={C} cy={C} r={R} fill={GREEN_LIGHT} stroke={GOLD} strokeWidth={1.5} />
            <circle cx={C} cy={C} r={R - 52} fill="none" stroke={GOLD} strokeOpacity={0.18} strokeWidth={1} />
            {Array.from({ length: 60 }).map((_, i) => {
              const isHour = i % 5 === 0;
              const outer = point(i * 6, R - 10);
              const inner = point(i * 6, isHour ? R - 44 : R - 26);
              return (
                <line
                  key={i}
                  x1={outer.x}
                  y1={outer.y}
                  x2={inner.x}
                  y2={inner.y}
                  stroke={GOLD}
                  strokeOpacity={isHour ? 0.9 : 0.4}
                  strokeWidth={isHour ? 3 : 1.2}
                />
              );
            })}
            <line x1={C} y1={C} x2={hourTip.x} y2={hourTip.y} stroke={CREAM} strokeWidth={7} strokeLinecap="round" />
            <line x1={C} y1={C} x2={minuteTip.x} y2={minuteTip.y} stroke={CREAM} strokeWidth={4} strokeLinecap="round" />
            <circle cx={C} cy={C} r={9} fill={GOLD} />
            <circle cx={C} cy={C} r={3} fill={GREEN} />
          </svg>
        </div>

        {/* Left column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 540,
            height: '100%',
            padding: '76px 0 76px 84px',
          }}
        >
          {/* Wordmark */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Cormorant',
                fontSize: 34,
                color: GOLD,
                letterSpacing: '0.02em',
              }}
            >
              The London Watchmaker
            </div>
            <div style={{ display: 'flex', fontFamily: 'Jost', fontSize: 18, color: 'rgba(247, 244, 238, 0.6)' }}>
              Hatton Garden, London EC1N
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              display: 'flex',
              fontFamily: 'Cormorant',
              fontSize: 64,
              lineHeight: 1.08,
              color: CREAM,
              letterSpacing: '-0.01em',
            }}
          >
            Your watch, diagnosed at the bench while you wait.
          </div>

          {/* Proof and contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', fontFamily: 'Jost', fontSize: 20, color: 'rgba(247, 244, 238, 0.8)' }}>
              Rolex, Patek Philippe, Cartier and Omega
            </div>
            <div style={{ display: 'flex', height: 1, width: 120, backgroundColor: 'rgba(201, 160, 80, 0.5)' }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'Jost',
                fontSize: 18,
                color: 'rgba(247, 244, 238, 0.6)',
              }}
            >
              <span>5.0 from 103 reviews</span>
              <span style={{ color: GOLD }}>WhatsApp +44 7892 883885</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Cormorant', data: cormorant, style: 'normal', weight: 500 },
        { name: 'Jost', data: jost, style: 'normal', weight: 400 },
      ],
    }
  );
}
