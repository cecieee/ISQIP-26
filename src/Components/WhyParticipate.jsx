import {
  Briefcase,
  Target,
  HeartHandshake,
  MessagesSquare,
  Mic,
  BarChart3,
  FileText,
  Link2,
} from "lucide-react";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap");

  .wp-section {
    background: var(--color-background);
    padding: clamp(4.5rem, 12vh, 8rem) clamp(1.5rem, 6vw, 5rem);
  }
  .wp-header {
    max-width: 900px;
    margin: 0 auto clamp(3rem, 8vh, 5rem);
    text-align: center;
  }
  .wp-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    color: var(--color-primary);
    letter-spacing: 0.05em;
    margin: 0 0 0.6rem;
  }
  .wp-title {
    font-family: var(--font-mech);
    font-size: clamp(2rem, 5vw, 3rem);
    color: var(--color-text);
    margin: 0;
    text-transform: uppercase;
  }

  /* --- signal-path layout (desktop) --- */
  .wp-circuit {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    display: none;
  }
  @media (min-width: 900px) {
    .wp-circuit { display: block; }
    .wp-list-fallback { display: none; }
  }

  .wp-spine {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(12,230,68,0.25);
    transform: translateY(-50%);
  }
  .wp-pulse {
    position: absolute;
    top: 50%;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 8px 2px rgba(12,230,68,0.7);
    transform: translate(-50%, -50%);
    animation: wp-travel 3.5s ease-in-out infinite;
  }
  @keyframes wp-travel {
    0% { left: 0%; opacity: 0; }
    8% { opacity: 1; }
    92% { opacity: 1; }
    100% { left: 100%; opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .wp-pulse { animation: none; opacity: 0; }
  }

  .wp-row {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .wp-row--top .wp-node { align-self: end; padding-bottom: 2.1rem; }
  .wp-row--bottom .wp-node { align-self: start; padding-top: 2.1rem; }

  .wp-node {
    position: relative;
    display: flex;
    flex-direction: column;
    padding-left: 1.1rem;
    padding-right: 1.1rem;
    text-align: left;
  }
  .wp-node::before {
    content: "";
    position: absolute;
    left: 50%;
    width: 1px;
    background: rgba(12,230,68,0.25);
    transform: translateX(-50%);
  }
  .wp-row--top .wp-node::before { bottom: 0; height: 2.1rem; }
  .wp-row--bottom .wp-node::before { top: 0; height: 2.1rem; }

  .wp-node::after {
    content: "";
    position: absolute;
    left: 50%;
    width: 6px;
    height: 6px;
    background: var(--color-background);
    border: 1px solid var(--color-primary);
    transform: translateX(-50%);
  }
  .wp-row--top .wp-node::after { bottom: -3.5px; }
  .wp-row--bottom .wp-node::after { top: -3.5px; }

  .wp-icon {
    color: var(--color-primary);
    margin-bottom: 0.6rem;
  }
  .wp-node-title {
    font-family: var(--font-mech);
    font-size: 0.82rem;
    color: var(--color-text);
    margin: 0 0 0.4rem;
    text-transform: uppercase;
    line-height: 1.25;
  }
  .wp-node-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    line-height: 1.5;
    color: rgba(245,247,246,0.5);
    margin: 0;
  }

  /* --- fallback grid (mobile) --- */
  .wp-list-fallback {
    max-width: 640px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem 1.5rem;
  }
  @media (max-width: 480px) {
    .wp-list-fallback { grid-template-columns: 1fr; }
  }
  .wp-fb-icon { color: var(--color-primary); margin-bottom: 0.5rem; }
  .wp-fb-title {
    font-family: var(--font-mech);
    font-size: 0.85rem;
    color: var(--color-text);
    margin: 0 0 0.35rem;
    text-transform: uppercase;
  }
  .wp-fb-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    line-height: 1.5;
    color: rgba(245,247,246,0.5);
    margin: 0;
  }
`;

const BENEFITS = [
  { Icon: Briefcase, title: "Internship Opportunities", desc: "Connect with industry partners for real experience." },
  { Icon: Target, title: "Expert-led Sessions", desc: "Learn from industry professionals and experts." },
  { Icon: HeartHandshake, title: "Industry Mentorship", desc: "Get guidance from experienced professionals." },
  { Icon: MessagesSquare, title: "Group Discussion", desc: "Collaborative learning through peer interaction." },
  { Icon: Mic, title: "Mock Interviews", desc: "Practice for real-world interview scenarios." },
  { Icon: BarChart3, title: "Aptitude Test", desc: "Assess and improve analytical skills." },
  { Icon: FileText, title: "Resume Development", desc: "Build resumes that stand out to employers." },
  { Icon: Link2, title: "LinkedIn Optimisation", desc: "Enhance your professional online presence." },
];

export default function WhyParticipate() {
  const top = BENEFITS.slice(0, 4);
  const bottom = BENEFITS.slice(4);

  return (
    <>
      <style>{STYLES}</style>

      <section id="benefits" className="wp-section">
        <div className="wp-header">
          <p className="wp-eyebrow">// why_participate</p>
          <h2 className="wp-title">Why Participate</h2>
        </div>

        <div className="wp-circuit">
          <div className="wp-row wp-row--top">
            {top.map(({ Icon, title, desc }) => (
              <div className="wp-node" key={title}>
                <Icon className="wp-icon" size={18} strokeWidth={1.5} />
                <h3 className="wp-node-title">{title}</h3>
                <p className="wp-node-desc">{desc}</p>
              </div>
            ))}
          </div>

          <div className="wp-spine">
            <span className="wp-pulse" />
          </div>

          <div className="wp-row wp-row--bottom">
            {bottom.map(({ Icon, title, desc }) => (
              <div className="wp-node" key={title}>
                <Icon className="wp-icon" size={18} strokeWidth={1.5} />
                <h3 className="wp-node-title">{title}</h3>
                <p className="wp-node-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="wp-list-fallback">
          {BENEFITS.map(({ Icon, title, desc }) => (
            <div key={title}>
              <Icon className="wp-fb-icon" size={17} strokeWidth={1.5} />
              <h3 className="wp-fb-title">{title}</h3>
              <p className="wp-fb-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}