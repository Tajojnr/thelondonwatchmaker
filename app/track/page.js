// app/track/page.jsx
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const display = 'font-[family-name:var(--font-display)]';
const body = 'font-[family-name:var(--font-body)]';
const ease = [0.22, 1, 0.36, 1];

const PHONE = 'tel:+447892883885';

// One source of truth for the stages. A job only stores its current stage id,
// so "done / current / upcoming" can never drift out of sync.
const STAGES = [
  { id: 'RECEIVED', label: 'Received', note: 'Your watch is booked in at the workshop.' },
  { id: 'DIAGNOSTIC', label: 'Diagnostic', note: 'We are inspecting and testing the movement.' },
  { id: 'PARTS', label: 'Parts sourcing', note: 'We are sourcing the parts your repair needs.' },
  { id: 'BENCH', label: 'On the bench', note: 'Your watchmaker is working on your watch.' },
  { id: 'QC', label: 'Quality control', note: 'Final checks for timekeeping and water resistance.' },
  { id: 'READY', label: 'Ready to collect', note: 'Your watch is ready. Call us to arrange collection.' },
];

// Mock data. In production this lookup runs on the server (a route handler reading
// Firebase), and returns only the watch, stage and update time. Never ship the job
// table, or customer names, to the browser.
const MOCK_JOBS = {
  'LWM-7821': {
    watch: 'Rolex Submariner 116610LN',
    stage: 'BENCH',
    updatedAt: '2025-10-24T10:42:00+01:00',
  },
};

async function lookupJob(ref) {
  await new Promise((r) => setTimeout(r, 350));
  return MOCK_JOBS[ref] ?? null;
}

// "lwm 7821", "LWM7821" and "lwm-7821" all become "LWM-7821"
function normaliseRef(raw) {
  const m = raw.trim().toUpperCase().replace(/\s+/g, '').match(/^LWM-?([A-Z0-9]{3,8})$/);
  return m ? `LWM-${m[1]}` : null;
}

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const formatUpdated = (iso) => {
  const d = new Date(iso);
  return `${dateFmt.format(d)} at ${timeFmt.format(d)}`;
};

