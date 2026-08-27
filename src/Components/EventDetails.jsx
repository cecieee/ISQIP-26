import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Calendar,
  Clock,
  Radio,
  CreditCard,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

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

  .ed-lower-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
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

  /* ── SCHEDULE STACK ─────────────────────────────────── */
  .ed-stack-container {
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    user-select: none;
  }

  /* Collapsed stack wrapper */
  .ed-stack-collapsed {
    position: relative;
    padding-bottom: 28px;
  }

  /* Depth layers behind the top card */
  .ed-stack-depth {
    position: absolute;
    left: 0;
    right: 0;
    height: 4px;
    border: 1px solid rgba(12, 230, 68, 0.12);
    border-top: none;
    border-radius: 0 0 4px 4px;
    background: rgba(6, 14, 12, 0.6);
    pointer-events: none;
  }

  /* The hero top card */
  .ed-stack-hero {
    position: relative;
    background: rgba(6, 14, 12, 0.96);
    border: 1px solid rgba(12, 230, 68, 0.25);
    border-radius: 4px;
    overflow: hidden;
    z-index: 3;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .ed-stack-container:hover .ed-stack-hero {
    border-color: rgba(12, 230, 68, 0.45);
    box-shadow: 0 0 20px rgba(12, 230, 68, 0.08);
  }

  /* Green accent line at the top of hero card */
  .ed-stack-hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--color-primary), rgba(12, 230, 68, 0.3));
  }

  .ed-stack-hero-inner {
    padding: 1.15rem 1.25rem 1rem;
  }

  .ed-stack-hero-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.6rem;
  }

  .ed-stack-hero-date {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.88rem, 1.3vw, 1rem);
    color: var(--color-text);
    margin: 0;
    letter-spacing: 0.02em;
    line-height: 1.3;
  }

  .ed-stack-hero-day {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.66rem;
    color: var(--color-primary);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
    flex-shrink: 0;
  }

  .ed-stack-hero-sessions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1rem;
    padding-top: 0.55rem;
    border-top: 1px solid rgba(245, 247, 246, 0.06);
  }

  .ed-stack-hero-session {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: rgba(245, 247, 246, 0.7);
    line-height: 1.35;
    margin: 0;
  }

  .ed-stack-hero-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--color-primary);
    opacity: 0.6;
    flex-shrink: 0;
  }

  /* Badge showing "+N more" */
  .ed-stack-hero-badge {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.7rem;
    margin-top: 0.6rem;
    border-top: 1px solid rgba(245, 247, 246, 0.06);
  }

  .ed-stack-hero-more {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.66rem;
    color: rgba(12, 230, 68, 0.6);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-stack-cta-label {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.66rem;
    color: rgba(12, 230, 68, 0.6);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: color 0.2s ease;
  }

  .ed-stack-container:hover .ed-stack-cta-label {
    color: var(--color-primary);
  }

  .ed-stack-cta-icon {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ed-stack-container:hover .ed-stack-cta-icon {
    transform: translateY(2px);
  }

  /* Expanded schedule list */
  .ed-schedule-expanded {
    display: flex;
    flex-direction: column;
    border-top: 1px solid rgba(12, 230, 68, 0.18);
  }

  .ed-schedule-row {
    position: relative;
    display: grid;
    grid-template-columns: 2rem 1fr;
    gap: 1rem;
    padding: clamp(1.15rem, 2.2vw, 1.45rem) clamp(0.75rem, 1.5vw, 1.25rem);
    border-bottom: 1px solid rgba(245, 247, 246, 0.08);
    background: transparent;
    transition: background 0.25s ease;
    align-items: center;
  }

  .ed-schedule-row:last-child {
    border-bottom: 1px solid rgba(12, 230, 68, 0.18);
  }

  .ed-schedule-row:hover {
    background: rgba(12, 230, 68, 0.03);
  }

  /* Left signal bar on hover */
  .ed-schedule-row::before {
    content: "";
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 2px;
    background: var(--color-primary);
    opacity: 0;
    transform: scaleY(0.4);
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ed-schedule-row:hover::before {
    opacity: 1;
    transform: scaleY(1);
  }

  .ed-row-index {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: rgba(12, 230, 68, 0.5);
    letter-spacing: 0.1em;
    user-select: none;
    transition: color 0.25s ease;
    align-self: center;
  }

  .ed-schedule-row:hover .ed-row-index {
    color: var(--color-primary);
  }

  .ed-row-content {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    min-width: 0;
  }

  @media (min-width: 640px) {
    .ed-row-content {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  .ed-row-date-block {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .ed-row-date-block {
      min-width: 165px;
    }
  }

  .ed-row-date {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.82rem, 1.4vw, 1.05rem);
    color: var(--color-text);
    margin: 0;
    letter-spacing: 0.02em;
    line-height: 1.25;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .ed-row-day {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: var(--color-primary);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-row-sessions {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
    min-width: 0;
  }

  @media (min-width: 640px) {
    .ed-row-sessions {
      align-items: flex-end;
      text-align: right;
    }
  }

  .ed-row-session-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Inter', sans-serif;
    font-size: clamp(0.78rem, 1vw, 0.86rem);
    color: rgba(245, 247, 246, 0.82);
    line-height: 1.4;
  }

  @media (min-width: 640px) {
    .ed-row-session-item {
      flex-direction: row-reverse;
    }
  }

  .ed-row-session-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-primary);
    opacity: 0.6;
    flex-shrink: 0;
    transition: opacity 0.2s ease;
  }

  .ed-schedule-row:hover .ed-row-session-dot {
    opacity: 1;
  }

  .ed-row-session-text {
    margin: 0;
  }

  /* Collapse CTA after expanded */
  .ed-collapse-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.85rem 0 0.25rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: rgba(12, 230, 68, 0.55);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    transition: color 0.2s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .ed-collapse-cta:hover {
    color: var(--color-primary);
  }

  /* ── VENUE MAP & EXPANDED STYLES ────────────────────── */
  .ed-venue-map-row {
    position: relative;
    padding: clamp(1rem, 2vw, 1.25rem) clamp(0.75rem, 1.5vw, 1.25rem) 0.5rem;
    border-bottom: 1px solid rgba(12, 230, 68, 0.18);
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    background: transparent;
  }

  .ed-map-frame {
    position: relative;
    height: clamp(160px, 18vw, 190px);
    border: 1px solid rgba(12, 230, 68, 0.25);
    border-radius: 3px;
    overflow: hidden;
    background: #071110;
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
const SCHEDULE = [
  {
    date: "September 19, 2026",
    day: "Saturday",
    sessions: ["Opening Ceremony", "Domain Training - Day 1"],
  },
  {
    date: "September 20, 2026",
    day: "Sunday",
    sessions: ["Domain Training - Day 2", "Hands-on Projects"],
  },
  {
    date: "September 26, 2026",
    day: "Saturday",
    sessions: ["General Training - Day 3", "Aptitude & Resume Building"],
  },
  {
    date: "September 27, 2026",
    day: "Sunday",
    sessions: ["General Training - Day 4", "Mock Interviews & Closing"],
  },
];

const VENUE = {
  name: "College of Applied Science",
  tag: "Perissery // Chengannur",
  subtitle: "IEEE SB CEC Host Campus",
  address: "Perissery, Chengannur, Kerala 689126",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=College%20of%20Applied%20Science%20Perissery&t=&z=15&ie=UTF8&iwloc=&output=embed",
  mapLink: "https://maps.app.goo.gl/cU61dU4RdUMPokNx6",
};

function FlipCard({ Icon, label, value, backTitle, backBody, delay }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="ed-card-item" data-aos="fade-up" data-aos-delay={delay}>
      <div
        className={`ed-card-wrap${flipped ? " flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="ed-card-inner">

          <div className="ed-card-front">
            <div className="ed-card-icon-glow">
              <Icon className="ed-card-icon" size={24} strokeWidth={1.5} />
            </div>
            <p className="ed-card-label">{label}</p>
            <p className="ed-card-value">{value}</p>
          </div>

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

export default function EventDetails() {
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const [venueExpanded, setVenueExpanded] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 850, once: true, offset: 50, easing: "ease-out" });
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section id="event-details" className="ed-section">
        <div className="ed-inner">

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

          <div className="ed-cards-grid">
            {CARDS.map((card, i) => (
              <FlipCard key={card.label} {...card} delay={i * 70} />
            ))}
          </div>

          <div className="ed-lower-grid">

            <div data-aos="fade-right" data-aos-delay="80">
              <div className="ed-subheading-wrap">
                <span className="ed-subheading-tag">// PROGRAMME_TIMELINE</span>
                <h3 className="ed-subheading">
                  Event <span>Schedule</span>
                </h3>
              </div>

              <motion.div layout>
                <AnimatePresence mode="wait">
                  {!scheduleExpanded ? (
                    /* ── COLLAPSED STACK ── */
                    <motion.div
                      key="stack"
                      className="ed-stack-container"
                      onClick={() => setScheduleExpanded(true)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scaleY: 0.92,
                        transition: { duration: 0.2, ease: "easeIn" },
                      }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="ed-stack-collapsed">
                        {/* Hero card — first event fully visible */}
                        <motion.div
                          className="ed-stack-hero"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 300,
                              damping: 26,
                            },
                          }}
                        >
                          <div className="ed-stack-hero-inner">
                            <div className="ed-stack-hero-top">
                              <p className="ed-stack-hero-date">
                                {SCHEDULE[0].date}
                              </p>
                              <p className="ed-stack-hero-day">
                                {SCHEDULE[0].day}
                              </p>
                            </div>

                            <div className="ed-stack-hero-sessions">
                              {SCHEDULE[0].sessions.map((s, i) => (
                                <p className="ed-stack-hero-session" key={i}>
                                  <span className="ed-stack-hero-dot" />
                                  {s}
                                </p>
                              ))}
                            </div>

                            <div className="ed-stack-hero-badge">
                              <p className="ed-stack-hero-more">
                                +{SCHEDULE.length - 1} more days
                              </p>
                              <span className="ed-stack-cta-label">
                                Expand
                                <ChevronDown
                                  size={12}
                                  className="ed-stack-cta-icon"
                                />
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Depth layers behind hero */}
                        {[1, 2].map((layer) => (
                          <motion.div
                            className="ed-stack-depth"
                            key={layer}
                            style={{
                              bottom: -(layer * 5),
                              left: layer * 6,
                              right: layer * 6,
                              zIndex: 3 - layer,
                              opacity: 1 - layer * 0.35,
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: 1 - layer * 0.35,
                              y: 0,
                              transition: {
                                delay: 0.08 + layer * 0.06,
                                type: "spring",
                                stiffness: 280,
                                damping: 25,
                              },
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    /* ── EXPANDED LIST ── */
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, scaleY: 0.95 }}
                      animate={{
                        opacity: 1,
                        scaleY: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 28,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        scaleY: 0.9,
                        transition: {
                          duration: 0.25,
                          ease: [0.4, 0, 1, 1],
                        },
                      }}
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="ed-schedule-expanded">
                        {SCHEDULE.map((item, index) => (
                          <motion.div
                            className="ed-schedule-row"
                            key={item.date}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: index * 0.07,
                                type: "spring",
                                stiffness: 320,
                                damping: 26,
                              },
                            }}
                            whileHover={{
                              x: 4,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                              },
                            }}
                          >
                            <span className="ed-row-index">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <div className="ed-row-content">
                              <div className="ed-row-date-block">
                                <h4 className="ed-row-date">{item.date}</h4>
                                <p className="ed-row-day">{item.day}</p>
                              </div>

                              <div className="ed-row-sessions">
                                {item.sessions.map((session, sIdx) => (
                                  <div className="ed-row-session-item" key={sIdx}>
                                    <span className="ed-row-session-dot" />
                                    <p className="ed-row-session-text">
                                      {session}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <button
                        className="ed-collapse-cta"
                        onClick={(e) => {
                          e.stopPropagation();
                          setScheduleExpanded(false);
                        }}
                      >
                        Collapse
                        <ChevronDown
                          size={13}
                          style={{ transform: "rotate(180deg)" }}
                        />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div data-aos="fade-left" data-aos-delay="140">
              <div className="ed-subheading-wrap">
                <span className="ed-subheading-tag">// BASE_LOCATION</span>
                <h3 className="ed-subheading">
                  Event <span>Venue</span>
                </h3>
              </div>

              <motion.div layout>
                <AnimatePresence mode="wait">
                  {!venueExpanded ? (
                    /* ── COLLAPSED VENUE STACK ── */
                    <motion.div
                      key="venue-stack"
                      className="ed-stack-container"
                      onClick={() => setVenueExpanded(true)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scaleY: 0.92,
                        transition: { duration: 0.2, ease: "easeIn" },
                      }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="ed-stack-collapsed">
                        {/* Hero card — venue overview visible */}
                        <motion.div
                          className="ed-stack-hero"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 300,
                              damping: 26,
                            },
                          }}
                        >
                          <div className="ed-stack-hero-inner">
                            <div className="ed-stack-hero-top">
                              <p className="ed-stack-hero-date">
                                {VENUE.name}
                              </p>
                              <p className="ed-stack-hero-day">
                                {VENUE.tag}
                              </p>
                            </div>

                            <div className="ed-stack-hero-sessions">
                              <p className="ed-stack-hero-session">
                                <span className="ed-stack-hero-dot" />
                                Offline • On-Campus
                              </p>
                              <p className="ed-stack-hero-session">
                                <span className="ed-stack-hero-dot" />
                                09:00 AM – 05:00 PM
                              </p>
                              <p className="ed-stack-hero-session">
                                <span className="ed-stack-hero-dot" />
                                {VENUE.subtitle}
                              </p>
                            </div>

                            <div className="ed-stack-hero-badge">
                              <p className="ed-stack-hero-more">
                                + Interactive Map & Access
                              </p>
                              <span className="ed-stack-cta-label">
                                Expand
                                <ChevronDown
                                  size={12}
                                  className="ed-stack-cta-icon"
                                />
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Depth layers behind hero */}
                        {[1, 2].map((layer) => (
                          <motion.div
                            className="ed-stack-depth"
                            key={layer}
                            style={{
                              bottom: -(layer * 5),
                              left: layer * 6,
                              right: layer * 6,
                              zIndex: 3 - layer,
                              opacity: 1 - layer * 0.35,
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: 1 - layer * 0.35,
                              y: 0,
                              transition: {
                                delay: 0.08 + layer * 0.06,
                                type: "spring",
                                stiffness: 280,
                                damping: 25,
                              },
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    /* ── EXPANDED VENUE ── */
                    <motion.div
                      key="venue-expanded"
                      initial={{ opacity: 0, scaleY: 0.95 }}
                      animate={{
                        opacity: 1,
                        scaleY: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 28,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        scaleY: 0.9,
                        transition: {
                          duration: 0.25,
                          ease: [0.4, 0, 1, 1],
                        },
                      }}
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="ed-schedule-expanded">
                        <motion.div
                          className="ed-schedule-row"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 320,
                              damping: 26,
                            },
                          }}
                          whileHover={{
                            x: 4,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            },
                          }}
                        >
                          <span className="ed-row-index">01</span>

                          <div className="ed-row-content">
                            <div className="ed-row-date-block">
                              <h4 className="ed-row-date">{VENUE.name}</h4>
                              <p className="ed-row-day">{VENUE.tag}</p>
                            </div>

                            <div className="ed-row-sessions">
                              <div className="ed-row-session-item">
                                <span className="ed-row-session-dot" />
                                <p className="ed-row-session-text">
                                  {VENUE.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Map row */}
                        <motion.div
                          className="ed-venue-map-row"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: 0.08,
                              type: "spring",
                              stiffness: 320,
                              damping: 26,
                            },
                          }}
                        >
                          <div className="ed-map-frame">
                            <iframe
                              src={VENUE.mapEmbedUrl}
                              title="College of Applied Science Perissery Google Map"
                              loading="lazy"
                              allowFullScreen
                            />
                          </div>

                          <a
                            href={VENUE.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ed-map-btn"
                          >
                            <MapPin size={14} />
                            View on Google Maps
                            <ExternalLink size={13} />
                          </a>
                        </motion.div>
                      </div>

                      <button
                        className="ed-collapse-cta"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVenueExpanded(false);
                        }}
                      >
                        Collapse
                        <ChevronDown
                          size={13}
                          style={{ transform: "rotate(180deg)" }}
                        />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
