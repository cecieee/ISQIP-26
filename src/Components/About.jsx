import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

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

  .ab-imgcol {
    position: relative;
    height: clamp(340px, 46vw, 620px);
    clip-path: polygon(5% 0, 100% 0, 100% 100%, 0% 100%);
  }
  @media (max-width: 900px) {
    .ab-imgcol {
      height: clamp(240px, 60vw, 380px);
      clip-path: none;
      margin: 0 clamp(1.5rem, 6vw, 3rem);
    }
  }

  .ab-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 85% 26%;
    display: block;
    filter: saturate(0.92) contrast(1.03);
  }

  /* small floating badge over the bottom-left of the photo,
     same circuit-status language as the rest of the page */
  .ab-badge {
    position: absolute;
    left: clamp(0.5rem, 2vw, 1rem);
    bottom: clamp(0.2rem, 1vw, 0.4rem);
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    background: rgba(6, 14, 9, 0.82);
    border: 1px solid rgba(12,230,68,0.4);
    border-radius: 8px;
    backdrop-filter: blur(3px);
    padding: 0.55rem 0.95rem;
  }
  .ab-badge-top {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--color-primary);
    letter-spacing: 0.03em;
  }
  .ab-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 5px 1px rgba(12,230,68,0.7);
    animation: ab-blink 1.6s ease-in-out infinite;
  }
  @keyframes ab-blink { 50% { opacity: 0.25; } }
  .ab-badge-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: rgba(245,247,246,0.55);
    letter-spacing: 0.02em;
  }
  @media (prefers-reduced-motion: reduce) {
    .ab-badge-dot { animation: none; }
  }
`;

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, offset: 60, easing: "ease-out" });
  }, []);

  return (
    <section id="about" className="ab-section">
      <style>{STYLES}</style>

      <div className="ab-outer">
        <div className="ab-textcol" data-aos="fade-down">
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

        <div className="ab-imgcol" data-aos="fade-up" data-aos-delay="160">
          <img
            src="/isqip-photo.jpg"
            alt="ISQIP participants"
            className="ab-image"
          />
          <div className="ab-badge">
            <p className="ab-badge-top">
              <span className="ab-badge-dot" /> ISQIP '25
            </p>
            <p className="ab-badge-sub">last year's cohort</p>
          </div>
        </div>
      </div>
    </section>
  );
}