function Check() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-2.5 w-2.5 text-[#06100C]">
      <path d="M2.5 6.4 5 8.8l4.5-5.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Timeline({ stageIndex, reduce }) {
  return (
    <ol className="relative">
      {STAGES.map((stage, i) => {
        const done = i < stageIndex || (i === stageIndex && stage.id === 'READY');
        const current = i === stageIndex && !done;
        const last = i === STAGES.length - 1;

        return (
          <motion.li
            key={stage.id}
            aria-current={i === stageIndex ? 'step' : undefined}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease, delay: reduce ? 0 : 0.25 + i * 0.08 }}
            className="grid grid-cols-[1rem_1fr] gap-x-5"
          >
            {/* Dot and the connector down to the next stage */}
            <div className="relative">
              <span
                className={`relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  done
                    ? 'border-[#C9A050] bg-[#C9A050]'
                    : current
                      ? 'border-[#C9A050] bg-[#06100C]'
                      : 'border-white/25 bg-[#06100C]'
                }`}
              >
                {done && <Check />}
                {current && (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A050]" />
                    <span
                      aria-hidden="true"
                      className="absolute -inset-1 rounded-full border border-[#C9A050]/50 motion-safe:animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]"
                    />
                  </>
                )}
              </span>

              {!last && (
                <span aria-hidden="true" className="absolute -bottom-1 left-1/2 top-5 w-px -translate-x-1/2 bg-white/10">
                  {i < stageIndex && (
                    <motion.span
                      initial={reduce ? false : { scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: reduce ? 0 : 0.5, ease, delay: reduce ? 0 : 0.4 + i * 0.12 }}
                      className="absolute inset-0 origin-top bg-[#C9A050]/70"
                    />
                  )}
                </span>
              )}
            </div>

            <div className={last ? '' : 'pb-8'}>
              <p
                className={`${body} text-[15px] leading-4 ${
                  done || current ? 'font-semibold text-white' : 'font-medium text-white/50'
                }`}
              >
                {stage.label}
                {i > stageIndex && <span className="sr-only"> (not started)</span>}
                {done && <span className="sr-only"> (complete)</span>}
              </p>
              {current && (
                <p className={`${body} mt-2 max-w-sm text-sm leading-relaxed text-[#F7F4EE]/70`}>{stage.note}</p>
              )}
              {i === stageIndex && done && (
                <p className={`${body} mt-2 max-w-sm text-sm leading-relaxed text-[#C9A050]`}>{stage.note}</p>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

export default function TrackPage() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [job, setJob] = useState(null);
  const [jobRef, setJobRef] = useState('');
  const [error, setError] = useState(null); // 'format' | 'missing' | 'failed' | null
  const [loading, setLoading] = useState(false);

  const requestId = useRef(0);
  const resultHeadingRef = useRef(null);

  const search = useCallback(async (raw) => {
    const id = ++requestId.current;
    const ref = normaliseRef(raw);

    if (!ref) {
      setJob(null);
      setError('format');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const found = await lookupJob(ref);
      if (id !== requestId.current) return; // a newer search has taken over
      if (found) {
        setJob(found);
        setJobRef(ref);
        setQuery(ref);
        window.history.replaceState(null, '', `?ref=${encodeURIComponent(ref)}`);
      } else {
        setJob(null);
        setError('missing');
      }
    } catch {
      if (id !== requestId.current) return;
      setJob(null);
      setError('failed');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // Deep link from a QR code or message: /track?ref=LWM-7821
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) {
      setQuery(ref);
      search(ref);
    }
  }, [search]);

  // Move focus to the result so keyboard and screen reader users land on it
  useEffect(() => {
    if (job) resultHeadingRef.current?.focus({ preventScroll: false });
  }, [job]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!loading) search(query);
  };

  const stageIndex = job ? Math.max(STAGES.findIndex((s) => s.id === job.stage), 0) : 0;
  const ready = job?.stage === 'READY';

  const errorText = {
    format: 'That does not look like a reference. It starts with LWM, for example LWM-1234.',
    missing: 'We could not find that reference. Check it against your job card, or call the workshop.',
    failed: 'Something went wrong on our side. Please try again, or call the workshop.',
  }[error];

  return (
    <main
      id="main-content"
      className="min-h-dvh bg-[#06100C] pb-24 pt-[calc(72px+env(safe-area-inset-top)+3rem)] text-[#F7F4EE] selection:bg-[#C9A050] selection:text-[#06100C] md:pt-[calc(72px+env(safe-area-inset-top)+4.5rem)]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <header className="mb-10 border-b border-[#C9A050]/20 pb-8 md:mb-12 md:pb-12">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-[#C9A050]" />
                <span className={`${body} text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A050]`}>
                  Hatton Garden workshop • repair updates
                </span>
              </div>
              <h1 className={`${display} text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl`}>
                Track your <span className="italic text-[#C9A050]">repair</span>
              </h1>
            </div>
            <p id="track-help" className={`${body} max-w-md text-sm leading-relaxed text-[#F7F4EE]/65 md:text-base`}>
              Enter the LWM reference number on your job card to see your watch’s progress through
              the workshop.
            </p>
          </div>
        </header>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mb-10 flex max-w-4xl flex-col gap-3 border border-white/10 bg-[#0C1E17] p-4 sm:p-6 md:mb-12 md:flex-row"
        >
          <label htmlFor="track-ref" className="sr-only">
            Repair reference number
          </label>
          <input
            id="track-ref"
            name="reference"
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            placeholder="LWM-1234"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'track-error' : 'track-help'}
            className={`${body} min-h-14 min-w-0 flex-1 border bg-[#06100C] px-5 text-lg font-medium uppercase tracking-wide text-[#F7F4EE] outline-none transition-[border-color,box-shadow] duration-300 placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#F7F4EE]/30 focus:border-[#C9A050] focus:ring-2 focus:ring-[#C9A050]/20 motion-reduce:transition-none ${
              error ? 'border-red-400/70' : 'border-white/10'
            }`}
          />
          <button
            type="submit"
            disabled={loading || query.trim() === ''}
            className="btn-gold min-h-14 touch-manipulation px-8 transition-opacity duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A050] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Finding…' : 'Find repair'}
          </button>
        </form>

        <AnimatePresence mode="wait" initial={false}>
          {error && (
            <motion.p
              key="error"
              id="track-error"
              role="alert"
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease }}
              className={`${body} -mt-4 mb-8 max-w-4xl border border-red-400/25 bg-red-950/25 p-4 text-sm leading-relaxed text-red-200 md:-mt-6`}
            >
              {errorText}{' '}
              <a
                href={PHONE}
                className="whitespace-nowrap font-semibold text-[#F7F4EE] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A050]"
              >
                Call the workshop
              </a>
            </motion.p>
          )}

          {job && !error && (
            <motion.section
              key={jobRef}
              aria-labelledby="track-result-heading"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: reduce ? 0 : 0.7, ease }}
              className="max-w-5xl border border-[#C9A050]/25 bg-[#0C1E17] p-6 text-[#F7F4EE] sm:p-8 md:p-12"
            >
              <div className="mb-8 grid gap-6 border-b border-[#C9A050]/20 pb-8 sm:grid-cols-[1fr_auto] sm:items-end md:mb-10">
                <div className="min-w-0">
                  <p className={`${body} mb-2 text-[10px] uppercase tracking-[0.2em] text-[#C9A050]`}>Timepiece</p>
                  <h2
                    id="track-result-heading"
                    ref={resultHeadingRef}
                    tabIndex={-1}
                    className={`${display} text-2xl leading-snug outline-none md:text-3xl`}
                  >
                    {job.watch}
                  </h2>
                </div>
                <div className="sm:text-right">
                  <p className={`${body} mb-2 text-[10px] uppercase tracking-[0.2em] text-[#C9A050]`}>Reference</p>
                  <p className="font-mono text-lg tabular-nums text-[#F7F4EE] md:text-xl">{jobRef}</p>
                </div>
              </div>

              <p className={`${body} mb-8 text-sm text-[#F7F4EE]/70`}>
                <span className={ready ? 'font-semibold text-[#C9A050]' : 'font-semibold text-[#F7F4EE]'}>
                  {STAGES[stageIndex].label}
                </span>
                <span className="mx-2 text-white/30" aria-hidden="true">
                  /
                </span>
                Step {stageIndex + 1} of {STAGES.length}
              </p>

              <Timeline stageIndex={stageIndex} reduce={reduce} />

              <p className={`${body} mt-8 border-t border-[#C9A050]/15 pt-6 text-xs text-[#F7F4EE]/50 md:mt-10 md:pt-8`}>
                Last updated {formatUpdated(job.updatedAt)}
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}