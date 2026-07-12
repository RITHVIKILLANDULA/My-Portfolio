'use client'

/**
 * Infinite marquee ticker. Content duplicated for a seamless loop; CSS-driven
 * (compositor only). `reverse` flips direction. Pauses under reduced motion.
 */
export default function Marquee({ items, reverse = false, speed = 36, className = '' }) {
  const row = items.map((it, i) => (
    <span className="mq-item" key={i}>
      {it}<i aria-hidden="true">✦</i>
    </span>
  ))
  return (
    <div className={`mq ${className}`} aria-hidden="true">
      <div className={`mq-track ${reverse ? 'rev' : ''}`} style={{ animationDuration: `${speed}s` }}>
        <div className="mq-row">{row}</div>
        <div className="mq-row">{row}</div>
      </div>
      <style jsx>{`
        .mq { overflow: hidden; white-space: nowrap; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        .mq-track { display: inline-flex; animation: mq-scroll linear infinite; will-change: transform; }
        .mq-track.rev { animation-direction: reverse; }
        .mq-row { display: inline-flex; }
        .mq-item { display: inline-flex; align-items: center; font-family: ui-monospace, monospace; font-size: 0.82rem;
          letter-spacing: 0.14em; text-transform: uppercase; color: #52525B; padding-right: 0.4rem; }
        .mq-item i { font-style: normal; color: rgba(99,102,241,0.55); margin-left: 1.6rem; margin-right: 1.6rem; font-size: 0.6rem; }
        @keyframes mq-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .mq-track { animation: none !important; } }
      `}</style>
    </div>
  )
}
