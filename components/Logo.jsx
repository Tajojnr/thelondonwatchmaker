// components/Logo.jsx
import Image from 'next/image';

// The artwork lives at public/brand/logo-mark.png (transparent PNG, 640 x 625)
const MARK_SRC = '/brand/logo-mark.png';
const MARK_W = 640;
const MARK_H = 625;

const display = 'font-[family-name:var(--font-display)]';
const body = 'font-[family-name:var(--font-body)]';

export default function Logo({ variant = 'full', className = '' }) {
  const isIcon = variant === 'icon';

  return (
    <div className={`group flex select-none flex-col items-center justify-center ${className}`}>
      <Image
        src={MARK_SRC}
        width={MARK_W}
        height={MARK_H}
        // The wordmark names the business, so the mark is decorative when text is shown
        alt={isIcon ? 'The London Watchmaker' : ''}
        priority
        sizes={isIcon ? '48px' : '76px'}
        className={`h-auto transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none ${
          isIcon ? 'w-12' : 'mb-2 w-[76px]'
        }`}
      />

      {!isIcon && (
        <>
          <div className="text-center">
            <span className={`${body} block text-[11px] uppercase tracking-[0.45em] text-[#C9A050]`}>
              The
            </span>
            <span
              className={`${display} block text-[length:clamp(17px,2.2vw,23px)] font-medium uppercase leading-tight tracking-[0.18em] text-[#F7F4EE]`}
            >
              London
            </span>
            <span
              className={`${body} block text-[11px] font-medium uppercase tracking-[0.35em] text-[#C9A050]`}
            >
              Watchmaker
            </span>
          </div>

          {variant === 'full' && (
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="h-px w-4 bg-[#C9A050]/40" />
              <span className={`${body} text-[10px] uppercase tracking-[0.25em] text-[#F7F4EE]/70`}>
                Hatton Garden, London
              </span>
              <span className="h-px w-4 bg-[#C9A050]/40" />
            </div>
          )}
        </>
      )}
    </div>
  );
}