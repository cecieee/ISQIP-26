import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarDays,
  Building2,
  Cpu,
  Timer,
  Award,
  Users,
  ExternalLink,
  ChevronDown,
  RotateCw,
  MapPin,
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
     ARCHITECTURAL MINIMALIST SPEC CARDS
     ========================================================= */
  .ed-matrix-wrap {
    margin-bottom: clamp(4rem, 8vw, 6rem);
    position: relative;
  }

  .ed-matrix-frame {
    background: transparent;
    position: relative;
  }

  .ed-matrix-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  @media (min-width: 640px) {
    .ed-matrix-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
  }

  @media (min-width: 1024px) {
    .ed-matrix-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }

  .ed-bay-cell {
    position: relative;
    min-height: 220px;
    perspective: 1200px;
  }

  .ed-bay-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 220px;
    cursor: pointer;
    user-select: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .ed-bay-inner {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 220px;
    transform-style: preserve-3d;
    transform-origin: center center;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (hover: hover) {
    .ed-bay-wrap:hover .ed-bay-inner {
      transform: rotateY(180deg);
    }
  }

  .ed-bay-wrap.is-flipped .ed-bay-inner {
    transform: rotateY(180deg);
  }

  .ed-bay-face {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    padding: 1.5rem 1.6rem 1.4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #08090a;
    border-radius: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-left: 1px solid rgba(255, 255, 255, 0.04);
    border-right: 1px solid rgba(255, 255, 255, 0.02);
    border-bottom: 1px solid rgba(0, 0, 0, 0.8);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    transition: border-color 0.3s ease, transform 0.3s ease;
  }

  .ed-bay-wrap:hover .ed-bay-face {
    border-top-color: rgba(12, 230, 68, 0.4);
    border-left-color: rgba(12, 230, 68, 0.15);
  }

  /* Card Header */
  .ed-bay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ed-bay-tag-group {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .ed-bay-index {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: var(--color-primary);
    letter-spacing: 0.06em;
    opacity: 0.9;
  }

  .ed-bay-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: rgba(245, 247, 246, 0.4);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-bay-icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    opacity: 0.85;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .ed-bay-wrap:hover .ed-bay-icon-badge {
    transform: scale(1.08);
    opacity: 1;
  }

  /* Bay Front Content */
  .ed-bay-content {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin: 0.6rem 0;
  }

  .ed-bay-val {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1.2rem, 1.55vw, 1.4rem);
    color: #ffffff;
    margin: 0;
    line-height: 1.15;
    letter-spacing: 0.01em;
  }

  .ed-bay-sub {
    font-family: 'Inter', sans-serif;
    font-size: 0.84rem;
    color: rgba(245, 247, 246, 0.5);
    line-height: 1.45;
    margin: 0;
  }

  /* Bay Footer */
  .ed-bay-footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .ed-bay-status-tag {
    display: inline-flex;
    align-items: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(12, 230, 68, 0.85);
    letter-spacing: 0.05em;
  }

  /* Bay Back Face */
  .ed-bay-back {
    transform: rotateY(180deg);
    background: #08090a;
  }

  .ed-bay-back-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0.2rem 0;
  }

  .ed-bay-back-title {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1rem, 1.3vw, 1.18rem);
    color: var(--color-primary);
    margin: 0;
    line-height: 1.2;
    letter-spacing: 0.02em;
  }

  .ed-bay-back-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    color: rgba(245, 247, 246, 0.72);
    line-height: 1.5;
    margin: 0;
  }

  .ed-bay-specs-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.2rem;
  }

  .ed-bay-spec-chip {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(245, 247, 246, 0.75);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
    letter-spacing: 0.04em;
  }

  .ed-bay-back-footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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

  /* ── MINIMALIST TIMELINE & VENUE CARDS ────────────── */
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
    padding-bottom: 16px;
  }

  /* Depth layers behind the top card */
  .ed-stack-depth {
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    background: rgba(6, 10, 8, 0.6);
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .ed-stack-container:hover .ed-stack-depth {
    border-color: rgba(12, 230, 68, 0.12);
  }

  /* The hero top card */
  .ed-stack-hero {
    position: relative;
    background: linear-gradient(180deg, rgba(13, 19, 15, 0.94) 0%, rgba(7, 11, 9, 0.98) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    overflow: hidden;
    z-index: 3;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ed-stack-container:hover .ed-stack-hero {
    border-color: rgba(12, 230, 68, 0.35);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 24px rgba(12, 230, 68, 0.08);
    transform: translateY(-2px);
  }

  .ed-stack-hero-inner {
    padding: 1.4rem 1.6rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  /* Top Anchor Block */
  .ed-hero-top-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .ed-hero-anchor-group {
    display: flex;
    align-items: center;
    gap: 1.1rem;
  }

  .ed-hero-big-anchor {
    font-family: 'Inter', sans-serif;
    font-size: clamp(2rem, 3vw, 2.35rem);
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
    letter-spacing: -0.03em;
    margin: 0;
    flex-shrink: 0;
  }

  .ed-hero-anchor-divider {
    width: 1px;
    height: 38px;
    background: rgba(255, 255, 255, 0.12);
    flex-shrink: 0;
  }

  .ed-hero-title-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .ed-hero-main-title {
    font-family: 'Inter', sans-serif;
    font-size: clamp(1rem, 1.4vw, 1.15rem);
    font-weight: 600;
    color: #ffffff;
    letter-spacing: -0.01em;
    margin: 0;
    line-height: 1.25;
  }

  .ed-hero-sub-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-primary);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-hero-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(245, 247, 246, 0.7);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0;
    flex-shrink: 0;
  }

  .ed-hero-status-pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-primary);
    opacity: 0.9;
    box-shadow: 0 0 8px rgba(12, 230, 68, 0.7);
  }

  /* Body Content: Sessions List / Venue details */
  .ed-hero-body-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.2rem;
  }

  .ed-hero-session-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.45rem 0.65rem;
    background: rgba(255, 255, 255, 0.025);
    border-radius: 6px;
    transition: background 0.2s ease;
  }

  .ed-stack-container:hover .ed-hero-session-row {
    background: rgba(255, 255, 255, 0.04);
  }

  .ed-hero-session-left {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
  }

  .ed-hero-session-idx {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: var(--color-primary);
    opacity: 0.7;
    letter-spacing: 0.05em;
  }

  .ed-hero-session-name {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    font-weight: 400;
    color: rgba(245, 247, 246, 0.85);
    margin: 0;
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ed-hero-session-time {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.66rem;
    color: rgba(245, 247, 246, 0.4);
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  /* Action footer */
  .ed-hero-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
  }

  .ed-hero-dots-indicator {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .ed-hero-step-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.18);
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    transition: all 0.25s ease;
  }

  .ed-hero-step-dot:hover {
    background: rgba(12, 230, 68, 0.5);
    transform: scale(1.3);
  }

  .ed-hero-step-dot.is-active {
    background: var(--color-primary);
    box-shadow: 0 0 8px rgba(12, 230, 68, 0.7);
    transform: scale(1.25);
  }

  .ed-hero-footer-count {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: rgba(245, 247, 246, 0.45);
    letter-spacing: 0.06em;
    margin-left: 0.4rem;
  }

  .ed-hero-expand-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: var(--color-primary);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.2s ease;
  }

  .ed-stack-container:hover .ed-hero-expand-link .ed-action-chevron {
    transform: translateY(2px);
  }

  .ed-action-chevron {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Expanded schedule list */
  .ed-schedule-expanded {
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, rgba(13, 19, 15, 0.92) 0%, rgba(7, 11, 9, 0.96) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }

  .ed-schedule-row {
    position: relative;
    display: grid;
    grid-template-columns: 2.2rem 1fr;
    gap: 1rem;
    padding: clamp(1.1rem, 2vw, 1.35rem) clamp(0.9rem, 1.5vw, 1.4rem);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    background: transparent;
    transition: background 0.25s ease;
    align-items: center;
  }

  .ed-schedule-row:last-child {
    border-bottom: none;
  }

  .ed-schedule-row:hover {
    background: rgba(12, 230, 68, 0.03);
  }

  .ed-row-index {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: rgba(12, 230, 68, 0.55);
    letter-spacing: 0.1em;
    user-select: none;
    transition: color 0.25s ease;
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
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.25;
  }

  .ed-row-day {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: var(--color-primary);
    letter-spacing: 0.1em;
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
    gap: 0.45rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    color: rgba(245, 247, 246, 0.75);
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
    padding: 0.9rem 0 0.4rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: rgba(12, 230, 68, 0.6);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    transition: color 0.2s ease;
    touch-action: manipulation;
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
    index: "01",
    label: "DURATION",
    Icon: CalendarDays,
    frontVal: "26 Days Active",
    frontSub: "September 15 – October 10",
    statusPill: "Fall 2026 Cohort",
    backTitle: "Program Duration",
    backDesc:
      "A 4-week structured bootcamp engineered to take participants from foundational fundamentals to production-ready project delivery.",
    chips: ["4 Weeks", "Sprint Schedule"],
  },
  {
    index: "02",
    label: "LOCATION",
    Icon: Building2,
    frontVal: "CE Chengannur",
    frontSub: "Main Campus Labs & Auditoriums",
    statusPill: "Kerala, India",
    backTitle: "Venue Infrastructure",
    backDesc:
      "Hosted directly on-site with full access to high-performance computing facilities, dedicated hardware labs, and seminar halls.",
    chips: ["On-Campus", "Advanced Lab Access"],
  },
  {
    index: "03",
    label: "LEARNING MODE",
    Icon: Cpu,
    frontVal: "In-Person Labs",
    frontSub: "Direct Mentor-Led Engineering",
    statusPill: "Zero Virtual Lag",
    backTitle: "Hands-On Experience",
    backDesc:
      "Interactive studio environment with live code reviews, instant roadblock resolution, and team-based development sprints.",
    chips: ["Live Mentoring", "Project Sprints"],
  },
  {
    index: "04",
    label: "COMMITMENT",
    Icon: Timer,
    frontVal: "Flexible Hours",
    frontSub: "Evenings & Weekend Sessions",
    statusPill: "Zero Lecture Clash",
    backTitle: "Time Commitment",
    backDesc:
      "Intelligently scheduled outside standard academic hours so you can upskill without missing university lectures or labs.",
    chips: ["After Hours", "Weekend Masterclasses"],
  },
  {
    index: "05",
    label: "IEEE SCHOLARSHIP",
    Icon: Award,
    frontVal: "100% Funded",
    frontSub: "Exclusive to IEEE SB CEC Members",
    statusPill: "60 Reserved Seats",
    backTitle: "Sponsored Track",
    backDesc:
      "Complete registration waiver and sponsored materials provided by IEEE Student Branch CEC to empower high-potential members.",
    chips: ["Full Waiver", "Member Exclusive"],
  },
  {
    index: "06",
    label: "OPEN ENROLLMENT",
    Icon: Users,
    frontVal: "All Colleges",
    frontSub: "Open to All Engineering Disciplines",
    statusPill: "60 Open Seats",
    backTitle: "Universal Cohort",
    backDesc:
      "Open access pathway designed for ambitious engineers across any institution eager to master in-demand technical domains.",
    chips: ["Cross-College", "Placement Focused"],
  },
];
const SCHEDULE = [
  {
    dayNum: "19",
    monthYear: "September 2026",
    date: "September 19, 2026",
    day: "Saturday",
    phase: "Cohort Opening",
    sessions: [
      { name: "Opening Ceremony", time: "09:30 AM" },
      { name: "Domain Training - Day 1", time: "01:30 PM" },
    ],
  },
  {
    dayNum: "20",
    monthYear: "September 2026",
    date: "September 20, 2026",
    day: "Sunday",
    phase: "Hands-on Sprint",
    sessions: [
      { name: "Domain Training - Day 2", time: "09:30 AM" },
      { name: "Hands-on Projects", time: "01:30 PM" },
    ],
  },
  {
    dayNum: "26",
    monthYear: "September 2026",
    date: "September 26, 2026",
    day: "Saturday",
    phase: "Career Track",
    sessions: [
      { name: "General Training - Day 3", time: "09:30 AM" },
      { name: "Aptitude & Resume Building", time: "01:30 PM" },
    ],
  },
  {
    dayNum: "27",
    monthYear: "September 2026",
    date: "September 27, 2026",
    day: "Sunday",
    phase: "Grand Finale",
    sessions: [
      { name: "General Training - Day 4", time: "09:30 AM" },
      { name: "Mock Interviews & Closing", time: "02:00 PM" },
    ],
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

function TelemetryBay({
  index,
  label,
  Icon,
  frontVal,
  frontSub,
  statusPill,
  backTitle,
  backDesc,
  chips,
  delay,
}) {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => {
    setFlipped((f) => !f);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <div className="ed-bay-cell" data-aos="fade-up" data-aos-delay={delay}>
      <div
        className={`ed-bay-wrap${flipped ? " is-flipped" : ""}`}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={flipped}
        aria-label={`${label}: ${frontVal}. Click to flip.`}
      >
        <div className="ed-bay-inner">
          {/* Front Bay Face */}
          <div className="ed-bay-face ed-bay-front">
            <div className="ed-bay-header">
              <div className="ed-bay-tag-group">
                <span className="ed-bay-index">{index}</span>
                <p className="ed-bay-label">{label}</p>
              </div>
              <span className="ed-bay-icon-badge">
                <Icon size={20} strokeWidth={1.8} />
              </span>
            </div>

            <div className="ed-bay-content">
              <h3 className="ed-bay-val">{frontVal}</h3>
              <p className="ed-bay-sub">{frontSub}</p>
            </div>

            <div className="ed-bay-footer">
              <span className="ed-bay-status-tag">{statusPill}</span>
            </div>
          </div>

          {/* Back Bay Face */}
          <div className="ed-bay-face ed-bay-back">
            <div className="ed-bay-header">
              <div className="ed-bay-tag-group">
                <span className="ed-bay-index">{index}</span>
                <p className="ed-bay-label">{label}</p>
              </div>
              <span className="ed-bay-icon-badge">
                <Icon size={20} strokeWidth={1.8} />
              </span>
            </div>

            <div className="ed-bay-back-body">
              <h3 className="ed-bay-back-title">{backTitle}</h3>
              <p className="ed-bay-back-desc">{backDesc}</p>
              {chips && chips.length > 0 && (
                <div className="ed-bay-specs-list">
                  {chips.map((chip, idx) => (
                    <span key={idx} className="ed-bay-spec-chip">
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="ed-bay-back-footer">
              <span className="ed-bay-status-tag">{statusPill}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventDetails() {
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const [venueExpanded, setVenueExpanded] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [isSchedulePaused, setIsSchedulePaused] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 850, once: true, offset: 50, easing: "ease-out" });
  }, []);

  useEffect(() => {
    if (isSchedulePaused || scheduleExpanded) return;
    const interval = setInterval(() => {
      setActiveDayIdx((prev) => (prev + 1) % SCHEDULE.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isSchedulePaused, scheduleExpanded]);

  return (
    <>
      <style>{STYLES}</style>

      <section id="event-details" className="ed-section">
        <div className="ed-inner">

          <div className="ed-header" data-aos="fade-down">
            <h2 className="ed-title">
              Event <span>Details</span>
            </h2>
            <div className="ed-divider">
              <span className="ed-divider-line" />
              <span className="ed-divider-diamond" />
              <span className="ed-divider-line" />
            </div>
          </div>

          {/* Minimal 6-Bay Matrix Grid (Non-card Layout) */}
          <div className="ed-matrix-wrap">
            <div className="ed-matrix-frame">
              <div className="ed-matrix-grid">
                {CARDS.map((card, i) => (
                  <TelemetryBay key={card.label} {...card} delay={i * 45} />
                ))}
              </div>
            </div>
          </div>

          <div className="ed-lower-grid">

            <div data-aos="fade-right" data-aos-delay="80">
              <div className="ed-subheading-wrap">
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
                        {/* Hero card — auto-cycling carousel */}
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
                          <div
                            className="ed-stack-hero-inner"
                            onMouseEnter={() => setIsSchedulePaused(true)}
                            onMouseLeave={() => setIsSchedulePaused(false)}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeDayIdx}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.26, ease: "easeOut" }}
                                style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
                              >
                                <div className="ed-hero-top-block">
                                  <div className="ed-hero-anchor-group">
                                    <h4 className="ed-hero-big-anchor">
                                      {SCHEDULE[activeDayIdx].dayNum}
                                    </h4>
                                    <div className="ed-hero-anchor-divider" />
                                    <div className="ed-hero-title-meta">
                                      <h5 className="ed-hero-main-title">
                                        {SCHEDULE[activeDayIdx].monthYear}
                                      </h5>
                                      <p className="ed-hero-sub-meta">
                                        {SCHEDULE[activeDayIdx].day} • {SCHEDULE[activeDayIdx].phase}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="ed-hero-status-badge">
                                    <span className="ed-hero-status-pulse" />
                                    <span>Day 0{activeDayIdx + 1}</span>
                                  </div>
                                </div>

                                <div className="ed-hero-body-list">
                                  {SCHEDULE[activeDayIdx].sessions.map((session, idx) => (
                                    <div className="ed-hero-session-row" key={idx}>
                                      <div className="ed-hero-session-left">
                                        <span className="ed-hero-session-idx">0{idx + 1}</span>
                                        <p className="ed-hero-session-name">
                                          {typeof session === "string" ? session : session.name}
                                        </p>
                                      </div>
                                      <span className="ed-hero-session-time">
                                        {typeof session === "string"
                                          ? (idx === 0 ? "09:30 AM" : "01:30 PM")
                                          : session.time}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </AnimatePresence>

                            <div className="ed-hero-footer-row">
                              <div className="ed-hero-dots-indicator">
                                {SCHEDULE.map((_, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    aria-label={`Go to Day ${i + 1}`}
                                    className={`ed-hero-step-dot${i === activeDayIdx ? " is-active" : ""}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDayIdx(i);
                                    }}
                                  />
                                ))}
                                <span className="ed-hero-footer-count">4 Days</span>
                              </div>
                              <span className="ed-hero-expand-link">
                                View All Dates
                                <ChevronDown
                                  size={13}
                                  className="ed-action-chevron"
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
                              top: layer * 5,
                              bottom: -(layer * 5),
                              left: layer * 8,
                              right: layer * 8,
                              zIndex: 3 - layer,
                              opacity: 1 - layer * 0.4,
                            }}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{
                              opacity: 1 - layer * 0.4,
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
                                      {typeof session === "string" ? session : session.name}
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
                            <div className="ed-hero-top-block">
                              <div className="ed-hero-anchor-group">
                                <h4
                                  className="ed-hero-big-anchor"
                                  style={{
                                    fontSize: "clamp(1.45rem, 2.3vw, 1.75rem)",
                                    letterSpacing: "0.02em",
                                  }}
                                >
                                  CAS
                                </h4>
                                <div className="ed-hero-anchor-divider" />
                                <div className="ed-hero-title-meta">
                                  <h5 className="ed-hero-main-title">{VENUE.name}</h5>
                                  <p className="ed-hero-sub-meta">{VENUE.tag}</p>
                                </div>
                              </div>
                              <div className="ed-hero-status-badge">
                                <span className="ed-hero-status-pulse" />
                                <span>Offline</span>
                              </div>
                            </div>

                            <div className="ed-hero-body-list">
                              <div className="ed-hero-session-row">
                                <div className="ed-hero-session-left">
                                  <span className="ed-hero-session-idx">LAB</span>
                                  <p className="ed-hero-session-name">{VENUE.subtitle}</p>
                                </div>
                                <span className="ed-hero-session-time">In-Person</span>
                              </div>
                              <div className="ed-hero-session-row">
                                <div className="ed-hero-session-left">
                                  <span className="ed-hero-session-idx">TIME</span>
                                  <p className="ed-hero-session-name">09:00 AM – 05:00 PM IST</p>
                                </div>
                                <span className="ed-hero-session-time">Full Day</span>
                              </div>
                            </div>

                            <div className="ed-hero-footer-row">
                              <div className="ed-hero-dots-indicator">
                                <span className="ed-hero-step-dot is-active" />
                                <span className="ed-hero-footer-count">Host Campus</span>
                              </div>
                              <span className="ed-hero-expand-link">
                                View Map & Access
                                <ChevronDown
                                  size={13}
                                  className="ed-action-chevron"
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
                              top: layer * 5,
                              bottom: -(layer * 5),
                              left: layer * 8,
                              right: layer * 8,
                              zIndex: 3 - layer,
                              opacity: 1 - layer * 0.4,
                            }}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{
                              opacity: 1 - layer * 0.4,
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
