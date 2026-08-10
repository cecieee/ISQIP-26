const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

  .ob-section {
    background: var(--color-background);
    padding: clamp(3.5rem, 8vh, 5.5rem) clamp(1.5rem, 5vw, 4rem);
    text-align: center;
  }
  .ob-title {
    font-family: var(--font-mech);
    font-size: clamp(1.5rem, 3vw, 1.9rem);
    color: var(--color-text);
    margin: 0 0 1rem;   /* was 2rem */
  }
  .ob-accent { color: var(--color-primary); }

  .ob-grid {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  .ob-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    transition: transform 0.25s ease, opacity 0.25s ease;
    opacity: 0.85;
  }
  .ob-panel:hover {
    transform: scale(1.06);
    opacity: 1;
  }

  .ob-logo {
    max-width: 100%;
    max-height: 56px;
    object-fit: contain;
  }
  .ob-logo.ob-invert {
    filter: invert(1) brightness(1.1);
  }

  @media (prefers-reduced-motion: reduce) {
    .ob-panel { transition: none; }
  }
`;

const ORGANIZERS = [
  { name: "IEEE SB CEC", logo: "/logos/ieee.png", invert: true },
  { name: "IEEE Computer Society", logo: "/logos/cs.png", invert: true },
  { name: "SSCS", logo: "/logos/sscs.png", invert: false },
  { name: "IEEE PES", logo: "/logos/pes.png", invert: true },
];

export default function OrganizedBy() {
  return (
    <>
      <style>{STYLES}</style>

      <section id="organized-by" className="ob-section">
        <h2 className="ob-title">
          Organized <span className="ob-accent">By</span>
        </h2>
        <div className="ob-grid">
          {ORGANIZERS.map((org) => (
            <div className="ob-panel" key={org.name}>
              <img
                src={org.logo}
                alt={org.name}
                className={`ob-logo ${org.invert ? "ob-invert" : ""}`}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}