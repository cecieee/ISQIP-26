function VlsiIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <line x1="7" y1="7" x2="10" y2="10" />
      <line x1="17" y1="7" x2="14" y2="10" />
      <line x1="7" y1="17" x2="10" y2="14" />
      <line x1="17" y1="17" x2="14" y2="14" />
    </svg>
  );
}

function SolarIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="6.7" y2="6.7" />
      <line x1="17.3" y1="17.3" x2="19.1" y2="19.1" />
      <line x1="4.9" y1="19.1" x2="6.7" y2="17.3" />
      <line x1="17.3" y1="6.7" x2="19.1" y2="4.9" />
    </svg>
  );
}

function QuantumIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
    </svg>
  );
}

const TRACKS = [
  {
    id: 1,
    name: "Understanding VLSI",
    description:
      "Circuit architectures, RTL to GDSII synthesis, and physical design methodologies for next-gen semiconductor silicon.",
    Icon: VlsiIcon,
  },
  {
    id: 2,
    name: "Neural Networks & Gen AI",
    description:
      "Deep learning architectures, transformer foundations, and building production-ready generative AI pipelines.",
    Icon: AiIcon,
  },
  {
    id: 3,
    name: "Sunlight to Electricity",
    description:
      "Model, simulate, and optimize high-efficiency solar PV systems, advanced inverter MPPT designs, and smart grid storage.",
    Icon: SolarIcon,
  },
  {
    id: 4,
    name: "Future of Computing",
    description:
      "Quantum computing principles, edge acceleration, and revolutionary architectures competing to replace traditional silicon.",
    Icon: QuantumIcon,
  },
];

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Share+Tech+Mono&display=swap");

  .lt-section {
    position: relative;
    background: var(--color-background, #071110);
    padding: clamp(4.5rem, 9vh, 7rem) clamp(1.25rem, 5vw, 4.5rem);
    overflow: hidden;
  }

  .lt-inner {
    position: relative;
    z-index: 2;
    max-width: 1240px;
    margin: 0 auto;
  }

  /* Header */
  .lt-header {
    text-align: center;
    margin-bottom: clamp(3.5rem, 7vw, 5rem);
  }

  .lt-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.76rem;
    color: rgba(12, 230, 68, 0.75);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 0.85rem;
  }

  .lt-eyebrow-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-primary, #0CE644);
    box-shadow: 0 0 6px rgba(12, 230, 68, 0.7);
  }

  .lt-title {
    font-family: var(--font-mech, sans-serif);
    font-size: clamp(2rem, 5.5vw, 3.4rem);
    color: var(--color-text, #F5F7F6);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 0 0 0.6rem;
    line-height: 1.05;
  }

  .lt-title span {
    color: var(--color-primary, #0CE644);
  }

  .lt-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.2rem;
  }

  .lt-divider-line {
    height: 1px;
    width: clamp(40px, 8vw, 90px);
    background: linear-gradient(90deg, transparent, rgba(12, 230, 68, 0.5));
  }

  .lt-divider-line:last-child {
    background: linear-gradient(270deg, transparent, rgba(12, 230, 68, 0.5));
  }

  .lt-divider-diamond {
    width: 6px;
    height: 6px;
    background: var(--color-primary, #0CE644);
    transform: rotate(45deg);
    box-shadow: 0 0 8px 2px rgba(12, 230, 68, 0.5);
  }

  /* 4-Card Responsive Grid */
  .lt-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 640px) {
    .lt-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }

  @media (min-width: 1040px) {
    .lt-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  }

  /* Module card */
  .lt-card {
    position: relative;
    background: linear-gradient(145deg, rgba(18, 32, 26, 0.98), rgba(7, 14, 12, 0.98));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-top: 2px solid rgba(12, 230, 68, 0.65);
    border-radius: 8px;
    padding: 1.35rem 1.35rem 1.1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    min-height: 330px;
    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;
    user-select: none;
    transition: border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
  }

  .lt-card::before {
    content: "";
    position: absolute;
    width: 150px;
    height: 150px;
    right: -72px;
    top: -78px;
    border: 1px solid rgba(12, 230, 68, 0.14);
    border-radius: 50%;
    box-shadow: 0 0 0 18px rgba(12, 230, 68, 0.025), 0 0 0 36px rgba(12, 230, 68, 0.018);
    pointer-events: none;
  }

  .lt-card:hover {
    border-color: rgba(12, 230, 68, 0.55);
    border-top-color: #0CE644;
    background: linear-gradient(145deg, rgba(20, 43, 29, 0.98), rgba(7, 14, 12, 0.98));
    transform: translateY(-5px);
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55), 0 0 28px rgba(12, 230, 68, 0.11);
  }

  .lt-card-top,
  .lt-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lt-card-top {
    position: relative;
    z-index: 1;
    margin-bottom: 2rem;
  }

  .lt-card-id,
  .lt-card-status,
  .lt-card-kicker,
  .lt-card-footer {
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .lt-card-id {
    font-family: 'Inter', sans-serif;
    color: var(--color-primary, #0CE644);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .lt-card-status {
    color: rgba(245, 247, 246, 0.42);
    font-size: 0.58rem;
  }

  /* Main content */
  .lt-card-main {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .lt-icon-shell {
    width: 58px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary, #0CE644);
    background: rgba(12, 230, 68, 0.08);
    border: 1px solid rgba(12, 230, 68, 0.28);
    border-radius: 6px;
    margin-bottom: 1.5rem;
    transition: color 0.3s ease, background 0.3s ease, transform 0.35s ease;
  }

  .lt-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lt-card:hover .lt-icon {
    color: #071110;
  }

  .lt-card:hover .lt-icon-shell {
    background: var(--color-primary, #0CE644);
    transform: translateY(-2px);
  }

  .lt-card-kicker {
    color: rgba(12, 230, 68, 0.68);
    font-size: 0.62rem;
    margin: 0 0 0.55rem;
  }

  .lt-card-title {
    font-family: var(--font-mech, sans-serif);
    font-size: clamp(0.95rem, 1.15vw, 1.2rem);
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0;
    margin: 0;
    line-height: 1.15;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  /* Description */
  .lt-card-desc-wrap {
    position: relative;
    z-index: 1;
    margin-top: 1.35rem;
  }

  .lt-card-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.84rem;
    color: rgba(245, 247, 246, 0.62);
    line-height: 1.65;
    margin: 0;
    max-width: 290px;
  }

  .lt-card-footer {
    position: relative;
    z-index: 1;
    color: rgba(245, 247, 246, 0.42);
    font-size: 0.58rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
    margin-top: 1.4rem;
  }

  .lt-card-arrow {
    color: var(--color-primary, #0CE644);
    font-size: 1.15rem;
    line-height: 0.7;
    transition: transform 0.3s ease;
  }

  .lt-card:hover .lt-card-arrow {
    transform: translate(3px, -3px);
  }

  @media (max-width: 639px) {
    .lt-card {
      min-height: 300px;
    }
  }
`;

function TrackCard({ track }) {
  const { name, description, Icon } = track;

  return (
    <div className="lt-card" tabIndex={0} role="article" aria-label={`${name} Track`}>
      <div className="lt-card-top">
        <span className="lt-card-id">0{track.id}</span>
        <span className="lt-card-status">Core Module</span>
      </div>

      <div className="lt-card-main">
        <div className="lt-icon-shell">
          <div className="lt-icon">
            <Icon />
          </div>
        </div>
        <p className="lt-card-kicker">Track 0{track.id}</p>
        <h3 className="lt-card-title">{name}</h3>
      </div>

      <div className="lt-card-desc-wrap">
        <p className="lt-card-desc">{description}</p>
      </div>

      <div className="lt-card-footer">
        <span>Explore pathway</span>
        <span className="lt-card-arrow" aria-hidden="true">&#8599;</span>
      </div>
    </div>
  );
}

export default function LearningTracks() {
  return (
    <section id="tracks" className="lt-section">
      <style>{STYLES}</style>

      <div className="lt-inner">
        <div className="lt-header">
          <div className="lt-eyebrow">
            <span className="lt-eyebrow-dot" />
            Specialized Pathways
          </div>
          <h2 className="lt-title">
            Learning <span>Tracks</span>
          </h2>
          <div className="lt-divider">
            <span className="lt-divider-line" />
            <span className="lt-divider-diamond" />
            <span className="lt-divider-line" />
          </div>
        </div>

        <div className="lt-grid">
          {TRACKS.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>
    </section>
  );
}