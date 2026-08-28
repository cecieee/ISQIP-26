const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

  .ob-section {
    background: var(--color-background);
    padding: clamp(3.5rem, 8vh, 5.5rem) clamp(1.5rem, 5vw, 4rem);
    text-align: center;
  }
  .ob-title {
    font-family: var(--font-mech);
    font-size: clamp(1.5rem, 5vw, 4rem);
    color: var(--color-text);
    margin: 0 0 clamp(3.5rem, 6vw, 4.5rem);
  }
  .ob-accent { color: var(--color-primary); }

  .ob-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: clamp(1.75rem, 4vw, 3.5rem);
  }
  .ob-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    transition: transform 0.25s ease, opacity 0.25s ease;
    opacity: 0.88;
  }
  .ob-panel:hover {
    transform: scale(1.08);
    opacity: 1;
  }

  .ob-logo {
    max-width: 100%;
    max-height: clamp(75px, 8.5vw, 95px);
    width: auto;
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
  { name: "IEEE SB CEC", logo: "/logos/ieeesb.png", invert: true },
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