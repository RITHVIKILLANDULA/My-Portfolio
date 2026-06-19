'use client'

import { useId } from 'react'

/**
 * Abstract, on-brand backdrop used wherever a literal photo used to sit
 * (intro, hero, work-experience, footer). Dark forged metal + a molten amber
 * glow + a reserved indigo data accent + a faint topographic grid + slow
 * drifting embers. Pure CSS/SVG, fills its parent, decorative only.
 */
const GLOW = {
  intro:  { amber: '60% 38%', indigo: '18% 78%' },
  hero:   { amber: '78% 42%', indigo: '30% 80%' },
  work:   { amber: '50% 70%', indigo: '82% 20%' },
  footer: { amber: '50% 45%', indigo: '20% 30%' },
}

export default function ForgeBackdrop({ variant = 'hero', className = '', style = {} }) {
  const g = GLOW[variant] || GLOW.hero
  const uid = useId().replace(/:/g, '')
  const gridId = `grid-${uid}`
  const fadeId = `gridfade-${uid}`
  const maskId = `gridmask-${uid}`
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `
          radial-gradient(120% 90% at ${g.amber}, rgba(255,122,47,0.16), rgba(255,122,47,0) 55%),
          radial-gradient(120% 90% at ${g.indigo}, rgba(124,120,240,0.10), rgba(124,120,240,0) 50%),
          radial-gradient(140% 120% at 50% 0%, #16121a 0%, #0c0a0d 45%, #08070a 100%)
        `,
        ...style,
      }}
    >
      {/* fine topographic data grid */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.5 }}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={gridId} width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M46 0 L0 0 0 46" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
          </pattern>
          <radialGradient id={fadeId} cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill={`url(#${fadeId})`} />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} mask={`url(#${maskId})`} />
      </svg>

      {/* drifting embers */}
      <span className="fb-ember fb-ember-a" />
      <span className="fb-ember fb-ember-b" />
      <span className="fb-ember fb-ember-c" />

      {/* edge vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(130% 130% at 50% 40%, transparent 55%, rgba(4,3,5,0.55) 100%)',
        }}
      />

      <style jsx>{`
        .fb-ember {
          position: absolute;
          border-radius: 9999px;
          filter: blur(6px);
          opacity: 0.5;
          pointer-events: none;
        }
        .fb-ember-a {
          width: 130px; height: 130px;
          left: 62%; top: 30%;
          background: radial-gradient(circle, rgba(255,160,90,0.55), transparent 70%);
          animation: fb-drift-a 13s ease-in-out infinite;
        }
        .fb-ember-b {
          width: 90px; height: 90px;
          left: 24%; top: 64%;
          background: radial-gradient(circle, rgba(124,120,240,0.45), transparent 70%);
          animation: fb-drift-b 17s ease-in-out infinite;
        }
        .fb-ember-c {
          width: 60px; height: 60px;
          left: 80%; top: 70%;
          background: radial-gradient(circle, rgba(255,122,47,0.40), transparent 70%);
          animation: fb-drift-a 19s ease-in-out infinite reverse;
        }
        @keyframes fb-drift-a {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(-22px,-26px); }
        }
        @keyframes fb-drift-b {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(26px,-18px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fb-ember { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
