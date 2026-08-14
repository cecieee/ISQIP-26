import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
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
    padding: clamp(3rem, 7vh, 5.5rem) clamp(1.25rem, 6vw, 5rem);
  }

  .wp-desktop { display: block; }
  @media (max-width: 799px) {
    .wp-desktop { display: none; }
  }

  .wp-board {
    display: grid;
    grid-template-columns: minmax(0,1fr) auto minmax(0,1fr);
    grid-template-rows: repeat(4, minmax(0, 1fr));
    align-items: center;
    column-gap: clamp(2.5rem, 5vw, 4rem);
    row-gap: clamp(1.9rem, 4.2vw, 2.75rem);
    max-width: 1220px;
    margin: 0 auto;
  }

  .wp-row {
    position: relative;
    display: flex;
    align-items: center;
    gap: clamp(0.6rem, 1.5vw, 1rem);
    min-width: 0;
    grid-column: 1;
  }
  .wp-row.wp-row-right { grid-column: 3; }

  /* line: stops short of the box, leaving a visible gap before the pin */
  .wp-row.wp-row-left::after {
    content: "";
    position: absolute;
    top: 50%;
    right: calc(-1 * clamp(2.5rem, 5vw, 4rem) + 10px);
    width: calc(clamp(2.5rem, 5vw, 4rem) - 10px);
    height: 1px;
    background: rgba(12,230,68,0.6);
    box-shadow: 0 0 4px rgba(12,230,68,0.3);
  }
  .wp-row.wp-row-right::before {
    content: "";
    position: absolute;
    top: 50%;
    left: calc(-1 * clamp(2.5rem, 5vw, 4rem) + 10px);
    width: calc(clamp(2.5rem, 5vw, 4rem) - 10px);
    height: 1px;
    background: rgba(12,230,68,0.6);
    box-shadow: 0 0 4px rgba(12,230,68,0.3);
  }

  /* pin: belongs to the SAME row as the line, at the SAME top:50% anchor,
     positioned the full gap distance so it lands exactly on the box edge.
     Because both use the row's own center, they can never drift apart. */
  .wp-row-pin-end {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 9px;
    height: 9px;
    border: 2px solid var(--color-primary);
    background: var(--color-background);
    box-shadow: 0 0 7px 1px rgba(12,230,68,0.45);
  }
  .wp-row-left .wp-row-pin-end {
    right: calc(-1 * clamp(2.5rem, 5vw, 4rem));
  }
  .wp-row-right .wp-row-pin-end {
    left: calc(-1 * clamp(2.5rem, 5vw, 4rem));
  }

  .wp-row-text { min-width: 0; flex: 1 1 0%; }
  .wp-row-left .wp-row-text {
    padding-right: clamp(0.75rem, 1.5vw, 1.25rem);
  }
  .wp-row-right .wp-row-text {
    padding-left: clamp(0.75rem, 1.5vw, 1.25rem);
  }

  .wp-row-head {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 0.35rem;
  }
  .wp-row-icon {
    color: var(--color-primary);
    flex-shrink: 0;
    filter: drop-shadow(0 0 4px rgba(12,230,68,0.4));
  }
  .wp-row-title {
    font-family: var(--font-mech);
    font-size: clamp(0.78rem, 1vw, 0.9rem);
    color: var(--color-text);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1.35;
  }
  .wp-row-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    line-height: 1.55;
    color: rgba(245,247,246,0.72);
    margin: 0;
    max-width: 30ch;
  }

  .wp-row-left .wp-row-head {
    flex-direction: row-reverse;
    justify-content: flex-start;
    gap: 0.45rem;
    width: 100%;
  }
  .wp-row-left .wp-row-title { text-align: right; margin-left: auto; }
  .wp-row-left .wp-row-desc { text-align: right; margin-left: auto; }

  .wp-chip {
    position: relative;
    grid-column: 2;
    grid-row: 1 / -1;
    align-self: stretch;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: clamp(290px, 24vw, 340px);
    overflow: visible;
    border: 1px solid rgba(12,230,68,0.6);
    background: rgba(12,230,68,0.045);
    padding: clamp(1.75rem, 3.5vw, 2.25rem) clamp(1.75rem, 3vw, 2.25rem);
    animation: wp-chip-glow 4s ease-in-out infinite;
  }
  @keyframes wp-chip-glow {
    0%, 100% { box-shadow: 0 0 18px rgba(12,230,68,0.12), inset 0 0 30px rgba(12,230,68,0.04); }
    50% { box-shadow: 0 0 30px rgba(12,230,68,0.22), inset 0 0 30px rgba(12,230,68,0.07); }
  }
  @media (prefers-reduced-motion: reduce) {
    .wp-chip { animation: none; box-shadow: 0 0 18px rgba(12,230,68,0.14); }
  }

  .wp-chip::before,
  .wp-chip::after {
    content: "";
    position: absolute;
    top: 12.5%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 8px 2px rgba(12,230,68,0.7);
    z-index: 5;
    animation: wp-chip-travel 5s linear infinite;
  }
  .wp-chip::before { left: -3px; }
  .wp-chip::after { right: -3px; }
  @keyframes wp-chip-travel {
    0% { top: 12.5%; opacity: 0; }
    8% { opacity: 1; }
    92% { opacity: 1; }
    100% { top: 87.5%; opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .wp-chip::before, .wp-chip::after { animation: none; opacity: 0; }
  }

  .wp-chip-status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(12,230,68,0.7);
    letter-spacing: 0.05em;
    margin-bottom: 0.9rem;
  }
  .wp-chip-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 5px 1px rgba(12,230,68,0.7);
    animation: wp-blink 1.6s ease-in-out infinite;
  }
  @keyframes wp-blink { 50% { opacity: 0.25; } }
  @media (prefers-reduced-motion: reduce) {
    .wp-chip-dot { animation: none; }
  }

  .wp-chip-title {
    font-family: var(--font-mech);
    font-size: clamp(1.2rem, 1.8vw, 1.5rem);
    color: var(--color-text);
    margin: 0 0 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    line-height: 1.35;
    text-shadow: 0 0 14px rgba(12,230,68,0.4);
    overflow-wrap: normal;
    word-break: normal;
  }
  .wp-chip-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(245,247,246,0.4);
    margin: 0;
    letter-spacing: 0.03em;
  }

  .wp-mobile { display: none; }
  @media (max-width: 799px) {
    .wp-mobile { display: block; }
  }

  .wp-mobile-chip {
    position: relative;
    border: 1px solid rgba(12,230,68,0.6);
    background: rgba(12,230,68,0.045);
    box-shadow: 0 0 22px rgba(12,230,68,0.16);
    padding: 1.5rem 1.5rem;
    text-align: center;
    margin: 0 auto clamp(2.75rem, 9vw, 4rem);
    max-width: 320px;
  }

  .wp-mobile-rows {
    position: relative;
    max-width: 420px;
    margin: 0 auto;
    padding-left: 1.75rem;
  }
  .wp-mobile-rows::before {
    content: "";
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4.5px;
    width: 1px;
    background: rgba(12,230,68,0.3);
  }

  .wp-mobile-row {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding-bottom: clamp(2.1rem, 7vw, 2.75rem);
  }
  .wp-mobile-row:last-child { padding-bottom: 0; }

  .wp-mobile-pin {
    position: relative;
    left: -1.75rem;
    top: 0.4rem;
    width: 9px;
    height: 9px;
    flex-shrink: 0;
    border: 2px solid var(--color-primary);
    background: var(--color-background);
    box-shadow: 0 0 7px 1px rgba(12,230,68,0.45);
  }
  .wp-mobile-row-text { min-width: 0; }
  .wp-mobile-row-head {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 0.35rem;
  }
  .wp-mobile-row-title {
    font-family: var(--font-mech);
    font-size: 0.92rem;
    color: var(--color-text);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1.35;
  }
  .wp-mobile-row-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    line-height: 1.55;
    color: rgba(245,247,246,0.72);
    margin: 0;
  }
