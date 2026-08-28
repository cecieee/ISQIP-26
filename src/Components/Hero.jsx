import { useRef, useEffect, useState } from 'react';
import Matter from 'matter-js';
import black1 from '../assets/black1.webp';
import singleTV from '../assets/singletv.webp';
import CRTWarp from './CRTWarp';

const HERO_STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&family=Bruno+Ace&display=swap");

  .hero-sticky{ height: 100vh; }
  @supports (height: 100svh) { .hero-sticky{ height: 100svh; } }

  .hero-scene{ min-height: 320vh; }
  @supports (height: 100svh) { .hero-scene{ min-height: 320svh; } }
  
  .hero-section{
    background-image: radial-gradient(circle, rgba(12,230,68,0.055) 1px, transparent 1px);
    background-size: 28px 28px;
    width:100%; height:100vh;
  }
  @supports (height: 100svh) { .hero-section{ height:100svh; } }

  .hero-kicker {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.72rem, 1.4vw, 0.88rem);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #0CE644;
    text-shadow: 0 0 10px rgba(12, 230, 68, 0.4);
    margin-bottom: 0.2rem;
  }

  .hero-headline{
    font-family: 'Mechsuit', sans-serif;
    color: #FFFFFF;
    text-shadow: 0 0 20px rgba(12,230,68,0.7), 0 0 50px rgba(12,230,68,0.3), 0 8px 24px rgba(0,0,0,0.9);
    line-height: 0.95;
    letter-spacing: 0.05em;
    margin: 0;
    font-size: clamp(3.6rem, 15vw, 8.5rem);
    position: relative;
    display: inline-block;
  }

  .hero-hl-wrap {
    position: relative;
    display: inline-block;
  }

  .hero-hl-wrap::before,
  .hero-hl-wrap::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip: rect(0, 0, 0, 0);
  }

  /* Left/Green glitch layer - fast dynamic burst cycle (1.2s) */
  .hero-hl-wrap::before {
    left: -3px;
    text-shadow: 3px 0 #0CE644, -2px 0 rgba(12, 230, 68, 0.9);
    animation: glitch-anim-1 2.2s infinite steps(2, end);
  }

  /* Right/White-Red glitch layer - fast dynamic burst cycle (1.6s) */
  .hero-hl-wrap::after {
    left: 3px;
    text-shadow: -3px 0 #ffffff, 2px 0 #0CE644;
    animation: glitch-anim-2 2.6s infinite steps(2, end);
  }

  @keyframes glitch-anim-1 {
    0%, 100% { clip: rect(0, 0, 0, 0); transform: translate(0, 0); }
    5% { clip: rect(18px, 9999px, 42px, 0); transform: translate(-6px, 1px) skew(-2deg); }
    12% { clip: rect(55px, 9999px, 80px, 0); transform: translate(5px, -1px) skew(1.5deg); }
    18% { clip: rect(0, 0, 0, 0); transform: translate(0, 0); }
    38% { clip: rect(70px, 9999px, 98px, 0); transform: translate(-8px, 2px) skew(-3deg); }
    45% { clip: rect(12px, 9999px, 35px, 0); transform: translate(6px, -1px) skew(2deg); }
    52% { clip: rect(0, 0, 0, 0); transform: translate(0, 0); }
    72% { clip: rect(30px, 9999px, 60px, 0); transform: translate(-5px, 1px) skew(1deg); }
    80% { clip: rect(85px, 9999px, 120px, 0); transform: translate(7px, -2px) skew(-2.5deg); }
    88% { clip: rect(0, 0, 0, 0); transform: translate(0, 0); }
  }

  @keyframes glitch-anim-2 {
    0%, 100% { clip: rect(0, 0, 0, 0); transform: translate(0, 0); }
    10% { clip: rect(80px, 9999px, 110px, 0); transform: translate(6px, -2px) skew(2.5deg); }
    20% { clip: rect(25px, 9999px, 50px, 0); transform: translate(-5px, 1px) skew(-1.5deg); }
    28% { clip: rect(0, 0, 0, 0); transform: translate(0, 0); }
    55% { clip: rect(10px, 9999px, 38px, 0); transform: translate(6px, 1px) skew(2deg); }
    64% { clip: rect(60px, 9999px, 90px, 0); transform: translate(-7px, -1px) skew(-3deg); }
    72% { clip: rect(0, 0, 0, 0); transform: translate(0, 0); }
    88% { clip: rect(45px, 9999px, 70px, 0); transform: translate(5px, -2px) skew(-1deg); }
    94% { clip: rect(95px, 9999px, 130px, 0); transform: translate(-6px, 1px) skew(3.5deg); }
  }

  .hero-hl-wrap{ position:relative; display:inline-block; }
  .hero-subtitle{
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

  .hero-desc {
    font-family: 'Inter', sans-serif;
    font-size: clamp(0.82rem, 1.4vw, 0.95rem);
    color: #7E9E88;
    max-width: min(520px, 86vw);
    line-height: 1.6;
    margin: 0 auto;
    text-align: center;
  }

  .hero-meta-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(142, 174, 149, 0.75);
    margin-top: 0.4rem;
  }
  .hero-meta-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #0CE644;
    opacity: 0.7;
  }

  .hero-btn-primary{
    display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    padding: clamp(12px,2.6vw,15px) clamp(28px,5vw,38px);
    border-radius:4px; font-size:.85rem; letter-spacing:.14em; text-transform:uppercase;
    font-weight:700; font-family:'Inter',sans-serif; color:#071110; background:#0CE644;
    border:none; cursor:pointer; box-shadow:0 0 24px rgba(12,230,68,0.5);
    transition: all .2s; white-space:nowrap;
  }
  .hero-btn-primary:hover{ box-shadow:0 0 35px rgba(12,230,68,0.8); transform:translateY(-2px); }

  .hero-btn-outline{
    display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    padding: clamp(12px,2.6vw,15px) clamp(28px,5vw,38px);
    border-radius:4px; font-size:.85rem; letter-spacing:.14em; text-transform:uppercase;
    font-weight:600; font-family:'Inter',sans-serif; color:#FFFFFF; background:rgba(7,17,16,0.6);
    border:none; cursor:pointer; backdrop-filter:blur(8px);
    transition: all .2s; white-space:nowrap;
  }
  .hero-btn-outline:hover{ background:rgba(12,230,68,0.15); color:#0CE644; transform:translateY(-2px); }

  .tv-matter-item {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    will-change: transform, opacity;
  }

  .hero-scroll-cue{
    position:absolute; left:50%; transform:translateX(-50%); bottom:clamp(18px,4vh,32px);
    display:flex; flex-direction:column; align-items:center; gap:8px; z-index:6;
    font-family:'Inter',sans-serif; font-size:.68rem; letter-spacing:.18em; text-transform:uppercase; color:#5f7d66;
    transition: opacity 0.3s;
  }
  .hero-scroll-cue .bar{ width:1px; height:26px; background:linear-gradient(to bottom, rgba(12,230,68,.7), transparent); }
`;

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const sceneContainerRef = useRef(null);
  const rafRef = useRef(null);

  // Array of live physics bodies state for rendering React TV nodes
  const [physicsTVs, setPhysicsTVs] = useState([]);
  const bodiesRef = useRef([]);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => { setScrollY(window.scrollY); rafRef.current = null; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('resize', updateHeight); window.removeEventListener('scroll', onScroll); };
  }, []);

  // Initialize Matter.js Real Physics Engine (like FancyComponents Gravity)
  useEffect(() => {
    const container = sceneContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const { Engine, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 1.8, scale: 0.0018 }
    });
    const world = engine.world;

    // Dimensions
    const tvWidth = Math.max(340, Math.min(520, width * 0.32));
    const tvHeight = tvWidth * 0.58;
    const heroTVWidth = Math.max(360, Math.min(540, width * 0.34));
    const heroTVHeight = heroTVWidth * 0.58;

    // Physical hitbox matching solid CRT body inside singletv.webp
    const hitBoxWidth = tvWidth * 0.65;
    const hitBoxHeight = tvHeight * 0.68;

    // Floor and side walls only (no artificial floating ledges)
    const floorY = height - 10;
    const floor = Bodies.rectangle(width / 2, floorY + 50, width * 3, 100, { isStatic: true, friction: 0.8, restitution: 0.25 });
    const leftWall = Bodies.rectangle(-40, height / 2, 80, height * 4, { isStatic: true, friction: 0.3, restitution: 0.35 });
    const rightWall = Bodies.rectangle(width + 40, height / 2, 80, height * 4, { isStatic: true, friction: 0.3, restitution: 0.35 });

    World.add(world, [floor, leftWall, rightWall]);

    // 8 Cascade TVs clustered densely on the left and right wings (light in the middle)
    const tvConfigs = [
      // Left Wing Dense Cluster (4 TVs)
      { x: width * 0.10, y: -100, angle: -0.15, forceX: -1.2, angularVelocity: -0.03, width: tvWidth, height: tvHeight, hitW: hitBoxWidth, hitH: hitBoxHeight, density: 0.006 },
      { x: width * 0.22, y: -140, angle: 0.08, forceX: -0.4, angularVelocity: 0.02, width: tvWidth, height: tvHeight, hitW: hitBoxWidth, hitH: hitBoxHeight, density: 0.006 },
      { x: width * 0.14, y: -340, angle: 0.18, forceX: 0.6, angularVelocity: 0.03, width: tvWidth, height: tvHeight, hitW: hitBoxWidth, hitH: hitBoxHeight, density: 0.005 },
      { x: width * 0.25, y: -480, angle: -0.12, forceX: -0.6, angularVelocity: -0.02, width: tvWidth, height: tvHeight, hitW: hitBoxWidth, hitH: hitBoxHeight, density: 0.005 },

      // Right Wing Dense Cluster (4 TVs)
      { x: width * 0.90, y: -100, angle: 0.15, forceX: 1.2, angularVelocity: 0.03, width: tvWidth, height: tvHeight, hitW: hitBoxWidth, hitH: hitBoxHeight, density: 0.006 },
      { x: width * 0.78, y: -140, angle: -0.08, forceX: 0.4, angularVelocity: -0.02, width: tvWidth, height: tvHeight, hitW: hitBoxWidth, hitH: hitBoxHeight, density: 0.006 },
      { x: width * 0.86, y: -340, angle: -0.18, forceX: -0.6, angularVelocity: -0.03, width: tvWidth, height: tvHeight, hitW: hitBoxWidth, hitH: hitBoxHeight, density: 0.005 },
      { x: width * 0.75, y: -480, angle: 0.12, forceX: 0.6, angularVelocity: 0.02, width: tvWidth, height: tvHeight, hitW: hitBoxWidth, hitH: hitBoxHeight, density: 0.005 },
    ];

    const activeBodies = tvConfigs.map((cfg, id) => {
      const body = Bodies.rectangle(cfg.x, cfg.y, cfg.hitW, cfg.hitH, {
        restitution: 0.28,
        friction: 0.85,
        frictionStatic: 1.2,
        frictionAir: 0.007,
        density: cfg.density,
        angle: cfg.angle,
      });

      Matter.Body.setAngularVelocity(body, cfg.angularVelocity);
      Matter.Body.setVelocity(body, { x: cfg.forceX, y: Math.random() * 2 });

      body.customId = id;
      body.width = cfg.width;
      body.height = cfg.height;
      body.isHero = false;
      body.side = cfg.x < width / 2 ? 'left' : 'right';
      return body;
    });

    World.add(world, activeBodies);

    // After 900ms delay, spawn the Central Hero TV so it makes a dramatic entrance and crashes onto the pile!
    const delayTimer = setTimeout(() => {
      const heroHitW = heroTVWidth * 0.65;
      const heroHitH = heroTVHeight * 0.68;
      const heroBody = Bodies.rectangle(width / 2, -150, heroHitW, heroHitH, {
        restitution: 0.22,
        friction: 0.9,
        frictionStatic: 1.4,
        frictionAir: 0.006,
        density: 0.012,
        angle: 0.01,
      });

      Matter.Body.setVelocity(heroBody, { x: 0, y: 3.5 });
      heroBody.customId = 99;
      heroBody.width = heroTVWidth;
      heroBody.height = heroTVHeight;
      heroBody.isHero = true;
      heroBody.side = 'center';

      activeBodies.push(heroBody);
      World.add(world, heroBody);
    }, 900);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Sync loop: copy Matter.js physics coordinates to React state on each animation frame
    let animId;
    const syncLoop = () => {
      const currentData = activeBodies.map(b => ({
        id: b.customId,
        x: b.position.x,
        y: b.position.y,
        angle: b.angle,
        width: b.width,
        height: b.height,
        isHero: b.isHero,
        side: b.side,
      }));
      setPhysicsTVs(currentData);
      animId = requestAnimationFrame(syncLoop);
    };
    animId = requestAnimationFrame(syncLoop);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(animId);
      Runner.stop(runner);
      Engine.clear(engine);
      World.clear(world, false);
    };
  }, []);

  const scrollVH = viewportHeight > 0 ? scrollY / viewportHeight : 0;
  
  // Find central hero monitor from physics simulation (id: 'hero')
  const heroPhysicsTV = physicsTVs.find(tv => tv.isHero);
  
  // Continuous fluid zoom from its exact physics landing position into the screen
  const zoomProgress = Math.min(1, scrollVH / 1.4);
  const sideOpacity = Math.max(0, 1 - zoomProgress * 2.5);
  const sideSpread = zoomProgress * 280;

  // Zoom scale starts at 1 (when landed) and expands smoothly past the camera
  const heroScale = 1 + Math.pow(zoomProgress, 1.8) * 11;
  const heroOpacity = zoomProgress > 0.75 ? Math.max(0, 1 - (zoomProgress - 0.75) / 0.25) : 1;
  
  // CRT Warp background and ISQIP UI only emerge AFTER the central TV finishes zooming past (zoomProgress > 0.75)
  const isqipOpacity = Math.max(0, Math.min(1, (zoomProgress - 0.72) / 0.28));
  const isqipScale = 0.85 + isqipOpacity * 0.15;

  return (
    <>
      <style>{HERO_STYLES}</style>
      <section id="home" className="hero-scene" style={{ position: 'relative', background: '#0A0D0A' }}>
        <div
          ref={sceneContainerRef}
          className="hero-sticky hero-section"
          style={{ position: 'sticky', top: 0, overflow: 'hidden', backgroundImage: `url(${black1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        >
          {/* CRTWarp Background: Fades in on scroll as the central TV enlarges (pitch black initially) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: isqipOpacity, pointerEvents: 'none', transition: 'opacity 0.1s ease-out' }}>
            <CRTWarp
              color="#0CE644"
              backgroundColor="#071110"
              speed={0.4}
              curvature={0.22}
              scanlineStrength={0.25}
              scanlineFrequency={180}
              waveAmplitude={0.22}
              waveFrequency={2.0}
              bloom={1.1}
              bloomRadius={0.9}
              noise={0.06}
              vignette={0.25}
              brightness={1.05}
              pixelation={1}
              rgbShift={0.01}
              mouseReact
              mouseStrength={0.35}
              dpr={1.2}
              fps={60}
            />
          </div>

          {/* Dark Contrast Backdrop to make text and CTAs stand out sharply */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: 'radial-gradient(ellipse at center, rgba(7,17,16,0.72) 0%, rgba(7,17,16,0.45) 45%, transparent 80%)',
            opacity: isqipOpacity,
            pointerEvents: 'none',
          }} />

          {/* Ambient Glows */}
          <div style={{ position: 'absolute', bottom: '-5%', left: '0%', width: '40vw', height: '50vh', background: 'radial-gradient(ellipse, rgba(12,230,68,0.35) 0%, rgba(12,230,68,0.15) 35%, transparent 70%)', filter: 'blur(55px)', opacity: sideOpacity * 0.95, zIndex: 3, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-5%', right: '0%', width: '40vw', height: '50vh', background: 'radial-gradient(ellipse, rgba(12,230,68,0.35) 0%, rgba(12,230,68,0.15) 35%, transparent 70%)', filter: 'blur(55px)', opacity: sideOpacity * 0.95, zIndex: 3, pointerEvents: 'none' }} />

          {/* Falling Physics TVs (Surrounding monitors) */}
          {physicsTVs.filter(tv => !tv.isHero).map((tv) => {
            const spreadX = tv.side === 'left' ? -sideSpread : sideSpread;
            return (
              <div
                key={tv.id}
                className="tv-matter-item"
                style={{
                  width: `${tv.width}px`,
                  height: `${tv.height}px`,
                  transform: `translate3d(${tv.x - tv.width / 2 + spreadX}px, ${tv.y - tv.height / 2}px, 0) rotate(${tv.angle}rad)`,
                  opacity: sideOpacity,
                  zIndex: 5,
                }}
              >
                <img
                  src={singleTV}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                />
              </div>
            );
          })}

          {/* Hero Central CRT Monitor - Natural Fall + Continuous Zoom-Through */}
          {heroPhysicsTV && (
            <div
              className="tv-matter-item"
              style={{
                width: `${heroPhysicsTV.width}px`,
                height: `${heroPhysicsTV.height}px`,
                transform: `translate3d(${heroPhysicsTV.x - heroPhysicsTV.width / 2}px, ${heroPhysicsTV.y - heroPhysicsTV.height / 2}px, 0) scale(${heroScale}) rotate(${heroPhysicsTV.angle * (1 - zoomProgress)}rad)`,
                transformOrigin: '50% 50%',
                opacity: heroOpacity,
                zIndex: 10,
                filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.95)) drop-shadow(0 0 35px rgba(12,230,68,0.4))',
              }}
            >
              <img
                src={singleTV}
                alt=""
                aria-hidden="true"
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
              />
            </div>
          )}

          {/* Hero Content (Smoothly emerges on scroll as the Central Monitor zooms through the camera) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              opacity: isqipOpacity,
              pointerEvents: isqipOpacity > 0.6 ? 'auto' : 'none',
            }}
          >
            <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', maxWidth: '1280px', padding: '2rem', gap: '0.85rem', transform: `scale(${isqipScale})` }}>
              {/* Presenter Kicker */}
              <div className="hero-kicker" style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <span>IEEE SB College of Engineering Chengannur</span>
                <span style={{ fontSize: '0.78em', letterSpacing: '0.3em', opacity: 0.85 }}>Presents</span>
              </div>

              {/* Main Headline */}
              <h1 className="hero-headline"><span className="hero-hl-wrap" data-text="ISQIP">ISQIP</span></h1>

              <p className="hero-subtitle">Innovate · Build · Transcend</p>
              


              {/* Minimalist Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.8rem' }}>
                <a href="#register" className="hero-btn-primary">Register Now</a>
                <a href="#tracks" className="hero-btn-outline">Explore Tracks</a>
              </div>
            </div>
          </div>

          <div className="hero-scroll-cue" style={{ opacity: scrollVH < 0.2 ? 1 : 0, pointerEvents: 'none' }}>
            <span>Scroll Down</span>
          </div>
        </div>
      </section>
    </>
  );
}