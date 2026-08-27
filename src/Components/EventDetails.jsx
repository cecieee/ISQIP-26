import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  MapPin,
  Calendar,
  Clock,
  Radio,
  CreditCard,
  Sparkles,
  ExternalLink,
  Train,
} from "lucide-react";

/* =========================================================
   STYLES
   ========================================================= */
const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&family=Bruno+Ace&display=swap");

  /* section wrapper */
  .ed-section {
    background: var(--color-background);
    padding: clamp(4rem, 9vh, 6.5rem) clamp(1.25rem, 6vw, 4.5rem);
    position: relative;
    overflow: hidden;
  }

  /* subtle grid overlay */
  .ed-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(12,230,68,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(12,230,68,0.035) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
    z-index: 0;
  }

  .ed-section::after {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 180px; height: 180px;
    border-top: 1px solid rgba(12,230,68,0.22);
    border-left: 1px solid rgba(12,230,68,0.22);
    pointer-events: none;
    z-index: 1;
  }

  .ed-inner {
    position: relative;
    z-index: 2;
    max-width: 1240px;
    margin: 0 auto;
  }

  /* header */
  .ed-header {
    text-align: center;
    margin-bottom: clamp(3rem, 6vw, 4.5rem);
  }

  .ed-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(12,230,68,0.7);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .ed-eyebrow-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 6px 2px rgba(12,230,68,0.7);
    animation: ed-blink 1.6s ease-in-out infinite;
  }

  @keyframes ed-blink { 50% { opacity: 0.2; } }
  @media (prefers-reduced-motion: reduce) { .ed-eyebrow-dot { animation: none; } }

  .ed-title {
    font-family: var(--font-mech);
    font-size: clamp(2rem, 5.5vw, 3.4rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 0 0 0.6rem;
    line-height: 1.05;
  }

  .ed-title span { color: var(--color-primary); }

  .ed-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.2rem;
  }

  .ed-divider-line {
    height: 1px;
    width: clamp(40px, 8vw, 90px);
    background: linear-gradient(90deg, transparent, rgba(12,230,68,0.5));
  }

  .ed-divider-line:last-child {
    background: linear-gradient(270deg, transparent, rgba(12,230,68,0.5));
  }

  .ed-divider-diamond {
    width: 6px; height: 6px;
    background: var(--color-primary);
    transform: rotate(45deg);
    box-shadow: 0 0 8px 2px rgba(12,230,68,0.5);
  }

  /* =========================================================
     3-D FLIP CARDS GRID (FIXED / PRESERVED)
     ========================================================= */
  .ed-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: clamp(1rem, 2.5vw, 1.4rem);
    margin-bottom: clamp(4rem, 8vw, 6rem);
  }

  @media (min-width: 900px) {
    .ed-cards-grid {
      grid-template-columns: repeat(4, 1fr);
    }
    .ed-card-item:nth-child(5) { grid-column: 2 / 3; }
    .ed-card-item:nth-child(6) { grid-column: 3 / 4; }
  }

  .ed-card-item {
    height: 100%;
    min-height: 220px;
  }

  .ed-card-wrap {
    perspective: 1000px;
    cursor: pointer;
    width: 100%;
    height: 100%;
    min-height: 220px;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    pointer-events: auto;
  }

  .ed-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 220px;
    transform-style: preserve-3d;
    transform-origin: center center;
    transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: none;
  }

  @media (hover: hover) {
    .ed-card-wrap:hover .ed-card-inner {
      transform: rotateY(180deg);
    }
    .ed-card-wrap:hover .ed-card-front::before,
    .ed-card-wrap:hover .ed-card-front::after {
      width: 22px;
      height: 22px;
    }
  }

  .ed-card-wrap.flipped .ed-card-inner {
    transform: rotateY(180deg);
  }

  .ed-card-front,
  .ed-card-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background: rgba(6, 14, 12, 0.96);
    border: 1px solid rgba(12, 230, 68, 0.28);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    padding: 2rem 1.5rem;
    text-align: center;
    overflow: hidden;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .ed-card-front::before,
  .ed-card-front::after,
  .ed-card-back::before,
  .ed-card-back::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    pointer-events: none;
    transition: width 0.3s, height 0.3s, border-color 0.3s;
    z-index: 2;
  }

  .ed-card-front::before,
  .ed-card-back::before {
    top: -1px; left: -1px;
    border-top: 2px solid rgba(12, 230, 68, 0.7);
    border-left: 2px solid rgba(12, 230, 68, 0.7);
  }

  .ed-card-front::after,
  .ed-card-back::after {
    bottom: -1px; right: -1px;
    border-bottom: 2px solid rgba(12, 230, 68, 0.7);
    border-right: 2px solid rgba(12, 230, 68, 0.7);
  }

  @media (hover: hover) {
    .ed-card-wrap:hover .ed-card-front,
    .ed-card-wrap:hover .ed-card-back {
      border-color: rgba(12, 230, 68, 0.55);
      box-shadow: 0 0 25px rgba(12, 230, 68, 0.15);
    }
    .ed-card-wrap:hover .ed-card-front::before,
    .ed-card-wrap:hover .ed-card-front::after,
    .ed-card-wrap:hover .ed-card-back::before,
    .ed-card-wrap:hover .ed-card-back::after {
      width: 22px;
      height: 22px;
      border-color: var(--color-primary);
    }
  }

  .ed-card-icon-glow {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    flex-shrink: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(12, 230, 68, 0.15) 0%, rgba(12, 230, 68, 0.03) 70%, transparent 100%);
    border: 1px solid rgba(12, 230, 68, 0.25);
    box-shadow: 0 0 15px rgba(12, 230, 68, 0.1);
  }

  .ed-card-icon {
    color: var(--color-primary);
    filter: drop-shadow(0 0 6px rgba(12, 230, 68, 0.65));
  }

  .ed-card-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(12, 230, 68, 0.7);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-card-value {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.85rem, 1.4vw, 0.98rem);
    color: var(--color-text);
    line-height: 1.45;
    margin: 0;
    letter-spacing: 0.02em;
  }

  .ed-card-back {
    transform: rotateY(180deg);
    border-color: rgba(12, 230, 68, 0.5);
    gap: 0.7rem;
    padding: 1.75rem 1.5rem;
  }

  .ed-card-back-bloom {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 30%, rgba(12, 230, 68, 0.08) 0%, transparent 65%);
    pointer-events: none;
  }

  .ed-card-back-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(12, 230, 68, 0.6);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  .ed-card-back-title {
    font-family: var(--font-mech);
    font-size: 1.1rem;
    color: var(--color-primary);
    letter-spacing: 0.03em;
    margin: 0;
    line-height: 1.25;
    text-shadow: 0 0 14px rgba(12, 230, 68, 0.35);
    position: relative;
    z-index: 1;
    text-transform: uppercase;
  }

  .ed-card-back-divider {
    width: 36px;
    height: 1px;
    background: rgba(12, 230, 68, 0.35);
    position: relative;
    z-index: 1;
  }

  .ed-card-back-body {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    color: rgba(245, 247, 246, 0.72);
    line-height: 1.65;
    margin: 0;
    max-width: 24ch;
    position: relative;
    z-index: 1;
  }

  /* =========================================================
     LOWER SECTION: SCHEDULE & VENUE (MINIMAL CYBER HUD)
     ========================================================= */
  .ed-lower-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: clamp(2rem, 4vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 1024px) {
    .ed-lower-grid {
      grid-template-columns: 1fr;
      gap: 2.75rem;
    }
  }

  /* Subheadings */
  .ed-subheading-wrap {
    margin-bottom: clamp(1.2rem, 2.5vw, 1.8rem);
  }

  .ed-subheading-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(12, 230, 68, 0.7);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.35rem;
  }

  .ed-subheading {
    font-family: var(--font-mech);
    font-size: clamp(1.4rem, 3vw, 1.85rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin: 0;
    line-height: 1.15;
  }

  .ed-subheading span { color: var(--color-primary); }

  /* ── SLEEK TIMELINE MATRIX ────────────────────────── */
  .ed-schedule-stack {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .ed-sched-card {
    background: rgba(6, 14, 12, 0.85);
    border: 1px solid rgba(12, 230, 68, 0.2);
    border-radius: 4px;
    padding: clamp(1rem, 2vw, 1.35rem);
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
  }

  .ed-sched-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 3px;
    background: var(--color-primary);
    opacity: 0.35;
    transition: opacity 0.3s ease, width 0.3s ease, box-shadow 0.3s ease;
  }

  .ed-sched-card:hover {
    border-color: rgba(12, 230, 68, 0.5);
    background: rgba(12, 230, 68, 0.03);
    transform: translateX(4px);
    box-shadow: 0 4px 24px rgba(12, 230, 68, 0.09);
  }

  .ed-sched-card:hover::before {
    opacity: 1;
    width: 4px;
    box-shadow: 0 0 10px var(--color-primary);
  }

  /* Date / Index Column */
  .ed-sched-lead {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 80px;
    flex-shrink: 0;
    border-right: 1px dashed rgba(12, 230, 68, 0.18);
    padding-right: 1rem;
  }

  .ed-sched-daynum {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: var(--color-primary);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 0.2rem;
  }

  .ed-sched-date {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.95rem, 1.4vw, 1.05rem);
    color: var(--color-text);
    line-height: 1.2;
    margin: 0;
    letter-spacing: 0.02em;
  }

  .ed-sched-weekday {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(245, 247, 246, 0.55);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 0.2rem;
  }

  /* Content Column */
  .ed-sched-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ed-sched-title {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.88rem, 1.3vw, 0.98rem);
    color: var(--color-text);
    margin: 0;
    letter-spacing: 0.02em;
    line-height: 1.3;
  }

  .ed-sched-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .ed-sched-tag {
    font-family: 'Inter', sans-serif;
    font-size: 0.76rem;
    color: rgba(245, 247, 246, 0.78);
    background: rgba(12, 230, 68, 0.05);
    border: 1px solid rgba(12, 230, 68, 0.18);
    border-radius: 3px;
    padding: 0.15rem 0.55rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .ed-sched-tag-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-primary);
  }

  /* ── VENUE PANEL ──────────────────────────────────── */
  .ed-venue-panel {
    background: rgba(6, 14, 12, 0.85);
    border: 1px solid rgba(12, 230, 68, 0.22);
    border-radius: 4px;
    padding: clamp(1.25rem, 2.5vw, 1.6rem);
    position: relative;
    overflow: hidden;
  }

  .ed-venue-panel::before {
    content: "";
    position: absolute;
    top: -1px; left: -1px;
    width: 14px; height: 14px;
    border-top: 2px solid var(--color-primary);
    border-left: 2px solid var(--color-primary);
    pointer-events: none;
  }

  .ed-venue-panel::after {
    content: "";
    position: absolute;
    bottom: -1px; right: -1px;
    width: 14px; height: 14px;
    border-bottom: 2px solid var(--color-primary);
    border-right: 2px solid var(--color-primary);
    pointer-events: none;
  }

  .ed-venue-header {
    margin-bottom: 1.15rem;
  }

  .ed-venue-title {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1.05rem, 2vw, 1.25rem);
    color: var(--color-text);
    text-transform: uppercase;
    margin: 0 0 0.3rem;
    line-height: 1.3;
    letter-spacing: 0.02em;
  }

  .ed-venue-title span { color: var(--color-primary); }

  .ed-venue-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: rgba(12, 230, 68, 0.85);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-map-frame {
    position: relative;
    height: clamp(160px, 18vw, 190px);
    border: 1px solid rgba(12, 230, 68, 0.25);
    border-radius: 3px;
    overflow: hidden;
    background: #071110;
    margin-bottom: 1.2rem;
  }

  .ed-map-frame iframe {
    width: 100%;
    height: 100%;
    border: none;
    filter: invert(92%) hue-rotate(180deg) contrast(1.18) brightness(0.85);
    transition: filter 0.3s ease;
  }

  .ed-map-frame:hover iframe {
    filter: invert(92%) hue-rotate(180deg) contrast(1.3) brightness(0.95);
  }

  .ed-venue-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    border-top: 1px solid rgba(12, 230, 68, 0.12);
    padding-top: 1rem;
  }

  .ed-venue-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .ed-venue-icon {
    color: var(--color-primary);
    margin-top: 2px;
    flex-shrink: 0;
  }

  .ed-venue-info {
    flex: 1;
  }

  .ed-venue-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.64rem;
    color: rgba(12, 230, 68, 0.7);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 0.15rem;
  }

  .ed-venue-value {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    color: rgba(245, 247, 246, 0.82);
    line-height: 1.45;
    margin: 0;
  }

  .ed-map-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-primary);
    background: rgba(12, 230, 68, 0.06);
    border: 1px solid rgba(12, 230, 68, 0.32);
    padding: 0.75rem 1.2rem;
    text-decoration: none;
    transition: all 0.25s ease;
    border-radius: 3px;
  }

  .ed-map-btn:hover {
    background: var(--color-primary);
    color: var(--color-background);
    box-shadow: 0 0 20px rgba(12, 230, 68, 0.4);
  }