`;

const LEFT_BENEFITS = [
  { Icon: Briefcase, title: "Internship Opportunities", desc: "Connect with industry partners for valuable internship experience." },
  { Icon: Target, title: "Expert-led Sessions", desc: "Learn from industry professionals and technical experts." },
  { Icon: HeartHandshake, title: "Industry Mentorship", desc: "Get guidance from experienced professionals in your field." },
  { Icon: MessagesSquare, title: "Group Discussion", desc: "Collaborative learning through peer interactions and discussions." },
];

const RIGHT_BENEFITS = [
  { Icon: Mic, title: "Mock Interviews", desc: "Practice and prepare for real-world interview scenarios." },
  { Icon: BarChart3, title: "Aptitude Test", desc: "Assess and improve your technical and analytical skills." },
  { Icon: FileText, title: "Resume Development", desc: "Create compelling resumes that stand out to employers." },
  { Icon: Link2, title: "LinkedIn Optimisation", desc: "Enhance your professional online presence and networking." },
];

const ALL_BENEFITS = [...LEFT_BENEFITS, ...RIGHT_BENEFITS];

const CHIP_DELAY = 0;
const CHIP_SETTLE = 550;
const ROW_STEP = 350;

function rowDelay(i) {
  return CHIP_SETTLE + i * ROW_STEP;
}

export default function WhyParticipate() {
  useEffect(() => {
    AOS.init({ duration: 850, once: true, offset: 60, easing: "ease-out" });
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section id="benefits" className="wp-section">
        <div className="wp-desktop">
          <div className="wp-board">
            {LEFT_BENEFITS.map(({ Icon, title, desc }, i) => (
              <div
                className="wp-row wp-row-left"
                key={title}
                style={{ gridRow: i + 1 }}
                data-aos="fade-right"
                data-aos-delay={rowDelay(i)}
              >
                <div className="wp-row-text">
                  <div className="wp-row-head">
                    <Icon className="wp-row-icon" size={22} strokeWidth={1.5} />
                    <h3 className="wp-row-title">{title}</h3>
                  </div>
                  <p className="wp-row-desc">{desc}</p>
                </div>
                <span className="wp-row-pin-end" />
              </div>
            ))}

            <div className="wp-chip" data-aos="zoom-in" data-aos-delay={CHIP_DELAY}>
              <div>
                
                <h2 className="wp-chip-title">Why Participate</h2>
                
              </div>
            </div>

            {RIGHT_BENEFITS.map(({ Icon, title, desc }, i) => (
              <div
                className="wp-row wp-row-right"
                key={title}
                style={{ gridRow: i + 1 }}
                data-aos="fade-left"
                data-aos-delay={rowDelay(i)}
              >
                <span className="wp-row-pin-end" />
                <div className="wp-row-text">
                  <div className="wp-row-head">
                    <Icon className="wp-row-icon" size={22} strokeWidth={1.5} />
                    <h3 className="wp-row-title">{title}</h3>
                  </div>
                  <p className="wp-row-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wp-mobile">
          <div className="wp-mobile-chip" data-aos="zoom-in" data-aos-delay={CHIP_DELAY}>
            <h2 className="wp-chip-title">Why Participate</h2>
          </div>

          <div className="wp-mobile-rows"></div>

          <div className="wp-mobile-rows">
            {ALL_BENEFITS.map(({ Icon, title, desc }, i) => (
              <div
                className="wp-mobile-row"
                key={title}
                data-aos="fade-up"
                data-aos-delay={CHIP_SETTLE + i * ROW_STEP}
              >
                <span className="wp-mobile-pin" />
                <div className="wp-mobile-row-text">
                  <div className="wp-mobile-row-head">
                    <Icon className="wp-row-icon" size={22} strokeWidth={1.5} />
                    <h3 className="wp-mobile-row-title">{title}</h3>
                  </div>
                  <p className="wp-mobile-row-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}