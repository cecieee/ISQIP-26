import { useEffect, useRef, useState } from "react";

/* =========================================================
   TIMELINE (ms) — tune these to taste
   ========================================================= */
const T = {
  LINE_GROW: 350,     // thin horizontal line grows across
  LINE_HOLD: 150,     // line sits fully extended
  FLASH: 300,         // line contracts to center + white flash burst
  STATIC: 900,        // analog static + scanlines
  STABILIZE: 550,     // static resolves into stable green screen
  STABLE_HOLD: 1800,  // logo sits long enough to show the flicker
  FADE_OUT: 1000,     // everything dissolves, Hero revealed underneath
};

// Play the intro on every full page load/refresh.
const PLAY_ONCE_PER_SESSION = false;
const SESSION_KEY = "isqip-crt-intro-played";

const PHASE_ORDER = [
  "lineGrow",
  "lineHold",
  "flash",
  "static",
  "stabilize",
  "stable",
  "fadeOut",
  "done",
];

const LETTER_FLICKER = [
  { delay: 0.24, duration: 1.45 },
  { delay: 0.78, duration: 1.2 },
  { delay: 0.08, duration: 1.65 },
  { delay: 0.56, duration: 1.32 },
  { delay: 0.94, duration: 1.5 },
  { delay: 0.36, duration: 1.25 },
  { delay: 0.68, duration: 1.58 },
  { delay: 0.16, duration: 1.38 },
  { delay: 0.88, duration: 1.18 },
];

