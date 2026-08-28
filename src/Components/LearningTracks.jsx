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

  /* Fixed Height Card with Natural Full-Height Centering */
  .lt-card {
    position: relative;
    background: #090e0c;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 16px;
    padding: 2.2rem 1.65rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 350px;
    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;
    user-select: none;
    transition: border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
  }

  .lt-card:hover {
    border-color: rgba(12, 230, 68, 0.4);
    background: #0c1410;
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.65), 0 0 26px rgba(12, 230, 68, 0.08);
  }

  /* Main Group: Icon & Title */
  .lt-card-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Icon */
  .lt-icon {
    color: var(--color-primary, #0CE644);
    margin-bottom: 1.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease, filter 0.3s ease, transform 0.35s ease;
  }

  .lt-card:hover .lt-icon {
    color: #ffffff;
    transform: scale(1.08);
    filter: drop-shadow(0 0 14px rgba(12, 230, 68, 0.6));
  }

  /* Title */
  .lt-card-title {
    font-family: 'Inter', sans-serif;
    font-size: clamp(1.22rem, 1.45vw, 1.35rem);
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.015em;
    margin: 0;
    line-height: 1.28;
  }

  /* Description: Larger font size & smooth centered expansion */
  .lt-card-desc-wrap {
    max-height: 0;
    opacity: 0;
    transform: translateY(10px);
    margin-top: 0;
    overflow: hidden;
    transition:
      max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.35s ease,
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      margin-top 0.35s ease;
  }

  .lt-card:hover .lt-card-desc-wrap {
    max-height: 180px;
    opacity: 1;
    transform: translateY(0);
    margin-top: 1.15rem;
  }

  .lt-card-desc {
    font-family: 'Inter', sans-serif;
    font-size: clamp(0.94rem, 1.15vw, 1.02rem);
    color: rgba(245, 247, 246, 0.75);
    line-height: 1.68;
    margin: 0;
    max-width: 285px;
  }
`;

function TrackCard({ track }) {
  const { name, description, Icon } = track;

  return (
    <div className="lt-card" tabIndex={0} role="article" aria-label={`${name} Track`}>
      <div className="lt-card-main">
        <div className="lt-icon">
          <Icon />
        </div>
        <h3 className="lt-card-title">{name}</h3>
      </div>

      <div className="lt-card-desc-wrap">
        <p className="lt-card-desc">{description}</p>
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