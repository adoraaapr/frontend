import {useEffect, useState, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {useIsFetching, useIsMutating} from '@tanstack/react-query';

export default function GlobalTopLoader() {
  const location = useLocation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBusy = isFetching > 0 || isMutating > 0;

  const startLoading = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
    setProgress(prev => (prev > 0 && prev < 85 ? prev : 16));

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress(old => {
        if (old >= 88) return old;
        const inc = Math.max(0.8, (90 - old) * 0.12);
        return Math.min(88, old + inc);
      });
    }, 180);
  };

  const finishLoading = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(100);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        setProgress(0);
      }, 350);
    }, 300);
  };

  // Route change triggers loading bar
  useEffect(() => {
    startLoading();
    const settle = setTimeout(() => {
      if (!isBusy) {
        finishLoading();
      }
    }, 400);
    return () => clearTimeout(settle);
  }, [location.pathname, location.search]);

  // Query / Mutation triggers
  useEffect(() => {
    if (isBusy) {
      startLoading();
    } else {
      finishLoading();
    }
  }, [isBusy]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  // Clamped scooty position so it never overflows off left screen
  const scootyLeft = Math.max(0, Math.min(progress, 98));

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Top track */}
      <div className="h-1.5 w-full bg-emerald-950/15 backdrop-blur-xs relative overflow-visible shadow-xs">
        {/* Progress Bar Fill */}
        <div
          className="h-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)] transition-all duration-200 ease-out"
          style={{width: `${progress}%`}}
        />

        {/* Scooty driving right on the edge of the bar */}
        <div
          className="absolute -top-6 transition-all duration-200 ease-out pointer-events-none"
          style={{
            left: `${scootyLeft}%`,
            transform: 'translateX(-85%) scale(0.85)',
            transformOrigin: 'bottom center'
          }}
        >
          <div className="scooty-bob relative">
            <svg
              width="46"
              height="28"
              viewBox="0 0 160 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md overflow-visible"
            >
              {/* Headlight beam */}
              <polygon points="134,40 185,25 185,60" fill="#fef08a" opacity="0.75" />
              {/* Exhaust puffs */}
              <circle cx="20" cy="74" r="3.5" fill="#94a3b8" className="exhaust-bubble-1" />
              <circle cx="15" cy="73" r="2.5" fill="#cbd5e1" className="exhaust-bubble-2" />
              {/* Exhaust pipe */}
              <path d="M32 75 L20 75" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
              {/* Rear Wheel */}
              <g className="wheel-spin" style={{transformOrigin: '38px 75px'}}>
                <circle cx="38" cy="75" r="14" fill="#1f2937" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="38" cy="75" r="7" fill="#e2e8f0" />
                <circle cx="38" cy="75" r="3" fill="#064e3b" />
              </g>
              {/* Front Wheel */}
              <g className="wheel-spin" style={{transformOrigin: '124px 75px'}}>
                <circle cx="124" cy="75" r="14" fill="#1f2937" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="124" cy="75" r="7" fill="#e2e8f0" />
                <circle cx="124" cy="75" r="3" fill="#064e3b" />
              </g>
              {/* Mudguard */}
              <path d="M24 75 A14 14 0 0 1 52 75 L54 62 L32 62 Z" fill="#064e3b" />
              <path d="M124 75 L118 48 L114 48 L110 75" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
              {/* Floorboard */}
              <path d="M48 68 L100 68 C106 68 110 64 112 55 L118 42 C120 38 124 38 128 42 L132 50 C134 54 130 58 124 60 L108 62 L98 72 L46 72 Z" fill="#10b981" />
              {/* Engine Cover */}
              <path d="M44 68 C42 56 50 48 64 48 L80 48 C84 48 88 56 86 68 Z" fill="#064e3b" />
              {/* Seat */}
              <path d="M52 48 C50 44 54 40 62 40 L88 42 C92 42 94 45 92 48 Z" fill="#1f2937" />
              {/* Stem */}
              <path d="M116 48 L122 28 L116 26" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
              {/* Headlight */}
              <path d="M125 36 L134 38 L134 46 L125 44 Z" fill="#fef08a" stroke="#facc15" strokeWidth="1.5" />
              {/* Ad Box */}
              <rect x="22" y="32" width="26" height="24" rx="3" fill="#10b981" stroke="#064e3b" strokeWidth="2" />
              <rect x="25" y="36" width="20" height="16" rx="2" fill="#064e3b" />
              <text x="35" y="47" fill="#10b981" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">A.</text>
              {/* Rider */}
              <path d="M72 40 C70 30 78 26 86 26 C94 26 98 32 96 42 L88 42 L72 40 Z" fill="#064e3b" />
              <path d="M84 32 L102 32 L114 27" stroke="#064e3b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="86" cy="18" r="9" fill="#10b981" stroke="#064e3b" strokeWidth="2" />
              <path d="M86 16 C90 16 94 18 95 21 L87 21 Z" fill="#0f172a" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

