import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Wifi,
  IndianRupee,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   STYLES
   ========================================================= */
const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&family=Bruno+Ace&display=swap");

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

  /* 3-D Flip Cards grid */
  .ed-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: clamp(1rem, 2.5vw, 1.4rem);
    margin-bottom: clamp(3.5rem, 7vw, 5.5rem);
  }

  /* Desktop: 4 on top, 2 centered on bottom */
  @media (min-width: 900px) {
    .ed-cards-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    /* 5th card → column 2, 6th card → column 3  →  centered in 4-col grid */
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

  /* Desktop: pure CSS hover flip & animations — no JS involved */
  @media (hover: hover) {
    .ed-card-wrap:hover .ed-card-inner {
      transform: rotateY(180deg);
    }

    .ed-card-wrap:hover .ed-card-front::before,
    .ed-card-wrap:hover .ed-card-front::after {
      width: 22px;
      height: 22px;
    }

    .ed-card-wrap:hover .ed-card-front .ed-card-sweep {
      top: 120%;
      transition: top 0.6s ease-in;
    }
  }

  /* Tap / flipped state */
  .ed-card-wrap.flipped .ed-card-inner {
    transform: rotateY(180deg);
  }

  /* ── shared face base ──────────────────────────────── */
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

  /* 4-corner bracket marks */
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

  /* top-left */
  .ed-card-front::before,
  .ed-card-back::before {
    top: -1px; left: -1px;
    border-top: 2px solid rgba(12, 230, 68, 0.7);
    border-left: 2px solid rgba(12, 230, 68, 0.7);
  }

  /* bottom-right */
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

  /* ── FRONT ─────────────────────────────────────────── */
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

  /* ── BACK ──────────────────────────────────────────── */
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


  /* Stats Bar */
  .ed-stats-bar {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border: 1px solid rgba(12,230,68,0.2);
    margin-bottom: clamp(3.5rem, 7vw, 5.5rem);
    background: rgba(12,230,68,0.025);
    position: relative;
    overflow: hidden;
  }

  /* top accent line */
  .ed-stats-bar::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(12,230,68,0.5) 20%,
      rgba(12,230,68,0.5) 80%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 2;
  }

  /* corner mark */
  .ed-stats-bar::after {
    content: "";
    position: absolute;
    top: -1px; right: -1px;
    width: 40px; height: 40px;
    border-top: 1px solid rgba(12,230,68,0.45);
    border-right: 1px solid rgba(12,230,68,0.45);
    pointer-events: none;
  }

  .ed-stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: clamp(1.4rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.5rem);
    position: relative;
    z-index: 1;
    text-align: center;
  }

  /* right border between cells — skip last */
  .ed-stat-item:not(:last-child) {
    border-right: 1px solid rgba(12,230,68,0.12);
  }

  /* subtle hover highlight on each cell */
  .ed-stat-item:hover {
    background: rgba(12,230,68,0.04);
  }

  .ed-stat-num {
    font-family: var(--font-mech);
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    color: var(--color-primary);
    text-shadow:
      0 0 8px rgba(12,230,68,0.8),
      0 0 24px rgba(12,230,68,0.35);
    line-height: 1;
    margin: 0;
    white-space: nowrap;
  }

  .ed-stat-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.58rem;
    color: rgba(245,247,246,0.4);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
    white-space: nowrap;
  }

  /* collapse to single row on small screens */
  @media (max-width: 640px) {
    .ed-stats-bar {
      grid-template-columns: repeat(3, 1fr);
    }

    .ed-stat-item:nth-child(3) {
      border-right: none;
    }

    .ed-stat-item:nth-child(4),
    .ed-stat-item:nth-child(5) {
      border-top: 1px solid rgba(12,230,68,0.12);
    }
  }

  /* Timeline */
  .ed-timeline-title {
    font-family: var(--font-mech);
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 0.6rem;
    line-height: 1.15;
    text-align: center;
  }

  .ed-timeline-title span { color: var(--color-primary); }

  .ed-timeline-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin: 0 auto clamp(1.8rem, 3.5vw, 2.6rem);
  }

  .ed-timeline-divider .ed-divider-line {
    height: 1px;
    width: clamp(30px, 5vw, 60px);
    background: linear-gradient(90deg, transparent, rgba(12,230,68,0.6));
  }

  .ed-timeline-divider .ed-divider-line:last-child {
    background: linear-gradient(270deg, transparent, rgba(12,230,68,0.6));
  }

  .ed-timeline {
    position: relative;
    padding-left: clamp(2rem, 5vw, 3.5rem);
  }

  .ed-timeline::before {
    content: "";
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 7px;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(12,230,68,0.5) 8%,
      rgba(12,230,68,0.5) 92%,
      transparent 100%
    );
  }

  .ed-timeline-pulse {
    position: absolute;
    left: 3px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 10px 3px rgba(12,230,68,0.55);
    animation: ed-pulse-travel 7s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes ed-pulse-travel {
    0%  { top: 2%;  opacity: 0; }
    5%  { opacity: 1; }
    95% { opacity: 1; }
    100%{ top: 94%; opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ed-timeline-pulse { animation: none; opacity: 0; }
  }

  .ed-timeline-item {
    position: relative;
    padding-bottom: clamp(1.8rem, 4vw, 2.5rem);
  }

  .ed-timeline-item:last-child { padding-bottom: 0; }

  .ed-timeline-node {
    position: absolute;
    left: calc(-1 * clamp(2rem, 5vw, 3.5rem) + 1px);
    top: 4px;
    width: 13px;
    height: 13px;
    background: var(--color-background);
    border: 2px solid var(--color-primary);
    transform: rotate(45deg);
    box-shadow: 0 0 8px 2px rgba(12,230,68,0.45);
    transition: background 0.3s, box-shadow 0.3s;
  }

  .ed-timeline-item:hover .ed-timeline-node {
    background: var(--color-primary);
    box-shadow: 0 0 14px 4px rgba(12,230,68,0.7);
  }

  .ed-timeline-item::before {
    content: "";
    position: absolute;
    top: 10px;
    left: calc(-1 * clamp(2rem, 5vw, 3.5rem) + 14px);
    width: clamp(0.6rem, 1.5vw, 1.2rem);
    height: 1px;
    background: rgba(12,230,68,0.45);
  }

  .ed-timeline-card {
    border: 1px solid rgba(12,230,68,0.25);
    background: rgba(12,230,68,0.03);
    padding: clamp(1rem, 2.5vw, 1.35rem) clamp(1rem, 3vw, 1.6rem);
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: border-color 0.3s, background 0.3s, transform 0.3s;
  }

  .ed-timeline-card:hover {
    border-color: rgba(12,230,68,0.6);
    background: rgba(12,230,68,0.07);
    transform: translateX(4px);
  }

  .ed-timeline-card::before {
    content: "";
    position: absolute;
    bottom: -1px; right: -1px;
    width: 20px; height: 20px;
    border-bottom: 1px solid rgba(12,230,68,0.4);
    border-right: 1px solid rgba(12,230,68,0.4);
    pointer-events: none;
    transition: width 0.3s, height 0.3s;
  }

  .ed-timeline-card:hover::before {
    width: 32px; height: 32px;
    border-color: rgba(12,230,68,0.7);
  }

  .ed-tl-phase {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(12,230,68,0.55);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 0 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .ed-tl-phase-bar {
    display: inline-block;
    width: 18px;
    height: 1px;
    background: rgba(12,230,68,0.5);
    vertical-align: middle;
  }

  .ed-tl-title {
    font-family: var(--font-mech);
    font-size: clamp(0.9rem, 1.8vw, 1.05rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 0 0 0.3rem;
  }

  .ed-tl-date {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: var(--color-primary);
    margin: 0 0 0.35rem;
    text-shadow: 0 0 6px rgba(12,230,68,0.4);
  }

  .ed-tl-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.83rem;
    color: rgba(245,247,246,0.62);
    line-height: 1.55;
    margin: 0;
  }

  .ed-tl-status {
    position: absolute;
    top: 0.8rem;
    right: 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.57rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.15em 0.5em;
    border: 1px solid;
    border-radius: 2px;
  }

  .ed-tl-status.upcoming {
    color: rgba(12,230,68,0.7);
    border-color: rgba(12,230,68,0.3);
    background: rgba(12,230,68,0.06);
  }

  .ed-tl-status.live {
    color: #0CE644;
    border-color: rgba(12,230,68,0.6);
    background: rgba(12,230,68,0.1);
    animation: ed-status-pulse 1.6s ease-in-out infinite;
  }

  @keyframes ed-status-pulse {
    50% { box-shadow: 0 0 8px rgba(12,230,68,0.5); }
  }

  /* Mobile timeline optimizations */
  @media (max-width: 640px) {
    .ed-timeline {
      padding-left: 1.75rem;
    }

    .ed-timeline::before {
      left: 5px;
    }

    .ed-timeline-pulse {
      left: 2px;
      width: 7px;
      height: 7px;
    }

    .ed-timeline-node {
      left: calc(-1.75rem + 1px);
      width: 10px;
      height: 10px;
      top: 6px;
    }

    .ed-timeline-item::before {
      left: calc(-1.75rem + 11px);
      width: 0.5rem;
      top: 10px;
    }

    .ed-timeline-item {
      padding-bottom: 1.35rem;
    }

    .ed-timeline-card {
      padding: 0.85rem 0.95rem;
    }

    .ed-tl-phase {
      padding-right: 4.2rem;
    }

    .ed-tl-title {
      font-size: 0.92rem;
      padding-right: 2.5rem;
    }

    .ed-tl-desc {
      font-size: 0.8rem;
      line-height: 1.5;
    }

    .ed-tl-status {
      top: 0.75rem;
      right: 0.75rem;
      font-size: 0.52rem;
    }
  }

  /* Two-column layout */
  .ed-lower {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 5vw, 4rem);
    align-items: start;
  }

  @media (max-width: 860px) {
    .ed-lower { grid-template-columns: 1fr; }
  }

  /* Venue panel */
  .ed-venue-panel {
    border: 1px solid rgba(12,230,68,0.3);
    padding: clamp(1.5rem, 3.5vw, 2rem);
    background: rgba(12,230,68,0.03);
    position: relative;
    overflow: hidden;
  }

  .ed-venue-panel::before {
    content: "VENUE // LOCATION_DATA";
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem;
    color: rgba(12,230,68,0.22);
    letter-spacing: 0.12em;
    position: absolute;
    top: 0.6rem;
    left: 0.9rem;
    pointer-events: none;
  }

  .ed-venue-name {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1.05rem, 2.2vw, 1.35rem);
    color: var(--color-text);
    text-transform: uppercase;
    margin: 1.5rem 0 0.35rem;
    text-shadow: 0 0 12px rgba(12,230,68,0.25);
    letter-spacing: 0.02em;
    line-height: 1.35;
  }

  .ed-venue-name span {
    color: var(--color-primary);
  }

  .ed-venue-address {
    font-family: 'Inter', sans-serif;
    font-size: 0.88rem;
    color: rgba(245,247,246,0.65);
    line-height: 1.65;
    margin: 0 0 1.25rem;
  }

  .ed-map-frame {
    position: relative;
    height: clamp(170px, 22vw, 230px);
    border: 1px solid rgba(12,230,68,0.3);
    border-radius: 2px;
    overflow: hidden;
    background: #071110;
    margin-bottom: 0.75rem;
  }

  .ed-map-frame iframe {
    width: 100%;
    height: 100%;
    border: none;
    filter: invert(92%) hue-rotate(180deg) contrast(1.15) brightness(0.85);
    transition: filter 0.3s ease;
  }

  .ed-map-frame:hover iframe {
    filter: invert(92%) hue-rotate(180deg) contrast(1.25) brightness(0.95);
  }

  .ed-map-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: var(--color-primary);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    transition: color 0.2s, transform 0.2s;
  }

  .ed-map-link-btn:hover {
    color: #14ff5a;
    transform: translateX(3px);
  }

  /* CTA panel */
  .ed-cta-panel {
    display: flex;
    flex-direction: column;
    gap: clamp(1.25rem, 2.5vw, 1.75rem);
  }

  .ed-cta-box {
    border: 1px solid rgba(12,230,68,0.3);
    padding: clamp(1.25rem, 3vw, 1.75rem) clamp(1.25rem, 3.5vw, 2rem);
    background: rgba(12,230,68,0.03);
    position: relative;
  }

  .ed-cta-box::before {
    content: "";
    position: absolute;
    top: -1px; left: -1px;
    width: 24px; height: 24px;
    border-top: 1px solid rgba(12,230,68,0.6);
    border-left: 1px solid rgba(12,230,68,0.6);
    pointer-events: none;
  }

  .ed-cta-box-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(12,230,68,0.55);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 0.55rem;
  }

  .ed-cta-box-val {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: clamp(0.95rem, 2vw, 1.15rem);
    color: var(--color-text);
    margin: 0;
  }

  .ed-cta-box-sub {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: rgba(245,247,246,0.5);
    margin: 0.35rem 0 0;
    line-height: 1.5;
  }

  .ed-register-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-background);
    background: var(--color-primary);
    border: none;
    padding: 0.9rem 2.5rem;
    cursor: pointer;
    overflow: hidden;
    width: 100%;
    transition: background 0.25s, box-shadow 0.25s, transform 0.2s;
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
  }

  .ed-register-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  .ed-register-btn:hover::before {
    transform: translateX(100%);
  }

  .ed-register-btn:hover {
    background: #14ff5a;
    box-shadow: 0 0 28px rgba(12,230,68,0.6), 0 0 60px rgba(12,230,68,0.2);
    transform: translateY(-2px);
  }

  .ed-register-btn:active { transform: translateY(0); }
