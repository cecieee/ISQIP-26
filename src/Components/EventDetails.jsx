import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  MapPin,
  Clock,
  Radio,
  UserCheck,
  Users,
  Check,
  CreditCard,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  Navigation,
} from "lucide-react";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&family=Bruno+Ace&display=swap");

  .ed-section {
    background: #000000;
    padding: clamp(4rem, 9vh, 7rem) clamp(1.25rem, 5vw, 4rem);
    position: relative;
    overflow: hidden;
  }

  .ed-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(12, 230, 68, 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    z-index: 0;
  }

  .ed-inner {
    position: relative;
    z-index: 2;
    max-width: 1220px;
    margin: 0 auto;
  }

  .ed-header {
    text-align: center;
    margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
    position: relative;
  }

  .ed-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.35rem 0.9rem;
    background: rgba(12, 230, 68, 0.06);
    border: 1px solid rgba(12, 230, 68, 0.25);
    border-radius: 4px;
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.7rem, 1.2vw, 0.78rem);
    color: var(--color-primary);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    box-shadow: 0 0 14px rgba(12, 230, 68, 0.08);
  }

  .ed-eyebrow-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 8px 2px rgba(12, 230, 68, 0.8);
    animation: ed-pulse 1.8s ease-in-out infinite;
  }

  @keyframes ed-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.35; transform: scale(0.8); }
  }

  .ed-title {
    font-family: var(--font-mech);
    font-size: clamp(2.2rem, 5.5vw, 3.4rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin: 0 0 0.5rem;
    line-height: 1.1;
  }

  .ed-title span {
    color: var(--color-primary);
    text-shadow: 0 0 24px rgba(12, 230, 68, 0.45);
  }

  .ed-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    margin-top: 1rem;
  }

  .ed-divider-line {
    height: 1px;
    width: clamp(40px, 8vw, 90px);
    background: linear-gradient(90deg, transparent, rgba(12, 230, 68, 0.65));
  }

  .ed-divider-line:last-child {
    background: linear-gradient(270deg, transparent, rgba(12, 230, 68, 0.65));
  }

  .ed-divider-diamond {
    width: 7px;
    height: 7px;
    background: var(--color-primary);
    transform: rotate(45deg);
    box-shadow: 0 0 10px 2px rgba(12, 230, 68, 0.7);
  }

  .ed-stats-deck {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: clamp(2rem, 4vw, 3rem);
  }

  @media (max-width: 900px) {
    .ed-stats-deck {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .ed-stats-deck {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
  }

  .ed-stat-pod {
    position: relative;
    background: rgba(8, 16, 12, 0.85);
    border: 1px solid rgba(12, 230, 68, 0.22);
    border-radius: 6px;
    padding: 1.25rem 1.1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.75rem;
    transition: all 0.25s ease;
    overflow: hidden;
  }

  .ed-stat-pod:hover {
    border-color: rgba(12, 230, 68, 0.55);
    background: rgba(12, 230, 68, 0.05);
    box-shadow: 0 0 20px rgba(12, 230, 68, 0.12);
    transform: translateY(-2px);
  }

  /* HUD corner notch */
  .ed-stat-pod::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 12px 12px 0;
    border-color: transparent var(--color-primary) transparent transparent;
    opacity: 0.65;
  }

  .ed-stat-pod-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ed-stat-code {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(12, 230, 68, 0.55);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .ed-stat-icon {
    color: var(--color-primary);
    opacity: 0.8;
  }

  .ed-stat-val {
    font-family: 'Bruno Ace', 'Mechsuit', cursive;
    font-size: clamp(1.75rem, 3.5vw, 2.35rem);
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1;
    text-shadow: 0 0 16px rgba(12, 230, 68, 0.55);
    margin: 0.2rem 0;
  }

  .ed-stat-lbl {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.72rem, 1.1vw, 0.82rem);
    color: rgba(245, 247, 246, 0.75);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-seats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(1.25rem, 3vw, 2rem);
    margin-bottom: clamp(3rem, 6vw, 4.5rem);
  }

  @media (max-width: 768px) {
    .ed-seats-grid {
      grid-template-columns: 1fr;
    }
  }

  .ed-seat-card {
    position: relative;
    background: rgba(6, 14, 11, 0.92);
    border: 1px solid rgba(12, 230, 68, 0.28);
    border-radius: 8px;
    padding: clamp(1.4rem, 3vw, 1.85rem);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .ed-seat-card:hover {
    border-color: rgba(12, 230, 68, 0.65);
    box-shadow: 0 0 32px rgba(12, 230, 68, 0.15);
    transform: translateY(-2px);
  }

  .ed-seat-card.alt {
    border-color: rgba(255, 170, 51, 0.28);
  }

  .ed-seat-card.alt:hover {
    border-color: rgba(255, 170, 51, 0.65);
    box-shadow: 0 0 32px rgba(255, 170, 51, 0.15);
  }

  .ed-seat-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.9rem;
    margin-bottom: 1.1rem;
    border-bottom: 1px solid rgba(12, 230, 68, 0.12);
  }

  .ed-seat-card.alt .ed-seat-card-header {
    border-bottom-color: rgba(255, 170, 51, 0.15);
  }

  .ed-seat-protocol-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    color: rgba(12, 230, 68, 0.6);
    text-transform: uppercase;
  }

  .ed-seat-card.alt .ed-seat-protocol-tag {
    color: rgba(255, 170, 51, 0.7);
  }

  .ed-seat-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
  }

  .ed-seat-count {
    font-family: 'Bruno Ace', 'Mechsuit', cursive;
    font-size: clamp(1.6rem, 3.2vw, 2.2rem);
    color: var(--color-primary);
    margin: 0 0 0.3rem;
    line-height: 1;
    text-shadow: 0 0 14px rgba(12, 230, 68, 0.45);
  }

  .ed-seat-card.alt .ed-seat-count {
    color: #FFAA33;
    text-shadow: 0 0 14px rgba(255, 170, 51, 0.45);
  }

  .ed-seat-label {
    font-family: 'Inter', sans-serif;
    font-size: clamp(1rem, 2vw, 1.15rem);
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.85rem;
  }

  .ed-capacity-bar {
    display: flex;
    gap: 4px;
    margin-bottom: 0.9rem;
    max-width: 220px;
  }

  .ed-capacity-segment {
    height: 4px;
    flex: 1;
    background: rgba(12, 230, 68, 0.2);
    border-radius: 1px;
  }

  .ed-capacity-segment.active {
    background: var(--color-primary);
    box-shadow: 0 0 6px rgba(12, 230, 68, 0.8);
  }

  .ed-seat-card.alt .ed-capacity-segment {
    background: rgba(255, 170, 51, 0.2);
  }

  .ed-seat-card.alt .ed-capacity-segment.active {
    background: #FFAA33;
    box-shadow: 0 0 6px rgba(255, 170, 51, 0.8);
  }

  .ed-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.85rem;
    border-radius: 4px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ed-badge-free {
    background: rgba(12, 230, 68, 0.12);
    border: 1px solid rgba(12, 230, 68, 0.5);
    color: var(--color-primary);
    box-shadow: 0 0 12px rgba(12, 230, 68, 0.2);
  }

  .ed-badge-paid {
    background: rgba(255, 170, 51, 0.12);
    border: 1px solid rgba(255, 170, 51, 0.5);
    color: #FFAA33;
    box-shadow: 0 0 12px rgba(255, 170, 51, 0.2);
  }

  .ed-seat-icon-box {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(12, 230, 68, 0.35);
    background: rgba(12, 230, 68, 0.06);
    color: var(--color-primary);
    box-shadow: inset 0 0 16px rgba(12, 230, 68, 0.12);
  }

  .ed-seat-card.alt .ed-seat-icon-box {
    border-color: rgba(255, 170, 51, 0.35);
    background: rgba(255, 170, 51, 0.06);
    color: #FFAA33;
    box-shadow: inset 0 0 16px rgba(255, 170, 51, 0.12);
  }

  .ed-grid-lower {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: clamp(2rem, 4.5vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 960px) {
    .ed-grid-lower {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  .ed-subheading-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.4rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(12, 230, 68, 0.18);
  }

  .ed-subheading {
    font-family: var(--font-mech);
    font-size: clamp(1.3rem, 2.2vw, 1.7rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ed-subheading span {
    color: var(--color-primary);
    text-shadow: 0 0 12px rgba(12, 230, 68, 0.4);
  }

  .ed-subheading-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.66rem;
    color: rgba(12, 230, 68, 0.5);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .ed-schedule-list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    padding-left: 1.5rem;
  }

  .ed-schedule-list::before {
    content: "";
    position: absolute;
    top: 14px;
    bottom: 14px;
    left: 4px;
    width: 2px;
    background: linear-gradient(
      to bottom,
      rgba(12, 230, 68, 0.6),
      rgba(12, 230, 68, 0.25) 50%,
      rgba(12, 230, 68, 0.6)
    );
    box-shadow: 0 0 6px rgba(12, 230, 68, 0.3);
  }

  .ed-day-node {
    position: relative;
    border: 1px solid rgba(12, 230, 68, 0.22);
    background: rgba(6, 14, 10, 0.75);
    border-radius: 6px;
    padding: clamp(1.1rem, 2vw, 1.35rem) clamp(1.2rem, 2.5vw, 1.5rem);
    transition: all 0.25s ease;
  }

  .ed-day-node:hover {
    border-color: rgba(12, 230, 68, 0.6);
    background: rgba(12, 230, 68, 0.05);
    transform: translateX(4px);
    box-shadow: 0 0 20px rgba(12, 230, 68, 0.1);
  }

  .ed-day-pin {
    position: absolute;
    left: -1.5rem;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border: 2px solid var(--color-primary);
    background: var(--color-background);
    box-shadow: 0 0 8px 1px rgba(12, 230, 68, 0.6);
    border-radius: 1px;
    transition: all 0.25s;
  }

  .ed-day-node:hover .ed-day-pin {
    background: var(--color-primary);
    box-shadow: 0 0 12px 3px rgba(12, 230, 68, 0.9);
  }

  .ed-day-inner {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .ed-day-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  .ed-day-header-meta {
    flex-shrink: 0;
  }

  .ed-day-date {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
    color: var(--color-text);
    margin: 0 0 0.3rem;
    letter-spacing: 0.02em;
  }

  .ed-day-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.55rem;
    background: rgba(12, 230, 68, 0.08);
    border: 1px solid rgba(12, 230, 68, 0.3);
    border-radius: 3px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .ed-day-sessions {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  @media (min-width: 640px) {
    .ed-day-sessions {
      text-align: right;
      align-items: flex-end;
    }
  }

  .ed-session-item {
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    color: rgba(245, 247, 246, 0.78);
    margin: 0;
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  @media (min-width: 640px) {
    .ed-session-item {
      flex-direction: row-reverse;
    }
  }

  .ed-session-bullet {
    color: var(--color-primary);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    opacity: 0.75;
  }

  .ed-venue-card {
    position: relative;
    border: 1px solid rgba(12, 230, 68, 0.3);
    background: rgba(6, 14, 11, 0.9);
    border-radius: 8px;
    padding: clamp(1.4rem, 3vw, 2rem);
    overflow: hidden;
    box-shadow: 0 0 25px rgba(12, 230, 68, 0.05);
  }

  .ed-venue-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid rgba(12, 230, 68, 0.15);
  }

  .ed-venue-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(12, 230, 68, 0.6);
    letter-spacing: 0.16em;
  }

  .ed-venue-coord {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(245, 247, 246, 0.4);
    letter-spacing: 0.08em;
  }

  .ed-venue-title {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1.1rem, 2vw, 1.35rem);
    color: var(--color-text);
    margin: 0 0 0.35rem;
    line-height: 1.35;
    letter-spacing: 0.02em;
  }

  .ed-venue-sub {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.82rem;
    color: var(--color-primary);
    letter-spacing: 0.06em;
    margin: 0 0 1.6rem;
  }

  .ed-venue-info-list {
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
    margin-bottom: 1.85rem;
  }

  .ed-venue-info-row {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    background: rgba(12, 230, 68, 0.03);
    border: 1px solid rgba(12, 230, 68, 0.12);
    border-radius: 4px;
    padding: 0.85rem 1rem;
    transition: border-color 0.2s;
  }

  .ed-venue-info-row:hover {
    border-color: rgba(12, 230, 68, 0.35);
  }

  .ed-venue-info-icon {
    color: var(--color-primary);
    flex-shrink: 0;
    margin-top: 0.15rem;
    filter: drop-shadow(0 0 6px rgba(12, 230, 68, 0.6));
  }

  .ed-venue-info-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: rgba(12, 230, 68, 0.75);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0 0 0.25rem;
  }

  .ed-venue-info-val {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: rgba(245, 247, 246, 0.88);
    line-height: 1.5;
    margin: 0;
  }

  .ed-maps-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.95rem 1.5rem;
    background: var(--color-primary);
    color: #071110;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.25s ease;
    box-shadow: 0 0 20px rgba(12, 230, 68, 0.35);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }

  .ed-maps-btn:hover {
    background: #19ff62;
    box-shadow: 0 0 30px rgba(12, 230, 68, 0.65), 0 0 60px rgba(12, 230, 68, 0.25);
    transform: translateY(-2px);
  }
`;

const STATS = [
  { value: "4", label: "Days of Training", icon: Calendar, code: "PARAM // 01" },
  { value: "3", label: "Core Domains", icon: Layers, code: "PARAM // 02" },
  { value: "FREE", label: "For IEEE Members", icon: Sparkles, code: "PARAM // 03" },
  { value: "120", label: "Total Seats", icon: Users, code: "PARAM // 04" },
];

const SCHEDULE_DAYS = [
  {
    date: "August 2, 2026",
    day: "Saturday",
    sessions: ["Opening Ceremony", "Domain Training - Day 1"],
  },
  {
    date: "August 3, 2026",
    day: "Sunday",
    sessions: ["Domain Training - Day 2", "Hands-on Projects"],
  },
  {
    date: "August 9, 2026",
    day: "Saturday",
    sessions: ["General Training - Day 1", "Aptitude & Resume Building"],
  },
  {
    date: "August 10, 2026",
    day: "Sunday",
    sessions: ["General Training - Day 2", "Mock Interviews & Closing"],
  },
];

export default function EventDetails() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 60, easing: "ease-out" });
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section id="event-details" className="ed-section">
        <div className="ed-inner">

          {/* Section Header */}
          <div className="ed-header" data-aos="fade-down">
            <div className="ed-eyebrow">
              <span className="ed-eyebrow-dot" />
              Schedule &amp; Location Data
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

          <div className="ed-stats-deck" data-aos="fade-up">
            {STATS.map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <div key={i} className="ed-stat-pod">
                  <div className="ed-stat-pod-top">
                    <span className="ed-stat-code">{stat.code}</span>
                    <IconComponent className="ed-stat-icon" size={16} />
                  </div>
                  <div>
                    <div className="ed-stat-val">{stat.value}</div>
                    <p className="ed-stat-lbl">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ed-seats-grid">
            {/* IEEE Members */}
            <div className="ed-seat-card" data-aos="fade-right">
              <div className="ed-seat-card-header">
                <span className="ed-seat-protocol-tag">// PROTOCOL: IEEE_MEMBER</span>
                <span className="ed-badge ed-badge-free">
                  <Check size={13} strokeWidth={2.5} />
                  FREE
                </span>
              </div>
              <div className="ed-seat-body">
                <div>
                  <h3 className="ed-seat-count">60 Seats</h3>
                  <p className="ed-seat-label">IEEE Members</p>
                  <div className="ed-capacity-bar" title="50% Total Allotment">
                    <span className="ed-capacity-segment active" />
                    <span className="ed-capacity-segment active" />
                    <span className="ed-capacity-segment active" />
                    <span className="ed-capacity-segment active" />
                    <span className="ed-capacity-segment active" />
                  </div>
                </div>
                <div className="ed-seat-icon-box">
                  <UserCheck size={30} strokeWidth={1.75} />
                </div>
              </div>
            </div>
            <div className="ed-seat-card alt" data-aos="fade-left">
              <div className="ed-seat-card-header">
                <span className="ed-seat-protocol-tag">// PROTOCOL: NON_IEEE_MEMBER</span>
                <span className="ed-badge ed-badge-paid">
                  <CreditCard size={13} strokeWidth={2} />
                  PAID
                </span>
              </div>
              <div className="ed-seat-body">
                <div>
                  <h3 className="ed-seat-count">60 Seats</h3>
                  <p className="ed-seat-label">Non-IEEE Members</p>
                  <div className="ed-capacity-bar" title="50% Total Allotment">
                    <span className="ed-capacity-segment active" />
                    <span className="ed-capacity-segment active" />
                    <span className="ed-capacity-segment active" />
                    <span className="ed-capacity-segment active" />
                    <span className="ed-capacity-segment active" />
                  </div>
                </div>
                <div className="ed-seat-icon-box">
                  <Users size={30} strokeWidth={1.75} />
                </div>
              </div>
            </div>
          </div>

          <div className="ed-grid-lower">

            {/* Left: Event Schedule */}
            <div data-aos="fade-right">
              <div className="ed-subheading-wrap">
                <h3 className="ed-subheading">
                  Event <span>Schedule</span>
                </h3>
                <span className="ed-subheading-tag">// 4_DAY_TIMELINE</span>
              </div>
              <div className="ed-schedule-list">
                {SCHEDULE_DAYS.map((item, idx) => (
                  <div className="ed-day-node" key={idx}>
                    <span className="ed-day-pin" />
                    <div className="ed-day-inner">
                      <div className="ed-day-header-meta">
                        <h4 className="ed-day-date">{item.date}</h4>
                        <span className="ed-day-badge">{item.day}</span>
                      </div>
                      <div className="ed-day-sessions">
                        {item.sessions.map((session, sIdx) => (
                          <p className="ed-session-item" key={sIdx}>
                            <span className="ed-session-bullet">&gt;</span>
                            {session}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-left">
              <div className="ed-subheading-wrap">
                <h3 className="ed-subheading">
                  Event <span>Venue</span>
                </h3>
                <span className="ed-subheading-tag">// FACILITY_NODE</span>
              </div>

              <div className="ed-venue-card">
                <div className="ed-venue-card-top">
                  <span className="ed-venue-tag">// BASE_LOCATION</span>
                  <span className="ed-venue-coord">09°19&apos;N 76°37&apos;E</span>
                </div>

                <h4 className="ed-venue-title">
                  IHRD College Of Applied Science, Perissery
                </h4>
                <p className="ed-venue-sub">IEEE Student Branch CEC</p>

                <div className="ed-venue-info-list">
                  
                  <div className="ed-venue-info-row">
                    <MapPin className="ed-venue-info-icon" size={18} />
                    <div>
                      <p className="ed-venue-info-label">Address</p>
                      <p className="ed-venue-info-val">
                        College of Applied Science Perissery,<br />
                        Chengannur, Kerala 689126
                      </p>
                    </div>
                  </div>

                  <div className="ed-venue-info-row">
                    <Clock className="ed-venue-info-icon" size={18} />
                    <div>
                      <p className="ed-venue-info-label">Timing</p>
                      <p className="ed-venue-info-val">9:00 AM - 5:00 PM</p>
                    </div>
                  </div>

                  {/* Mode */}
                  <div className="ed-venue-info-row">
                    <Radio className="ed-venue-info-icon" size={18} />
                    <div>
                      <p className="ed-venue-info-label">Mode</p>
                      <p className="ed-venue-info-val">Offline - On Campus</p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/cU61dU4RdUMPokNx6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-maps-btn"
                >
                  <Navigation size={16} />
                  View on Maps
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
