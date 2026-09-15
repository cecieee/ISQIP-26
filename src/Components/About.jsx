import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600&display=swap");

  .ab-section {
    position: relative;
    background: var(--color-background);
    overflow: hidden;
  }

  .ab-outer {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    grid-template-areas:
      "heading image"
      "copy    image";
    align-items: center;
    min-height: clamp(500px, 75vh, 760px);
  }
  @media (max-width: 900px) {
    .ab-outer {
      grid-template-columns: 1fr;
      grid-template-areas:
        "heading"
        "image"
        "copy";
      min-height: 0;
    }
  }

  .ab-heading-col {
    grid-area: heading;
    min-width: 0;
    padding: clamp(3.5rem, 8vh, 5.5rem) clamp(1.5rem, 4vw, 3.5rem) 0;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .ab-heading-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (max-width: 900px) {
    .ab-heading-col { padding: clamp(3rem, 8vh, 4.5rem) clamp(1.25rem, 5vw, 2.5rem) 0; }
  }
  @media (max-width: 480px) {
    .ab-heading-col { padding: 2.5rem 1.1rem 0; }
  }

  .ab-heading {
    font-family: var(--font-mech);
    font-size: clamp(1.9rem, 4.2vw, 3.6rem);
    line-height: 1.05;
    margin: 0 0 2.4rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4em;
  }
  @media (max-width: 480px) {
    .ab-heading { margin-bottom: 1.4rem; }
  }
  .ab-heading-stroke {
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(245, 247, 246, 0.85);
    text-stroke: 1.5px rgba(245, 247, 246, 0.85);
    filter: drop-shadow(0 0 10px rgba(245, 247, 246, 0.15));
  }
  .ab-heading span.ab-heading-accent {
    color: var(--color-primary);
    -webkit-text-stroke: 0;
    text-stroke: 0;
    text-shadow: 0 0 16px rgba(12, 230, 68, 0.65), 0 0 32px rgba(12, 230, 68, 0.25);
  }

  .ab-copycol {
    grid-area: copy;
    min-width: 0;
    padding: 0 clamp(1.5rem, 4vw, 3.5rem) clamp(3.5rem, 8vh, 5.5rem);
  }
  @media (max-width: 900px) {
    .ab-copycol { padding: 1.5rem clamp(1.25rem, 5vw, 2.5rem) clamp(3rem, 8vh, 4.5rem); }
  }
  @media (max-width: 480px) {
    .ab-copycol { padding: 1.25rem 1.1rem 2.5rem; }
  }

  .ab-body-flow {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    width: 100%;
  }

  .ab-paragraph {
    font-family: 'Inter', sans-serif;
    font-size: clamp(0.98rem, 1.35vw, 1.15rem);
    line-height: 1.75;
    color: rgba(245, 247, 246, 0.75);
    margin: 0;
    font-weight: 400;
    width: 100%;
    word-break: break-word;
  }

  .ab-paragraph strong {
    font-weight: 700;
    color: #FFFFFF;
  }

  .ab-paragraph em {
    font-style: italic;
    color: var(--color-primary);
    font-weight: 500;
  }

  .ab-imgcol {
    grid-area: image;
    position: relative;
    height: clamp(380px, 52vw, 680px);
  }
  @media (max-width: 900px) {
    .ab-outer {
      grid-template-columns: 1fr;
      min-height: 0;
    }
    .ab-textcol {
      padding: clamp(2.5rem, 6vh, 4rem) clamp(1rem, 5vw, 2.5rem) 1.75rem;
    }
    .ab-heading {
      font-size: clamp(1.6rem, 7vw, 2.6rem);
      margin: 0 0 1.5rem;
    }
    .ab-imgcol {
      height: clamp(240px, 65vw, 420px);
      margin: 0 clamp(1.25rem, 6vw, 3rem);
    }
  }
  @media (max-width: 480px) {
    .ab-imgcol {
      height: 62vw;
      min-height: 220px;
      margin: 0 -1rem;
    }
  }

  .ab-wipe {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    clip-path: polygon(5% 0, 100% 0, 100% 100%, 0% 100%);
  }
  @media (max-width: 900px) {
    .ab-wipe { clip-path: polygon(12% 0, 100% 0, 88% 100%, 0% 100%); }
  }

  .ab-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 85% 26%;
    display: block;
    filter: saturate(0.92) contrast(1.03);
    transform: scale(1.08);
    transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ab-img-visible .ab-image {
    transform: scale(1);
  }

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
    background: #FFFFFF;
    opacity: 1;
    transform: scale(1);
    will-change: opacity, transform;
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .ab-img-visible .ab-pixel {
    opacity: 0;
    transform: scale(0.35);
  }

  .ab-link-wrap {
    margin-top: 1.6rem;
  }

  .ab-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-primary);
    text-decoration: none;
    position: relative;
    padding-bottom: 2px;
    transition: color 0.2s ease;
  }

  .ab-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 1px;
    background: var(--color-primary);
    transition: width 0.25s ease;
  }

  .ab-link:hover {
    color: #FFFFFF;
  }

  .ab-link:hover::after {
    width: 100%;
    background: #FFFFFF;
  }

  .ab-link-icon {
    font-size: 1rem;
    line-height: 1;
    transition: transform 0.25s ease;
  }

  .ab-link:hover .ab-link-icon {
    transform: translate(3px, -3px);
  }

  @media (prefers-reduced-motion: reduce) {
    .ab-image, .ab-pixel {
      transition: none !important;
      transform: none !important;
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
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

const GRID_SIZE = 10;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const PIXEL_STEP = 6;

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
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, offset: 60, easing: "ease-out" });
  }, []);

  const [imgRef, imgInView] = useInView(0.15);
  const [imgLoaded, setImgLoaded] = useState(false);

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
          className={`ab-heading-col ${imgInView ? "ab-heading-visible" : ""}`}
        >
          <h2 className="ab-heading">
            <span className="ab-heading-stroke">About</span>{" "}
            <span className="ab-heading-accent">ISQIP</span>
          </h2>
        </div>

        <div
          className={`ab-imgcol ${imgReady ? "ab-img-visible" : ""}`}
          ref={imgRef}
        >
          <div className="ab-wipe">
            <img
              src="/isqip-photo.jpg"
              alt="ISQIP participants"
              className="ab-image"
              loading="eager"
              fetchpriority="high"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
            <div className="ab-pixel-grid" style={{ "--ab-grid": GRID_SIZE }}>
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

        <div className="ab-copycol" data-aos="fade-down" data-aos-delay="100">
          <div className="ab-body-flow">
            <p className="ab-paragraph">
              <strong>IEEE Student Quality Improvement Programme (ISQIP '25)</strong> is a structured initiative designed to transform students into{" "}
              <em>industry-ready professionals</em>. The program features comprehensive domain-specific training with hands-on projects for{" "}
              <em>CSE</em>, <em>ECE</em>, and <em>EEE</em> students.
            </p>

            <p className="ab-paragraph">
              Beyond technical skills, <em>ISQIP '25</em> includes essential professional development through{" "}
              <strong>group discussions</strong>, <strong>mock interviews</strong>,{" "}
              <strong>aptitude training</strong>, <strong>resume building</strong>, and{" "}
              <strong>LinkedIn profile enhancement</strong>. Led by <em>industry experts</em>, the program ensures career readiness and opens doors to internship opportunities.
            </p>

            <div className="ab-link-wrap">
              <a
                href="https://cecieee.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="ab-link"
              >
                <span>About IEEE SB CEC</span>
                <span className="ab-link-icon">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}