`;

/* =========================================================
   DATA
   ========================================================= */
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
    Icon: Wifi,
    label: "Mode",
    value: "In-Person",
    backTitle: "Hybrid Option",
    backBody: "Select sessions available online for outstation participants.",
  },
  {
    Icon: Clock,
    label: "Session Length",
    value: "3–4 Hrs / Session",
    backTitle: "Schedule",
    backBody: "Weekday evenings + Saturday mornings. No clash with academics.",
  },
  {
    Icon: Users,
    label: "Eligibility",
    value: "S1 – S8, Any Branch",
    backTitle: "Who Can Join",
    backBody: "Open to all UG students of CEC. Final year students get priority.",
  },
  {
    Icon: IndianRupee,
    label: "Registration Fee",
    value: "Rs. 300 / Person",
    backTitle: "What's Included",
    backBody: "Full programme access, resource kits, certificates & placement support.",
  },
];

const TIMELINE = [
  {
    phase: "Phase 01",
    title: "Registrations Open",
    date: "Sep 01, 2026",
    desc: "Fill out the Google Form. Limited seats — ISQIP fills up fast.",
    status: "upcoming",
  },
  {
    phase: "Phase 02",
    title: "Kick-off Session",
    date: "Sep 15, 2026",
    desc: "Orientation, domain allocation, and introduction to mentors.",
    status: "upcoming",
  },
  {
    phase: "Phase 03",
    title: "Domain Training",
    date: "Sep 16 – Oct 04, 2026",
    desc: "Expert-led technical sessions, hands-on projects, and aptitude drives.",
    status: "upcoming",
  },
  {
    phase: "Phase 04",
    title: "Mock Interviews & GDs",
    date: "Oct 05 – 08, 2026",
    desc: "Panel interviews, group discussions, and resume review workshops.",
    status: "upcoming",
  },
  {
    phase: "Phase 05",
    title: "Closing Ceremony",
    date: "Oct 10, 2026",
    desc: "Certificate distribution, internship offers, and feedback roundtable.",
    status: "upcoming",
  },
];

const STATS = [
  { value: 26, suffix: "th", label: "Edition" },
  { value: 30, suffix: "+", label: "Industry Mentors" },
  { value: 4, suffix: " Wks", label: "Programme" },
  { value: 300, suffix: "", label: "Max Seats" },
  { value: 1996, suffix: "", label: "Since" },
];

/* =========================================================
   ANIMATED COUNTER HOOK
   ========================================================= */
function useCounter(target, duration, startTrigger) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startTrigger) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, startTrigger]);

  return count;
}

/* =========================================================
   STAT ITEM
   ========================================================= */
function StatItem({ value, suffix, label, trigger }) {
  const count = useCounter(value, 1400, trigger);
  return (
    <div className="ed-stat-item">
      <p className="ed-stat-num">{count}{suffix}</p>
      <p className="ed-stat-label">{label}</p>
    </div>
  );
}

/* =========================================================
   FLIP CARD
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
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 60, easing: "ease-out" });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
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

          {/* 3D Flip Cards */}
          <div className="ed-cards-grid">
            {CARDS.map((card, i) => (
              <FlipCard key={card.label} {...card} delay={i * 80} />
            ))}
          </div>

          {/* Animated Stats Bar */}
          <div className="ed-stats-bar" ref={statsRef} data-aos="fade-up">
            {STATS.map((s) => (
              <StatItem
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                trigger={statsVisible}
              />
            ))}
          </div>

          {/* Lower two-column section */}
          <div className="ed-lower">

            {/* Left: Timeline */}
            <div data-aos="fade-right" data-aos-delay="80">
              <h3 className="ed-timeline-title">Programme <span>Timeline</span></h3>
              <div className="ed-timeline-divider">
                <span className="ed-divider-line" />
                <span className="ed-divider-diamond" />
                <span className="ed-divider-line" />
              </div>
              <div className="ed-timeline">
                <span className="ed-timeline-pulse" />
                {TIMELINE.map((item, i) => (
                  <div
                    className="ed-timeline-item"
                    key={item.phase}
                    data-aos="fade-right"
                    data-aos-delay={120 + i * 100}
                  >
                    <span className="ed-timeline-node" />
                    <div className="ed-timeline-card">
                      <span className={`ed-tl-status ${item.status}`}>
                        {item.status === "live" ? "live" : "upcoming"}
                      </span>
                      <p className="ed-tl-phase">
                        <span className="ed-tl-phase-bar" />
                        {item.phase}
                      </p>
                      <h4 className="ed-tl-title">{item.title}</h4>
                      <p className="ed-tl-date">{item.date}</p>
                      <p className="ed-tl-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Venue + CTA */}
            <div className="ed-cta-panel" data-aos="fade-left" data-aos-delay="160">

              {/* Venue panel */}
              <div className="ed-venue-panel">
                <p className="ed-venue-name">College of Engineering <span>Chengannur</span></p>
                <p className="ed-venue-address">
                  Chengannur — 689121<br />
                  Alappuzha District, Kerala, India
                </p>
                <div className="ed-map-frame">
                  <iframe
                    src="https://maps.google.com/maps?q=College%20of%20Engineering%20Chengannur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    title="College of Engineering Chengannur Google Map"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <a
                  href="https://maps.google.com/?q=College+of+Engineering+Chengannur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-map-link-btn"
                >
                  Open in Google Maps &rarr;
                </a>
              </div>

              {/* Registration fee */}
              <div className="ed-cta-box">
                <p className="ed-cta-box-label">Registration Fee</p>
                <p className="ed-cta-box-val">Rs. 300 per participant</p>
                <p className="ed-cta-box-sub">
                  Includes full programme access, resource material,
                  placement support and ISQIP 26 certificate.
                </p>
              </div>

              {/* Eligibility */}
              <div className="ed-cta-box">
                <p className="ed-cta-box-label">Eligibility</p>
                <p className="ed-cta-box-val">All CEC Students (S1 – S8)</p>
                <p className="ed-cta-box-sub">
                  CSE, ECE and EEE tracks available. Final-year students encouraged to register early.
                </p>
              </div>

              {/* CTA Button */}
              <button
                className="ed-register-btn"
                onClick={() =>
                  window.open("https://forms.gle/placeholder", "_blank", "noopener")
                }
              >
                Register Now
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
