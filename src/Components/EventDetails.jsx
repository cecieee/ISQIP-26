import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Wifi,
  Radio,
  CreditCard,
  ChevronRight,
  Navigation,
  ExternalLink,
  Terminal,
  Train,
  ShieldAlert,
  Sparkles,
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
     LOWER SECTION: SCHEDULE & VENUE
     ========================================================= */
  .ed-lower-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: clamp(2.5rem, 5vw, 4.5rem);
    align-items: start;
  }

  @media (max-width: 1024px) {
    .ed-lower-grid {
      grid-template-columns: 1fr;
      gap: 3.5rem;
    }
  }

  /* Subheading */
  .ed-subheading-wrap {
    margin-bottom: clamp(1.5rem, 3vw, 2.2rem);
  }

  .ed-subheading-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(12, 230, 68, 0.65);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.35rem;
  }

  .ed-subheading {
    font-family: var(--font-mech);
    font-size: clamp(1.4rem, 3.2vw, 1.9rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin: 0;
    line-height: 1.15;
  }

  .ed-subheading span { color: var(--color-primary); }

  /* ── SCHEDULE TIMELINE MATRIX ────────────────────────── */
  .ed-schedule-container {
    position: relative;
    padding-left: clamp(1.5rem, 3vw, 2.2rem);
  }

  .ed-schedule-container::before {
    content: "";
    position: absolute;
    top: 14px;
    bottom: 20px;
    left: 7px;
    width: 2px;
    background: linear-gradient(
      180deg,
      rgba(12, 230, 68, 0.7) 0%,
      rgba(12, 230, 68, 0.3) 50%,
      rgba(12, 230, 68, 0.7) 100%
    );
    box-shadow: 0 0 8px rgba(12, 230, 68, 0.3);
  }

  .ed-schedule-pulse {
    position: absolute;
    left: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 10px 3px rgba(12, 230, 68, 0.75);
    animation: ed-rail-pulse 8s ease-in-out infinite;
    pointer-events: none;
    z-index: 3;
  }

  @keyframes ed-rail-pulse {
    0%   { top: 2%; opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { top: 96%; opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ed-schedule-pulse { animation: none; opacity: 0; }
  }

  .ed-phase-node {
    position: relative;
    margin-bottom: clamp(1.4rem, 2.5vw, 1.8rem);
  }

  .ed-phase-node:last-child {
    margin-bottom: 0;
  }

  .ed-phase-pin {
    position: absolute;
    left: calc(-1 * clamp(1.5rem, 3vw, 2.2rem) + 2px);
    top: 18px;
    width: 12px;
    height: 12px;
    background: var(--color-background);
    border: 2px solid var(--color-primary);
    transform: rotate(45deg);
    box-shadow: 0 0 8px 2px rgba(12, 230, 68, 0.45);
    transition: all 0.3s ease;
    z-index: 2;
  }

  .ed-phase-node:hover .ed-phase-pin {
    background: var(--color-primary);
    box-shadow: 0 0 16px 4px rgba(12, 230, 68, 0.8);
    transform: rotate(45deg) scale(1.15);
  }

  .ed-phase-card {
    background: rgba(6, 14, 12, 0.9);
    border: 1px solid rgba(12, 230, 68, 0.24);
    padding: clamp(1.1rem, 2.2vw, 1.5rem);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .ed-phase-card:hover {
    border-color: rgba(12, 230, 68, 0.6);
    background: rgba(12, 230, 68, 0.04);
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(12, 230, 68, 0.08);
  }

  .ed-phase-card::before {
    content: "";
    position: absolute;
    bottom: -1px; right: -1px;
    width: 16px; height: 16px;
    border-bottom: 2px solid rgba(12, 230, 68, 0.5);
    border-right: 2px solid rgba(12, 230, 68, 0.5);
    pointer-events: none;
    transition: width 0.3s, height 0.3s, border-color 0.3s;
  }

  .ed-phase-card:hover::before {
    width: 24px; height: 24px;
    border-color: var(--color-primary);
  }

  .ed-phase-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.7rem;
  }

  .ed-phase-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-primary);
    background: rgba(12, 230, 68, 0.08);
    border: 1px solid rgba(12, 230, 68, 0.3);
    padding: 0.2rem 0.55rem;
    border-radius: 2px;
  }

  .ed-phase-date {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: rgba(245, 247, 246, 0.75);
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .ed-phase-title {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.95rem, 1.8vw, 1.15rem);
    color: var(--color-text);
    letter-spacing: 0.02em;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
  }

  .ed-phase-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    color: rgba(245, 247, 246, 0.65);
    line-height: 1.55;
    margin: 0 0 0.85rem;
  }

  .ed-phase-sessions {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    border-top: 1px dashed rgba(12, 230, 68, 0.18);
    padding-top: 0.75rem;
  }

  .ed-session-row {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    font-size: 0.78rem;
    line-height: 1.45;
  }

  .ed-session-time {
    font-family: 'Share Tech Mono', monospace;
    color: var(--color-primary);
    font-size: 0.68rem;
    white-space: nowrap;
    background: rgba(12, 230, 68, 0.05);
    border: 1px solid rgba(12, 230, 68, 0.2);
    padding: 0.1rem 0.4rem;
    border-radius: 2px;
    min-width: 90px;
    text-align: center;
    flex-shrink: 0;
  }

  .ed-session-text {
    font-family: 'Inter', sans-serif;
    color: rgba(245, 247, 246, 0.8);
    margin: 0;
    flex: 1;
  }

  /* ── REDESIGNED: VENUE CONSOLE ─────────────────────────── */
  .ed-venue-console {
    display: flex;
    flex-direction: column;
  }

  .ed-venue-panel {
    background: rgba(6, 14, 12, 0.85);
    border: 1px solid rgba(12, 230, 68, 0.25);
    padding: clamp(1.4rem, 2.5vw, 1.85rem);
    position: relative;
    overflow: hidden;
  }

  .ed-venue-panel::before {
    content: "";
    position: absolute;
    top: -1px; left: -1px;
    width: 18px; height: 18px;
    border-top: 2px solid var(--color-primary);
    border-left: 2px solid var(--color-primary);
    pointer-events: none;
  }

  .ed-venue-panel::after {
    content: "";
    position: absolute;
    bottom: -1px; right: -1px;
    width: 18px; height: 18px;
    border-bottom: 2px solid var(--color-primary);
    border-right: 2px solid var(--color-primary);
    pointer-events: none;
  }

  .ed-venue-meta-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
  }

  .ed-venue-status-chip {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: var(--color-primary);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .ed-venue-coords {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(245, 247, 246, 0.45);
    letter-spacing: 0.08em;
  }

  .ed-venue-name {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1.15rem, 2.2vw, 1.45rem);
    color: var(--color-text);
    text-transform: uppercase;
    margin: 0 0 0.3rem;
    line-height: 1.25;
    letter-spacing: 0.02em;
  }

  .ed-venue-name span {
    color: var(--color-primary);
  }

  .ed-venue-host {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: rgba(12, 230, 68, 0.85);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 1.2rem;
  }

  /* Custom Cyberpunk Dark Map Frame */
  .ed-map-frame {
    position: relative;
    height: clamp(180px, 20vw, 210px);
    border: 1px solid rgba(12, 230, 68, 0.3);
    border-radius: 2px;
    overflow: hidden;
    background: #071110;
    margin-bottom: 1.35rem;
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

  /* Location Info Rows */
  .ed-location-details {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 1.35rem;
    border-top: 1px solid rgba(12, 230, 68, 0.12);
    padding-top: 1rem;
  }

  .ed-loc-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .ed-loc-icon {
    color: var(--color-primary);
    margin-top: 2px;
    flex-shrink: 0;
  }

  .ed-loc-content {
    flex: 1;
  }

  .ed-loc-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.64rem;
    color: rgba(12, 230, 68, 0.7);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 0.15rem;
  }

  .ed-loc-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    color: rgba(245, 247, 246, 0.82);
    line-height: 1.45;
    margin: 0;
  }

  /* Terminal Attendance Note */
  .ed-venue-notice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(12, 230, 68, 0.9);
    background: rgba(12, 230, 68, 0.05);
    border-left: 2px solid var(--color-primary);
    padding: 0.6rem 0.85rem;
    margin-bottom: 1.35rem;
    line-height: 1.45;
    letter-spacing: 0.03em;
  }

  .ed-venue-notice-icon {
    flex-shrink: 0;
    color: var(--color-primary);
  }

  /* Action Buttons Group */
  .ed-venue-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .ed-map-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    width: 100%;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-primary);
    background: rgba(12, 230, 68, 0.06);
    border: 1px solid rgba(12, 230, 68, 0.32);
    padding: 0.75rem 1.2rem;
    text-decoration: none;
    transition: all 0.25s ease;
  }

  .ed-map-btn:hover {
    background: rgba(12, 230, 68, 0.15);
    border-color: var(--color-primary);
    color: #14ff5a;
  }

  /* Cyber CTA Register Button */
  .ed-register-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.95rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--color-background);
    background: var(--color-primary);
    border: none;
    padding: 1rem 2rem;
    cursor: pointer;
    overflow: hidden;
    width: 100%;
    transition: all 0.25s ease;
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    box-shadow: 0 0 20px rgba(12, 230, 68, 0.4);
  }

  .ed-register-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  .ed-register-btn:hover::before {
    transform: translateX(100%);
  }

  .ed-register-btn:hover {
    background: #14ff5a;
    box-shadow: 0 0 32px rgba(12, 230, 68, 0.75), 0 0 70px rgba(12, 230, 68, 0.3);
    transform: translateY(-2px);
  }

  .ed-register-btn:active {
    transform: translateY(0);
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

// 4-Phase Curriculum & Timeline (Authentic ISQIP Architecture)
const SCHEDULE_PHASES = [
  {
    phase: "Phase 01 // Domain Immersion",
    day: "Day 01 — Saturday",
    date: "Sep 19, 2026",
    title: "Inauguration & Core Domain Foundations",
    desc: "Grand opening address followed by stream-wise domain segregation and deep architectural fundamentals.",
    sessions: [
      { time: "09:00 AM", text: "Inauguration & Keynote Address by Industry Experts" },
      { time: "10:00 AM – 01:00 PM", text: "Domain Track 1: CS (Systems & Web), EC (VLSI/Embedded), EEE (Power & IoT)" },
      { time: "02:00 PM – 05:00 PM", text: "Hands-on Workshop: Environment Setup & Toolchain Deployment" },
    ],
  },
  {
    phase: "Phase 02 // Hands-on Build",
    day: "Day 02 — Sunday",
    date: "Sep 20, 2026",
    title: "Practical Engineering & Real-World Build Sprint",
    desc: "Intensive practical laboratories focusing on enterprise problem statements and hardware-software integration.",
    sessions: [
      { time: "09:30 AM – 01:00 PM", text: "Advanced Track Projects: Real-time Data Pipelines, Embedded Firmware & Circuit Design" },
      { time: "02:00 PM – 04:30 PM", text: "Mentored Hack Sprint & Live Code / Schematic Reviews" },
      { time: "04:30 PM – 05:00 PM", text: "Milestone Assessment & Debugging Circle" },
    ],
  },
  {
    phase: "Phase 03 // Career Acceleration",
    day: "Day 03 — Saturday",
    date: "Sep 26, 2026",
    title: "Professional Skills & Placement Readiness",
    desc: "Empowering engineering students with high-yield career preparation, ATS resume engineering, and aptitude skills.",
    sessions: [
      { time: "09:00 AM – 11:00 AM", text: "Resume Engineering & Professional LinkedIn Profile Optimization" },
      { time: "11:15 AM – 01:00 PM", text: "Aptitude Training & Logical Reasoning Masterclass" },
      { time: "02:00 PM – 05:00 PM", text: "Group Discussion (GD) Simulations & Corporate Communication Tactics" },
    ],
  },
  {
    phase: "Phase 04 // Evaluation & Finale",
    day: "Day 04 — Sunday",
    date: "Sep 27, 2026",
    title: "Mock Interview Drives & Valedictory Ceremony",
    desc: "Personalized technical & HR interview panels, capstone project evaluation, awards, and certificate distribution.",
    sessions: [
      { time: "09:30 AM – 01:00 PM", text: "1-on-1 Technical & HR Mock Panel Interviews with Corporate Leaders" },
      { time: "02:00 PM – 03:45 PM", text: "Capstone Project Demonstrations & Peer Reviews" },
      { time: "04:00 PM – 05:00 PM", text: "Valedictory Ceremony, Award Announcements & Certificate Distribution" },
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

          {/* Lower Section: Programme Schedule & Venue Console */}
          <div className="ed-lower-grid">

            {/* Left Column: Programme Schedule Matrix */}
            <div data-aos="fade-right" data-aos-delay="80">
              <div className="ed-subheading-wrap">
                <span className="ed-subheading-tag">// CURRICULUM_MATRIX</span>
                <h3 className="ed-subheading">
                  Programme <span>Schedule</span>
                </h3>
              </div>

              <div className="ed-schedule-container">
                <span className="ed-schedule-pulse" />

                {SCHEDULE_PHASES.map((phaseItem, index) => (
                  <div
                    className="ed-phase-node"
                    key={phaseItem.phase}
                    data-aos="fade-right"
                    data-aos-delay={100 + index * 80}
                  >
                    <span className="ed-phase-pin" />
                    <div className="ed-phase-card">
                      <div className="ed-phase-meta">
                        <span className="ed-phase-badge">
                          <Terminal size={12} />
                          {phaseItem.phase}
                        </span>
                        <span className="ed-phase-date">
                          <Clock size={13} color="var(--color-primary)" />
                          {phaseItem.day}
                        </span>
                      </div>

                      <h4 className="ed-phase-title">{phaseItem.title}</h4>
                      <p className="ed-phase-desc">{phaseItem.desc}</p>

                      <div className="ed-phase-sessions">
                        {phaseItem.sessions.map((session, sIdx) => (
                          <div className="ed-session-row" key={sIdx}>
                            <span className="ed-session-time">{session.time}</span>
                            <p className="ed-session-text">{session.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Venue */}
            <div className="ed-venue-console" data-aos="fade-left" data-aos-delay="140">
              <div className="ed-subheading-wrap">
                <span className="ed-subheading-tag">// BASE_LOCATION</span>
                <h3 className="ed-subheading">Venue</h3>
              </div>

              {/* Redesigned Venue Console Panel */}
              <div className="ed-venue-panel">
                <div className="ed-venue-meta-top">
                  <span className="ed-venue-status-chip">// HOST_CAMPUS</span>
                  <span className="ed-venue-coords">09°19&apos;N 76°37&apos;E</span>
                </div>

                <h4 className="ed-venue-name">
                  College of Engineering <span>Chengannur</span>
                </h4>
                <p className="ed-venue-host">
                  IEEE Student Branch CEC // Alappuzha, Kerala
                </p>

                {/* Cyberpunk Map Frame */}
                <div className="ed-map-frame">
                  <iframe
                    src="https://maps.google.com/maps?q=College%20of%20Engineering%20Chengannur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    title="College of Engineering Chengannur Google Map"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>

                {/* Clean Location & Access Breakdown */}
                <div className="ed-location-details">
                  <div className="ed-loc-row">
                    <MapPin className="ed-loc-icon" size={16} />
                    <div className="ed-loc-content">
                      <p className="ed-loc-title">Campus Address</p>
                      <p className="ed-loc-text">
                        College of Engineering Chengannur, SH1, Chengannur, Kerala 689121
                      </p>
                    </div>
                  </div>

                  <div className="ed-loc-row">
                    <Train className="ed-loc-icon" size={16} />
                    <div className="ed-loc-content">
                      <p className="ed-loc-title">Transit Connectivity</p>
                      <p className="ed-loc-text">
                        1.5 km from Chengannur Railway Station (CNGR) &amp; KSRTC Bus Station
                      </p>
                    </div>
                  </div>

                  <div className="ed-loc-row">
                    <Clock className="ed-loc-icon" size={16} />
                    <div className="ed-loc-content">
                      <p className="ed-loc-title">Mode &amp; Timings</p>
                      <p className="ed-loc-text">
                        100% Offline (On Campus) &bull; 09:00 AM – 05:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mandatory Attendance Directive Notice */}
                <div className="ed-venue-notice">
                  <ShieldAlert className="ed-venue-notice-icon" size={15} />
                  <span>
                    Mandatory 100% attendance on all 4 training days is required for IEEE SB CEC certificate validation.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="ed-venue-actions">
                  <a
                    href="https://maps.google.com/?q=College+of+Engineering+Chengannur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-map-btn"
                  >
                    <Navigation size={14} />
                    Open in Google Maps
                    <ExternalLink size={13} />
                  </a>

                  <button
                    className="ed-register-btn"
                    onClick={() =>
                      window.open("https://forms.gle/placeholder", "_blank", "noopener")
                    }
                  >
                    Register for ISQIP &apos;26
                    <ChevronRight size={19} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}
