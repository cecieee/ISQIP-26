import { useRef, useEffect } from 'react';
import singleTV from '../assets/singletv.webp';
import black1   from '../assets/black1.webp';
import CRTWarp  from './CRTWarp';

/* --- Easings --- */
const easeInCubic  = (t) => t * t * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* --- Config --- */
// How much of the image height is transparent padding top+bottom
const IMG_VPAD       = 0.30;
// 8 monitors: fills phone screen snugly with zero wasted off-screen compute
const N_TVS          = 8;
// Monitor width relative to viewport
const TV_W_FRAC      = 0.95;

// Max random X jitter (fraction of viewport width)
const JITTER_X       = 0.08;
// Max random tilt on landing (degrees)
const MAX_TILT       = 7;
// Fast, punchy fall durations
const FALL_DUR_FIRST = 700;  // ms
const FALL_DUR_LAST  = 260;  // ms
// Gap between each monitor's fall START (ms)
const FALL_STAGGER   = 110;
// Derived total intro time (~1.47s total)
const TOTAL_INTRO    = (N_TVS - 1) * FALL_STAGGER + FALL_DUR_FIRST;

/* --- Stable per-TV deterministic randoms (module-level, never change) --- */
const _rng = (seed) => { let s = seed | 1; return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xffffffff; }; };
const TV_RAND = Array.from({ length: N_TVS }, (_, i) => {
  const r = _rng(i * 6271 + 1);
  return {
    xJitter:  (r() - 0.5) * 2 * JITTER_X,  // fraction of W
    tilt:     (r() - 0.5) * 2 * MAX_TILT,   // degrees at rest
    startXf:  (r() - 0.5) * 1.5,            // fall-from X fraction of W
    startRot: (r() - 0.5) * 50,             // start rotation
  };
});


