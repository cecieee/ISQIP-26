import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap");

  .ab-section {
    position: relative;
    background: var(--color-background);
  }
  .ab-outer {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    align-items: center;
    gap: clamp(2.5rem, 5vw, 4rem);
    max-width: 1300px;
    margin: 0 auto;
    padding: clamp(4rem, 10vh, 6rem) clamp(1.5rem, 6vw, 4rem);
  }
  @media (max-width: 900px) {
    .ab-outer {
      grid-template-columns: 1fr;
      padding: clamp(3.5rem, 10vh, 5rem) clamp(1.5rem, 6vw, 3rem);
    }
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
  .ab-copy {
    font-family: 'Inter', sans-serif;
    font-size: 1.02rem;
    line-height: 1.75;
    color: rgba(245,247,246,0.72);
    max-width: 52ch;
    margin: 0 0 1.4rem;
  }
  .ab-highlight {
    background: rgba(12,230,68,0.15);
    color: var(--color-primary);
    padding: 0.05em 0.35em;
    font-weight: 500;
  }

  /* ---------------- image: tilt + spotlight glass card ---------------- */
  .ab-visual {
    position: relative;
    max-width: 560px;
    margin: 0 auto;
  }

  /* soft rotating glow sitting behind the card */
  .ab-glow {
    position: absolute;
    inset: -6%;
    z-index: 0;
    border-radius: 32px;
    background: conic-gradient(
      from 0deg,
      rgba(12,230,68,0.55),
      rgba(12,230,68,0) 30%,
      rgba(12,230,68,0) 70%,
      rgba(12,230,68,0.55) 100%
    );
    filter: blur(38px);
    opacity: 0.55;
    animation: ab-rotate 10s linear infinite;
  }
  @keyframes ab-rotate {
    to { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ab-glow { animation: none; }
  }

  .ab-card {
    position: relative;
    z-index: 1;
    aspect-ratio: 4 / 3;
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid rgba(12,230,68,0.25);
    box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6);
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 0.15s ease-out;
  }

  .ab-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
    filter: saturate(0.95) contrast(1.03);
    transform: translateZ(0) scale(1.02);
  }

  /* subtle bottom gradient so overlay text/badges stay legible */
  .ab-card-shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(3,10,6,0.55) 0%,
      rgba(3,10,6,0) 35%
    );
    pointer-events: none;
  }

  /* cursor-following spotlight */
  .ab-spotlight {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease;
    background: radial-gradient(
      260px circle at var(--mx, 50%) var(--my, 50%),
      rgba(12,230,68,0.25),
      transparent 65%
    );
    mix-blend-mode: screen;
  }
  .ab-card:hover .ab-spotlight { opacity: 1; }

  /* floating glass badge, overlapping the card corner */
  .ab-badge {
    position: absolute;
    left: -18px;
    bottom: -18px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 1.1rem;
    border-radius: 14px;
    background: rgba(10,18,14,0.65);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(12,230,68,0.3);
    box-shadow: 0 12px 28px -10px rgba(0,0,0,0.55);
  }
  .ab-badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 8px 2px rgba(12,230,68,0.6);
    flex-shrink: 0;
  }
  .ab-badge-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    line-height: 1.4;
    color: rgba(245,247,246,0.85);
    letter-spacing: 0.02em;
  }
  .ab-badge-text strong {
    display: block;
    font-family: var(--font-mech);
    font-size: 0.95rem;
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.01em;
  }

  @media (max-width: 900px) {
    .ab-badge { left: 14px; bottom: 14px; }
  }
`;

export default function About() {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 60, easing: "ease-out" });
  }, []);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 12;

    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
    });
  };

  return (
    <section id="about" className="ab-section">
      <style>{STYLES}</style>
      <div className="ab-outer">
        <div data-aos="fade-down">
          <h2 className="ab-heading">
            About <span>ISQIP</span>
          </h2>
          <p className="ab-copy">
            A structured programme built to turn students into
            industry-ready professionals — domain-specific training with
            hands-on projects for CSE, ECE, and EEE.
          </p>
          <p className="ab-copy">
            Beyond technical skill, it covers what actually gets you
            hired: group discussions, mock interviews, aptitude
            training, resume building, and LinkedIn optimisation.
          </p>
          <p className="ab-copy">
            <span className="ab-highlight">
              Since 1996, IEEE SB CEC has run the sessions that get
              people internship-ready.
            </span>
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="150">
          <div className="ab-visual">
            <span className="ab-glow" />
            <div
              className="ab-card"
              ref={cardRef}
              style={style}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src="/isqip-photo.jpg"
                alt="ISQIP participants"
                className="ab-image"
              />
              <span className="ab-card-shade" />
              <span className="ab-spotlight" />
            </div>
            <div className="ab-badge">
              <span className="ab-badge-dot" />
              <span className="ab-badge-text">
                <strong>ISQIP '25</strong>
                last year's cohort
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}