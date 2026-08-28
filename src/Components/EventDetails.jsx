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
  RotateCw,
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

  /* =========================================================
     MINIMAL TELEMETRY MATRIX (NON-CARD BESPOKE DESIGN)
     ========================================================= */
  .ed-matrix-wrap {
    margin-bottom: clamp(4rem, 8vw, 6rem);
    position: relative;
  }

  /* Unified Grid Frame */
  .ed-matrix-frame {
    background: #000000;
    border: 1px solid rgba(12, 230, 68, 0.25);
    border-radius: 4px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
    position: relative;
    overflow: hidden;
  }

  /* Seamless 6-Bay Matrix Grid */
  .ed-matrix-grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .ed-matrix-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .ed-matrix-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* Seamless Bay Cell */
  .ed-bay-cell {
    position: relative;
    min-height: 220px;
    perspective: 1200px;
    border-right: 1px solid rgba(12, 230, 68, 0.14);
    border-bottom: 1px solid rgba(12, 230, 68, 0.14);
    background: #000000;
  }

  @media (min-width: 1024px) {
    .ed-bay-cell:nth-child(3n) {
      border-right: none;
    }
    .ed-bay-cell:nth-child(n+4) {
      border-bottom: none;
    }
  }

  @media (min-width: 640px) and (max-width: 1023px) {
    .ed-bay-cell:nth-child(2n) {
      border-right: none;
    }
    .ed-bay-cell:nth-child(n+5) {
      border-bottom: none;
    }
  }

  @media (max-width: 639px) {
    .ed-bay-cell {
      border-right: none;
    }
    .ed-bay-cell:last-child {
      border-bottom: none;
    }
  }

  /* Interactive Flipper Wrapper */
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
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  @media (hover: hover) {
    .ed-bay-wrap:hover .ed-bay-inner {
      transform: rotateY(180deg);
    }
  }

  .ed-bay-wrap.is-flipped .ed-bay-inner {
    transform: rotateY(180deg);
  }

  /* Bay Front & Back Panels */
  .ed-bay-face {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    padding: 1.35rem 1.4rem 1.15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #000000;
  }

  /* Bay Header */
  .ed-bay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .ed-bay-tag-group {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .ed-bay-index {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: var(--color-primary);
    background: rgba(12, 230, 68, 0.08);
    border: 1px solid rgba(12, 230, 68, 0.25);
    padding: 0.1rem 0.35rem;
    border-radius: 2px;
  }

  .ed-bay-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: rgba(245, 247, 246, 0.6);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
  }

  .ed-bay-flip-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(12, 230, 68, 0.6);
    padding: 0.15rem 0.4rem;
    border: 1px solid rgba(12, 230, 68, 0.18);
    border-radius: 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
  }

  .ed-bay-wrap:hover .ed-bay-flip-trigger {
    color: var(--color-primary);
    border-color: rgba(12, 230, 68, 0.5);
    background: rgba(12, 230, 68, 0.08);
  }

  /* Bay Front Content */
  .ed-bay-content {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin: 0.75rem 0;
  }

  .ed-bay-icon-title-row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 0.15rem;
  }

  .ed-bay-icon {
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .ed-bay-val {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    color: var(--color-text);
    margin: 0;
    line-height: 1.25;
    letter-spacing: 0.02em;
  }

  .ed-bay-sub {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    color: rgba(245, 247, 246, 0.6);
    line-height: 1.4;
    margin: 0;
  }

  /* Bay Footer */
  .ed-bay-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(245, 247, 246, 0.06);
  }

  .ed-bay-status-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: rgba(12, 230, 68, 0.85);
  }

  .ed-bay-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 0 0 5px rgba(12, 230, 68, 0.7);
    animation: ed-blink 1.8s ease-in-out infinite;
  }

  .ed-bay-hint {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(245, 247, 246, 0.3);
    text-transform: uppercase;
  }

  /* Bay Back Face (Pure Solid Black Background) */
  .ed-bay-back {
    transform: rotateY(180deg);
    background: #000000;
  }

  .ed-bay-back-body {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    margin: 0.55rem 0;
  }

  .ed-bay-back-title {
    font-family: 'Bruno Ace', cursive;
    font-size: clamp(0.92rem, 1.2vw, 1.08rem);
    color: var(--color-primary);
    margin: 0;
    line-height: 1.25;
    letter-spacing: 0.02em;
  }

  .ed-bay-back-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: rgba(245, 247, 246, 0.78);
    line-height: 1.5;
    margin: 0;
  }

  .ed-bay-specs-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem 0.45rem;
    margin-top: 0.2rem;
  }

  .ed-bay-spec-chip {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(245, 247, 246, 0.8);
    background: #0a0a0a;
    border: 1px solid rgba(12, 230, 68, 0.2);
    padding: 0.15rem 0.4rem;
    border-radius: 2px;
    letter-spacing: 0.04em;
  }

  .ed-bay-back-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(245, 247, 246, 0.08);
  }

  .ed-bay-back-return {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    color: rgba(12, 230, 68, 0.7);
    text-transform: uppercase;
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
    index: "01",
    label: "TIMELINE",
    Icon: Calendar,
    frontVal: "Sep 15 – Oct 10",
    frontSub: "4-Week Cohort Schedule",
    statusPill: "26 Days Duration",
    backTitle: "4-Week Intensive",
    backDesc:
      "A fast-paced 4-week hybrid schedule blending core domain training, hands-on development sprints, and career readiness sessions.",
    chips: ["Weekend & Evenings", "No Academic Clash"],
  },
  {
    index: "02",
    label: "HOST CAMPUS",
    Icon: MapPin,
    frontVal: "CEC Main Campus",
    frontSub: "College of Engineering Chengannur",
    statusPill: "Chengannur, Kerala",
    backTitle: "Campus Facilities",
    backDesc:
      "Fully on-campus, hosted at College of Engineering Chengannur with access to department labs and seminar auditoriums.",
    chips: ["Hands-on Labs", "IEEE SB Host"],
  },
  {
    index: "03",
    label: "FORMAT",
    Icon: Radio,
    frontVal: "100% Offline",
    frontSub: "Hands-On In-Person Labs",
    statusPill: "Physical Attendance",
    backTitle: "On-Campus Experience",
    backDesc:
      "Zero virtual disconnects. Direct face-to-face mentorship, live debugging with industry trainers, and active peer collaboration.",
    chips: ["Live Mentorship", "Physical Cohort"],
  },
  {
    index: "04",
    label: "PACING",
    Icon: Clock,
    frontVal: "3–4 Hrs / Session",
    frontSub: "Optimized Study Schedule",
    statusPill: "Evenings & Saturdays",
    backTitle: "Curated Hours",
    backDesc:
      "Carefully structured around standard college hours — weekday evenings and Saturday mornings to prevent clashes with university academics.",
    chips: ["Zero Class Clash", "Structured Pace"],
  },
  {
    index: "05",
    label: "IEEE TRACK",
    Icon: Sparkles,
    frontVal: "Free • 60 Seats",
    frontSub: "Sponsored by IEEE SB CEC",
    statusPill: "100% Fee Waiver",
    backTitle: "IEEE Sponsored Seats",
    backDesc:
      "60 reserved seats with full tuition fee covered courtesy of IEEE Student Branch CEC. Exclusive benefit for active IEEE members.",
    chips: ["60 Reserved Seats", "IEEE CEC Sponsored"],
  },
  {
    index: "06",
    label: "OPEN TRACK",
    Icon: CreditCard,
    frontVal: "Paid • 60 Seats",
    frontSub: "Open to All Engineering Students",
    statusPill: "Direct Registration",
    backTitle: "General Admission",
    backDesc:
      "60 seats open for external & non-IEEE engineering students seeking comprehensive technical training and placement prep.",
    chips: ["60 Open Seats", "Universal Access"],
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
              <span className="ed-bay-flip-trigger">
                <RotateCw size={10} />
                Flip
              </span>
            </div>

            <div className="ed-bay-content">
              <div className="ed-bay-icon-title-row">
                <Icon className="ed-bay-icon" size={20} strokeWidth={1.75} />
                <h3 className="ed-bay-val">{frontVal}</h3>
              </div>
              <p className="ed-bay-sub">{frontSub}</p>
            </div>

            <div className="ed-bay-footer">
              <span className="ed-bay-status-tag">
                <span className="ed-bay-status-dot" />
                {statusPill}
              </span>
              <span className="ed-bay-hint">Hover / Click</span>
            </div>
          </div>

          {/* Back Bay Face */}
          <div className="ed-bay-face ed-bay-back">
            <div className="ed-bay-header">
              <div className="ed-bay-tag-group">
                <span className="ed-bay-index">{index}</span>
                <p className="ed-bay-label">{label}</p>
              </div>
              <span className="ed-bay-flip-trigger">
                <RotateCw size={10} />
                Back
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
              <span className="ed-bay-status-tag">
                <span className="ed-bay-status-dot" />
                {statusPill}
              </span>
              <span className="ed-bay-back-return">
                <RotateCw size={10} />
                Return
              </span>
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
              ISQIP '26
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

          {/* Minimal 6-Bay Matrix Grid (Non-card Layout) */}
          <div className="ed-matrix-wrap" data-aos="zoom-in" data-aos-delay="40">
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