/* ─── Styles ─────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;600;700&family=Bruno+Ace&display=swap");

  .mh-track {
    position: relative;
    height: 180vh;
    background: #071110;
  }
  @supports (height: 100svh) { .mh-track { height: 180svh; } }

  .mh-pin {
    position: sticky;
    top: 0; left: 0;
    width: 100%; height: 100vh;
    overflow: hidden;
    background: #071110;
  }
  @supports (height: 100svh) { .mh-pin { height: 100svh; } }

  .mh-tv {
    position: absolute;
    top: 0; left: 0;
    opacity: 0;
    will-change: transform;
    pointer-events: none;
    backface-visibility: hidden;
    filter: drop-shadow(0 6px 14px rgba(0,0,0,0.85));
  }
  .mh-tv img {
    display: block;
    width: 100%; height: 100%;
    object-fit: contain;
  }

  .mh-kicker {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.5rem, 2vw, 0.7rem);
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #0CE644; text-shadow: 0 0 8px rgba(12,230,68,0.5);
    display: flex; flex-direction: column;
    gap: 2px; line-height: 1.5; text-align: center;
  }
  .mh-headline {
    font-family: 'Mechsuit', sans-serif;
    font-size: clamp(3rem, 19vw, 5rem);
    color: #fff; line-height: 0.95; letter-spacing: 0.04em; margin: 0;
    text-shadow: 0 0 20px rgba(12,230,68,0.7), 0 0 50px rgba(12,230,68,0.25), 0 6px 20px rgba(0,0,0,0.9);
    display: inline-block;
  }
  .mh-hl { position: relative; display: inline-block; }
  .mh-hl::before, .mh-hl::after {
    content: attr(data-text);
    position: absolute; top:0; left:0; width:100%; height:100%;
    clip: rect(0,0,0,0);
  }
  .mh-hl::before {
    left: -2px;
    text-shadow: 2px 0 #0CE644, -1px 0 rgba(12,230,68,0.8);
    animation: mh-glitch1 2.2s infinite steps(2,end);
  }
  .mh-hl::after {
    left: 2px;
    text-shadow: -2px 0 #ffffff, 1px 0 #0CE644;
    animation: mh-glitch2 2.6s infinite steps(2,end);
  }
  @keyframes mh-glitch1 {
    0%,100%{clip:rect(0,0,0,0);transform:translate(0,0)}
    8%{clip:rect(14px,9999px,32px,0);transform:translate(-3px,1px)}
    18%{clip:rect(0,0,0,0);transform:translate(0,0)}
    45%{clip:rect(10px,9999px,28px,0);transform:translate(3px,-1px)}
    55%{clip:rect(0,0,0,0);transform:translate(0,0)}
    78%{clip:rect(22px,9999px,44px,0);transform:translate(-3px,1px)}
    86%{clip:rect(0,0,0,0);transform:translate(0,0)}
  }
  @keyframes mh-glitch2 {
    0%,100%{clip:rect(0,0,0,0);transform:translate(0,0)}
    12%{clip:rect(30px,9999px,50px,0);transform:translate(3px,-1px)}
    22%{clip:rect(0,0,0,0);transform:translate(0,0)}
    60%{clip:rect(18px,9999px,36px,0);transform:translate(-2px,1px)}
    70%{clip:rect(0,0,0,0);transform:translate(0,0)}
  }

  .mh-subtitle {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.72rem, 3.2vw, 0.95rem);
    color: #B5DAC0; text-shadow: 0 2px 8px rgba(0,0,0,0.95);
    line-height: 1.5; letter-spacing: 0.06em; margin: 0;
  }
  .mh-btn-p {
    font-family:'Share Tech Mono',monospace; font-size:0.8rem;
    font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
    color:#000; background:#0CE644; border:1px solid #0CE644;
    padding:0.65rem 1.6rem; text-decoration:none; display:inline-block;
    box-shadow:0 0 16px rgba(12,230,68,0.5), inset 0 1px 0 rgba(255,255,255,0.3);
    transition:background 0.2s, box-shadow 0.2s;
  }
  .mh-btn-p:hover {
    background:#16ff52; box-shadow:0 0 26px rgba(12,230,68,0.85);
  }
  .mh-btn-o {
    font-family:'Share Tech Mono',monospace; font-size:0.8rem;
    letter-spacing:0.12em; text-transform:uppercase;
    color:#0CE644; background:rgba(7,17,16,0.7);
    border:1px solid rgba(12,230,68,0.45);
    padding:0.65rem 1.6rem; text-decoration:none; display:inline-block;
    backdrop-filter:blur(6px); transition:border-color 0.2s, background 0.2s;
  }
  .mh-btn-o:hover {
    border-color:#0CE644; background:rgba(12,230,68,0.12);
  }

  .mh-cue {
    position:absolute; bottom:18px; left:50%;
    transform:translateX(-50%);
    display:flex; flex-direction:column; align-items:center; gap:5px; z-index:25;
    font-family:'Share Tech Mono',monospace; font-size:0.58rem;
    letter-spacing:0.2em; text-transform:uppercase; color:#4d7055;
    opacity:0; transition:opacity 0.4s;
  }
  @keyframes mh-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
  .mh-cue-bar {
    width:1px; height:22px;
    background:linear-gradient(to bottom, rgba(12,230,68,0.75), transparent);
    animation:mh-bob 1.4s ease-in-out infinite;
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function HeroMobile() {
  const trackRef   = useRef(null);
  const pinRef     = useRef(null);
  const tvRefs     = useRef([]);
  const cueRef     = useRef(null);
  const contentRef = useRef(null);
  const crtRef     = useRef(null);
  const scrollPRef = useRef(0);
  const heroIdxRef = useRef(Math.round(N_TVS / 2));

  useEffect(() => {
    /* ── Reset scroll ── */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, behavior: 'instant' });

    const pin = pinRef.current;
    if (!pin) return;

    const W = pin.clientWidth  || window.innerWidth;
    const H = pin.clientHeight || window.innerHeight;

    /* --- Layout: compute where each monitor rests in the pile --- */
    const tvW     = W * TV_W_FRAC;
    const tvH     = tvW * 0.58;
    const bodyH   = Math.round(tvH * (1 - IMG_VPAD));

    // Build the pile bottom-up.
    const restY = Array.from({ length: N_TVS }, (_, i) =>
      H - bodyH * (i + 1) - tvH * IMG_VPAD * 0.5
    );

    // restX[i] = left px, centered + jitter
    const restX = TV_RAND.map(r => (W - tvW) / 2 + r.xJitter * W);

    // Pick the hero: monitor whose vertical center is closest to H/2
    const heroIdx = restY.reduce((best, y, i) => {
      const centerY = y + tvH / 2;
      const prev    = restY[best] + tvH / 2;
      return Math.abs(centerY - H / 2) < Math.abs(prev - H / 2) ? i : best;
    }, 0);
    heroIdxRef.current = heroIdx;

    // Fall duration for each monitor: first = slowest, last = fastest
    const fallDur = Array.from({ length: N_TVS }, (_, i) =>
      FALL_DUR_FIRST - (FALL_DUR_FIRST - FALL_DUR_LAST) * (i / (N_TVS - 1))
    );
    // Delay before each monitor starts falling (staggered)
    const fallDelay = Array.from({ length: N_TVS }, (_, i) => i * FALL_STAGGER);

    // Initialise all monitors off-screen top at their random start X
    tvRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.width   = `${tvW}px`;
      el.style.height  = `${tvH}px`;
      el.style.left    = '0px';
      const sx = (W - tvW) / 2 + TV_RAND[i].startXf * W;
      const sr = TV_RAND[i].startRot;
      el.style.transform = `translate3d(${sx}px, ${-tvH - 40}px, 0) rotate(${sr}deg) scale(1)`;
      el.style.opacity = '0';
    });

    /* --- Animation loop --- */
    const introStart = performance.now();
    let landed       = false;
    let smoothScrollP = 0;
    let raf;
    let lastHeroTransform = '';
    let lastHeroOpacity   = -1;
    let lastPileOpacity   = -1;
    const lastTVTransform = Array(N_TVS).fill('');

    const loop = (now) => {
      raf = requestAnimationFrame(loop);

      const introT  = Math.min(now - introStart, TOTAL_INTRO);
      const targetScrollP = scrollPRef.current;

      /* Responsive 0.35 lerp: snaps to finger in 2-3 frames, zero sluggishness */
      smoothScrollP += (targetScrollP - smoothScrollP) * 0.35;
      if (Math.abs(targetScrollP - smoothScrollP) < 0.001) {
        smoothScrollP = targetScrollP;
      }
      const scrollP = smoothScrollP;

      if (!landed && (introT >= TOTAL_INTRO || scrollP > 0.03)) landed = true;

      /* Scroll cue */
      if (cueRef.current)
        cueRef.current.style.opacity = (landed && scrollP < 0.03) ? '1' : '0';

      /* Hero zoom: complete full-bleed expansion within one natural swipe */
      const zoomP = Math.min(1, Math.max(0, scrollP / 0.58));
      const heroZoomP = zoomP * (2 - zoomP); // easeOutQuad
      const isZooming = zoomP > 0.005;

      // Scale up to 8.2x: pushes the outer TV bezel & knobs completely out of the frame!
      const heroScale = 1 + Math.pow(heroZoomP, 1.35) * 7.2;

      // As the monitor scales out of frame, it dissolves into the background
      const heroOpacity = landed
        ? (zoomP > 0.38 ? Math.max(0, 1 - (zoomP - 0.38) / 0.28) : 1)
        : 1;

      // Pile monitors fade away as the hero expands over them
      const pileOpacity = landed
        ? Math.max(0, 1 - zoomP * 2.8)
        : 1;

      // CRTWarp background fades in cleanly, exactly like desktop Hero
      const bgOpacity = Math.max(0, Math.min(1, (zoomP - 0.15) / 0.35));
      if (crtRef.current)
        crtRef.current.style.opacity = String(bgOpacity);

      // Content overlay fades in as monitor goes out of frame
      const contentOp = Math.max(0, Math.min(1, (zoomP - 0.36) / 0.34));
      if (contentRef.current) {
        contentRef.current.style.opacity       = String(contentOp);
        contentRef.current.style.transform     = `scale(${0.92 + contentOp * 0.08})`;
        contentRef.current.style.pointerEvents = contentOp > 0.5 ? 'auto' : 'none';
      }

      /* Update non-hero TVs */
      if (landed) {
        if (Math.abs(pileOpacity - lastPileOpacity) > 0.01) {
          lastPileOpacity = pileOpacity;
          const hi = heroIdxRef.current;
          tvRefs.current.forEach((el, i) => {
            if (!el || i === hi) return;
            if (pileOpacity <= 0.005) {
              el.style.visibility = 'hidden';
            } else {
              el.style.visibility = 'visible';
              el.style.opacity    = String(pileOpacity);
              el.style.transform  = `translate3d(${restX[i]}px, ${restY[i]}px, 0) rotate(${TV_RAND[i].tilt}deg) scale(1)`;
            }
          });
        }
      } else {
        /* Non-hero intro fall animation */
        tvRefs.current.forEach((el, i) => {
          if (!el || i === heroIdxRef.current) return;

          const rand  = TV_RAND[i];
          const tvT   = Math.max(0, introT - fallDelay[i]);
          const dur   = fallDur[i];
          const tvP   = Math.min(1, tvT / dur);

          const sx  = (W - tvW) / 2 + rand.startXf * W;
          const curY = (-tvH - 40) + (restY[i] - (-tvH - 40)) * easeInCubic(tvP);
          const curX = sx + (restX[i] - sx) * easeOutCubic(tvP);
          const curR = rand.startRot * (1 - easeOutCubic(tvP)) + rand.tilt * easeOutCubic(tvP);

          const t = `translate3d(${curX}px, ${curY}px, 0) rotate(${curR}deg) scale(1)`;
          if (t !== lastTVTransform[i]) { el.style.transform = t; lastTVTransform[i] = t; }
          el.style.opacity = String(tvP > 0 ? 1 : 0);
        });
      }

      /* Hero TV */
      const heroEl = tvRefs.current[heroIdxRef.current];
      if (heroEl) {
        const hi    = heroIdxRef.current;
        const rand  = TV_RAND[hi];
        const tvT   = Math.max(0, introT - fallDelay[hi]);
        const dur   = fallDur[hi];
        const tvP   = Math.min(1, tvT / dur);

        const sx     = (W - tvW) / 2 + rand.startXf * W;
        const introY = (-tvH - 40) + (restY[hi] - (-tvH - 40)) * easeInCubic(tvP);
        const introX = sx + (restX[hi] - sx) * easeOutCubic(tvP);
        const introR = rand.startRot * (1 - easeOutCubic(tvP));

        let fy = landed ? restY[hi] : introY;
        let fx = landed ? restX[hi] : introX;
        let fr = landed ? rand.tilt  : introR + rand.tilt * easeOutCubic(tvP);

        /* Smoothstep center glide: zero initial jerk when scroll starts */
        const cy    = H / 2 - tvH / 2;
        const cx    = (W - tvW) / 2;
        const snapE = heroZoomP * heroZoomP * (3 - 2 * heroZoomP);
        fy = fy + (cy - fy) * snapE;
        fx = fx + (cx - fx) * snapE;
        fr = fr * (1 - snapE);

        const nt = `translate3d(${fx}px, ${fy}px, 0) rotate(${fr}deg) scale(${heroScale})`;
        if (nt !== lastHeroTransform) { heroEl.style.transform = nt; lastHeroTransform = nt; }

        const targetHeroOp = landed ? heroOpacity : (tvP > 0 ? 1 : 0);
        if (Math.abs(targetHeroOp - lastHeroOpacity) > 0.01) {
          heroEl.style.opacity = String(targetHeroOp);
          lastHeroOpacity = targetHeroOp;
        }

        heroEl.style.zIndex = isZooming ? '18' : String(hi + 5);
      }
    };

    raf = requestAnimationFrame(loop);

    const onScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      scrollPRef.current = scrollable > 0
        ? Math.min(1, Math.max(0, -rect.top) / scrollable) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* --- Render --- */
  return (
    <>
      <style>{STYLES}</style>

      <section ref={trackRef} id="home" className="mh-track">
        <div ref={pinRef} className="mh-pin">

          {/* Background image - matching desktop Hero */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 0,
              backgroundImage: `url(${black1})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Dot grid */}
          <div style={{
            position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
            backgroundImage:'radial-gradient(circle, rgba(12,230,68,0.055) 1px, transparent 1px)',
            backgroundSize:'28px 28px',
          }}/>

          {/* CRTWarp animated background – identical to desktop Hero */}
          <div
            ref={crtRef}
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.08s linear',
            }}
          >
            <CRTWarp
              color="#0CE644"
              backgroundColor="#071110"
              speed={0.4}
              curvature={0.22}
              scanlineStrength={0.25}
              scanlineFrequency={100}
              waveAmplitude={0.22}
              waveFrequency={2.0}
              bloom={1.0}
              bloomRadius={0.8}
              noise={0.05}
              vignette={0.25}
              brightness={1.05}
              pixelation={1}
              rgbShift={0.01}
              mouseReact={false}
              dpr={0.75}
              fps={30}
            />
          </div>

          {/* Radial overlay */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
              background: 'radial-gradient(ellipse at center, rgba(7,17,16,0.72) 0%, rgba(7,17,16,0.45) 45%, transparent 80%)',
            }}
          />

          {/* Ambient glow left & right matching desktop */}
          <div style={{
            position: 'absolute', bottom: '-5%', left: '0%',
            width: '50vw', height: '45vh', zIndex: 4, pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(12,230,68,0.35) 0%, rgba(12,230,68,0.15) 35%, transparent 70%)',
            filter: 'blur(50px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-5%', right: '0%',
            width: '50vw', height: '45vh', zIndex: 4, pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(12,230,68,0.35) 0%, rgba(12,230,68,0.15) 35%, transparent 70%)',
            filter: 'blur(50px)',
          }} />

          {/* 8 monitors: index 0 = bottom of pile, 7 = top */}
          {Array.from({ length: N_TVS }, (_, i) => (
            <div
              key={i}
              ref={el => { tvRefs.current[i] = el; }}
              className="mh-tv"
              style={{
                zIndex: i + 5,
                transformOrigin: 'center center',
              }}
            >
              <img src={singleTV} alt="" aria-hidden draggable={false} />
            </div>
          ))}

          {/* Hero content */}
          <div
            ref={contentRef}
            style={{
              position:'absolute', inset:0, zIndex:22,
              display:'flex', alignItems:'center', justifyContent:'center',
              opacity:0, transformOrigin:'center center', pointerEvents:'none',
            }}
          >
            <div style={{
              position:'relative', zIndex:1,
              display:'flex', flexDirection:'column', alignItems:'center',
              textAlign:'center', width:'100%',
              padding:'2rem 1.4rem 5rem', gap:'0.75rem',
            }}>
              <div className="mh-kicker">
                <span>IEEE SB College of Engineering Chengannur</span>
                <span style={{ fontSize:'0.82em', letterSpacing:'0.28em', opacity:0.8 }}>Presents</span>
              </div>
              <h1 className="mh-headline">
                <span className="mh-hl" data-text="ISQIP">ISQIP</span>
              </h1>
              <p className="mh-subtitle">Innovate · Build · Transcend</p>
              <div style={{
                display:'flex', flexDirection:'column',
                gap:'0.65rem', width:'100%', maxWidth:'230px', marginTop:'0.5rem',
              }}>
                <a href="#register" className="mh-btn-p">Register Now</a>
                <a href="#tracks"   className="mh-btn-o">Explore Tracks</a>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div ref={cueRef} className="mh-cue">
            <span>Scroll</span>
            <div className="mh-cue-bar"/>
          </div>

        </div>
      </section>
    </>
  );
}
