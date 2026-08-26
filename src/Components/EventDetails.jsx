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
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap");

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
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: clamp(1rem, 2.5vw, 1.4rem);
    margin-bottom: clamp(3.5rem, 7vw, 5.5rem);
  }

  .ed-card-wrap {
    perspective: 900px;
    cursor: pointer;
    min-height: 220px;
  }

  .ed-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 220px;
    transform-style: preserve-3d;
    transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .ed-card-wrap:hover .ed-card-inner,
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
    background: rgba(6,14,12,0.96);
    border: 1px solid rgba(12,230,68,0.28);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem 1.5rem;
    text-align: center;
    overflow: hidden;
  }

  /* 4-corner bracket marks — the thing that actually makes cards look designed */
  .ed-card-front::before,
  .ed-card-front::after,
  .ed-card-back::before,
  .ed-card-back::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    pointer-events: none;
    transition: width 0.3s, height 0.3s, opacity 0.3s;
  }

  /* top-left */
  .ed-card-front::before,
  .ed-card-back::before {
    top: -1px; left: -1px;
    border-top: 2px solid rgba(12,230,68,0.7);
    border-left: 2px solid rgba(12,230,68,0.7);
  }

  /* bottom-right */
  .ed-card-front::after,
  .ed-card-back::after {
    bottom: -1px; right: -1px;
    border-bottom: 2px solid rgba(12,230,68,0.7);
    border-right: 2px solid rgba(12,230,68,0.7);
  }

  .ed-card-wrap:hover .ed-card-front::before,
  .ed-card-wrap:hover .ed-card-front::after {
    width: 22px; height: 22px;
  }

  /* scan-sweep line on hover */
  .ed-card-front .ed-card-sweep {
    position: absolute;
    top: -100%;
    left: 0; right: 0;
    height: 60%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(12,230,68,0.04) 50%,
      transparent 100%
    );
    pointer-events: none;
    transition: top 0s;
  }

  .ed-card-wrap:hover .ed-card-front .ed-card-sweep {
    top: 120%;
    transition: top 0.6s ease-in;
  }

  /* ── FRONT ─────────────────────────────────────────── */

  /* radial glow behind icon */
  .ed-card-icon-glow {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
  }

  .ed-card-icon-glow::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(12,230,68,0.14) 0%, transparent 72%);
    border: 1px solid rgba(12,230,68,0.2);
  }

  .ed-card-icon {
    color: var(--color-primary);
    filter: drop-shadow(0 0 6px rgba(12,230,68,0.65));
    position: relative;
    z-index: 1;
  }

  .ed-card-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(12,230,68,0.5);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-card-value {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: clamp(0.88rem, 1.6vw, 1rem);
    color: var(--color-text);
    line-height: 1.4;
    margin: 0;
  }

  .ed-card-hint {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem;
    color: rgba(12,230,68,0.3);
    letter-spacing: 0.1em;
    position: absolute;
    bottom: 0.65rem;
    right: 0.8rem;
  }

  /* ── BACK ──────────────────────────────────────────── */
  .ed-card-back {
    transform: rotateY(180deg);
    border-color: rgba(12,230,68,0.5);
    background: rgba(6,14,12,0.96);
    gap: 0.6rem;
    padding: 1.75rem 1.5rem;
  }

  /* green radial bloom on back */
  .ed-card-back .ed-card-bloom {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 30%, rgba(12,230,68,0.08) 0%, transparent 65%);
    pointer-events: none;
  }

  .ed-card-back-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.58rem;
    color: rgba(12,230,68,0.45);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  .ed-card-back-title {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--color-primary);
    letter-spacing: 0.01em;
    margin: 0;
    line-height: 1.25;
    text-shadow: 0 0 14px rgba(12,230,68,0.35);
    position: relative;
    z-index: 1;
  }

  .ed-card-back-divider {
    width: 32px;
    height: 1px;
    background: rgba(12,230,68,0.35);
    position: relative;
    z-index: 1;
  }

  .ed-card-back-body {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    color: rgba(245,247,246,0.68);
    line-height: 1.65;
    margin: 0;
    max-width: 24ch;
    position: relative;
    z-index: 1;
  }

  .ed-card-back-hint {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem;
    color: rgba(12,230,68,0.3);
    letter-spacing: 0.1em;
    position: absolute;
    bottom: 0.65rem;
    right: 0.8rem;
  }


  /* Stats Bar */
  .ed-stats-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: clamp(1.5rem, 4vw, 3rem);
    border: 1px solid rgba(12,230,68,0.2);
    padding: clamp(1.5rem, 3.5vw, 2.25rem) clamp(1.5rem, 5vw, 3rem);
    margin-bottom: clamp(3.5rem, 7vw, 5.5rem);
    background: rgba(12,230,68,0.025);
    position: relative;
    overflow: hidden;
  }

  .ed-stats-bar::before {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(12,230,68,0.025) 4px,
      transparent 5px
    );
    pointer-events: none;
    animation: ed-scan 8s linear infinite;
  }

  @keyframes ed-scan {
    0% { background-position: 0 0; }
    100% { background-position: 0 40px; }
  }

  .ed-stats-bar::after {
    content: "";
    position: absolute;
    top: -1px; right: -1px;
    width: 60px; height: 60px;
    border-top: 1px solid rgba(12,230,68,0.35);
    border-right: 1px solid rgba(12,230,68,0.35);
    pointer-events: none;
  }

  .ed-stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    min-width: 110px;
    position: relative;
    z-index: 1;
  }

  .ed-stat-item + .ed-stat-item::before {
    content: "";
    position: absolute;
    left: calc(-1 * clamp(0.75rem, 2vw, 1.5rem));
    top: 15%;
    height: 70%;
    width: 1px;
    background: rgba(12,230,68,0.18);
  }

  .ed-stat-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    color: var(--color-primary);
    text-shadow:
      0 0 6px rgba(12,230,68,0.8),
      0 0 20px rgba(12,230,68,0.4);
    line-height: 1;
    margin: 0;
    font-variant-numeric: tabular-nums;
  }

  .ed-stat-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(245,247,246,0.45);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0;
    text-align: center;
  }

  /* Timeline */
  .ed-timeline-title {
    font-family: var(--font-mech);
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 clamp(2rem, 4vw, 3rem);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .ed-timeline-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(12,230,68,0.4), transparent);
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
    font-family: var(--font-mech);
    font-size: clamp(1.15rem, 2.5vw, 1.5rem);
    color: var(--color-primary);
    text-transform: uppercase;
    margin: 1.5rem 0 0.35rem;
    text-shadow: 0 0 12px rgba(12,230,68,0.5);
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
    height: clamp(140px, 18vw, 200px);
    border: 1px solid rgba(12,230,68,0.2);
    background:
      linear-gradient(rgba(12,230,68,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(12,230,68,0.04) 1px, transparent 1px),
      #071110;
    background-size: 24px 24px, 24px 24px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .ed-map-frame::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(12,230,68,0.09) 0%, transparent 65%);
    pointer-events: none;
  }

  .ed-crosshair {
    position: relative;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .ed-crosshair::before,
  .ed-crosshair::after {
    content: "";
    position: absolute;
    background: rgba(12,230,68,0.6);
  }

  .ed-crosshair::before {
    top: 50%; left: 0;
    transform: translateY(-50%);
    width: 100%; height: 1px;
  }

  .ed-crosshair::after {
    left: 50%; top: 0;
    transform: translateX(-50%);
    width: 1px; height: 100%;
  }

  .ed-crosshair-dot {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 10px 3px rgba(12,230,68,0.6);
    animation: ed-ping 2s ease-out infinite;
  }

  @keyframes ed-ping {
    0%  { box-shadow: 0 0 0 0 rgba(12,230,68,0.6); }
    70% { box-shadow: 0 0 0 16px rgba(12,230,68,0); }
    100%{ box-shadow: 0 0 0 0 rgba(12,230,68,0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .ed-crosshair-dot { animation: none; }
  }

  .ed-map-label {
    position: absolute;
    bottom: 0.6rem;
    right: 0.75rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(12,230,68,0.5);
    letter-spacing: 0.08em;
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

  /* Terminal footer bar */
  .ed-terminal-bar {
    margin-top: clamp(3rem, 5vw, 4rem);
    border-top: 1px solid rgba(12,230,68,0.15);
    padding-top: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(12,230,68,0.35);
    letter-spacing: 0.08em;
  }

  .ed-terminal-bar-blink {
    display: inline-block;
    width: 7px; height: 12px;
    background: rgba(12,230,68,0.4);
    animation: cursorBlink 1s steps(1) infinite;
    flex-shrink: 0;
  }
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
    bar: "78%",
  },
  {
    Icon: MapPin,
    label: "Venue",
    value: "CEC Main Campus, Chengannur",
    backTitle: "Campus",
    backBody: "College of Engineering Chengannur — fully on-campus, hands-on experience.",
    bar: "62%",
  },
  {
    Icon: Wifi,
    label: "Mode",
    value: "In-Person",
    backTitle: "Hybrid Option",
    backBody: "Select sessions available online for outstation participants.",
    bar: "45%",
  },
  {
    Icon: Clock,
    label: "Session Length",
    value: "3–4 Hrs / Session",
    backTitle: "Schedule",
    backBody: "Weekday evenings + Saturday mornings. No clash with academics.",
    bar: "55%",
  },
  {
    Icon: Users,
    label: "Eligibility",
    value: "S1 – S8, Any Branch",
    backTitle: "Who Can Join",
    backBody: "Open to all UG students of CEC. Final year students get priority.",
    bar: "90%",
  },
  {
    Icon: IndianRupee,
    label: "Registration Fee",
    value: "Rs. 300 / Person",
    backTitle: "What's Included",
    backBody: "Full programme access, resource kits, certificates & placement support.",
    bar: "70%",
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
    <div
      className={`ed-card-wrap${flipped ? " flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="ed-card-inner">

        {/* FRONT */}
        <div className="ed-card-front">
          <span className="ed-card-sweep" aria-hidden="true" />
          <div className="ed-card-icon-glow">
            <Icon className="ed-card-icon" size={22} strokeWidth={1.5} />
          </div>
          <p className="ed-card-label">{label}</p>
          <p className="ed-card-value">{value}</p>
          <span className="ed-card-hint">hover to flip</span>
        </div>

        {/* BACK */}
        <div className="ed-card-back">
          <span className="ed-card-bloom" aria-hidden="true" />
          <p className="ed-card-back-label">{label}</p>
          <p className="ed-card-back-title">{backTitle}</p>
          <div className="ed-card-back-divider" />
          <p className="ed-card-back-body">{backBody}</p>
          <span className="ed-card-back-hint">hover off to flip back</span>
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
              <h3 className="ed-timeline-title">Programme Timeline</h3>
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
                <p className="ed-venue-name">College of Engineering Chengannur</p>
                <p className="ed-venue-address">
                  Chengannur — 689121<br />
                  Alappuzha District, Kerala, India
                </p>
                <div
                  className="ed-map-frame"
                  title="View on Google Maps"
                  onClick={() =>
                    window.open(
                      "https://maps.google.com/?q=College+of+Engineering+Chengannur",
                      "_blank",
                      "noopener"
                    )
                  }
                >
                  <div className="ed-crosshair">
                    <span className="ed-crosshair-dot" />
                  </div>
                  <span className="ed-map-label">click to open maps</span>
                </div>
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

          {/* Terminal footer bar */}
          <div className="ed-terminal-bar" data-aos="fade-up" data-aos-delay="200">
            <span className="ed-terminal-bar-blink" />
            ISQIP_26 :: SESSION_DETAILS_LOADED :: IEEE_SB_CEC :: ALL_SYSTEMS_NOMINAL
          </div>

        </div>
      </section>
    </>
  );
}
