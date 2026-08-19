import { useEffect, useRef, useState } from "react";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap");

  .ab-section {
    position: relative;
    background: var(--color-background);
    overflow: hidden;
  }

  .ab-outer {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    align-items: center;
    min-height: clamp(480px, 70vh, 720px);
  }
  @media (max-width: 900px) {
    .ab-outer {
      grid-template-columns: 1fr;
      min-height: 0;
    }
  }

  .ab-textcol {
    padding: clamp(4rem, 10vh, 6rem) clamp(1.5rem, 6vw, 4rem);
    padding-right: clamp(1.5rem, 4vw, 3rem);
  }
  @media (max-width: 900px) {
    .ab-textcol { padding: clamp(3.5rem, 10vh, 5rem) clamp(1.5rem, 6vw, 3rem) 2.5rem; }
  }

  .ab-heading {
    font-family: var(--font-mech);
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    color: var(--color-text);
    line-height: 1;
    margin: 0 0 1.75rem;
    text-transform: uppercase;
  }
  .ab-heading span { color: var(--color-primary); }

  .ab-line-mask {
    overflow: hidden;
    margin: 0 0 1.4rem;
  }
  .ab-copy {
    font-family: 'Inter', sans-serif;
    font-size: 1.02rem;
    line-height: 1.75;
    color: rgba(245,247,246,0.72);
    max-width: 52ch;
    margin: 0;
    transform: translateY(100%);
    opacity: 0;
    transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s ease;
  }
  .ab-visible .ab-copy {
    transform: translateY(0);
    opacity: 1;
  }

  .ab-highlight {
    background: rgba(12,230,68,0.15);
    color: var(--color-primary);
    padding: 0.05em 0.35em;
    font-weight: 500;
  }

  /* --- image column: flat rectangle except one corner, which
     tapers off at an angle --- */
  .ab-imgcol {
    position: relative;
    height: clamp(340px, 46vw, 620px);
  }
  @media (max-width: 900px) {
    .ab-imgcol {
      height: clamp(240px, 60vw, 380px);
      margin: 0 clamp(1.5rem, 6vw, 3rem);
    }
  }

  .ab-wipe {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* flat on the right/bottom, tapers in only at the top-left corner */
    clip-path: polygon(6% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
  @media (max-width: 900px) {
    .ab-wipe {
      clip-path: polygon(4% 0%, 100% 0%, 100% 100%, 0% 100%);
    }
  }

  .ab-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 85% 26%;
    display: block;
    filter: saturate(0.92) contrast(1.03);
    transform: scale(1.1);
    transition: transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ab-visible .ab-image {
    transform: scale(1);
  }

  /* --- pixel-dissolve reveal: a grid of tiles covers the photo,
     each shrinks/fades away on its own randomised delay --- */
  .ab-pixel-grid {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    display: grid;
    grid-template-columns: repeat(var(--ab-grid), 1fr);
    grid-template-rows: repeat(var(--ab-grid), 1fr);
  }
  .ab-pixel {
    background: var(--color-background);
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .ab-visible .ab-pixel {
    opacity: 0;
    transform: scale(0.35);
  }

  @media (prefers-reduced-motion: reduce) {
    .ab-copy, .ab-image, .ab-pixel {
      transition: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
    .ab-pixel-grid { display: none; }
  }
`;

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// --- pixel grid setup ---
const GRID_SIZE = 8;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const PIXEL_STEP = 16; // ms between each tile starting to dissolve

// Shuffle the reveal order once so tiles don't dissolve row-by-row,
// they pop in a scattered "pixel dust" pattern like the reactbits demo.
function buildPixelDelays() {
  const order = Array.from({ length: CELL_COUNT }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const delays = new Array(CELL_COUNT);
  order.forEach((cellIndex, rank) => {
    delays[cellIndex] = rank * PIXEL_STEP;
  });
  return delays;
}
const PIXEL_DELAYS = buildPixelDelays();

export default function About() {
  const [textRef, textVisible] = useInView(0.15);
  const [imgRef, imgInView] = useInView(0.15);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Safety net: if the photo 404s or is slow, don't leave the
  // tiles permanently shut — reveal anyway after a short wait.
  useEffect(() => {
    if (imgLoaded) return;
    const t = setTimeout(() => setImgLoaded(true), 2500);
    return () => clearTimeout(t);
  }, [imgLoaded]);

  const imgReady = imgInView && imgLoaded;

  return (
    <section id="about" className="ab-section">
      <style>{STYLES}</style>

      <div className="ab-outer">
        <div
          className={`ab-textcol ${textVisible ? "ab-visible" : ""}`}
          ref={textRef}
        >
          <h2 className="ab-heading">
            About <span>ISQIP</span>
          </h2>

          <div className="ab-line-mask">
            <p className="ab-copy" style={{ transitionDelay: "0.1s" }}>
              A structured programme built to turn students into
              industry-ready professionals — domain-specific training with
              hands-on projects for CSE, ECE, and EEE.
            </p>
          </div>
          <div className="ab-line-mask">
            <p className="ab-copy" style={{ transitionDelay: "0.5s" }}>
              Beyond technical skill, it covers what actually gets you
              hired: group discussions, mock interviews, aptitude
              training, resume building, and LinkedIn optimisation.
            </p>
          </div>
          <div className="ab-line-mask">
            <p className="ab-copy" style={{ transitionDelay: "0.9s" }}>
              <span className="ab-highlight">
                Since 1996, IEEE SB CEC has run the sessions that get
                people internship-ready.
              </span>
            </p>
          </div>
        </div>

        <div
          className={`ab-imgcol ${imgReady ? "ab-visible" : ""}`}
          ref={imgRef}
        >
          <div className="ab-wipe">
            <img
              src="/isqip-photo.jpg"
              alt="ISQIP participants"
              className="ab-image"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
            <div
              className="ab-pixel-grid"
              style={{ "--ab-grid": GRID_SIZE }}
            >
              {Array.from({ length: CELL_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="ab-pixel"
                  style={{ transitionDelay: `${PIXEL_DELAYS[i]}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}