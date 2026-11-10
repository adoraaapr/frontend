interface ScootyLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ScootyLoader({
  message = 'Loading your ride…',
  size = 'md',
  className = ''
}: ScootyLoaderProps) {
  const isSm = size === 'sm';

  return (
    <div className={`flex flex-col items-center justify-center py-6 px-4 ${className}`}>
      {/* Scooty Illustration Area */}
      <div className="relative flex flex-col items-center">
        {/* Bobbing Scooter Body */}
        <div className="scooty-bob relative">
          <svg
            width={isSm ? 120 : 160}
            height={isSm ? 75 : 100}
            viewBox="0 0 160 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Headlight beam */}
            <polygon
              points="134,40 185,25 185,60"
              fill="url(#headlight-beam)"
              opacity="0.3"
            />

            {/* Exhaust puffs */}
            <circle cx="20" cy="74" r="3.5" fill="#94a3b8" className="exhaust-bubble-1" />
            <circle cx="16" cy="73" r="2.5" fill="#cbd5e1" className="exhaust-bubble-2" />
            <circle cx="12" cy="72" r="2" fill="#e2e8f0" className="exhaust-bubble-3" />

            {/* Scooter Exhaust Pipe */}
            <path
              d="M32 75 L20 75"
              stroke="#475569"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Rear Wheel */}
            <g className="wheel-spin" style={{ transformOrigin: '38px 75px' }}>
              <circle cx="38" cy="75" r="14" fill="#1f2937" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="38" cy="75" r="8" fill="#e2e8f0" />
              <circle cx="38" cy="75" r="3" fill="#064e3b" />
              <line x1="38" y1="67" x2="38" y2="83" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="30" y1="75" x2="46" y2="75" stroke="#94a3b8" strokeWidth="1.5" />
            </g>

            {/* Front Wheel */}
            <g className="wheel-spin" style={{ transformOrigin: '124px 75px' }}>
              <circle cx="124" cy="75" r="14" fill="#1f2937" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="124" cy="75" r="8" fill="#e2e8f0" />
              <circle cx="124" cy="75" r="3" fill="#064e3b" />
              <line x1="124" y1="67" x2="124" y2="83" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="116" y1="75" x2="132" y2="75" stroke="#94a3b8" strokeWidth="1.5" />
            </g>

            {/* Rear Mudguard / Frame */}
            <path
              d="M24 75 A14 14 0 0 1 52 75 L54 62 L32 62 Z"
              fill="#064e3b"
            />

            {/* Front Fork & Mudguard */}
            <path
              d="M124 75 L118 48 L114 48 L110 75"
              stroke="#64748b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M110 70 A14 14 0 0 1 138 70"
              stroke="#064e3b"
              strokeWidth="4"
              fill="none"
            />

            {/* Floorboard / Base Frame */}
            <path
              d="M48 68 L100 68 C106 68 110 64 112 55 L118 42 C120 38 124 38 128 42 L132 50 C134 54 130 58 124 60 L108 62 L98 72 L46 72 Z"
              fill="#10b981"
            />
            {/* Rubber Foot Mat */}
            <rect x="66" y="66" width="28" height="3" rx="1.5" fill="#064e3b" />

            {/* Main Body Shell / Engine Cover */}
            <path
              d="M44 68 C42 56 50 48 64 48 L80 48 C84 48 88 56 86 68 Z"
              fill="#064e3b"
            />

            {/* Seat */}
            <path
              d="M52 48 C50 44 54 40 62 40 L88 42 C92 42 94 45 92 48 Z"
              fill="#1f2937"
            />

            {/* Handlebar & Stem */}
            <path
              d="M116 48 L122 28 L116 26"
              stroke="#334155"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Handle Grip */}
            <rect x="112" y="24" width="7" height="4" rx="1.5" fill="#0f172a" />
            {/* Rear Mirror */}
            <circle cx="114" cy="20" r="3" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />

            {/* Headlight */}
            <path
              d="M125 36 L134 38 L134 46 L125 44 Z"
              fill="#fef08a"
              stroke="#facc15"
              strokeWidth="1.5"
            />

            {/* Ad Box on the Back Carrier */}
            <rect
              x="22"
              y="32"
              width="26"
              height="24"
              rx="3"
              fill="#10b981"
              stroke="#064e3b"
              strokeWidth="2"
            />
            {/* Ad Box Branding */}
            <rect x="25" y="36" width="20" height="16" rx="2" fill="#064e3b" />
            <text
              x="35"
              y="47"
              fill="#10b981"
              fontSize="7.5"
              fontWeight="900"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              A.
            </text>

            {/* Rider: Body & Helmet */}
            <path
              d="M72 40 C70 30 78 26 86 26 C94 26 98 32 96 42 L88 42 L72 40 Z"
              fill="#064e3b"
            />
            <path
              d="M84 32 L102 32 L114 27"
              stroke="#064e3b"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Helmet */}
            <circle cx="86" cy="18" r="9" fill="#10b981" stroke="#064e3b" strokeWidth="2" />
            {/* Visor */}
            <path
              d="M86 16 C90 16 94 18 95 21 L87 21 Z"
              fill="#0f172a"
            />

            {/* Defs */}
            <defs>
              <linearGradient id="headlight-beam" x1="134" y1="40" x2="185" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Animated Road Track */}
        <div className="w-48 sm:w-60 h-2 mt-1 rounded-full bg-slate-200 overflow-hidden relative border border-slate-300/80 shadow-inner">
          <div className="road-track h-full w-full" />
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-48 sm:w-60 h-1.5 mt-3.5 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full animate-pulse transition-all duration-300 w-full" />
      </div>

      {/* Loading Text */}
      <p className="mt-3 text-xs sm:text-sm font-semibold tracking-wide text-slate-700 flex items-center gap-1.5">
        <span>{message}</span>
        <span className="flex gap-0.5">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
        </span>
      </p>
    </div>
  );
}