export default function CRTLoadingScreen() {
  const [phase, setPhase] = useState(() => {
    if (typeof window === "undefined") return "lineGrow";

    const isMobile = window.innerWidth <= 768;

    if (PLAY_ONCE_PER_SESSION && !isMobile && sessionStorage.getItem(SESSION_KEY)) {
      return "done";
    }

    if (!isMobile && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "stable";
    }

    // Start the visible sequence immediately on first paint.
    return "lineGrow";
  });

  const timeouts = useRef([]);

  // Drives real per-tick noise randomization for the static.
  const [noiseSeed, setNoiseSeed] = useState(1);
  const noiseIntervalRef = useRef(null);

  useEffect(() => {
    if (phase === "done") {
      window.dispatchEvent(new Event("isqip-loading-complete"));
    }
  }, [phase]);

  useEffect(() => {
    // Handy for testing:
    // window.__replayCRTIntro()
    window.__replayCRTIntro = () => {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.reload();
    };

    if (phase === "done") return;

    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timeoutIds = timeouts.current;

    if (!isMobile && prefersReducedMotion) {
      const t = window.setTimeout(() => {
        setPhase("fadeOut");
      }, 400);

      timeouts.current.push(t);

      const t2 = window.setTimeout(() => {
        setPhase("done");

        if (PLAY_ONCE_PER_SESSION) {
          sessionStorage.setItem(SESSION_KEY, "1");
        }
      }, 400 + T.FADE_OUT);

      timeouts.current.push(t2);

      return () => {
        timeoutIds.forEach((id) =>
          window.clearTimeout(id)
        );
      };
    }

    // Start at lineGrow, then schedule every phase after it.
    const remaining = PHASE_ORDER.slice(1);

    let elapsed = T.LINE_GROW;

    remaining.forEach((p) => {
      const t = window.setTimeout(() => {
        setPhase(p);
      }, elapsed);

      timeouts.current.push(t);

      elapsed += T[toKey(p)] ?? 0;
    });

    const finalTimeout = window.setTimeout(() => {
      if (PLAY_ONCE_PER_SESSION) {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    }, elapsed);

    timeouts.current.push(finalTimeout);

    return () => {
      timeoutIds.forEach((id) =>
        window.clearTimeout(id)
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reseed the turbulence filter rapidly ONLY while static is showing.
  useEffect(() => {
    if (phase === "static" || phase === "stabilize") {
      noiseIntervalRef.current = window.setInterval(() => {
        setNoiseSeed((s) => (s > 9999 ? 1 : s + 1));
      }, 65);
    }

    return () => {
      if (noiseIntervalRef.current) {
        window.clearInterval(noiseIntervalRef.current);
        noiseIntervalRef.current = null;
      }
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      data-phase={phase}
      aria-hidden="true"
      className="crt-intro-root"
    >
      <style>{STYLES}</style>

      {/* ================= SCREEN CONTENT ================= */}
      <div className="crt-intro-screen">

        {/* Horizontal power-on line */}
        <div className="crt-intro-line" />

        {/* Center flash burst */}
        <div className="crt-intro-flash" />

        {/* Analog static */}
        <svg
          className="crt-intro-static"
          aria-hidden="true"
        >
          <filter id="crtNoise">

            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.55"
              numOctaves="2"
              seed={noiseSeed}
              stitchTiles="stitch"
            />

            <feColorMatrix
              type="saturate"
              values="0"
            />

            {/* Posterize the noise into discrete levels */}
            <feComponentTransfer>
              <feFuncR
                type="discrete"
                tableValues="0 0.01 0.08 0.25 0.55 0.90 1"
              />
              <feFuncG
                type="discrete"
                tableValues="0 0.01 0.08 0.25 0.55 0.90 1"
              />
              <feFuncB
                type="discrete"
                tableValues="0 0.01 0.08 0.25 0.55 0.90 1"
              />
            </feComponentTransfer>

          </filter>

          <rect
            width="100%"
            height="100%"
            filter="url(#crtNoise)"
          />
        </svg>

        {/* Scanlines */}
        <div className="crt-intro-scanlines" />

        {/* Stable logo */}
        <div className="crt-intro-logo">
          <div className="crt-intro-logo-title">
            {[...'ISQIP \'26'].map((character, index) => (
              <span
                key={`${character}-${index}`}
                style={{
                  '--flicker-delay': `${LETTER_FLICKER[index].delay}s`,
                  '--flicker-duration': `${LETTER_FLICKER[index].duration}s`,
                }}
              >
                {character === ' ' ? '\u00a0' : character}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Edge vignette */}
      <div className="crt-intro-room" />

    </div>
  );
}

function toKey(phaseName) {
  const map = {
    lineGrow: "LINE_GROW",
    lineHold: "LINE_HOLD",
    flash: "FLASH",
    static: "STATIC",
    stabilize: "STABILIZE",
    stable: "STABLE_HOLD",
    fadeOut: "FADE_OUT",
    done: null,
  };

  return map[phaseName];
}

const STYLES = `
  .crt-intro-root {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #000;
    overflow: hidden;
    pointer-events: auto;
    transition: opacity ${T.FADE_OUT}ms ease-in;
  }

  .crt-intro-root[data-phase="fadeOut"] {
    opacity: 0;
    pointer-events: none;
  }

  /* =========================================================
     DARK ROOM / EDGE VIGNETTE
     ========================================================= */

  .crt-intro-room {
    position: absolute;
    inset: 0;

    background:
      radial-gradient(
        ellipse at center,
        transparent 50%,
        rgba(0,0,0,0.65) 100%
      );

    pointer-events: none;
    z-index: 8;
  }

  /* =========================================================
     SCREEN
     ========================================================= */

  .crt-intro-screen {
    position: absolute;
    inset: 0;

    background: #000;

    overflow: hidden;
    z-index: 1;
  }

  /* =========================================================
     HORIZONTAL POWER-ON LINE
     ========================================================= */

  .crt-intro-line {
    position: absolute;

    top: 50%;
    left: 50%;

    width: 0%;
    height: 2px;

    background: #ffffff;

    box-shadow:
      0 0 8px 2px rgba(255,255,255,0.8);

    transform:
      translate(-50%, -50%)
      scaleX(0);

    transform-origin: center;

    opacity: 0;
  }

  [data-phase="lineGrow"] .crt-intro-line,
  [data-phase="lineHold"] .crt-intro-line {
    opacity: 1;

    width: 100%;

    transform:
      translate(-50%, -50%)
      scaleX(1);

    transition:
      transform ${T.LINE_GROW}ms
      cubic-bezier(0.2,0.8,0.3,1);
  }

  [data-phase="flash"] .crt-intro-line {
    opacity: 1;
    width: 100%;

    transform:
      translate(-50%, -50%)
      scaleX(0.02);

    transition:
      transform ${T.FLASH * 0.6}ms
      ease-in;
  }

  [data-phase="static"] .crt-intro-line,
  [data-phase="stabilize"] .crt-intro-line,
  [data-phase="stable"] .crt-intro-line {
    opacity: 0;
  }

  /* =========================================================
     CENTER FLASH
     ========================================================= */

  .crt-intro-flash {
    position: absolute;

    top: 50%;
    left: 50%;

    width: 40px;
    height: 40px;

    border-radius: 50%;

    background:
      radial-gradient(
        circle,
        rgba(255,255,255,1) 0%,
        rgba(255,255,255,0.4) 40%,
        transparent 70%
      );

    transform:
      translate(-50%, -50%)
      scale(0);

    opacity: 0;
  }

  [data-phase="flash"] .crt-intro-flash {
    animation:
      crtFlashBurst ${T.FLASH}ms
      ease-out forwards;
  }

  @keyframes crtFlashBurst {
    0% {
      transform:
        translate(-50%, -50%)
        scale(0.2);

      opacity: 0;
    }

    35% {
      transform:
        translate(-50%, -50%)
        scale(1);

      opacity: 1;
    }

    100% {
      transform:
        translate(-50%, -50%)
        scale(18);

      opacity: 0;
    }
  }

  /* =========================================================
     ANALOG STATIC
     ========================================================= */

  .crt-intro-static {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    opacity: 0;

    filter:
      brightness(1.05)
      contrast(2.2);

    mix-blend-mode: screen;
  }

  [data-phase="static"] .crt-intro-static {
    opacity: 1;
  }

  [data-phase="stabilize"] .crt-intro-static {
    opacity: 0;

    transition:
      opacity ${T.STABILIZE}ms ease-out;
  }

  /* =========================================================
     DARKER GREEN STATIC
     ========================================================= */

  [data-phase="static"] .crt-intro-static,
  [data-phase="stabilize"] .crt-intro-static {
    background:
      rgba(10, 130,0, 1);

    background-blend-mode: screen;
  }

  /* =========================================================
     SCANLINES
     ========================================================= */

  .crt-intro-scanlines {
    position: absolute;
    inset: 0;

    background:
      repeating-linear-gradient(
        to bottom,
        rgba(0,0,0,0.85) 0px,
        rgba(0,0,0,0.85) 1px,
        transparent 2px,
        transparent 4px
      );

    opacity: 0;

    pointer-events: none;
    z-index: 3;
  }

  [data-phase="static"] .crt-intro-scanlines,
  [data-phase="stabilize"] .crt-intro-scanlines,
  [data-phase="stable"] .crt-intro-scanlines {
    opacity: 0.5;
  }

  /* =========================================================
     STABLE LOGO
     ========================================================= */

  .crt-intro-logo {
    position: absolute;

    top: 50%;
    left: 50%;

    transform:
      translate(-50%, -50%);

    text-align: center;

    opacity: 0;

    z-index: 4;
  }

  [data-phase="stabilize"] .crt-intro-logo,
  [data-phase="stable"] .crt-intro-logo {
    opacity: 1;

    transition:
      opacity ${T.STABILIZE}ms ease-out;
  }

  .crt-intro-logo-title {
    font-family: "Mechsuit", sans-serif;

    font-size:
      clamp(1.8rem, 5vw, 3rem);

    letter-spacing: 0.08em;
    white-space: nowrap;

    color: #0CE644;

    text-shadow:
      0 0 10px rgba(12,230,68,0.7),
      0 0 24px rgba(12,230,68,0.35);
  }

  .crt-intro-logo-title > span {
    display: inline-block;
    animation: crt-logo-flicker var(--flicker-duration) ease-in-out infinite;
    animation-delay: var(--flicker-delay);
  }

  @keyframes crt-logo-flicker {
    0%, 26%, 100% {
      opacity: 1;
      text-shadow:
        0 0 10px rgba(12,230,68,0.7),
        0 0 24px rgba(12,230,68,0.35);
    }
    30%, 34% {
      opacity: 0.35;
      text-shadow:
        0 0 5px rgba(12,230,68,0.45),
        0 0 12px rgba(12,230,68,0.2);
    }
    35% {
      opacity: 0.9;
      text-shadow:
        0 0 14px rgba(12,230,68,0.85),
        0 0 30px rgba(12,230,68,0.45);
    }
  }

  @media (max-width: 480px) {
    .crt-intro-logo-title {
      font-size: clamp(1.3rem, 8vw, 2rem);
    }
  }

  .crt-intro-logo-sub {
    margin-top: 0.4rem;

    font-family:
      'Share Tech Mono',
      monospace;

    font-size:
      clamp(0.7rem, 2vw, 0.95rem);

    letter-spacing: 0.25em;

    color:
      rgba(12,230,68,0.75);
  }

  /* =========================================================
     REDUCED MOTION
     ========================================================= */

  @media (prefers-reduced-motion: reduce) {
    .crt-intro-root,
    .crt-intro-line,
    .crt-intro-flash,
    .crt-intro-static,
    .crt-intro-logo {
      transition:
        opacity 400ms ease !important;

      animation:
        none !important;
    }
  }
`;