import { useRef, useEffect, useState, useCallback } from 'react';
import Matter from 'matter-js';
import black1 from '../assets/black1.webp';
import singleTV from '../assets/singletv.webp';
import LazyCRTWarp from './LazyCRTWarp';

/* ─── Injected Styles ─────────────────────────────────────────────────────── */
const HERO_STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&family=Bruno+Ace&display=swap");

  /* The outer scroll track – gives the sticky element room to pin */
  .hero-track {
    position: relative;
    height: 300vh;
    background: #071110;
  }

  /* The sticky viewport frame */
  .hero-pin {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  @supports (height: 100svh) {
    .hero-pin { height: 100svh; }
  }

  /* Full-viewport scene canvas */
  .hero-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle, rgba(12,230,68,0.055) 1px, transparent 1px);
    background-size: 28px 28px;
    background-image: url(${black1});
    background-size: cover;
    background-position: center;
  }

  /* ── Typography ── */
  .hero-kicker {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.65rem, 1.3vw, 0.88rem);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #0CE644;
    text-shadow: 0 0 10px rgba(12,230,68,0.4);
    margin-bottom: 0.2rem;
  }
  @media (max-width:640px) {
    .hero-kicker { font-size: clamp(0.6rem,1.8vw,0.75rem); letter-spacing:0.18em; }
  }

  .hero-headline {
    font-family: 'Mechsuit', sans-serif;
    color: #FFFFFF;
    text-shadow: 0 0 20px rgba(12,230,68,0.7), 0 0 50px rgba(12,230,68,0.3), 0 8px 24px rgba(0,0,0,0.9);
    line-height: 0.95;
    letter-spacing: 0.05em;
    margin: 0;
    font-size: clamp(2.5rem, 15vw, 8.5rem);
    position: relative;
    display: inline-block;
  }
  @media (max-width:640px) { .hero-headline { font-size:clamp(2rem,16vw,3.5rem); line-height:1.05; } }
  @media (max-width:480px) { .hero-headline { font-size:clamp(1.8rem,14vw,2.8rem); } }

  .hero-hl-wrap { position:relative; display:inline-block; }
  .hero-hl-wrap::before, .hero-hl-wrap::after {
    content: attr(data-text);
    position: absolute; top:0; left:0; width:100%; height:100%;
    clip: rect(0,0,0,0);
  }
  .hero-hl-wrap::before {
    left: -3px;
    text-shadow: 3px 0 #0CE644, -2px 0 rgba(12,230,68,0.9);
    animation: glitch1 2.2s infinite steps(2,end);
  }
  .hero-hl-wrap::after {
    left: 3px;
    text-shadow: -3px 0 #ffffff, 2px 0 #0CE644;
    animation: glitch2 2.6s infinite steps(2,end);
  }
  @keyframes glitch1 {
    0%,100%{clip:rect(0,0,0,0);transform:translate(0,0)}
    5%{clip:rect(18px,9999px,42px,0);transform:translate(-6px,1px) skew(-2deg)}
    12%{clip:rect(55px,9999px,80px,0);transform:translate(5px,-1px) skew(1.5deg)}
    18%{clip:rect(0,0,0,0);transform:translate(0,0)}
    38%{clip:rect(70px,9999px,98px,0);transform:translate(-8px,2px) skew(-3deg)}
    45%{clip:rect(12px,9999px,35px,0);transform:translate(6px,-1px) skew(2deg)}
    52%{clip:rect(0,0,0,0);transform:translate(0,0)}
    72%{clip:rect(30px,9999px,60px,0);transform:translate(-5px,1px) skew(1deg)}
    80%{clip:rect(85px,9999px,120px,0);transform:translate(7px,-2px) skew(-2.5deg)}
    88%{clip:rect(0,0,0,0);transform:translate(0,0)}
  }
  @keyframes glitch2 {
    0%,100%{clip:rect(0,0,0,0);transform:translate(0,0)}
    10%{clip:rect(80px,9999px,110px,0);transform:translate(6px,-2px) skew(2.5deg)}
    20%{clip:rect(25px,9999px,50px,0);transform:translate(-5px,1px) skew(-1.5deg)}
    28%{clip:rect(0,0,0,0);transform:translate(0,0)}
    55%{clip:rect(10px,9999px,38px,0);transform:translate(6px,1px) skew(2deg)}
    64%{clip:rect(60px,9999px,90px,0);transform:translate(-7px,-1px) skew(-3deg)}
    72%{clip:rect(0,0,0,0);transform:translate(0,0)}
    88%{clip:rect(45px,9999px,70px,0);transform:translate(5px,-2px) skew(-1deg)}
    94%{clip:rect(95px,9999px,130px,0);transform:translate(-6px,1px) skew(3.5deg)}
  }

  .hero-subtitle {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.85rem, 1.8vw, 1.2rem);
    color: #B5DAC0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.95);
    line-height: 1.6;
    max-width: min(600px, 90vw);
    letter-spacing: 0.06em;
    margin: 1rem auto 0;
    text-align: center;
  }

  .hero-btn-primary {
    display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    padding: clamp(12px,2.6vw,15px) clamp(28px,5vw,38px);
    border-radius:4px; font-size:.85rem; letter-spacing:.14em; text-transform:uppercase;
    font-weight:700; font-family:'Inter',sans-serif; color:#071110; background:#0CE644;
    border:none; cursor:pointer; box-shadow:0 0 24px rgba(12,230,68,0.5);
    transition: all .2s; white-space:nowrap;
  }
  .hero-btn-primary:hover { box-shadow:0 0 35px rgba(12,230,68,0.8); transform:translateY(-2px); }

  .hero-btn-outline {
    display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    padding: clamp(12px,2.6vw,15px) clamp(28px,5vw,38px);
    border-radius:4px; font-size:.85rem; letter-spacing:.14em; text-transform:uppercase;
    font-weight:600; font-family:'Inter',sans-serif; color:#FFFFFF; background:rgba(7,17,16,0.6);
    border:none; cursor:pointer; backdrop-filter:blur(8px);
    transition: all .2s; white-space:nowrap;
  }
  .hero-btn-outline:hover { background:rgba(12,230,68,0.15); color:#0CE644; transform:translateY(-2px); }

  .tv-item {
    position: absolute;
    top: 0; left: 0;
    pointer-events: none;
    will-change: transform, opacity;
  }

  .hero-scroll-cue {
    position:absolute; left:50%; transform:translateX(-50%); bottom:clamp(18px,4vh,32px);
    display:flex; flex-direction:column; align-items:center; gap:8px; z-index:6;
    font-family:'Inter',sans-serif; font-size:.68rem; letter-spacing:.18em;
    text-transform:uppercase; color:#5f7d66;
    transition: opacity 0.4s;
  }
  .hero-scroll-cue .cue-bar {
    width:1px; height:26px;
    background: linear-gradient(to bottom, rgba(12,230,68,.7), transparent);
  }
  @keyframes cue-bounce {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }
  .hero-scroll-cue .cue-bar { animation: cue-bounce 1.4s ease-in-out infinite; }
`;

/* ─── Component ────────────────────────────────────────────────────────────── */
export default function Hero() {
  const trackRef = useRef(null);      // the 300vh scroll track
  const pinRef = useRef(null);        // the sticky 100vh pin
  const animRef = useRef(null);
  const tvStateRef = useRef([]);
  const tvRefs = useRef({});
  const contentRef = useRef(null);
  const crtRef = useRef(null);
  const radialRef = useRef(null);
  const glowRefs = useRef([]);
  const cueRef = useRef(null);
  const scrollPRef = useRef(0);

  const [tvState, setTvState] = useState([]);       // live physics positions
  const [fallDone, setFallDone] = useState(false);  // true once monitors settled
  const [loadingReady, setLoadingReady] = useState(false);

  useEffect(() => {
    const onLoadingComplete = () => setLoadingReady(true);
    window.addEventListener('isqip-loading-complete', onLoadingComplete, { once: true });
    return () => window.removeEventListener('isqip-loading-complete', onLoadingComplete);
  }, []);

  const applyScrollProgress = (p) => {
    const pin = pinRef.current;
    const heroTV = tvStateRef.current.find(tv => tv.hero);
    if (!pin || !heroTV) return;

    const W = pin.clientWidth || window.innerWidth;
    const H = pin.clientHeight || window.innerHeight;
    const isMob = W <= 768;
    const sideOpacity = Math.max(0, 1 - p * 2.5);
    const sideSpread = p * (isMob ? 200 : 400);
    const ease = Math.min(1, Math.pow(p, 0.9));
    const ix = heroTV.x + (W / 2 - heroTV.x) * ease;
    const iy = heroTV.y + (H / 2 - heroTV.y) * ease;
    const heroScale = 1 + Math.pow(p, 1.6) * (isMob ? 18 : 26);
    const heroOpacity = p > 0.38 ? Math.max(0, 1 - (p - 0.38) / 0.28) : 1;
    const contentOpacity = Math.max(0, Math.min(1, (p - 0.38) / 0.28));
    const contentScale = 0.9 + contentOpacity * 0.1;

    tvStateRef.current.forEach(tv => {
      const element = tvRefs.current[tv.uid];
      if (!element) return;

      if (tv.hero) {
        element.style.transform = `translate3d(${ix - tv.w / 2}px, ${iy - tv.h / 2}px, 0) scale(${heroScale}) rotate(${tv.angle * (1 - ease)}rad)`;
        element.style.opacity = String(heroOpacity);
      } else {
        const spreadX = tv.side === 'left' ? -sideSpread : sideSpread;
        element.style.transform = `translate3d(${tv.x - tv.w / 2 + spreadX}px, ${tv.y - tv.h / 2}px, 0) rotate(${tv.angle}rad)`;
        element.style.opacity = String(sideOpacity);
      }
    });

    if (contentRef.current) {
      contentRef.current.style.opacity = String(contentOpacity);
      contentRef.current.style.transform = `scale(${contentScale})`;
      contentRef.current.style.pointerEvents = contentOpacity > 0.6 ? 'auto' : 'none';
    }
    if (crtRef.current) crtRef.current.style.opacity = String(contentOpacity);
    if (radialRef.current) radialRef.current.style.opacity = String(contentOpacity);
    glowRefs.current.forEach(element => {
      if (element) element.style.opacity = String(sideOpacity * 0.9);
    });
    if (cueRef.current) cueRef.current.style.opacity = p < 0.08 ? '1' : '0';
  };

  /* ── Scroll progress ────────────────────────────────────────────────────── */
  useEffect(() => {
    // Disable browser scroll restoration so reload always starts at top
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, behavior: 'instant' });

    const track = trackRef.current;
    const trackTop = track ? track.offsetTop : 0;
    const scrollable = track ? track.offsetHeight - window.innerHeight : 0;

    const readScroll = () => {
      const scrolled = Math.max(0, window.scrollY - trackTop);
      scrollPRef.current = scrollable > 0 ? Math.min(1, scrolled / scrollable) : 0;
      applyScrollProgress(scrollPRef.current);
    };

    const onScroll = () => {
      if (animRef.current) return;
      animRef.current = requestAnimationFrame(() => {
        animRef.current = null;
        readScroll();
      });
    };

    // Delay first read by one frame so the scrollTo(0) above has taken effect
    const initRaf = requestAnimationFrame(() => readScroll());
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(initRaf);
      window.removeEventListener('scroll', onScroll);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  /* ── Matter.js physics – gravity fall intro ─────────────────────────────── */
  useEffect(() => {
    if (!loadingReady) return undefined;

    const pin = pinRef.current;
    if (!pin) return;

    const W = pin.clientWidth  || window.innerWidth;
    const H = pin.clientHeight || window.innerHeight;
    const mob = W <= 768;

    if (mob) {
      const heroW = Math.min(220, W * 0.52);
      const heroH = heroW * 0.58;
      const staticTVs = [
        { uid: 0, x: W * 0.14, y: H * 0.62, angle: -0.08, w: heroW * 0.86, h: heroH * 0.86, hero: false, side: 'left' },
        { uid: 1, x: W * 0.86, y: H * 0.62, angle: 0.08, w: heroW * 0.86, h: heroH * 0.86, hero: false, side: 'right' },
        { uid: 99, x: W / 2, y: H * 0.62, angle: 0, w: heroW, h: heroH, hero: true, side: 'center' },
      ];
      setTvState(staticTVs);
      tvStateRef.current = staticTVs;
      setFallDone(true);
      return;
    }

    const { Engine, World, Bodies, Runner } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 1.5, scale: 0.0018 },
    });

    /* ── TV sizes ── */
    const tvW  = mob ? Math.max(140, Math.min(200, W * 0.38)) : Math.max(300, Math.min(460, W * 0.28));
    const tvH  = tvW * 0.58;
    const htvW = mob ? Math.max(160, Math.min(250, W * 0.48)) : Math.max(340, Math.min(500, W * 0.32));
    const htvH = htvW * 0.58;

    /* ── Bodies ── */
    const mkTV = (x, y, w, h, opts = {}) => Bodies.rectangle(x, y, w * 0.64, h * 0.67, {
      restitution: 0.22, friction: 0.88, frictionStatic: 1.2,
      frictionAir: 0.007, density: 0.006,
      ...opts,
    });

    const sideCfgs = mob
      ? [
          { x: W * 0.10, y: -90,  angle: -0.15, vx: -0.4 },
          { x: W * 0.28, y: -220, angle:  0.10, vx:  0.2 },
          { x: W * 0.90, y: -90,  angle:  0.15, vx:  0.4 },
          { x: W * 0.72, y: -220, angle: -0.10, vx: -0.2 },
        ]
      : [
          { x: W * 0.09, y: -100, angle: -0.15, vx: -0.9 },
          { x: W * 0.22, y: -150, angle:  0.08, vx: -0.3 },
          { x: W * 0.15, y: -340, angle:  0.18, vx:  0.4 },
          { x: W * 0.26, y: -470, angle: -0.12, vx: -0.5 },
          { x: W * 0.91, y: -100, angle:  0.15, vx:  0.9 },
          { x: W * 0.78, y: -150, angle: -0.08, vx:  0.3 },
          { x: W * 0.85, y: -340, angle: -0.18, vx: -0.4 },
          { x: W * 0.74, y: -470, angle:  0.12, vx:  0.5 },
        ];

    const sideW = tvW * 0.64;
    const sideH = tvH * 0.67;

    const sideBodies = sideCfgs.map((c, i) => {
      const b = mkTV(c.x, c.y, tvW, tvH, { angle: c.angle });
      Matter.Body.setVelocity(b, { x: c.vx, y: Math.random() * 1.5 + 0.5 });
      Matter.Body.setAngularVelocity(b, c.angle * 0.15);
      b._uid  = i;
      b._w    = tvW;
      b._h    = tvH;
      b._hero = false;
      b._side = c.x < W / 2 ? 'left' : 'right';
      return b;
    });

    /* hero TV – drops slightly later (delay via higher initial y) */
    const heroBody = mkTV(W / 2, -300, htvW, htvH, {
      density: 0.012, restitution: 0.18, frictionAir: 0.005, angle: 0.003,
    });
    Matter.Body.setVelocity(heroBody, { x: 0, y: 2.5 });
    heroBody._uid  = 99;
    heroBody._w    = htvW;
    heroBody._h    = htvH;
    heroBody._hero = true;
    heroBody._side = 'center';

    /* floor & walls */
    const floor = Bodies.rectangle(W / 2, H + 50, W * 3, 100, { isStatic: true, friction: 0.9, restitution: 0.2 });
    const lWall = Bodies.rectangle(-40, H / 2, 80, H * 4, { isStatic: true });
    const rWall = Bodies.rectangle(W + 40, H / 2, 80, H * 4, { isStatic: true });

    World.add(engine.world, [...sideBodies, heroBody, floor, lWall, rWall]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    /* ── Render loop ── */
    let raf;
    const allBodies = [...sideBodies, heroBody];
    let lastUpdate = 0;
    const frameInterval = 1000 / 30;

    const loop = () => {
      const now = performance.now();
      const snapshot = allBodies.map(b => ({
        uid:   b._uid,
        x:     b.position.x,
        y:     b.position.y,
        angle: b.angle,
        w:     b._w,
        h:     b._h,
        hero:  b._hero,
        side:  b._side,
        vx:    b.velocity.x,
        vy:    b.velocity.y,
      }));

      if (now - lastUpdate >= frameInterval) {
        lastUpdate = now;
        tvStateRef.current = snapshot;
        setTvState(snapshot);
      }

      // Detect when all bodies have settled (very low speed)
      const moving = allBodies.some(b => Math.abs(b.velocity.y) > 0.3 || Math.abs(b.velocity.x) > 0.3);
      if (!moving) {
        setFallDone(true);
        cancelAnimationFrame(raf);
        Runner.stop(runner);
        return;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      Runner.stop(runner);
      Engine.clear(engine);
      World.clear(engine.world, false);
    };
  }, [loadingReady]);

  /* ── Derived scroll values ──────────────────────────────────────────────── */
  const isMob = typeof window !== 'undefined' && window.innerWidth <= 768;
  const W = pinRef.current ? pinRef.current.clientWidth  : (typeof window !== 'undefined' ? window.innerWidth  : 1200);
  const H = pinRef.current ? pinRef.current.clientHeight : (typeof window !== 'undefined' ? window.innerHeight : 800);

  const heroTV = tvState.find(t => t.hero);

  // scrollP: 0 = monitors just fell, 1 = fully zoomed in
  // We split into two sub-phases:
  //   Phase A (0 → 0.4): monitors spread + hero monitor zooms toward screen center
  //   Phase B (0.4 → 1): hero content fades in fully
  const p = scrollPRef.current;

  // Side monitors: spread outward and fade
  const sideOpacity = Math.max(0, 1 - p * 2.5);
  const sideSpread  = p * (isMob ? 200 : 400);

  // Hero monitor: interpolate toward center + zoom
  const hx = heroTV ? heroTV.x : W / 2;
  const hy = heroTV ? heroTV.y : H * 0.72;
  const ease = Math.min(1, Math.pow(p, 0.9));
  const ix = hx + (W / 2 - hx) * ease;
  const iy = hy + (H / 2 - hy) * ease;
  const heroScale = 1 + Math.pow(p, 1.6) * (isMob ? 18 : 26);
  const heroOpacity = p > 0.38 ? Math.max(0, 1 - (p - 0.38) / 0.28) : 1;

  // Hero content: emerges as monitor fades out
  const contentOpacity = Math.max(0, Math.min(1, (p - 0.38) / 0.28));
  const contentScale   = 0.9 + contentOpacity * 0.1;

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{HERO_STYLES}</style>

      {/* 300vh scroll track — gives the page room to scroll */}
      <section
        ref={trackRef}
        id="home"
        className="hero-track"
      >
        {/* Sticky 100vh pin */}
        <div ref={pinRef} className="hero-pin">

          {/* Background image */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 0,
              backgroundImage: `url(${black1})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Dot-grid overlay */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(circle, rgba(12,230,68,0.055) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* CRTWarp background – fades in with hero content */}
          <div
            ref={crtRef}
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              opacity: contentOpacity,
              pointerEvents: 'none',
              transition: 'opacity 0.1s linear',
            }}
          >
            <LazyCRTWarp
              active={contentOpacity > 0}
              delay={250}
              preload
              color="#0CE644"
              backgroundColor="#071110"
              speed={0.4}
              curvature={0.22}
              scanlineStrength={0.25}
              scanlineFrequency={isMob ? 100 : 180}
              waveAmplitude={0.22}
              waveFrequency={2.0}
              bloom={1.1}
              bloomRadius={0.9}
              noise={0.06}
              vignette={0.25}
              brightness={1.05}
              pixelation={1}
              rgbShift={0.01}
              mouseReact={!isMob}
              mouseStrength={0.35}
              dpr={isMob ? 0.75 : 0.85}
              fps={30}
            />
          </div>

          {/* Radial overlay */}
          <div
            ref={radialRef}
            style={{
              position: 'absolute', inset: 0, zIndex: 3,
              background: 'radial-gradient(ellipse at center, rgba(7,17,16,0.72) 0%, rgba(7,17,16,0.45) 45%, transparent 80%)',
              opacity: contentOpacity, pointerEvents: 'none',
            }}
          />

          {/* Ambient glow left */}
          <div ref={element => { glowRefs.current[0] = element; }} style={{
            position: 'absolute', bottom: '-5%', left: '0%',
            width: '40vw', height: '50vh', zIndex: 4, pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(12,230,68,0.35) 0%, rgba(12,230,68,0.15) 35%, transparent 70%)',
            filter: 'blur(55px)',
            opacity: sideOpacity * 0.9,
          }} />
          {/* Ambient glow right */}
          <div ref={element => { glowRefs.current[1] = element; }} style={{
            position: 'absolute', bottom: '-5%', right: '0%',
            width: '40vw', height: '50vh', zIndex: 4, pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(12,230,68,0.35) 0%, rgba(12,230,68,0.15) 35%, transparent 70%)',
            filter: 'blur(55px)',
            opacity: sideOpacity * 0.9,
          }} />

          {/* Side TVs */}
          {tvState.filter(t => !t.hero).map(tv => {
            const spreadX = tv.side === 'left' ? -sideSpread : sideSpread;
            return (
              <div
                key={tv.uid}
                ref={element => { tvRefs.current[tv.uid] = element; }}
                className="tv-item"
                style={{
                  width: `${tv.w}px`, height: `${tv.h}px`,
                  transform: `translate3d(${tv.x - tv.w / 2 + spreadX}px, ${tv.y - tv.h / 2}px, 0) rotate(${tv.angle}rad)`,
                  opacity: sideOpacity,
                  zIndex: 5,
                  filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.85))',
                }}
              >
                <img src={singleTV} alt="" aria-hidden="true" draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            );
          })}

          {/* Hero (center) TV – zooms toward camera on scroll */}
          {heroTV && (
            <div
              ref={element => { tvRefs.current[heroTV.uid] = element; }}
              className="tv-item"
              style={{
                width: `${heroTV.w}px`, height: `${heroTV.h}px`,
                transformOrigin: 'center center',
                transform: `translate3d(${ix - heroTV.w / 2}px, ${iy - heroTV.h / 2}px, 0) scale(${heroScale}) rotate(${heroTV.angle * (1 - ease)}rad)`,
                opacity: heroOpacity,
                zIndex: 10,
                filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.95)) drop-shadow(0 0 35px rgba(12,230,68,0.4))',
              }}
            >
              <img src={singleTV} alt="" aria-hidden="true" draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}

          {/* Hero Content */}
          <div
            ref={contentRef}
            style={{
              position: 'absolute', inset: 0, zIndex: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: contentOpacity,
              pointerEvents: contentOpacity > 0.6 ? 'auto' : 'none',
              transform: `scale(${contentScale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.05s linear',
            }}
          >
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center',
              width: '100%', maxWidth: '1280px', padding: '2rem', gap: '0.85rem',
            }}>
              <div className="hero-kicker" style={{ display:'flex', flexDirection:'column', gap:'4px', alignItems:'center' }}>
                <span>IEEE SB College of Engineering Chengannur</span>
                <span style={{ fontSize:'0.78em', letterSpacing:'0.3em', opacity:0.85 }}>Presents</span>
              </div>

              <h1 className="hero-headline">
                <span className="hero-hl-wrap" data-text="ISQIP">ISQIP</span>
              </h1>

              <p className="hero-subtitle">Innovate · Build · Transcend</p>

              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', marginTop:'0.8rem' }}>
                <a href="#register" className="hero-btn-primary">Register Now</a>
                <a href="#tracks"   className="hero-btn-outline">Explore Tracks</a>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div
            ref={cueRef}
            className="hero-scroll-cue"
            style={{ opacity: p < 0.08 && fallDone ? 1 : 0, pointerEvents: 'none' }}
          >
            <span>Scroll</span>
            <div className="cue-bar" />
          </div>

        </div>
      </section>
    </>
  );
}