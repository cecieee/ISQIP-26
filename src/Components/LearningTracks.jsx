import { useEffect, useRef, useState } from 'react';
import mechsuitFont from '../assets/Font/mechsuit/Mechsuit.otf';

/* ------------------------------------------------------------------ */
/*  Content — swap copy freely, structure stays the same               */
/* ------------------------------------------------------------------ */
const TRACKS = [
  {
    id: 1,
    name: 'Understanding VLSI',
    tag: 'EC ISQIP',
    description:
      'Circuit architectures, design methodologies, and where semiconductor tech is headed next.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="9" y="9" width="14" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="13" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
        {[11, 16, 21].map(y => (
          <g key={y}>
            <line x1="2" y1={y} x2="9" y2={y} stroke="currentColor" strokeWidth="1.6" />
            <line x1="23" y1={y} x2="30" y2={y} stroke="currentColor" strokeWidth="1.6" />
          </g>
        ))}
        {[11, 16, 21].map(x => (
          <g key={`v${x}`}>
            <line x1={x} y1="2" x2={x} y2="9" stroke="currentColor" strokeWidth="1.6" />
            <line x1={x} y1="23" x2={x} y2="30" stroke="currentColor" strokeWidth="1.6" />
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Neural Networks & Gen AI',
    tag: 'CS ISQIP',
    description:
      'How modern models are trained, tuned, and shipped — from first principles to generative systems.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="7" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="7" cy="23" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="25" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="25" cy="23" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.2 10.4 13.8 14.6M9.2 21.6 13.8 17.4M18.2 14.6 22.8 10.4M18.2 17.4 22.8 21.6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'From Sunlight to Electricity',
    tag: 'EE ISQIP',
    description:
      'Model, simulate, and evaluate solar PV systems — system design through real-world energy yield.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.6" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 16 + Math.cos(a) * 9, y1 = 16 + Math.sin(a) * 9;
          const x2 = 16 + Math.cos(a) * 13, y2 = 16 + Math.sin(a) * 13;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />;
        })}
      </svg>
    ),
  },
  {
    id: 4,
    name: 'The Future of Computing',
    tag: 'GENERAL ISQIP',
    description:
      'A look past the roadmap — quantum, edge, and the architectures competing to replace silicon-as-usual.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="10" y="10" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="2.6" stroke="currentColor" strokeWidth="1.4" />
        {[8, 16, 24].map(y => (<line key={`l${y}`} x1="2" y1={y} x2="10" y2={y} stroke="currentColor" strokeWidth="1.6" />))}
        {[8, 16, 24].map(y => (<line key={`r${y}`} x1="22" y1={y} x2="30" y2={y} stroke="currentColor" strokeWidth="1.6" />))}
      </svg>
    ),
  },
  {
    id: 5,
    name: 'Evolution of EV',
    tag: 'EE ISQIP',
    description:
      'Battery chemistry, drivetrain design, and the charging infrastructure racing to keep up.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M6 20V13.5a2 2 0 0 1 1.7-2L11 11l2-4h6l2 4 3.3.5a2 2 0 0 1 1.7 2V20" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="4.5" y="20" width="23" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10.5" cy="24.5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21.5" cy="24.5" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M17.5 12.5 14.5 17h3l-2 4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Styles — same visual language as Navbar / Hero                     */
/* ------------------------------------------------------------------ */
const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@500;600;700&display=swap");

  @font-face {
    font-family: 'Mechsuit';
    src: url('${mechsuitFont}') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  .lt-section{
    position: relative;
    background: #0A0D0A;
    background-image: radial-gradient(circle, rgba(12,230,68,0.05) 1px, transparent 1px);
    background-size: 26px 26px;
    padding: clamp(4rem, 10vh, 7rem) clamp(1.25rem, 5vw, 4rem);
    overflow: hidden;
  }
  .lt-section::before{
    content:"";
    position:absolute; inset:0; pointer-events:none; z-index:1;
    background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px);
    mix-blend-mode: multiply;
  }
  .lt-glow{
    position:absolute; top:-10%; left:50%; transform:translateX(-50%);
    width:60vw; height:40vh; max-width:900px;
    background: radial-gradient(ellipse, rgba(12,230,68,0.14) 0%, transparent 70%);
    filter: blur(40px); pointer-events:none; z-index:0;
  }

  .lt-inner{ position:relative; z-index:2; max-width:1240px; margin:0 auto; }

  .lt-eyebrow{
    display:inline-flex; align-items:center; gap:8px;
    font-family:'Share Tech Mono', monospace;
    font-size:.72rem; letter-spacing:.32em; text-transform:uppercase;
    color:#0CE644; margin:0 0 .9rem;
  }
  .lt-eyebrow::before{
    content:''; width:6px; height:6px; border-radius:50%;
    background:#0CE644; box-shadow:0 0 6px #0CE644;
    animation: lt-blink 1.2s step-start infinite;
  }
  @keyframes lt-blink{ 0%,100%{opacity:1} 50%{opacity:0} }

  .lt-title{
    font-family:'Orbitron', sans-serif;
    font-weight: 600;
    color: rgba(12,230,68,0.85);
    text-shadow: 0 0 8px rgba(12,230,68,.35), 0 0 30px rgba(12,230,68,.18);
    font-size: clamp(2.1rem, 6vw, 3.4rem);
    line-height: 1.02;
    letter-spacing: .02em;
    margin: 0 0 .9rem;
  }
  .lt-sub{
    font-family:'Inter', sans-serif;
    font-weight: 400;
    color:#8FAE95;
    font-size: clamp(.9rem, 1.6vw, 1.05rem);
    max-width: 640px;
    line-height:1.65;
    margin: 0 0 clamp(2.5rem, 6vh, 3.5rem);
  }

  .lt-grid{
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(228px, 1fr));
    gap: clamp(1rem, 2.2vw, 1.5rem);
  }

  .lt-card{
    position:relative;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(12,230,68,0.16);
    border-radius: 10px;
    padding: 1.5rem 1.4rem 1.6rem;
    cursor: pointer;
    overflow: hidden;
    text-align: left;
    opacity: 0;
    transform: translateY(22px);
    transition:
      opacity .55s cubic-bezier(.25,.46,.45,.94),
      transform .55s cubic-bezier(.25,.46,.45,.94),
      border-color .25s ease, box-shadow .25s ease, background .25s ease;
  }
  .lt-card.lt-visible{ opacity:1; transform:translateY(0); }

  .lt-card::after{
    /* scanline sweep on hover */
    content:'';
    position:absolute; left:0; right:0; top:-40%;
    height:40%;
    background: linear-gradient(to bottom, transparent, rgba(12,230,68,0.09), transparent);
    transform: translateY(0);
    opacity:0;
    transition: opacity .2s ease;
    pointer-events:none;
  }
  @media (hover:hover){
    .lt-card:hover, .lt-card.lt-active{
      border-color: rgba(12,230,68,0.55);
      background: rgba(12,230,68,0.035);
      box-shadow: 0 10px 34px rgba(0,0,0,0.45), 0 0 22px rgba(12,230,68,0.12);
      transform: translateY(-4px);
    }
    .lt-card:hover::after{ opacity:1; animation: lt-sweep 1.1s ease-in-out; }
  }
  .lt-card.lt-active{
    border-color: rgba(12,230,68,0.6);
    background: rgba(12,230,68,0.04);
  }
  .lt-card:focus-visible{ outline:2px solid #0CE644; outline-offset:3px; }
  @keyframes lt-sweep{ 0%{ top:-40%; } 100%{ top:100%; } }

  .lt-card-top{ display:flex; align-items:flex-start; justify-content:space-between; margin-bottom: 1.1rem; }

  .lt-num{
    font-family:'Share Tech Mono', monospace;
    font-size:.68rem; letter-spacing:.18em; color:#5f7d66;
  }
  .lt-tag{
    font-family:'Share Tech Mono', monospace;
    font-size:.6rem; letter-spacing:.1em; color:#4d6653;
    border:1px solid rgba(12,230,68,0.22); border-radius:3px; padding:2px 6px;
  }

  .lt-icon{
    width: 40px; height:40px; color:#0CE644;
    margin-bottom: .9rem;
    filter: drop-shadow(0 0 6px rgba(12,230,68,0.25));
    transition: transform .35s cubic-bezier(.34,1.56,.64,1);
  }
  .lt-card:hover .lt-icon{ transform: scale(1.08) rotate(-3deg); }

  .lt-name-wrap{ position:relative; display:block; }
  .lt-name{
    font-family:'Inter', sans-serif;
    font-weight:600;
    font-size: 1.05rem;
    color:#EAF4EC;
    margin: 0 0 .55rem;
    letter-spacing:.005em;
  }
  .lt-name-wrap::before, .lt-name-wrap::after{
    content: attr(data-text);
    position:absolute; left:0; top:0; right:0;
    font-family:'Inter', sans-serif; font-weight:600; font-size:1.05rem;
    pointer-events:none; opacity:0;
  }
  @media (hover:hover){
    .lt-card:hover .lt-name-wrap::before{ color:#0CE644; animation: lt-glitch .35s steps(1) forwards; opacity:1; }
    .lt-card:hover .lt-name-wrap::after{ color:#FFAA33; animation: lt-glitch-2 .35s steps(1) forwards; opacity:1; }
  }
  @keyframes lt-glitch{0%{clip-path:inset(0 0 88% 0);transform:translate(-2px,0)}40%{clip-path:inset(40% 0 30% 0);transform:translate(2px,0)}70%{clip-path:inset(0 0 0 0);transform:translate(0,0)}100%{clip-path:inset(0 0 0 0)}}
  @keyframes lt-glitch-2{0%{clip-path:inset(70% 0 5% 0);opacity:.5}45%{opacity:.3}60%{opacity:0}100%{opacity:0}}

  .lt-desc{
    font-family:'Inter', sans-serif;
    font-size:.86rem; line-height:1.6; color:#8FAE95;
    margin:0;
  }

  .lt-reel{
    position:absolute; right:1.1rem; bottom:1.1rem;
    width:22px; height:22px; opacity:.5;
    color:#0CE644;
  }
  .lt-card:hover .lt-reel{ animation: lt-spin 1.6s linear infinite; opacity:.85; }
  @keyframes lt-spin{ to{ transform: rotate(360deg); } }

  .lt-panel{
    margin-top: clamp(1.5rem, 3vh, 2rem);
    border: 1px solid rgba(12,230,68,0.28);
    border-radius: 10px;
    background: rgba(8,12,8,0.6);
    padding: 1.4rem 1.6rem;
    font-family:'Share Tech Mono', monospace;
    color:#B9D6BF;
    font-size:.85rem;
    line-height:1.7;
    display:flex; gap:.6rem;
    max-height: 0;
    opacity: 0;
    overflow:hidden;
    transition: max-height .4s ease, opacity .3s ease, padding .4s ease;
  }
  .lt-panel.lt-panel-open{ max-height: 200px; opacity:1; }
  .lt-panel .lt-caret{ color:#0CE644; flex-shrink:0; }

  @media (prefers-reduced-motion: reduce){
    .lt-card{ transition: opacity .3s ease; transform:none !important; }
    .lt-card:hover{ transform:none; }
    .lt-card:hover .lt-icon, .lt-card:hover .lt-reel{ animation:none; transform:none; }
    .lt-card:hover .lt-name-wrap::before, .lt-card:hover .lt-name-wrap::after{ animation:none; opacity:0; }
    .lt-card::after{ display:none; }
  }
`;

function TrackCard({ track, index, active, onSelect }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.unobserve(el); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      className={`lt-card ${visible ? 'lt-visible' : ''} ${active ? 'lt-active' : ''}`}
      style={{ transitionDelay: visible ? `${index * 70}ms` : '0ms' }}
      onClick={() => onSelect(track.id)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(track.id); } }}
    >
      <div className="lt-card-top">
        <span className="lt-num">TRACK {num}</span>
        <span className="lt-tag">{track.tag}</span>
      </div>

      <div className="lt-icon">{track.icon}</div>

      <span className="lt-name-wrap" data-text={track.name}>
        <h3 className="lt-name">{track.name}</h3>
      </span>

      <p className="lt-desc">{track.description}</p>

      <svg className="lt-reel" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="12" cy="4.5" r="1.1" fill="currentColor" />
        <circle cx="19.5" cy="12" r="1.1" fill="currentColor" />
        <circle cx="12" cy="19.5" r="1.1" fill="currentColor" />
        <circle cx="4.5" cy="12" r="1.1" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function LearningTracks() {
  const [activeId, setActiveId] = useState(null);
  const active = TRACKS.find(t => t.id === activeId) || null;

  return (
    <section id="tracks" className="lt-section">
      <style>{STYLES}</style>
      <div className="lt-glow" aria-hidden="true" />

      <div className="lt-inner">
        <h2 className="lt-title">Learning Tracks</h2>

        <div className="lt-grid">
          {TRACKS.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i} active={track.id === activeId} onSelect={id => setActiveId(cur => (cur === id ? null : id))} />
          ))}
        </div>

        <div className={`lt-panel ${active ? 'lt-panel-open' : ''}`} aria-live="polite">
          {active && (
            <>
              <span className="lt-caret">&gt;</span>
              <span>
                TRACK {String(TRACKS.findIndex(t => t.id === active.id) + 1).padStart(2, '0')} / {active.tag} — {active.description}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}