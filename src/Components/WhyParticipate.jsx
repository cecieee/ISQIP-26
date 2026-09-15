import { useState, useEffect, useRef } from "react";
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
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&family=Bruno+Ace&display=swap");

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
    cursor: pointer;
    transition: transform 0.25s ease;
  }
  .wp-row:hover,
  .wp-row.is-revealed {
    transform: translateY(-2px);
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
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .wp-row.wp-row-left:hover::after,
  .wp-row.wp-row-left.is-revealed::after {
    background: rgba(12,230,68,1);
    box-shadow: 0 0 8px rgba(12,230,68,0.6);
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
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .wp-row.wp-row-right:hover::before,
  .wp-row.wp-row-right.is-revealed::before {
    background: rgba(12,230,68,1);
    box-shadow: 0 0 8px rgba(12,230,68,0.6);
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
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .wp-row:hover .wp-row-pin-end,
  .wp-row.is-revealed .wp-row-pin-end {
    box-shadow: 0 0 12px 3px rgba(12,230,68,0.8);
  }
  .wp-row-left .wp-row-pin-end {
    right: calc(-1 * clamp(2.5rem, 5vw, 4rem));
  }
  .wp-row-right .wp-row-pin-end {
    left: calc(-1 * clamp(2.5rem, 5vw, 4rem));
  }

  .wp-row-text { 
    min-width: 0; 
    flex: 1 1 0%;
    position: relative;
  }
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
    transform: translateY(1.1rem); /* aligns title directly on the connector line axis initially */
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .wp-row:hover .wp-row-head,
  .wp-row.is-revealed .wp-row-head {
    transform: translateY(0);
  }
  .wp-row-icon {
    color: var(--color-primary);
    flex-shrink: 0;
    filter: drop-shadow(0 0 4px rgba(12,230,68,0.4));
    opacity: 0;
    visibility: hidden;
    transform: scale(0.6);
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s ease;
  }
  .wp-row:hover .wp-row-icon,
  .wp-row.is-revealed .wp-row-icon,
  .wp-mobile-row:hover .wp-mobile-row-icon,
  .wp-mobile-row.is-revealed .wp-mobile-row-icon {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
  .wp-row-title {
    font-family: var(--font-mech);
    font-size: clamp(0.78rem, 1vw, 0.9rem);
    color: var(--color-text);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1.35;
    transition: color 0.3s ease, text-shadow 0.3s ease;
  }
  .wp-row:hover .wp-row-title,
  .wp-row.is-revealed .wp-row-title,
  .wp-mobile-row:hover .wp-mobile-row-title,
  .wp-mobile-row.is-revealed .wp-mobile-row-title {
    color: #ffffff;
    text-shadow: 0 0 8px rgba(12,230,68,0.5);
  }
  .wp-row-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    line-height: 1.55;
    color: rgba(245,247,246,0.72);
    margin: 0;
    max-width: 30ch;
    opacity: 0;
    visibility: hidden;
    transform: translateY(8px);
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s ease;
  }
  .wp-row:hover .wp-row-desc,
  .wp-row.is-revealed .wp-row-desc,
  .wp-mobile-row:hover .wp-mobile-row-desc,
  .wp-mobile-row.is-revealed .wp-mobile-row-desc {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
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
  .wp-chip-title .wp-chip-highlight {
    color: var(--color-primary);
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

  .wp-mobile-header {
    text-align: center;
    margin-bottom: clamp(2rem, 6vw, 3rem);
  }

  .wp-mobile-title {
    font-family: var(--font-mech);
    font-size: clamp(1.8rem, 6.5vw, 2.4rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 0 0 0.5rem;
    line-height: 1.1;
  }

  .wp-mobile-title span {
    color: var(--color-primary);
    text-shadow: 0 0 14px rgba(12, 230, 68, 0.55), 0 0 28px rgba(12, 230, 68, 0.25);
  }

  .wp-mobile-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0.9rem;
  }
  .wp-mobile-divider-line {
    height: 1px;
    width: clamp(30px, 8vw, 60px);
    background: linear-gradient(90deg, transparent, rgba(12,230,68,0.5));
  }
  .wp-mobile-divider-line:last-child {
    background: linear-gradient(270deg, transparent, rgba(12,230,68,0.5));
  }
  .wp-mobile-divider-diamond {
    width: 5px;
    height: 5px;
    background: var(--color-primary);
    transform: rotate(45deg);
    box-shadow: 0 0 6px 2px rgba(12,230,68,0.5);
  }

  .wp-mobile-list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid rgba(12, 230, 68, 0.12);
    border-bottom: 1px solid rgba(12, 230, 68, 0.12);
  }

  /* 1. Base / Default Item State */
  .wp-mobile-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    padding: 1.15rem 0.75rem 1.15rem 1rem;
    border-bottom: 1px solid rgba(12, 230, 68, 0.08);
    border-left: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.25s ease,
                border-left-color 0.25s ease,
                box-shadow 0.25s ease,
                transform 0.25s ease;
  }

  .wp-mobile-item:last-child {
    border-bottom: none;
  }

  .wp-mobile-item-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0.12rem;
  }

  .wp-mobile-item-icon {
    color: rgba(245, 247, 246, 0.7);
    flex-shrink: 0;
    opacity: 0.75;
    transform: scale(0.95);
    transition: opacity 0.25s ease, transform 0.25s ease, filter 0.25s ease, color 0.25s ease;
  }

  .wp-mobile-item-body {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
    flex: 1;
  }

  .wp-mobile-item-title {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.86rem, 2.8vw, 0.96rem);
    color: var(--color-text, #F5F7F6);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    line-height: 1.35;
    transition: color 0.25s ease, text-shadow 0.25s ease;
  }

  /* 2. Previously Revealed State (Persistent open description, soft accent) */
  .wp-mobile-item.is-past,
  .wp-mobile-item.is-revealed {
    border-left-color: rgba(12, 230, 68, 0.35);
  }

  .wp-mobile-item.is-past .wp-mobile-item-icon,
  .wp-mobile-item.is-revealed .wp-mobile-item-icon {
    color: var(--color-primary);
    opacity: 0.85;
    filter: drop-shadow(0 0 4px rgba(12, 230, 68, 0.4));
  }

  /* 3. Hover, Active, and Reading Focus States (High-priority interactive state) */
  .wp-mobile-item:hover,
  .wp-mobile-item:active,
  .wp-mobile-item.is-scrolled {
    background: linear-gradient(90deg, rgba(12, 230, 68, 0.08) 0%, rgba(12, 230, 68, 0.015) 60%, transparent 100%) !important;
    border-left-color: var(--color-primary) !important;
    box-shadow: inset 2px 0 8px rgba(12, 230, 68, 0.15) !important;
    transform: translateX(4px);
  }

  .wp-mobile-item:hover .wp-mobile-item-title,
  .wp-mobile-item:active .wp-mobile-item-title,
  .wp-mobile-item.is-scrolled .wp-mobile-item-title {
    color: var(--color-primary) !important;
    text-shadow: 0 0 8px rgba(12, 230, 68, 0.7), 0 0 18px rgba(12, 230, 68, 0.35) !important;
  }

  .wp-mobile-item:hover .wp-mobile-item-icon,
  .wp-mobile-item:active .wp-mobile-item-icon,
  .wp-mobile-item.is-scrolled .wp-mobile-item-icon {
    opacity: 1 !important;
    transform: scale(1.14);
    color: var(--color-primary) !important;
    filter: drop-shadow(0 0 8px rgba(12, 230, 68, 0.9)) !important;
  }

  /* Smooth zero-lag grid-based expanding description */
  .wp-mobile-desc-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .wp-mobile-item:hover .wp-mobile-desc-wrapper,
  .wp-mobile-item:active .wp-mobile-desc-wrapper,
  .wp-mobile-item.is-scrolled .wp-mobile-desc-wrapper,
  .wp-mobile-item.is-revealed .wp-mobile-desc-wrapper,
  .wp-mobile-item.is-past .wp-mobile-desc-wrapper {
    grid-template-rows: 1fr;
  }

  .wp-mobile-desc-inner {
    overflow: hidden;
  }

  .wp-mobile-item-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.84rem;
    line-height: 1.55;
    color: rgba(245, 247, 246, 0.55);
    margin: 0;
    padding-top: 0.35rem;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
  }

  /* When revealed or past: description is visible and stays open */
  .wp-mobile-item.is-past .wp-mobile-item-desc,
  .wp-mobile-item.is-revealed .wp-mobile-item-desc {
    opacity: 1;
    transform: translateY(0);
    color: rgba(245, 247, 246, 0.75);
  }

  /* When actively focused or hovered: description is highlighted bright */
  .wp-mobile-item:hover .wp-mobile-item-desc,
  .wp-mobile-item:active .wp-mobile-item-desc,
  .wp-mobile-item.is-scrolled .wp-mobile-item-desc {
    opacity: 1 !important;
    transform: translateY(0);
    color: rgba(245, 247, 246, 0.95) !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .wp-mobile-item, .wp-mobile-item-title,
    .wp-mobile-item-icon, .wp-mobile-item-desc, .wp-mobile-desc-wrapper {
      transition: none;
      transform: none !important;
    }
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
  const [revealed, setRevealed] = useState({});
  const [activeIdx, setActiveIdx] = useState(-1);
  const [revealedUpTo, setRevealedUpTo] = useState(-1);
  const itemRefs = useRef([]);

  const handleToggleReveal = (title, idx) => {
    setRevealed((prev) => ({ ...prev, [title]: !prev[title] }));
    setRevealedUpTo((prev) => Math.max(prev, idx));
  };

  useEffect(() => {
    AOS.init({ duration: 850, once: true, offset: 60, easing: "ease-out" });
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateActiveItem = () => {
      const focalLine = window.innerHeight * 0.48;
      let closestIdx = -1;
      let minDistance = Infinity;

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const itemCenter = rect.top + rect.height / 2;
          const distance = Math.abs(itemCenter - focalLine);
          if (distance < minDistance) {
            minDistance = distance;
            closestIdx = idx;
          }
        }
      });

      if (closestIdx !== -1 && minDistance < window.innerHeight * 0.3) {
        setActiveIdx(closestIdx);
        setRevealedUpTo((prev) => Math.max(prev, closestIdx));
      } else {
        setActiveIdx(-1);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveItem();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section id="benefits" className="wp-section">
        <div className="wp-desktop">
          <div className="wp-board">
            {LEFT_BENEFITS.map(({ Icon, title, desc }, i) => {
              const isRevealed = !!revealed[title];
              return (
                <div
                  className={`wp-row wp-row-left ${isRevealed ? "is-revealed" : ""}`}
                  key={title}
                  style={{ gridRow: i + 1 }}
                  onMouseEnter={() => setRevealed((prev) => ({ ...prev, [title]: true }))}
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
              );
            })}

            <div className="wp-chip" data-aos="zoom-in" data-aos-delay={CHIP_DELAY}>
              <div>
                <h2 className="wp-chip-title">Why <span className="wp-chip-highlight">Participate</span></h2>
              </div>
            </div>

            {RIGHT_BENEFITS.map(({ Icon, title, desc }, i) => {
              const isRevealed = !!revealed[title];
              return (
                <div
                  className={`wp-row wp-row-right ${isRevealed ? "is-revealed" : ""}`}
                  key={title}
                  style={{ gridRow: i + 1 }}
                  onMouseEnter={() => setRevealed((prev) => ({ ...prev, [title]: true }))}
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
              );
            })}
          </div>
        </div>

        <div className="wp-mobile">
          <div className="wp-mobile-header">
            <h2 className="wp-mobile-title">Why <span>Participate</span></h2>
            <div className="wp-mobile-divider">
              <span className="wp-mobile-divider-line" />
              <span className="wp-mobile-divider-diamond" />
              <span className="wp-mobile-divider-line" />
            </div>
          </div>

          <div className="wp-mobile-list">
            {ALL_BENEFITS.map(({ Icon, title, desc }, i) => {
              const isRevealed = !!revealed[title] || i <= revealedUpTo;
              const isActive = i === activeIdx;
              return (
                <div
                  ref={(el) => (itemRefs.current[i] = el)}
                  className={`wp-mobile-item${
                    isActive
                      ? " is-scrolled"
                      : i <= revealedUpTo
                      ? " is-past"
                      : ""
                  }${isRevealed ? " is-revealed" : ""}`}
                  key={title}
                  onClick={() => handleToggleReveal(title, i)}
                  onMouseEnter={() => {
                    setRevealed((prev) => ({ ...prev, [title]: true }));
                    setRevealedUpTo((prev) => Math.max(prev, i));
                  }}
                >
                  <div className="wp-mobile-item-icon-wrap">
                    <Icon className="wp-mobile-item-icon" size={18} strokeWidth={1.8} />
                  </div>
                  <div className="wp-mobile-item-body">
                    <h3 className="wp-mobile-item-title">{title}</h3>
                    <div className="wp-mobile-desc-wrapper">
                      <div className="wp-mobile-desc-inner">
                        <p className="wp-mobile-item-desc">{desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}