`;

/* =========================================================
   DATA DEFINITIONS
   ========================================================= */

// 6 3D Flip Cards (Fixed & Untouched)
const CARDS = [
  {
    Icon: Calendar,
    label: "Date",
    value: "Sep 15 – Oct 10, 2026",
    backTitle: "Duration",
    backBody: "4-week intensive programme with weekend & weekday sessions.",
  },
  {
    Icon: MapPin,
    label: "Venue",
    value: "CEC Main Campus, Chengannur",
    backTitle: "Campus",
    backBody: "College of Engineering Chengannur — fully on-campus, hands-on experience.",
  },
  {
    Icon: Radio,
    label: "Mode",
    value: "Offline",
    backTitle: "On-Campus",
    backBody: "100% offline, hands-on intensive workshops conducted on CEC campus.",
  },
  {
    Icon: Clock,
    label: "Session Length",
    value: "3–4 Hrs / Session",
    backTitle: "Schedule",
    backBody: "Weekday evenings + Saturday mornings. No clash with academics.",
  },
  {
    Icon: Sparkles,
    label: "IEEE Members",
    value: "Free • 60 Seats",
    backTitle: "Sponsored",
    backBody: "60 reserved seats completely free for IEEE members, sponsored by IEEE SB CEC.",
  },
  {
    Icon: CreditCard,
    label: "Non-IEEE Members",
    value: "Paid • 60 Seats",
    backTitle: "Registration",
    backBody: "60 seats available for non-IEEE students with paid registration access.",
  },
];

// ISQIP '26 Curriculum & Training Milestones (4-Day Architecture)
const SCHEDULE = [
  {
    dayNum: "Day 01",
    date: "Sep 19",
    weekday: "Saturday",
    title: "Domain Training — Phase I",
    sessions: [
      "Inauguration Ceremony",
      "Domain Tracks (CS / EC / EEE)",
      "Core Foundation Workshops",
    ],
  },
  {
    dayNum: "Day 02",
    date: "Sep 20",
    weekday: "Sunday",
    title: "Domain Training — Phase II",
    sessions: [
      "Hands-on Project Development",
      "Mentored Lab Build Sprint",
      "Hardware / Software Testing",
    ],
  },
  {
    dayNum: "Day 03",
    date: "Sep 26",
    weekday: "Saturday",
    title: "General Training — Career & Aptitude",
    sessions: [
      "Resume Engineering & Review",
      "Aptitude & Logical Reasoning",
      "Group Discussion Simulations",
    ],
  },
  {
    dayNum: "Day 04",
    date: "Sep 27",
    weekday: "Sunday",
    title: "Mock Interviews & Valedictory",
    sessions: [
      "1-on-1 Mock Interviews (HR & Tech)",
      "Capstone Project Demonstrations",
      "Valedictory & Certificate Distribution",
    ],
  },
];

/* =========================================================
   FLIP CARD (FIXED & UNTOUCHED)
   ========================================================= */
function FlipCard({ Icon, label, value, backTitle, backBody, delay }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="ed-card-item" data-aos="fade-up" data-aos-delay={delay}>
      <div
        className={`ed-card-wrap${flipped ? " flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="ed-card-inner">

          {/* FRONT */}
          <div className="ed-card-front">
            <div className="ed-card-icon-glow">
              <Icon className="ed-card-icon" size={24} strokeWidth={1.5} />
            </div>
            <p className="ed-card-label">{label}</p>
            <p className="ed-card-value">{value}</p>
          </div>

          {/* BACK */}
          <div className="ed-card-back">
            <span className="ed-card-back-bloom" aria-hidden="true" />
            <p className="ed-card-back-label">{label}</p>
            <p className="ed-card-back-title">{backTitle}</p>
            <div className="ed-card-back-divider" />
            <p className="ed-card-back-body">{backBody}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function EventDetails() {
  useEffect(() => {
    AOS.init({ duration: 850, once: true, offset: 50, easing: "ease-out" });
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section id="event-details" className="ed-section">
        <div className="ed-inner">

          {/* Header */}
          <div className="ed-header" data-aos="fade-down">
            <div className="ed-eyebrow">
              <span className="ed-eyebrow-dot" />
              ISQIP 26 // IEEE SB CEC
            </div>
            <h2 className="ed-title">
              Event <span>Details</span>
            </h2>
            <div className="ed-divider">
              <span className="ed-divider-line" />
              <span className="ed-divider-diamond" />
              <span className="ed-divider-line" />
            </div>
          </div>

          {/* 3D Flip Cards (Fixed & Preserved) */}
          <div className="ed-cards-grid">
            {CARDS.map((card, i) => (
              <FlipCard key={card.label} {...card} delay={i * 70} />
            ))}
          </div>

          {/* Lower Section: Event Schedule & Event Venue */}
          <div className="ed-lower-grid">

            {/* Left Column: Event Schedule */}
            <div data-aos="fade-right" data-aos-delay="80">
              <div className="ed-subheading-wrap">
                <span className="ed-subheading-tag">// MILESTONE_TIMELINE</span>
                <h3 className="ed-subheading">
                  Programme <span>Schedule</span>
                </h3>
              </div>

              <div className="ed-schedule-stack">
                {SCHEDULE.map((item, index) => (
                  <div
                    className="ed-sched-card"
                    key={item.dayNum}
                    data-aos="fade-up"
                    data-aos-delay={100 + index * 60}
                  >
                    {/* Date / Day Lead */}
                    <div className="ed-sched-lead">
                      <span className="ed-sched-daynum">{item.dayNum}</span>
                      <p className="ed-sched-date">{item.date}</p>
                      <span className="ed-sched-weekday">{item.weekday}</span>
                    </div>

                    {/* Content & Modules */}
                    <div className="ed-sched-main">
                      <h4 className="ed-sched-title">{item.title}</h4>
                      <div className="ed-sched-tags">
                        {item.sessions.map((session, sIdx) => (
                          <span className="ed-sched-tag" key={sIdx}>
                            <span className="ed-sched-tag-dot" />
                            {session}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Event Venue */}
            <div data-aos="fade-left" data-aos-delay="140">
              <div className="ed-subheading-wrap">
                <span className="ed-subheading-tag">// BASE_LOCATION</span>
                <h3 className="ed-subheading">
                  Event <span>Venue</span>
                </h3>
              </div>

              <div className="ed-venue-panel">
                <div className="ed-venue-header">
                  <h4 className="ed-venue-title">
                    College of Engineering <span>Chengannur</span>
                  </h4>
                  <p className="ed-venue-sub">IEEE Student Branch CEC // Alappuzha, Kerala</p>
                </div>

                {/* Cyberpunk Map Frame */}
                <div className="ed-map-frame">
                  <iframe
                    src="https://maps.google.com/maps?q=College%20of%20Engineering%20Chengannur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    title="College of Engineering Chengannur Google Map"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>

                {/* Venue Details Breakdown */}
                <div className="ed-venue-details">
                  <div className="ed-venue-row">
                    <MapPin className="ed-venue-icon" size={16} />
                    <div className="ed-venue-info">
                      <p className="ed-venue-label">Campus Address</p>
                      <p className="ed-venue-value">
                        College of Engineering Chengannur, SH1, Chengannur, Kerala 689121
                      </p>
                    </div>
                  </div>

                  <div className="ed-venue-row">
                    <Train className="ed-venue-icon" size={16} />
                    <div className="ed-venue-info">
                      <p className="ed-venue-label">Transit Connectivity</p>
                      <p className="ed-venue-value">
                        1.5 km from Chengannur Railway Station (CNGR) &amp; KSRTC Bus Station
                      </p>
                    </div>
                  </div>

                  <div className="ed-venue-row">
                    <Clock className="ed-venue-icon" size={16} />
                    <div className="ed-venue-info">
                      <p className="ed-venue-label">Mode &amp; Timings</p>
                      <p className="ed-venue-value">
                        100% Offline (On-Campus) &bull; 09:00 AM – 05:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>

                {/* View on Maps Link Button */}
                <a
                  href="https://maps.google.com/?q=College+of+Engineering+Chengannur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-map-btn"
                >
                  <MapPin size={14} />
                  Open in Google Maps
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
