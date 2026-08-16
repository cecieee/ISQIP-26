import { useRef, useEffect, useState, useCallback } from 'react';
import departureMono from '../assets/Font/DepartureMono-Regular.woff2';
import mechsuitFont from '../assets/Font/mechsuit/Mechsuit.otf';
import black1 from '../assets/black1.webp';
import tvLeft from '../assets/tv_left.webp';
import tvRight from '../assets/tv-right.webp';
import singleTV from '../assets/singletv.webp';

/* ------------------------------------------------------------------ */
/*  Perlin noise (unchanged logic, same output as before)              */
/* ------------------------------------------------------------------ */
class Grad {
  constructor(x, y, z) { this.x = x; this.y = y; this.z = z; }
  dot2(x, y) { return this.x * x + this.y * y; }
}
class Noise {
  constructor(seed = 0) {
    this.grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];
    this.p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    this.perm = new Array(512); this.gradP = new Array(512); this.seed(seed);
  }
  seed(s) {
    if (s > 0 && s < 1) s *= 65536; s = Math.floor(s); if (s < 256) s |= s << 8;
    for (let i = 0; i < 256; i++) {
      const v = i & 1 ? this.p[i] ^ (s & 255) : this.p[i] ^ ((s >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }
  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(a, b, t) { return (1 - t) * a + t * b; }
  perlin2(x, y) {
    let X = Math.floor(x), Y = Math.floor(y); x -= X; y -= Y; X &= 255; Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

/* ------------------------------------------------------------------ */
/*  Waves canvas background — now DPR-aware and reduced-motion safe   */
/* ------------------------------------------------------------------ */
function Waves({
  lineColor = 'rgba(12,230,68,0.18)', backgroundColor = 'transparent',
  waveSpeedX = 0.0125, waveSpeedY = 0.005, waveAmpX = 32, waveAmpY = 16,
  xGap = 10, yGap = 32, friction = 0.925, tension = 0.005, maxCursorMove = 100,
  style = {}, className = '',
}) {
  const containerRef = useRef(null), canvasRef = useRef(null), ctxRef = useRef(null);
  const boundingRef = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const noiseRef = useRef(new Noise(Math.random())), linesRef = useRef([]);
  const mouseRef = useRef({ x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false });
  const cfgRef = useRef({ lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap });
  const frameRef = useRef(null);

  useEffect(() => {
    cfgRef.current = { lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap };
  }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap]);

  useEffect(() => {
    const canvas = canvasRef.current, container = containerRef.current;
    ctxRef.current = canvas.getContext('2d');
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function setSize() {
      boundingRef.current = container.getBoundingClientRect();
      canvas.width = Math.round(boundingRef.current.width * dpr);
      canvas.height = Math.round(boundingRef.current.height * dpr);
      ctxRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function setLines() {
      const { width, height } = boundingRef.current;
      linesRef.current = [];
      const { xGap, yGap } = cfgRef.current;
      // fewer sample points on small / narrow viewports keeps this smooth on phones
      const density = width < 640 ? 1.6 : 1;
      const oW = width + 200, oH = height + 30;
      const tL = Math.ceil(oW / (xGap * density)), tP = Math.ceil(oH / (yGap * density));
      const xS = (width - xGap * density * tL) / 2, yS = (height - yGap * density * tP) / 2;
      for (let i = 0; i <= tL; i++) {
        const pts = [];
        for (let j = 0; j <= tP; j++) pts.push({ x: xS + xGap * density * i, y: yS + yGap * density * j, wave: { x: 0, y: 0 }, cursor: { x: 0, y: 0, vx: 0, vy: 0 } });
        linesRef.current.push(pts);
      }
    }
    function movePoints(time) {
      const lines = linesRef.current, mouse = mouseRef.current, noise = noiseRef.current;
      const { waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove } = cfgRef.current;
      lines.forEach(pts => { pts.forEach(p => {
        const mv = noise.perlin2((p.x + time * waveSpeedX) * 0.002, (p.y + time * waveSpeedY) * 0.0015) * 12;
        p.wave.x = Math.cos(mv) * waveAmpX; p.wave.y = Math.sin(mv) * waveAmpY;
        const dx = p.x - mouse.sx, dy = p.y - mouse.sy, dist = Math.hypot(dx, dy), l = Math.max(175, mouse.vs);
        if (dist < l) { const s = 1 - dist / l, f = Math.cos(dist * 0.001) * s; p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065; p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065; }
        p.cursor.vx += (0 - p.cursor.x) * tension; p.cursor.vy += (0 - p.cursor.y) * tension;
        p.cursor.vx *= friction; p.cursor.vy *= friction;
        p.cursor.x += p.cursor.vx * 2; p.cursor.y += p.cursor.vy * 2;
        p.cursor.x = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.x));
        p.cursor.y = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.y));
      }); });
    }
    function moved(pt, wc = true) { return { x: Math.round((pt.x + pt.wave.x + (wc ? pt.cursor.x : 0)) * 10) / 10, y: Math.round((pt.y + pt.wave.y + (wc ? pt.cursor.y : 0)) * 10) / 10 }; }
    function drawLines() {
      const { width, height } = boundingRef.current, ctx = ctxRef.current;
      ctx.clearRect(0, 0, width, height); ctx.beginPath(); ctx.strokeStyle = cfgRef.current.lineColor;
      linesRef.current.forEach(points => {
        let p1 = moved(points[0], false); ctx.moveTo(p1.x, p1.y);
        points.forEach((p, idx) => {
          const isLast = idx === points.length - 1;
          p1 = moved(p, !isLast);
          const p2 = moved(points[idx + 1] || points[points.length - 1], !isLast);
          ctx.lineTo(p1.x, p1.y);
          if (isLast) ctx.moveTo(p2.x, p2.y);
        });
      });
      ctx.stroke();
    }
    function tick(t) {
      const m = mouseRef.current; m.sx += (m.x - m.sx) * 0.1; m.sy += (m.y - m.sy) * 0.1;
      const dx = m.x - m.lx, dy = m.y - m.ly, d = Math.hypot(dx, dy);
      m.v = d; m.vs += (d - m.vs) * 0.1; m.vs = Math.min(100, m.vs); m.lx = m.x; m.ly = m.y; m.a = Math.atan2(dy, dx);
      movePoints(t); drawLines();
      frameRef.current = requestAnimationFrame(tick);
    }
    function onResize() { setSize(); setLines(); }
    function updateMouse(x, y) { const m = mouseRef.current, b = boundingRef.current; m.x = x - b.left; m.y = y - b.top; if (!m.set) { m.sx = m.x; m.sy = m.y; m.lx = m.x; m.ly = m.y; m.set = true; } }

    setSize(); setLines();

    if (reduceMotion) {
      // draw a single static frame instead of animating forever
      movePoints(0); drawLines();
    } else {
      frameRef.current = requestAnimationFrame(tick);
    }

    const onMove = e => updateMouse(e.clientX, e.clientY);
    const onTouch = e => { if (e.touches && e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`waves-wrap ${className}`} style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor, ...style }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const HERO_STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@300;400;500;600;700&display=swap");
  @import url('https://fonts.googleapis.com/css2?family=Bruno+Ace&display=swap');

  @font-face {
    font-family: 'Departure Mono';
    src: url('${departureMono}') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Mechsuit';
    src: url('${mechsuitFont}') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  .hero-section{
    background-image: radial-gradient(circle, rgba(12,230,68,0.055) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .hero-section::before{
    content:"";
    pointer-events:none;
    position:absolute;
    inset:0;
    z-index:3;
    background: repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px);
    mix-blend-mode: multiply;
  }

  /* Sticky viewport: prefer dynamic viewport units so mobile browser
     chrome (the address bar showing/hiding) doesn't clip content */
  .hero-sticky{ height: 100vh; }
  @supports (height: 100svh) { .hero-sticky{ height: 100svh; } }

  .hero-scene{ min-height: 250vh; }
  @supports (height: 100svh) { .hero-scene{ min-height: 250svh; } }
  @media (max-width: 640px){
    /* shorter scroll runway on phones so the reveal doesn't feel like an endless scroll */
    .hero-scene{ min-height: 190vh; }
    @supports (height: 100svh) { .hero-scene{ min-height: 190svh; } }
  }

  /* headline: Share Tech Mono is loaded and reads as an arcade/terminal
     face, unlike the previous 'Mechsuit' which was never imported and
     silently fell back to the browser's default sans-serif */
  .hero-headline{
    font-family: 'Mechsuit', sans-serif;
    color: rgba(12,230,68,0.72);
    text-shadow: 0 0 8px rgba(12,230,68,0.4), 0 0 28px rgba(12,230,68,.28), 0 0 60px rgba(12,230,68,.12);
    line-height: 0.9;
    letter-spacing: 0.02em;
    margin: 0;
    font-size: clamp(3rem, 13vw, 7rem);
  }

  @keyframes h-glitch{0%{clip-path:inset(0 0 96% 0);transform:translate(-2px,0)}20%{clip-path:inset(35% 0 45% 0);transform:translate(2px,0)}45%{clip-path:inset(65% 0 15% 0);transform:translate(-1px,0)}65%{clip-path:inset(0 0 0 0);transform:translate(0,0)}100%{clip-path:inset(0 0 0 0);transform:translate(0,0)}}
  @keyframes h-glitch-2{0%{clip-path:inset(75% 0 8% 0);transform:translate(3px,0);opacity:.55}30%{clip-path:inset(15% 0 65% 0);transform:translate(-2px,0);opacity:.35}55%{opacity:0}100%{opacity:0}}
  .hero-hl-wrap{ position:relative; display:inline-block; }
  .hero-hl-wrap::before,.hero-hl-wrap::after{
    content: attr(data-text);
    position:absolute; inset:0;
    font-family:'Mechsuit', sans-serif;
    line-height:0.9;
    pointer-events:none;
    opacity:0;
  }
  @media (hover:hover){
    .hero-hl-wrap:hover::before{ color: rgba(12,230,68,0.72); text-shadow:0 0 8px rgba(12,230,68,0.4); animation:h-glitch .4s steps(1) forwards; opacity:1; }
    .hero-hl-wrap:hover::after{ color:#FFAA33; animation:h-glitch-2 .4s steps(1) forwards; opacity:1; }
  }

  .hero-subtitle{
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.72rem, 1.6vw, 1rem);
    color:#8FAE95;
    line-height:1.75;
    max-width: min(560px, 86vw);
    letter-spacing:0.02em;
    margin: 1rem auto 0;
    text-align: center;
  }

  @keyframes btn-flicker{0%{opacity:.6}20%{opacity:1}40%{opacity:.7}60%{opacity:1}100%{opacity:1}}
  .hero-btn-primary{
    display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    padding: clamp(11px,2.6vw,14px) clamp(22px,5vw,34px);
    border-radius:4px; font-size:.85rem; letter-spacing:.1em; text-transform:uppercase;
    font-weight:700; font-family:'Inter',sans-serif; color:#0A0D0A; background:#0CE644;
    border:none; cursor:pointer; transition:box-shadow .2s, transform .1s; white-space:nowrap;
  }
  .hero-btn-primary:hover{ animation:btn-flicker .3s ease forwards; box-shadow:0 0 20px rgba(12,230,68,.65), 0 0 44px rgba(12,230,68,.28); transform:translateY(-2px); }
  .hero-btn-primary:focus-visible, .hero-btn-outline:focus-visible{ outline:2px solid #0CE644; outline-offset:3px; }

  .hero-btn-outline{
    display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    padding: clamp(10px,2.4vw,13px) clamp(18px,4.4vw,30px);
    border-radius:4px; font-size:.85rem; letter-spacing:.1em; text-transform:uppercase;
    font-weight:500; font-family:'Inter',sans-serif; color:#0CE644; background:transparent;
    border:1px solid rgba(12,230,68,.55); cursor:pointer;
    transition:background .2s, box-shadow .2s, border-color .2s, transform .1s; white-space:nowrap;
  }
  .hero-btn-outline:hover{ background:rgba(12,230,68,.08); border-color:#0CE644; box-shadow:0 0 14px rgba(12,230,68,.3); transform:translateY(-2px); }

  .hero-tv-side{
    position:absolute; bottom:0; height:min(65vh, 460px); width:auto; object-fit:contain;
  }
  .hero-tv-single{
    position:absolute; left:50%; height:min(35vh, 260px); width:auto; object-fit:contain;
  }
  @media (max-width:560px){
    /* side TVs crowd the centered logo on narrow phones — tuck them
       further to the edges and shrink instead of hiding them outright */
    .hero-tv-side{ height:min(30vh, 190px); opacity:.85; }
  }

  .hero-scroll-cue{
    position:absolute; left:50%; transform:translateX(-50%); bottom:clamp(18px,4vh,32px);
    display:flex; flex-direction:column; align-items:center; gap:8px; z-index:6;
    font-family:'Inter',sans-serif; font-size:.68rem; letter-spacing:.18em; text-transform:uppercase; color:#5f7d66;
  }
  .hero-scroll-cue .bar{ width:1px; height:26px; background:linear-gradient(to bottom, rgba(12,230,68,.7), transparent); animation: blink 1.6s ease-in-out infinite; }

  @keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}

  @media (prefers-reduced-motion: reduce){
    .hero-hl-wrap:hover::before, .hero-hl-wrap:hover::after{ animation:none; }
    .hero-scroll-cue .bar{ animation:none; }
  }
`;

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);

    // rAF-throttled scroll handler avoids stacking state updates on
    // low-power / mobile devices
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollVH = viewportHeight > 0 ? scrollY / viewportHeight : 0;

  const tvDropProgress = Math.min(scrollVH / 0.8, 1);
  const singleTVTop = -80 + tvDropProgress * 100;

  const transitionProgress = Math.max(0, Math.min(1, (scrollVH - 0.8) / 0.3));
  const tvOpacity = Math.max(0, 1 - transitionProgress);
  const isqipOpacity = transitionProgress;

  const ctaOpacity = Math.max(0, 1 - Math.max(0, (scrollVH - 2.0) / 0.3));

  const tvScale = 1 - transitionProgress * 0.2;
  const tvBlur = transitionProgress * 20;
  const isqipScale = 0.9 + transitionProgress * 0.1;

  return (
    <>
      <style>{HERO_STYLES}</style>

      <section id="home" className="hero-scene" style={{ position: 'relative', background: '#0A0D0A' }}>

        <div
          className="hero-sticky hero-section"
          style={{
            position: 'sticky',
            top: 0,
            overflow: 'hidden',
            backgroundImage: `url(${black1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div style={{
            position: 'absolute', bottom: '-10%', left: '-5%', width: '30vw', height: '50vh',
            background: 'radial-gradient(ellipse, rgba(12,230,68,0.25) 0%, rgba(12,230,68,0.15) 30%, transparent 70%)',
            filter: 'blur(60px)', opacity: tvOpacity * 0.8, transition: 'opacity 0.3s ease-out', zIndex: 3, pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute', bottom: '-10%', right: '-5%', width: '30vw', height: '50vh',
            background: 'radial-gradient(ellipse, rgba(12,230,68,0.25) 0%, rgba(12,230,68,0.15) 30%, transparent 70%)',
            filter: 'blur(60px)', opacity: tvOpacity * 0.8, transition: 'opacity 0.3s ease-out', zIndex: 3, pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute', top: `${singleTVTop + 5}vh`, left: '50%', transform: 'translateX(-50%)',
            width: 'min(25vw, 340px)', height: '40vh',
            background: 'radial-gradient(ellipse, rgba(12,230,68,0.3) 0%, rgba(12,230,68,0.18) 30%, transparent 70%)',
            filter: 'blur(50px)', opacity: tvOpacity * 0.9, transition: 'opacity 0.3s ease-out', zIndex: 8, pointerEvents: 'none',
          }} />

          <img
            src={tvLeft} alt="" aria-hidden="true" className="hero-tv-side"
            style={{
              left: 0, bottom: -12, objectPosition: 'bottom left', opacity: tvOpacity,
              transform: `scale(${tvScale})`, transformOrigin: 'bottom left',
              filter: `blur(${tvBlur}px)`,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out, filter 0.3s ease-out',
              zIndex: 5,
            }}
          />

          <img
            src={tvRight} alt="" aria-hidden="true" className="hero-tv-side"
            style={{
              right: 0, bottom: -12, objectPosition: 'bottom right', opacity: tvOpacity,
              transform: `scale(${tvScale})`, transformOrigin: 'bottom right',
              filter: `blur(${tvBlur}px)`,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out, filter 0.3s ease-out',
              zIndex: 5,
            }}
          />

          <img
            src={singleTV} alt="" aria-hidden="true" className="hero-tv-single"
            style={{
              top: `${singleTVTop}vh`, transform: `translateX(-50%) scale(${tvScale})`,
              opacity: tvOpacity, filter: `blur(${tvBlur}px)`,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out, filter 0.3s ease-out',
              zIndex: 10,
            }}
          />

          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 20, opacity: isqipOpacity, transform: `scale(${isqipScale})`,
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
            pointerEvents: isqipOpacity > 0.7 ? 'auto' : 'none',
            backgroundImage: `url(${black1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
          }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
              <Waves lineColor="rgba(12,230,68,0.18)" backgroundColor="transparent" waveSpeedX={0.018} waveSpeedY={0.008} waveAmpX={44} waveAmpY={22} xGap={14} yGap={40} friction={0.93} tension={0.006} maxCursorMove={120} />
            </div>

            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(12,230,68,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 2 }} />

            <div style={{
              position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              width: '100%', maxWidth: '1280px', padding: '2rem clamp(1.25rem,5vw,4rem)', minHeight: '100%',
              gap: 'clamp(1rem, 3vh, 1.75rem)',
            }}>
              <h1 className="hero-headline">
                <span className="hero-hl-wrap" data-text="ISQIP">ISQIP</span>
              </h1>

              <p className="hero-subtitle">IEEE Student Quality Improvement Programme</p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', opacity: ctaOpacity, transition: 'opacity 0.4s ease-out' }}>
                <a href="#register" className="hero-btn-primary">
                  Register Now
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <a href="#tracks" className="hero-btn-outline">
                  Learn More
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><polygon points="3,2 9,6 3,10" fill="currentColor" /></svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}