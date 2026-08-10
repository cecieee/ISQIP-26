const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap");

  .ab-section {
    position: relative;
    background: var(--color-background);
    padding: clamp(4.5rem, 12vh, 8rem) clamp(1.5rem, 6vw, 5rem);
    overflow: hidden;
  }

  .ab-watermark {
    position: absolute;
    top: clamp(1rem, 4vh, 2rem);
    left: clamp(1.5rem, 6vw, 5rem);
    font-family: var(--font-mech);
    font-size: clamp(1.8rem, 16vw, 11rem);
    color: rgba(245,247,246,0.03);
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
  }

  .ab-grid {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 0.85fr;
    gap: clamp(2.5rem, 6vw, 5rem);
    align-items: center;
  }
  @media (max-width: 800px) {
    .ab-grid { grid-template-columns: 1fr; }
  }

  .ab-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    color: var(--color-primary);
    letter-spacing: 0.05em;
    margin: 0 0 0.6rem;
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

  .ab-pullout {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: var(--color-primary);
    border-left: 2px solid var(--color-primary);
    padding-left: 1rem;
    margin-top: 1.75rem;
    max-width: 40ch;
  }

  .ab-frame {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
  }
  .ab-frame::before,
  .ab-frame::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-primary);
    z-index: 2;
    pointer-events: none;
  }
  .ab-frame::before { top: -8px; left: -8px; border-right: none; border-bottom: none; }
  .ab-frame::after { bottom: -8px; right: -8px; border-left: none; border-top: none; }

  .ab-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
    filter: saturate(0.92) contrast(1.03);
  }

  /* --- telemetry markers: snap into place once, then hold still --- */
  .ab-tag {
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    opacity: 0;
    animation: ab-lock 0.5s ease forwards;
  }
  .ab-tag--a { top: 16%; left: 12%; animation-delay: 0.5s; }
  .ab-tag--b { bottom: 20%; right: 10%; animation-delay: 0.85s; flex-direction: row-reverse; }

  @keyframes ab-lock {
    0% { opacity: 0; transform: scale(1.6); }
    60% { opacity: 1; }
    100% { opacity: 1; transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ab-tag { animation: none; opacity: 1; transform: scale(1); }
  }

  .ab-reticle {
    width: 14px;
    height: 14px;
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
  }
  .ab-reticle::before,
  .ab-reticle::after {
    content: "";
    position: absolute;
    background: var(--color-primary);
  }
  .ab-reticle::before { top: 50%; left: -5px; width: 4px; height: 1px; transform: translateY(-50%); }
  .ab-reticle::after { top: -5px; left: 50%; width: 1px; height: 4px; transform: translateX(-50%); }

  .ab-tag-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: var(--color-primary);
    background: rgba(7,17,16,0.75);
    backdrop-filter: blur(4px);
    padding: 0.2rem 0.5rem;
    white-space: nowrap;
  }

  .ab-caption {
    margin-top: 0.8rem;
    display: flex;
    justify-content: space-between;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: var(--color-primary);
  }
  .ab-caption span { color: rgba(245,247,246,0.4); }
`;

export default function About() {
  return (
    <section id="about" className="ab-section">
      <style>{STYLES}</style>
      <p className="ab-watermark">About</p>

      <div className="ab-grid">
        <div>
          <p className="ab-eyebrow">// about_isqip</p>
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

          <p className="ab-pullout">
            Since 1996, IEEE SB CEC has run the sessions that get
            people internship-ready.
          </p>
        </div>

        <div>
          <div className="ab-frame">
            <img
              src="/isqip-photo.jpg"
              alt="ISQIP participants"
              className="ab-image"
            />
            <div className="ab-tag ab-tag--a">
              <span className="ab-reticle" />
              <span className="ab-tag-label">ISQIP_25</span>
            </div>
            <div className="ab-tag ab-tag--b">
              <span className="ab-reticle" />
              <span className="ab-tag-label">STATUS: ACTIVE</span>
            </div>
          </div>
          <div className="ab-caption">
            // archive_2025
            <span>last year's cohort</span>
          </div>
        </div>
      </div>
    </section>
  );
}