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
} from "lucide-react";

/* =========================================================
   STYLES
   ========================================================= */
const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&family=Bruno+Ace&display=swap");

  .ed-section {
    background: var(--color-background);
    padding: clamp(4rem, 9vh, 6.5rem) clamp(1.25rem, 6vw, 4.5rem);
    position: relative;
    overflow: hidden;
  }

  /* Subtle cyber background grid */
  .ed-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(12, 230, 68, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(12, 230, 68, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .ed-inner {
    position: relative;
    z-index: 2;
    max-width: 1240px;
    margin: 0 auto;
  }

  /* Section Header */
  .ed-header {
    text-align: center;
    margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
  }

  .ed-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: rgba(12, 230, 68, 0.8);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
  }

  .ed-eyebrow-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 8px 2px rgba(12, 230, 68, 0.7);
  }

  .ed-title {
    font-family: var(--font-mech);
    font-size: clamp(2rem, 5vw, 3.2rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin: 0 0 0.5rem;
    line-height: 1.1;
  }

  .ed-title span {
    color: var(--color-primary);
    text-shadow: 0 0 20px rgba(12, 230, 68, 0.35);
  }

  .ed-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .ed-divider-line {
    height: 1px;
    width: clamp(35px, 7vw, 80px);
    background: linear-gradient(90deg, transparent, rgba(12, 230, 68, 0.6));
  }

  .ed-divider-line:last-child {
    background: linear-gradient(270deg, transparent, rgba(12, 230, 68, 0.6));
  }

  .ed-divider-diamond {
    width: 6px;
    height: 6px;
    background: var(--color-primary);
    transform: rotate(45deg);
    box-shadow: 0 0 8px 2px rgba(12, 230, 68, 0.6);
  }

  /* 4 Stats Banner */
  .ed-banner {
    position: relative;
    background: rgba(12, 230, 68, 0.04);
    border: 1px solid rgba(12, 230, 68, 0.25);
    border-radius: 12px;
    padding: clamp(1.5rem, 3.5vw, 2.25rem) clamp(1rem, 3vw, 2rem);
    margin-bottom: clamp(2rem, 4vw, 3rem);
    overflow: hidden;
    box-shadow: 0 0 25px rgba(12, 230, 68, 0.04);
  }

  .ed-banner::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(12, 230, 68, 0.8) 50%, transparent);
  }

  .ed-banner-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .ed-banner-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
  }

  .ed-banner-item:not(:last-child) {
    border-right: 1px solid rgba(12, 230, 68, 0.12);
  }

  .ed-banner-val {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1;
    text-shadow: 0 0 14px rgba(12, 230, 68, 0.6);
    margin: 0;
  }

  .ed-banner-lbl {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(0.72rem, 1.2vw, 0.85rem);
    color: rgba(245, 247, 246, 0.7);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0;
  }

  @media (max-width: 640px) {
    .ed-banner-grid {
      grid-template-columns: repeat(2, 1fr);
      row-gap: 1.5rem;
    }
    .ed-banner-item:nth-child(2) {
      border-right: none;
    }
    .ed-banner-item:nth-child(3),
    .ed-banner-item:nth-child(4) {
      padding-top: 0.5rem;
      border-top: 1px solid rgba(12, 230, 68, 0.1);
    }
  }

  /* 2 Seats / Pricing Cards */
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
    border: 1px solid rgba(12, 230, 68, 0.28);
    background: rgba(6, 14, 12, 0.85);
    border-radius: 12px;
    padding: clamp(1.5rem, 3vw, 2rem);
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    overflow: hidden;
  }

  .ed-seat-card:hover {
    border-color: rgba(12, 230, 68, 0.65);
    box-shadow: 0 0 30px rgba(12, 230, 68, 0.12);
    transform: translateY(-2px);
  }

  /* Corner bracket accents */
  .ed-seat-card::before,
  .ed-seat-card::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    pointer-events: none;
  }

  .ed-seat-card::before {
    top: -1px;
    left: -1px;
    border-top: 2px solid var(--color-primary);
    border-left: 2px solid var(--color-primary);
  }

  .ed-seat-card::after {
    bottom: -1px;
    right: -1px;
    border-bottom: 2px solid var(--color-primary);
    border-right: 2px solid var(--color-primary);
  }

  .ed-seat-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
  }

  .ed-seat-count {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: var(--color-primary);
    margin: 0 0 0.35rem;
    line-height: 1;
    text-shadow: 0 0 10px rgba(12, 230, 68, 0.4);
  }

  .ed-seat-label {
    font-family: 'Inter', sans-serif;
    font-size: clamp(1rem, 2vw, 1.15rem);
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.75rem;
  }

  .ed-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    border-radius: 9999px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ed-badge-free {
    background: rgba(12, 230, 68, 0.15);
    border: 1px solid rgba(12, 230, 68, 0.45);
    color: var(--color-primary);
    box-shadow: 0 0 10px rgba(12, 230, 68, 0.15);
  }

  .ed-badge-paid {
    background: rgba(255, 170, 51, 0.15);
    border: 1px solid rgba(255, 170, 51, 0.45);
    color: #FFAA33;
    box-shadow: 0 0 10px rgba(255, 170, 51, 0.15);
  }

  .ed-seat-icon-glow {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(12, 230, 68, 0.25);
    background: radial-gradient(circle, rgba(12, 230, 68, 0.15) 0%, rgba(12, 230, 68, 0.02) 70%, transparent 100%);
    color: var(--color-primary);
  }

  .ed-seat-icon-glow.alt {
    border-color: rgba(255, 170, 51, 0.3);
    background: radial-gradient(circle, rgba(255, 170, 51, 0.15) 0%, rgba(255, 170, 51, 0.02) 70%, transparent 100%);
    color: #FFAA33;
  }

  /* Two Column Section: Schedule & Venue */
  .ed-grid-lower {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 5vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 960px) {
    .ed-grid-lower {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  .ed-subheading {
    font-family: var(--font-mech);
    font-size: clamp(1.4rem, 2.5vw, 1.8rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .ed-subheading span {
    color: var(--color-primary);
  }

  /* Schedule Cards */
  .ed-schedule-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ed-day-card {
    border: 1px solid rgba(12, 230, 68, 0.2);
    background: rgba(12, 230, 68, 0.025);
    border-radius: 10px;
    padding: clamp(1.2rem, 2.5vw, 1.5rem);
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    transition: border-color 0.25s, background 0.25s, transform 0.25s;
    position: relative;
    overflow: hidden;
  }

  @media (min-width: 600px) {
    .ed-day-card {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  .ed-day-card:hover {
    border-color: rgba(12, 230, 68, 0.5);
    background: rgba(12, 230, 68, 0.05);
    transform: translateX(4px);
  }

  .ed-day-meta {
    flex-shrink: 0;
  }

  .ed-day-date {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
    color: var(--color-text);
    margin: 0 0 0.25rem;
    letter-spacing: 0.02em;
  }

  .ed-day-badge {
    display: inline-block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ed-day-sessions {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    text-align: left;
  }

  @media (min-width: 600px) {
    .ed-day-sessions {
      text-align: right;
      align-items: flex-end;
    }
  }

  .ed-session-item {
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    color: rgba(245, 247, 246, 0.75);
    margin: 0;
    line-height: 1.4;
  }

  /* Venue Panel */
  .ed-venue-card {
    border: 1px solid rgba(12, 230, 68, 0.25);
    background: rgba(12, 230, 68, 0.03);
    border-radius: 12px;
    padding: clamp(1.5rem, 3.5vw, 2.25rem);
    position: relative;
    overflow: hidden;
  }

  .ed-venue-card::before {
    content: "// VENUE_DETAILS";
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(12, 230, 68, 0.4);
    letter-spacing: 0.16em;
    display: block;
    margin-bottom: 0.9rem;
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
    letter-spacing: 0.05em;
    margin: 0 0 1.75rem;
  }

  .ed-venue-info-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .ed-venue-info-row {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
  }

  .ed-venue-info-icon {
    color: var(--color-primary);
    flex-shrink: 0;
    margin-top: 0.2rem;
    filter: drop-shadow(0 0 4px rgba(12, 230, 68, 0.5));
  }

  .ed-venue-info-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: rgba(12, 230, 68, 0.75);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 0.2rem;
  }

  .ed-venue-info-val {
    font-family: 'Inter', sans-serif;
    font-size: 0.92rem;
    color: rgba(245, 247, 246, 0.82);
    line-height: 1.55;
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
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 6px;
    transition: background 0.25s, box-shadow 0.25s, transform 0.2s;
    box-shadow: 0 0 16px rgba(12, 230, 68, 0.35);
  }

  .ed-maps-btn:hover {
    background: #14ff5a;
    box-shadow: 0 0 26px rgba(12, 230, 68, 0.6), 0 0 50px rgba(12, 230, 68, 0.2);
    transform: translateY(-2px);
  }
`;

/* =========================================================
   DATA (Faithfully matches https://isqip.cecieee.org/)
   ========================================================= */
const STATS = [
  { value: "4", label: "Days of Training" },
  { value: "3", label: "Core Domains" },
  { value: "FREE", label: "For IEEE Members" },
  { value: "120", label: "Total Seats" },
];

const SCHEDULE_DAYS = [
  {
    date: "August 2, 2025",
    day: "Saturday",
    sessions: ["Opening Ceremony", "Domain Training - Day 1"],
  },
  {
    date: "August 3, 2025",
    day: "Sunday",
    sessions: ["Domain Training - Day 2", "Hands-on Projects"],
  },
  {
    date: "August 9, 2025",
    day: "Saturday",
    sessions: ["General Training - Day 1", "Aptitude & Resume Building"],
  },
  {
    date: "August 10, 2025",
    day: "Sunday",
    sessions: ["General Training - Day 2", "Mock Interviews & Closing"],
  },
];

/* =========================================================
   COMPONENT
   ========================================================= */
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

          {/* 4 Stats Top Banner */}
          <div className="ed-banner" data-aos="fade-up">
            <div className="ed-banner-grid">
              {STATS.map((stat, i) => (
                <div key={i} className="ed-banner-item">
                  <p className="ed-banner-val">{stat.value}</p>
                  <p className="ed-banner-lbl">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2 Seats / Eligibility Breakdown Cards */}
          <div className="ed-seats-grid">
            {/* IEEE Members */}
            <div className="ed-seat-card" data-aos="fade-right">
              <div className="ed-seat-content">
                <div>
                  <h3 className="ed-seat-count">60 Seats</h3>
                  <p className="ed-seat-label">IEEE Members</p>
                  <span className="ed-badge ed-badge-free">
                    <Check size={14} strokeWidth={2.5} />
                    FREE
                  </span>
                </div>
                <div className="ed-seat-icon-glow">
                  <UserCheck size={28} strokeWidth={1.75} />
                </div>
              </div>
            </div>

            {/* Non-IEEE Members */}
            <div className="ed-seat-card" data-aos="fade-left">
              <div className="ed-seat-content">
                <div>
                  <h3 className="ed-seat-count">60 Seats</h3>
                  <p className="ed-seat-label">Non-IEEE Members</p>
                  <span className="ed-badge ed-badge-paid">
                    <CreditCard size={14} strokeWidth={2} />
                    PAID
                  </span>
                </div>
                <div className="ed-seat-icon-glow alt">
                  <Users size={28} strokeWidth={1.75} />
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Grid: Event Schedule + Event Venue */}
          <div className="ed-grid-lower">

            {/* Left: Event Schedule */}
            <div data-aos="fade-right">
              <h3 className="ed-subheading">
                Event <span>Schedule</span>
              </h3>
              <div className="ed-schedule-list">
                {SCHEDULE_DAYS.map((item, idx) => (
                  <div className="ed-day-card" key={idx}>
                    <div className="ed-day-meta">
                      <h4 className="ed-day-date">{item.date}</h4>
                      <span className="ed-day-badge">{item.day}</span>
                    </div>
                    <div className="ed-day-sessions">
                      {item.sessions.map((session, sIdx) => (
                        <p className="ed-session-item" key={sIdx}>
                          {session}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Event Venue */}
            <div data-aos="fade-left">
              <h3 className="ed-subheading">
                Event <span>Venue</span>
              </h3>
              <div className="ed-venue-card">
                <h4 className="ed-venue-title">
                  IHRD College Of Applied Science, Perissery
                </h4>
                <p className="ed-venue-sub">IEEE Student Branch CEC</p>

                <div className="ed-venue-info-list">
                  {/* Address */}
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

                  {/* Timing */}
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
                  <MapPin size={16} />
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
