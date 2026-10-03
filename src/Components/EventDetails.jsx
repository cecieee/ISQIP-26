import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  CalendarDays,
  Building2,
  Cpu,
  Timer,
  Award,
  Users,
  ExternalLink,
  ChevronDown,
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
    perspective: 1200px;
    pointer-events: auto;
  }

  .ed-bay-inner {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 220px;
    transform-style: preserve-3d;
    transform-origin: center center;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
    will-change: transform;
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
    transition: border-color 0.3s ease;
  }

  .ed-bay-front {
    transform: rotateY(0deg);
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
    font-size: clamp(1.25rem, 3.5vw, 1.85rem);
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 0;
    line-height: 1.15;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .ed-subheading {
      font-size: clamp(1.15rem, 5.5vw, 1.45rem);
      letter-spacing: 0.015em;
      white-space: nowrap;
    }
  }

  @media (max-width: 380px) {
    .ed-subheading {
      font-size: clamp(1rem, 5vw, 1.15rem);
      letter-spacing: 0.01em;
      white-space: nowrap;
    }
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

  /* Final right-pane layout: contained, flexible, and overflow-safe */
  .ed-schedule-panel .ed-stack-hero {
    min-width: 0;
    overflow: hidden;
  }

  .ed-schedule-panel .ed-stack-hero-inner {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(8rem, 33.333%) minmax(0, 1fr);
    gap: 0;
    padding: 0;
    background: #000000;
  }

  .ed-schedule-panel .ed-hero-top-block {
    grid-column: 1;
    grid-row: 1 / span 2;
    min-width: 0;
    min-height: 0;
    padding: 1.25rem;
  }

  .ed-schedule-panel .ed-hero-status-badge {
    margin: 0.35rem 0 0;
    align-self: flex-start;
    color: rgba(7, 17, 16, 0.78);
    font-size: 0.58rem;
  }

  .ed-schedule-panel .ed-hero-status-pulse {
    background: #071110;
    box-shadow: none;
  }

  .ed-schedule-panel .ed-hero-anchor-group,
  .ed-schedule-panel .ed-hero-title-meta {
    min-width: 0;
    max-width: 100%;
  }

  .ed-schedule-panel .ed-hero-main-title {
    max-width: 100%;
    overflow-wrap: normal;
    white-space: nowrap;
  }

  .ed-schedule-panel .ed-hero-body-list {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 1.25rem 0.25rem;
    overflow: hidden;
  }

  .ed-schedule-panel .ed-hero-session-row {
    width: 100%;
    box-sizing: border-box;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: auto auto;
    min-width: 0;
    column-gap: 0.75rem;
    row-gap: 0.3rem;
    padding: 0.8rem 0;
  }

  .ed-schedule-panel .ed-hero-session-left {
    grid-column: 1;
    grid-row: 1;
    min-width: 0;
    max-width: 100%;
  }

  .ed-schedule-panel .ed-hero-session-name {
    min-width: 0;
    max-width: 100%;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .ed-schedule-panel .ed-hero-session-time {
    grid-column: 2;
    grid-row: 1;
    min-width: max-content;
    font-size: 0.72rem;
  }

  .ed-schedule-panel .ed-session-status {
    grid-column: 1;
    grid-row: 2;
    justify-self: start;
    min-width: 0;
    white-space: nowrap;
    text-align: left;
  }

  .ed-schedule-panel .ed-hero-footer-row {
    grid-column: 2;
    grid-row: 2;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.65rem 1.25rem 0.9rem;
    overflow: hidden;
  }

  .ed-schedule-panel .ed-day-switcher {
    min-width: 0;
    flex: 1 1 auto;
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: thin;
  }

  .ed-schedule-panel .ed-day-count {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  .ed-schedule-panel .ed-hero-expand-link {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-stack-hero-inner {
      display: flex;
      flex-direction: column;
    }

    .ed-schedule-panel .ed-hero-top-block,
    .ed-schedule-panel .ed-hero-body-list,
    .ed-schedule-panel .ed-hero-footer-row {
      width: 100%;
      box-sizing: border-box;
    }

    .ed-schedule-panel .ed-hero-top-block {
      padding: 1rem;
    }

    .ed-schedule-panel .ed-hero-body-list {
      padding: 0.85rem 1rem 0.25rem;
    }

    .ed-schedule-panel .ed-hero-footer-row {
      padding: 0.6rem 1rem 0.8rem;
    }
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

  .ed-schedule-row:hover,
  .ed-schedule-row.is-scrolled {
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

  .ed-schedule-row:hover .ed-row-index,
  .ed-schedule-row.is-scrolled .ed-row-index {
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

  .ed-schedule-row:hover .ed-row-session-dot,
  .ed-schedule-row.is-scrolled .ed-row-session-dot {
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

  /* ── EVENT CONSOLE REDESIGN ─────────────────────────── */
  .ed-event-panel {
    position: relative;
  }

  .ed-event-panel .ed-subheading-wrap {
    padding-left: 0.9rem;
    border-left: 2px solid var(--color-primary);
  }

  .ed-event-panel .ed-subheading-tag {
    color: rgba(12, 230, 68, 0.65);
  }

  .ed-event-panel .ed-stack-collapsed {
    padding: 0;
  }

  .ed-event-panel .ed-stack-depth {
    display: none;
  }

  .ed-event-panel .ed-stack-hero,
  .ed-event-panel .ed-schedule-expanded {
    border-radius: 2px;
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.36);
  }

  .ed-event-panel .ed-stack-hero-inner {
    padding: 1.4rem;
  }

  .ed-schedule-panel .ed-stack-hero,
  .ed-schedule-panel .ed-schedule-expanded {
    border-top: 2px solid var(--color-primary);
    background:
      linear-gradient(90deg, rgba(12, 230, 68, 0.07) 1px, transparent 1px),
      linear-gradient(rgba(12, 230, 68, 0.04) 1px, transparent 1px),
      #09130e;
    background-size: 28px 28px;
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    color: var(--color-background);
    background: var(--color-primary);
    padding: 0.72rem 0.8rem;
    min-width: 3.4rem;
    text-align: center;
    letter-spacing: 0;
    border-radius: 2px;
  }

  .ed-schedule-panel .ed-hero-anchor-divider {
    height: 46px;
    background: rgba(12, 230, 68, 0.35);
  }

  .ed-schedule-panel .ed-hero-session-row {
    border-left: 2px solid rgba(12, 230, 68, 0.35);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.22);
  }

  .ed-venue-panel .ed-stack-hero,
  .ed-venue-panel .ed-schedule-expanded {
    border-top: 2px solid rgba(245, 247, 246, 0.65);
    background: linear-gradient(145deg, #151d19 0%, #090e0c 72%);
  }

  .ed-venue-panel .ed-hero-big-anchor {
    color: var(--color-text);
    border: 1px solid rgba(245, 247, 246, 0.3);
    background: rgba(255, 255, 255, 0.06);
    padding: 0.72rem 0.65rem;
    min-width: 3.8rem;
    text-align: center;
    letter-spacing: 0.04em;
    border-radius: 2px;
  }

  .ed-venue-panel .ed-hero-session-row {
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.055);
  }

  .ed-venue-panel .ed-map-frame {
    border-radius: 2px;
    border-color: rgba(245, 247, 246, 0.24);
  }

  .ed-venue-panel .ed-map-btn {
    color: var(--color-text);
    border-color: rgba(245, 247, 246, 0.3);
    background: rgba(255, 255, 255, 0.07);
  }

  .ed-venue-panel .ed-map-btn:hover {
    color: var(--color-background);
    background: var(--color-text);
  }

  @media (max-width: 640px) {
    .ed-event-panel .ed-hero-top-block {
      align-items: flex-start;
    }

    .ed-event-panel .ed-hero-status-badge {
      font-size: 0.62rem;
    }
  }

  /* Calendar ticket variation for the schedule preview */
  .ed-schedule-panel .ed-stack-hero,
  .ed-schedule-panel .ed-schedule-expanded {
    background: #0b100d;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-top: 0;
    border-radius: 10px;
    box-shadow: 0 20px 42px rgba(0, 0, 0, 0.38);
  }

  .ed-schedule-panel .ed-stack-hero::before {
    content: "SCHEDULE / 2026";
    display: block;
    padding: 0.65rem 1.4rem;
    color: rgba(12, 230, 68, 0.7);
    background: rgba(12, 230, 68, 0.08);
    border-bottom: 1px solid rgba(12, 230, 68, 0.18);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
  }

  .ed-schedule-panel .ed-stack-hero-inner {
    padding: 1.35rem 1.4rem 1.15rem;
    gap: 1.25rem;
  }

  .ed-schedule-panel .ed-hero-top-block {
    align-items: stretch;
  }

  .ed-schedule-panel .ed-hero-anchor-group {
    display: grid;
    grid-template-columns: 82px minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 74px;
    min-width: 0;
    padding: 0.5rem;
    color: #071110;
    background: var(--color-primary);
    border-radius: 8px;
    font-size: 2.25rem;
    letter-spacing: -0.06em;
  }

  .ed-schedule-panel .ed-hero-anchor-divider {
    display: none;
  }

  .ed-schedule-panel .ed-hero-title-meta {
    gap: 0.45rem;
  }

  .ed-schedule-panel .ed-hero-main-title {
    font-size: clamp(1.05rem, 1.8vw, 1.35rem);
  }

  .ed-schedule-panel .ed-hero-sub-meta {
    font-size: 0.66rem;
    line-height: 1.5;
  }

  .ed-schedule-panel .ed-hero-status-badge {
    align-self: flex-start;
    padding-top: 0.25rem;
    font-size: 0.62rem;
  }

  .ed-schedule-panel .ed-hero-body-list {
    gap: 0;
    margin-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ed-schedule-panel .ed-hero-session-row {
    min-height: 2.8rem;
    padding: 0.6rem 0.15rem;
    border-left: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0;
    background: transparent;
  }

  .ed-schedule-panel .ed-hero-session-idx {
    width: 1.7rem;
    color: var(--color-primary);
    font-size: 0.6rem;
  }

  .ed-schedule-panel .ed-hero-session-name {
    font-size: 0.8rem;
  }

  .ed-schedule-panel .ed-hero-session-time {
    color: rgba(245, 247, 246, 0.55);
    font-size: 0.6rem;
  }

  .ed-schedule-panel .ed-hero-footer-row {
    padding-top: 0.2rem;
    border-top: 0;
  }

  @media (max-width: 480px) {
    .ed-schedule-panel .ed-hero-anchor-group {
      grid-template-columns: 64px minmax(0, 1fr);
      gap: 0.75rem;
    }

    .ed-schedule-panel .ed-hero-big-anchor {
      min-height: 62px;
      font-size: 1.8rem;
    }

    .ed-schedule-panel .ed-hero-status-badge {
      display: none;
    }
  }

  /* Minimal editorial variation */
  .ed-event-panel .ed-subheading-wrap {
    padding-left: 0;
    border-left: 0;
  }

  .ed-event-panel .ed-subheading-tag {
    color: rgba(245, 247, 246, 0.42);
    font-family: 'Inter', sans-serif;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
  }

  .ed-event-panel .ed-stack-hero,
  .ed-event-panel .ed-schedule-expanded {
    background: #0b110e;
    border: 1px solid rgba(245, 247, 246, 0.16);
    border-radius: 0;
    box-shadow: none;
  }

  .ed-event-panel .ed-stack-hero::before {
    display: none;
  }

  .ed-event-panel .ed-stack-hero-inner {
    padding: clamp(1.15rem, 3vw, 1.6rem);
    gap: 1.3rem;
  }

  .ed-schedule-panel .ed-hero-big-anchor,
  .ed-venue-panel .ed-hero-big-anchor {
    color: var(--color-text);
    background: transparent;
    border: 0;
    border-bottom: 2px solid var(--color-primary);
    border-radius: 0;
    padding: 0.1rem 0 0.45rem;
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    font-size: 2.45rem;
  }

  .ed-venue-panel .ed-hero-big-anchor {
    font-size: 1.4rem;
    letter-spacing: 0;
  }

  .ed-event-panel .ed-hero-main-title {
    font-size: 1.05rem;
    font-weight: 600;
  }

  .ed-event-panel .ed-hero-sub-meta {
    font-size: 0.64rem;
    color: rgba(245, 247, 246, 0.52);
  }

  .ed-event-panel .ed-hero-session-row {
    padding: 0.7rem 0;
    border: 0;
    border-top: 1px solid rgba(245, 247, 246, 0.1);
    border-radius: 0;
    background: transparent;
  }

  .ed-event-panel .ed-hero-session-name {
    color: rgba(245, 247, 246, 0.9);
  }

  .ed-event-panel .ed-hero-footer-row {
    border-top: 1px solid rgba(245, 247, 246, 0.1);
    padding-top: 1rem;
  }

  .ed-event-panel .ed-hero-expand-link {
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
  }

  .ed-venue-panel .ed-map-frame {
    border-color: rgba(245, 247, 246, 0.16);
    border-radius: 0;
  }

  .ed-venue-panel .ed-map-btn {
    border-radius: 0;
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
  }

  /* Two-column dossier layout for schedule and venue */
  .ed-schedule-panel .ed-stack-hero-inner > div:first-child {
    display: grid !important;
    grid-template-columns: minmax(0, 0.9fr) minmax(150px, 1.1fr);
    gap: 1.3rem;
  }

  .ed-schedule-panel .ed-hero-top-block {
    grid-column: 1;
    display: block;
  }

  .ed-schedule-panel .ed-hero-anchor-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    min-height: 0;
    min-width: 0;
    padding: 0;
    border: 0;
    font-size: clamp(3.4rem, 7vw, 5rem);
    line-height: 0.85;
    background: transparent;
  }

  .ed-schedule-panel .ed-hero-title-meta {
    padding-top: 0.75rem;
    border-top: 1px solid rgba(12, 230, 68, 0.35);
  }

  .ed-schedule-panel .ed-hero-body-list {
    grid-column: 2;
    align-self: center;
    margin: 0;
  }

  .ed-schedule-panel .ed-hero-footer-row {
    grid-column: 1 / -1;
  }

  .ed-venue-panel .ed-stack-hero-inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(150px, 0.9fr);
    gap: 1.25rem;
  }

  .ed-venue-panel .ed-hero-top-block {
    grid-column: 1 / -1;
  }

  .ed-venue-panel .ed-hero-body-list {
    grid-column: 1;
    align-self: center;
  }

  .ed-venue-panel .ed-hero-footer-row {
    grid-column: 1 / -1;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-stack-hero-inner > div:first-child,
    .ed-venue-panel .ed-stack-hero-inner {
      display: flex !important;
      flex-direction: column;
      gap: 1.15rem;
    }

    .ed-schedule-panel .ed-hero-body-list,
    .ed-venue-panel .ed-hero-body-list {
      align-self: stretch;
    }

    .ed-schedule-panel .ed-hero-big-anchor {
      font-size: 3.5rem;
    }
  }

  /* Split-rail layout variation */
  .ed-schedule-panel .ed-stack-hero-inner > div:first-child {
    display: grid !important;
    grid-template-columns: 7rem minmax(0, 1fr);
    column-gap: 1.25rem;
    row-gap: 1.25rem;
  }

  .ed-schedule-panel .ed-hero-top-block {
    grid-column: 1;
    display: block;
  }

  .ed-schedule-panel .ed-hero-anchor-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.65rem;
    padding-right: 1rem;
    border-right: 1px solid rgba(12, 230, 68, 0.25);
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    font-size: 3.8rem;
    line-height: 0.8;
    color: var(--color-primary);
    border: 0;
  }

  .ed-schedule-panel .ed-hero-title-meta {
    padding-top: 0.65rem;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .ed-schedule-panel .ed-hero-main-title {
    font-size: 0.8rem;
    line-height: 1.25;
  }

  .ed-schedule-panel .ed-hero-sub-meta {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.57rem;
    line-height: 1.45;
  }

  .ed-schedule-panel .ed-hero-status-badge {
    margin-top: 0.9rem;
    font-size: 0.56rem;
  }

  .ed-schedule-panel .ed-hero-body-list {
    grid-column: 2;
    align-self: center;
  }

  .ed-schedule-panel .ed-hero-footer-row {
    grid-column: 1 / -1;
  }

  .ed-venue-panel .ed-stack-hero-inner {
    display: grid;
    grid-template-columns: 8rem minmax(0, 1fr);
    column-gap: 1.25rem;
    row-gap: 1.2rem;
  }

  .ed-venue-panel .ed-hero-top-block {
    grid-column: 1;
    display: block;
  }

  .ed-venue-panel .ed-hero-anchor-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
    padding-right: 1rem;
    border-right: 1px solid rgba(245, 247, 246, 0.18);
  }

  .ed-venue-panel .ed-hero-big-anchor {
    font-size: 1.25rem;
    line-height: 1;
    padding: 0;
    border: 0;
  }

  .ed-venue-panel .ed-hero-anchor-divider {
    display: none;
  }

  .ed-venue-panel .ed-hero-title-meta {
    padding-top: 0.7rem;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .ed-venue-panel .ed-hero-main-title {
    font-size: 0.78rem;
  }

  .ed-venue-panel .ed-hero-sub-meta {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.56rem;
    line-height: 1.45;
  }

  .ed-venue-panel .ed-hero-status-badge {
    margin-top: 0.9rem;
    font-size: 0.56rem;
  }

  .ed-venue-panel .ed-hero-body-list {
    grid-column: 2;
    align-self: center;
  }

  .ed-venue-panel .ed-hero-footer-row {
    grid-column: 1 / -1;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-stack-hero-inner > div:first-child,
    .ed-venue-panel .ed-stack-hero-inner {
      display: flex !important;
      flex-direction: column;
      gap: 1.15rem;
    }

    .ed-schedule-panel .ed-hero-anchor-group,
    .ed-venue-panel .ed-hero-anchor-group {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      border-right: 0;
      padding-right: 0;
    }

    .ed-schedule-panel .ed-hero-status-badge,
    .ed-venue-panel .ed-hero-status-badge {
      margin-top: 0;
    }

    .ed-schedule-panel .ed-hero-body-list,
    .ed-venue-panel .ed-hero-body-list {
      align-self: stretch;
    }
  }

  /* Floating slate variation */
  .ed-event-panel .ed-stack-hero,
  .ed-event-panel .ed-schedule-expanded {
    border: 0;
    border-radius: 18px;
    background: linear-gradient(145deg, #14251b, #09100c 68%);
    box-shadow: 0 22px 50px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.07);
  }

  .ed-event-panel .ed-stack-hero-inner {
    padding: 1.25rem;
    gap: 1.2rem;
  }

  .ed-schedule-panel .ed-stack-hero-inner > div:first-child,
  .ed-venue-panel .ed-stack-hero-inner {
    display: flex !important;
    flex-direction: column;
    gap: 1.2rem;
  }

  .ed-schedule-panel .ed-hero-top-block,
  .ed-venue-panel .ed-hero-top-block {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .ed-schedule-panel .ed-hero-anchor-group,
  .ed-venue-panel .ed-hero-anchor-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.85rem;
    padding: 0;
    border: 0;
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    display: flex;
    width: 68px;
    height: 68px;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: #071110;
    background: var(--color-primary);
    border-radius: 50%;
    font-size: 2.2rem;
    line-height: 1;
  }

  .ed-schedule-panel .ed-hero-title-meta,
  .ed-venue-panel .ed-hero-title-meta {
    padding: 0;
    border: 0;
  }

  .ed-schedule-panel .ed-hero-main-title,
  .ed-venue-panel .ed-hero-main-title {
    font-size: 1.05rem;
  }

  .ed-schedule-panel .ed-hero-sub-meta,
  .ed-venue-panel .ed-hero-sub-meta {
    margin-top: 0.3rem;
    font-size: 0.62rem;
  }

  .ed-event-panel .ed-hero-status-badge {
    margin: 0 0 0 auto;
    padding: 0.4rem 0.6rem;
    border: 1px solid rgba(12, 230, 68, 0.22);
    border-radius: 999px;
    font-size: 0.56rem;
  }

  .ed-event-panel .ed-hero-body-list {
    display: grid;
    gap: 0.55rem;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .ed-event-panel .ed-hero-session-row {
    min-height: 2.8rem;
    padding: 0.55rem 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.045);
  }

  .ed-event-panel .ed-hero-footer-row {
    padding-top: 0.9rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ed-venue-panel .ed-hero-big-anchor {
    padding: 0;
    color: var(--color-text);
    border: 0;
    font-size: 1.3rem;
  }

  .ed-venue-panel .ed-map-frame {
    border: 0;
    border-radius: 12px;
  }

  .ed-venue-panel .ed-map-btn {
    border: 0;
    border-radius: 999px;
  }

  @media (max-width: 480px) {
    .ed-event-panel .ed-hero-top-block {
      align-items: flex-start;
    }

    .ed-event-panel .ed-hero-status-badge {
      display: none;
    }

    .ed-schedule-panel .ed-hero-big-anchor {
      width: 58px;
      height: 58px;
      font-size: 1.85rem;
    }
  }

  /* Split-color command panel variation */
  .ed-schedule-panel .ed-stack-hero,
  .ed-venue-panel .ed-stack-hero {
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 4px;
    background: #0b100d;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.38);
  }

  .ed-schedule-panel .ed-stack-hero-inner,
  .ed-venue-panel .ed-stack-hero-inner {
    display: grid;
    grid-template-columns: 9.5rem minmax(0, 1fr);
    gap: 0;
    padding: 0;
  }

  .ed-schedule-panel .ed-stack-hero-inner > div:first-child,
  .ed-venue-panel .ed-stack-hero-inner > div:first-child {
    display: contents !important;
  }

  .ed-schedule-panel .ed-hero-top-block,
  .ed-venue-panel .ed-hero-top-block {
    grid-column: 1;
    grid-row: 1 / span 2;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 225px;
    padding: 1.35rem 1rem;
  }

  .ed-schedule-panel .ed-hero-top-block {
    background: var(--color-primary);
  }

  .ed-schedule-panel .ed-hero-anchor-group,
  .ed-venue-panel .ed-hero-anchor-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0;
    border: 0;
  }

  .ed-schedule-panel .ed-hero-anchor-group {
    width: 100%;
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    width: auto;
    height: auto;
    padding: 0;
    color: #071110;
    background: transparent;
    font-size: 4.2rem;
    line-height: 0.8;
  }

  .ed-schedule-panel .ed-hero-title-meta {
    width: 100%;
    min-width: 0;
    padding-top: 0.8rem;
    border-top: 1px solid rgba(7, 17, 16, 0.35);
  }

  .ed-schedule-panel .ed-hero-main-title,
  .ed-schedule-panel .ed-hero-sub-meta {
    color: #071110;
  }

  .ed-schedule-panel .ed-hero-main-title {
    white-space: nowrap;
    font-size: clamp(0.78rem, 1.2vw, 0.95rem);
  }

  .ed-schedule-panel .ed-hero-sub-meta {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.58rem;
  }

  .ed-schedule-panel .ed-hero-status-badge {
    margin: auto 0 0;
    padding: 0;
    border: 0;
    color: rgba(7, 17, 16, 0.7);
  }

  .ed-schedule-panel .ed-hero-status-pulse {
    background: #071110;
    box-shadow: none;
  }

  .ed-event-panel .ed-hero-body-list {
    grid-column: 2;
    grid-row: 1;
    align-self: stretch;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    padding: 1.35rem 1.25rem 0.7rem;
    margin: 0;
    border: 0;
  }

  .ed-event-panel .ed-hero-session-row {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem 0;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0;
    background: transparent;
  }

  .ed-event-panel .ed-hero-footer-row {
    grid-column: 2;
    grid-row: 2;
    padding: 0.75rem 1.25rem 1.1rem;
    border-top: 0;
  }

  .ed-venue-panel .ed-hero-top-block {
    background: #202a25;
  }

  .ed-venue-panel .ed-hero-big-anchor,
  .ed-venue-panel .ed-hero-main-title,
  .ed-venue-panel .ed-hero-sub-meta {
    color: var(--color-text);
  }

  .ed-venue-panel .ed-hero-main-title {
    font-size: 1.05rem;
    white-space: normal;
  }

  .ed-venue-panel .ed-hero-sub-meta {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.58rem;
    color: rgba(245, 247, 246, 0.55);
  }

  .ed-venue-panel .ed-hero-status-badge {
    margin: auto 0 0;
    padding: 0;
    border: 0;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-stack-hero-inner,
    .ed-venue-panel .ed-stack-hero-inner {
      display: flex;
      flex-direction: column;
    }

    .ed-schedule-panel .ed-hero-top-block,
    .ed-venue-panel .ed-hero-top-block {
      min-height: 0;
      padding: 1.25rem;
    }

    .ed-schedule-panel .ed-hero-body-list,
    .ed-venue-panel .ed-hero-body-list {
      padding: 0.7rem 1.25rem;
      width: 100%;
    }

    .ed-event-panel .ed-hero-footer-row {
      padding: 0.75rem 1.25rem 1.1rem;
    }
  }

  /* Overflow protection for the split-color layout */
  .ed-event-panel .ed-stack-hero,
  .ed-event-panel .ed-stack-hero-inner,
  .ed-event-panel .ed-hero-top-block,
  .ed-event-panel .ed-hero-anchor-group,
  .ed-event-panel .ed-hero-title-meta,
  .ed-event-panel .ed-hero-body-list,
  .ed-event-panel .ed-hero-session-left {
    min-width: 0;
    max-width: 100%;
  }

  .ed-event-panel .ed-hero-main-title,
  .ed-event-panel .ed-hero-sub-meta,
  .ed-event-panel .ed-hero-session-name {
    min-width: 0;
    max-width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: normal;
  }

  .ed-event-panel .ed-hero-session-name {
    overflow: visible;
    text-overflow: clip;
  }

  .ed-event-panel .ed-hero-session-time,
  .ed-event-panel .ed-hero-status-badge {
    flex-shrink: 0;
    white-space: nowrap;
  }

  .ed-event-panel .ed-hero-footer-row {
    min-width: 0;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .ed-event-panel .ed-hero-expand-link {
    min-width: 0;
    max-width: 100%;
    white-space: normal;
    text-align: right;
  }

  @media (max-width: 480px) {
    .ed-event-panel .ed-hero-session-row {
      align-items: flex-start;
    }

    .ed-event-panel .ed-hero-session-left {
      flex: 1 1 auto;
    }

    .ed-event-panel .ed-hero-session-time {
      font-size: 0.55rem;
    }

    .ed-event-panel .ed-hero-footer-row {
      align-items: flex-start;
    }

    .ed-event-panel .ed-hero-expand-link {
      margin-left: auto;
      max-width: 10rem;
    }
  }

  /* Schedule card content */
  .ed-schedule-panel .ed-hero-anchor-group {
    min-width: 9.5rem;
  }

  .ed-schedule-panel .ed-hero-main-title {
    white-space: nowrap;
    overflow-wrap: normal;
    font-size: clamp(0.88rem, 1.4vw, 1.05rem);
  }

  .ed-schedule-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem 0.55rem;
    margin-top: 0.45rem;
  }

  .ed-schedule-weekday,
  .ed-schedule-track,
  .ed-session-status,
  .ed-day-count {
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }

  .ed-schedule-weekday {
    margin: 0;
    color: #071110;
    font-size: 0.62rem;
    font-weight: 700;
  }

  .ed-schedule-track {
    color: rgba(7, 17, 16, 0.7);
    font-size: 0.56rem;
  }

  .ed-schedule-panel .ed-hero-body-list {
    gap: 0.65rem;
  }

  .ed-schedule-panel .ed-hero-session-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    min-height: 4rem;
    padding: 0.8rem 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 3px solid rgba(255, 255, 255, 0.18);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.045);
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  }

  .ed-schedule-panel .ed-hero-session-row:hover,
  .ed-schedule-panel .ed-hero-session-row:focus-visible {
    outline: none;
    border-color: rgba(12, 230, 68, 0.62);
    border-left-color: var(--color-primary);
    background: rgba(12, 230, 68, 0.1);
    transform: translateX(3px);
  }

  .ed-schedule-panel .ed-hero-session-row.is-done {
    border-left-color: rgba(12, 230, 68, 0.65);
  }

  .ed-schedule-panel .ed-hero-session-row.is-now {
    border-left-color: var(--color-primary);
    background: rgba(12, 230, 68, 0.11);
  }

  .ed-schedule-panel .ed-hero-session-row.is-upcoming {
    border-left-color: rgba(255, 255, 255, 0.25);
  }

  .ed-schedule-panel .ed-hero-session-left {
    min-width: 0;
  }

  .ed-hero-session-marker {
    width: 0.65rem;
    height: 0.65rem;
    flex: 0 0 auto;
    border: 2px solid rgba(245, 247, 246, 0.45);
    border-radius: 50%;
  }

  .is-done .ed-hero-session-marker,
  .is-now .ed-hero-session-marker {
    border-color: var(--color-primary);
    background: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(12, 230, 68, 0.12);
  }

  .ed-schedule-panel .ed-hero-session-name {
    font-size: 0.82rem;
    font-weight: 500;
  }

  .ed-schedule-panel .ed-hero-session-time {
    padding: 0 0.75rem;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .ed-session-status {
    min-width: 3.3rem;
    color: rgba(245, 247, 246, 0.55);
    font-size: 0.52rem;
    text-align: right;
  }

  .is-now .ed-session-status {
    color: var(--color-primary);
  }

  .ed-day-switcher {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .ed-day-chip {
    min-width: 44px;
    min-height: 44px;
    padding: 0.45rem 0.6rem;
    color: rgba(245, 247, 246, 0.6);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .ed-day-chip:hover,
  .ed-day-chip:focus-visible {
    color: #071110;
    background: rgba(12, 230, 68, 0.75);
    border-color: var(--color-primary);
    outline: none;
  }

  .ed-day-chip.is-active {
    color: #071110;
    background: var(--color-primary);
    border-color: var(--color-primary);
    font-weight: 700;
  }

  .ed-day-count {
    margin-left: 0.35rem;
    color: rgba(245, 247, 246, 0.62);
    font-size: 0.58rem;
  }

  .ed-schedule-panel .ed-hero-expand-link {
    min-height: 44px;
    padding: 0.5rem 0;
    color: var(--color-primary);
    background: none;
    border: 0;
    cursor: pointer;
    font-weight: 700;
  }

  .ed-schedule-panel .ed-hero-expand-link:hover,
  .ed-schedule-panel .ed-hero-expand-link:focus-visible {
    color: #ffffff;
    outline: 2px solid rgba(12, 230, 68, 0.5);
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-hero-session-row {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .ed-session-status {
      display: none;
    }

    .ed-schedule-panel .ed-hero-session-time {
      font-size: 0.7rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ed-schedule-panel .ed-hero-session-row,
    .ed-day-chip {
      transition: none;
    }
  }

  /* Schedule right-side refinement */
  .ed-schedule-panel {
    --schedule-accent: var(--color-primary, #0CE644);
    --schedule-surface: rgba(255, 255, 255, 0.035);
    --schedule-divider: rgba(245, 247, 246, 0.16);
    --schedule-muted: rgba(245, 247, 246, 0.68);
    --schedule-space: 1.5rem;
    --schedule-radius: 6px;
  }

  .ed-schedule-panel .ed-hero-body-list {
    position: relative;
    gap: 0;
    padding: 0.5rem 0 0.75rem 1.7rem;
    background: transparent;
  }

  .ed-schedule-panel .ed-hero-body-list::before {
    content: "";
    position: absolute;
    top: 1.05rem;
    bottom: 1.05rem;
    left: 0.43rem;
    width: 1px;
    background: var(--schedule-divider);
    pointer-events: none;
  }

  .ed-schedule-panel .ed-hero-session-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 6.2rem 4.6rem;
    min-height: 0;
    padding: 1rem 0;
    border: 0;
    border-bottom: 1px solid var(--schedule-divider);
    border-left: 0;
    border-radius: 0;
    background: transparent;
    transform: none;
    transition: background 0.2s ease, padding-left 0.2s ease;
  }

  .ed-schedule-panel .ed-hero-session-row:last-child {
    border-bottom: 0;
  }

  .ed-schedule-panel .ed-hero-session-row:hover,
  .ed-schedule-panel .ed-hero-session-row:focus-visible {
    border-color: transparent;
    outline: none;
    background: var(--schedule-surface);
    padding-left: 0.5rem;
  }

  .ed-schedule-panel .ed-hero-session-left {
    position: relative;
    gap: 0.75rem;
  }

  .ed-schedule-panel .ed-hero-session-marker {
    position: absolute;
    left: -1.7rem;
    width: 0.8rem;
    height: 0.8rem;
    border: 2px solid var(--schedule-muted);
    background: #0b110e;
    box-shadow: 0 0 0 4px #0b110e;
  }

  .ed-schedule-panel .is-done .ed-hero-session-marker,
  .ed-schedule-panel .is-now .ed-hero-session-marker {
    border-color: var(--schedule-accent);
    background: var(--schedule-accent);
  }

  .ed-schedule-panel .ed-hero-session-name {
    color: #f5f7f6;
    font-size: 0.86rem;
  }

  .ed-schedule-panel .ed-hero-session-time {
    align-self: center;
    padding: 0;
    color: #f5f7f6;
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    text-align: right;
  }

  .ed-schedule-panel .ed-session-status {
    align-self: center;
    min-width: 0;
    color: var(--schedule-muted);
    font-size: 0.75rem;
    font-weight: 600;
    text-align: right;
  }

  .ed-schedule-panel .is-done .ed-session-status {
    color: var(--schedule-accent);
  }

  .ed-schedule-panel .is-now .ed-session-status {
    color: #ffffff;
  }

  .ed-schedule-panel .ed-hero-footer-row {
    align-items: center;
    padding: 1rem 0 0;
    border-top: 1px solid var(--schedule-divider);
  }

  .ed-schedule-panel .ed-day-switcher {
    align-items: center;
    gap: 0.4rem;
  }

  .ed-schedule-panel .ed-day-chip {
    min-width: 44px;
    min-height: 44px;
    border-radius: var(--schedule-radius);
  }

  .ed-schedule-panel .ed-day-count {
    margin-left: 0.5rem;
    color: #f5f7f6;
    font-size: 0.68rem;
    font-weight: 600;
  }

  .ed-schedule-panel .ed-hero-expand-link {
    min-height: 44px;
    padding: 0.55rem 0;
    border-bottom: 1px solid transparent;
    color: var(--schedule-accent);
    font-size: 0.68rem;
    text-decoration: none;
  }

  .ed-schedule-panel .ed-hero-expand-link:hover,
  .ed-schedule-panel .ed-hero-expand-link:focus-visible {
    border-bottom-color: var(--schedule-accent);
    outline: none;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-hero-body-list {
      padding-left: 1.5rem;
    }

    .ed-schedule-panel .ed-hero-session-row {
      grid-template-columns: minmax(0, 1fr) auto;
      column-gap: 0.75rem;
    }

    .ed-schedule-panel .ed-hero-session-marker {
      left: -1.5rem;
    }

    .ed-schedule-panel .ed-session-status {
      display: none;
    }

    .ed-schedule-panel .ed-hero-footer-row {
      align-items: flex-start;
    }

    .ed-schedule-panel .ed-day-switcher {
      max-width: 100%;
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 0.25rem;
      scrollbar-width: thin;
    }
  }

  /* Schedule rail and agenda redesign */
  .ed-schedule-panel {
    --schedule-rail-width: 9.5rem;
    --schedule-space-1: 0.5rem;
    --schedule-space-2: 1rem;
    --schedule-space-3: 1.5rem;
    --schedule-space-4: 2rem;
    --schedule-ink: #f5f7f6;
    --schedule-muted: rgba(245, 247, 246, 0.68);
    --schedule-line: rgba(245, 247, 246, 0.2);
  }

  /* Keep the green rail, but give its content a calmer type rhythm. */
  .ed-schedule-panel .ed-hero-top-block {
    min-height: 100%;
    padding: var(--schedule-space-4) var(--schedule-space-3);
  }

  .ed-schedule-panel .ed-hero-anchor-group {
    gap: var(--schedule-space-2);
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    font-size: clamp(3.8rem, 6vw, 5rem);
    line-height: 0.82;
    letter-spacing: -0.08em;
  }

  .ed-schedule-panel .ed-hero-title-meta {
    gap: var(--schedule-space-1);
    padding-top: var(--schedule-space-2);
  }

  .ed-schedule-panel .ed-hero-main-title {
    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
    line-height: 1.2;
  }

  .ed-schedule-panel .ed-schedule-meta {
    gap: 0.35rem;
    margin-top: 0.35rem;
  }

  .ed-schedule-panel .ed-schedule-weekday {
    font-size: 0.66rem;
  }

  .ed-schedule-panel .ed-schedule-track {
    font-size: 0.58rem;
    line-height: 1.3;
  }

  /* The right side is an agenda, not a group of nested cards. */
  .ed-schedule-panel .ed-hero-body-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0;
    padding: var(--schedule-space-4) var(--schedule-space-3) var(--schedule-space-2);
    background: transparent;
  }

  .ed-schedule-panel .ed-hero-body-list::before {
    content: "TODAY'S AGENDA";
    position: static;
    display: block;
    margin-bottom: var(--schedule-space-2);
    color: var(--schedule-muted);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
  }

  .ed-schedule-panel .ed-hero-body-list::after {
    top: 4.15rem;
    bottom: 1.25rem;
    left: 1.95rem;
    background: var(--schedule-line);
  }

  .ed-schedule-panel .ed-hero-session-row {
    display: grid;
    grid-template-columns: 5.8rem minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--schedule-space-2);
    min-height: 4.5rem;
    padding: 0.9rem 0;
    border: 0;
    border-bottom: 0;
    background: transparent;
    transform: none;
  }

  .ed-schedule-panel .ed-hero-session-row:hover,
  .ed-schedule-panel .ed-hero-session-row:focus-visible {
    padding-left: 0.5rem;
    background: rgba(12, 230, 68, 0.06);
    outline: none;
  }

  .ed-schedule-panel .ed-hero-session-time {
    grid-column: 1;
    grid-row: 1;
    align-self: center;
    padding: 0;
    color: var(--schedule-ink);
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    text-align: left;
  }

  .ed-schedule-panel .ed-hero-session-left {
    grid-column: 2;
    grid-row: 1;
    position: relative;
    min-width: 0;
    padding-left: 1.25rem;
  }

  .ed-schedule-panel .ed-hero-session-marker {
    left: 0;
    width: 0.72rem;
    height: 0.72rem;
    border-color: var(--schedule-muted);
    background: #0b110e;
    box-shadow: 0 0 0 4px #0b110e;
  }

  .ed-schedule-panel .is-done .ed-hero-session-marker,
  .ed-schedule-panel .is-now .ed-hero-session-marker {
    border-color: var(--color-primary);
    background: var(--color-primary);
  }

  .ed-schedule-panel .ed-hero-session-name {
    color: var(--schedule-ink);
    font-size: 0.88rem;
    font-weight: 600;
    line-height: 1.35;
  }

  .ed-schedule-panel .ed-session-status {
    grid-column: 3;
    grid-row: 1;
    align-self: center;
    min-width: 4.4rem;
    padding: 0.35rem 0.5rem;
    color: var(--schedule-muted);
    border: 1px solid rgba(245, 247, 246, 0.24);
    border-radius: 999px;
    font-size: 0.68rem;
    line-height: 1;
    text-align: center;
  }

  .ed-schedule-panel .is-done .ed-session-status {
    color: var(--color-primary);
    border-color: rgba(12, 230, 68, 0.48);
  }

  .ed-schedule-panel .is-now .ed-session-status {
    color: #071110;
    background: var(--color-primary);
    border-color: var(--color-primary);
  }

  .ed-schedule-panel .ed-hero-footer-row {
    align-items: center;
    gap: var(--schedule-space-2);
    padding: var(--schedule-space-2) var(--schedule-space-3) var(--schedule-space-3);
    border-top: 0;
  }

  .ed-schedule-panel .ed-day-switcher {
    margin-left: 0;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-hero-top-block {
      min-height: 0;
      padding: var(--schedule-space-3) var(--schedule-space-2);
    }

    .ed-schedule-panel .ed-hero-body-list {
      padding: var(--schedule-space-3) var(--schedule-space-2) var(--schedule-space-1);
    }

    .ed-schedule-panel .ed-hero-session-row {
      grid-template-columns: 5.4rem minmax(0, 1fr) auto;
      gap: 0.65rem;
      min-height: 4.25rem;
    }

    .ed-schedule-panel .ed-hero-footer-row {
      padding: var(--schedule-space-2);
    }
  }

  /* Editorial agenda variation */
  .ed-schedule-panel .ed-hero-body-list {
    padding: 2rem 2rem 1rem;
    gap: 0;
  }

  .ed-schedule-panel .ed-hero-body-list::before {
    content: "AGENDA";
    margin-bottom: 1.2rem;
    color: rgba(245, 247, 246, 0.54);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.2em;
  }

  .ed-schedule-panel .ed-hero-body-list::after {
    top: 4.1rem;
    bottom: 1.7rem;
    left: 6.6rem;
    background: rgba(12, 230, 68, 0.38);
  }

  .ed-schedule-panel .ed-hero-session-row {
    display: grid;
    grid-template-columns: 5rem minmax(0, 1fr);
    grid-template-rows: auto auto;
    column-gap: 1.6rem;
    row-gap: 0.3rem;
    min-height: 0;
    padding: 1.05rem 0;
    border: 0;
    background: transparent;
    transition: background 0.2s ease, padding-left 0.2s ease;
  }

  .ed-schedule-panel .ed-hero-session-row:hover,
  .ed-schedule-panel .ed-hero-session-row:focus-visible {
    padding-left: 0.65rem;
    outline: none;
    background: rgba(12, 230, 68, 0.055);
  }

  .ed-schedule-panel .ed-hero-session-time {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: center;
    padding: 0;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0;
    text-align: left;
  }

  .ed-schedule-panel .ed-hero-session-left {
    grid-column: 2;
    grid-row: 1;
    position: relative;
    min-width: 0;
    padding-left: 1.1rem;
  }

  .ed-schedule-panel .ed-hero-session-marker {
    left: -0.32rem;
    width: 0.62rem;
    height: 0.62rem;
    border-width: 2px;
    background: #0b110e;
    box-shadow: 0 0 0 4px #0b110e;
  }

  .ed-schedule-panel .ed-hero-session-name {
    color: #f5f7f6;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.35;
  }

  .ed-schedule-panel .ed-session-status {
    grid-column: 2;
    grid-row: 2;
    justify-self: start;
    min-width: 0;
    padding: 0;
    color: rgba(245, 247, 246, 0.62);
    border: 0;
    border-radius: 0;
    font-size: 0.68rem;
    text-align: left;
  }

  .ed-schedule-panel .is-done .ed-session-status {
    color: var(--color-primary);
  }

  .ed-schedule-panel .is-now .ed-session-status {
    color: #ffffff;
  }

  .ed-schedule-panel .ed-hero-footer-row {
    padding: 1rem 2rem 1.5rem;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-hero-body-list {
      padding: 1.5rem 1.25rem 0.75rem;
    }

    .ed-schedule-panel .ed-hero-body-list::after {
      left: 5.8rem;
    }

    .ed-schedule-panel .ed-hero-session-row {
      grid-template-columns: 4.25rem minmax(0, 1fr);
      column-gap: 1.15rem;
    }

    .ed-schedule-panel .ed-hero-footer-row {
      padding: 1rem 1.25rem 1.25rem;
    }
  }

  /* One-third green date rail, two-thirds black agenda */
  .ed-schedule-panel .ed-stack-hero-inner {
    grid-template-columns: 33.333% 66.667%;
    background: #000000;
  }

  .ed-schedule-panel .ed-hero-top-block {
    background: var(--color-primary, #0CE644);
  }

  .ed-schedule-panel .ed-hero-body-list,
  .ed-schedule-panel .ed-hero-footer-row {
    background: #000000;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-stack-hero-inner {
      display: flex;
      background: #000000;
    }
  }

  /* Open program-list variation for the black right pane */
  .ed-schedule-panel .ed-hero-body-list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 1.75rem 2rem 0.75rem;
    background: #000000;
  }

  .ed-schedule-panel .ed-hero-body-list::before {
    content: "PROGRAM / 02 SESSIONS";
    position: static;
    display: block;
    margin-bottom: 1rem;
    color: rgba(245, 247, 246, 0.58);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.16em;
  }

  .ed-schedule-panel .ed-hero-body-list::after {
    display: none;
  }

  .ed-schedule-panel .ed-hero-session-row {
    display: grid;
    grid-template-columns: 5.8rem minmax(0, 1fr) auto;
    align-items: center;
    gap: 1rem;
    min-height: 5rem;
    padding: 1rem 0;
    border: 0;
    border-top: 1px solid rgba(245, 247, 246, 0.16);
    border-radius: 0;
    background: transparent;
    transform: none;
  }

  .ed-schedule-panel .ed-hero-session-row:last-child {
    border-bottom: 1px solid rgba(245, 247, 246, 0.16);
  }

  .ed-schedule-panel .ed-hero-session-row:hover,
  .ed-schedule-panel .ed-hero-session-row:focus-visible {
    padding-left: 0.75rem;
    background: rgba(12, 230, 68, 0.07);
    outline: none;
  }

  .ed-schedule-panel .ed-hero-session-time {
    grid-column: 1;
    grid-row: 1;
    padding: 0;
    color: var(--color-primary);
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    text-align: left;
  }

  .ed-schedule-panel .ed-hero-session-left {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
    padding-left: 0;
  }

  .ed-schedule-panel .ed-hero-session-marker {
    display: none;
  }

  .ed-schedule-panel .ed-hero-session-name {
    color: #f5f7f6;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.35;
  }

  .ed-schedule-panel .ed-session-status {
    grid-column: 3;
    grid-row: 1;
    min-width: 4.4rem;
    padding: 0.35rem 0.5rem;
    color: rgba(245, 247, 246, 0.7);
    border: 1px solid rgba(245, 247, 246, 0.24);
    border-radius: 999px;
    font-size: 0.68rem;
    text-align: center;
  }

  .ed-schedule-panel .is-done .ed-session-status {
    color: var(--color-primary);
    border-color: rgba(12, 230, 68, 0.48);
  }

  .ed-schedule-panel .is-now .ed-session-status {
    color: #071110;
    background: var(--color-primary);
    border-color: var(--color-primary);
  }

  .ed-schedule-panel .ed-hero-footer-row {
    padding: 1rem 2rem 1.5rem;
    background: #000000;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-hero-body-list {
      padding: 1.25rem 1.25rem 0.75rem;
    }

    .ed-schedule-panel .ed-hero-session-row {
      grid-template-columns: 4.8rem minmax(0, 1fr) auto;
      gap: 0.7rem;
    }

    .ed-schedule-panel .ed-hero-footer-row {
      padding: 1rem 1.25rem 1.25rem;
    }
  }
  
  /* Wide-entry agenda variation */
  .ed-schedule-panel .ed-hero-body-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;
    padding: 1.4rem 2rem 0.8rem;
    background: #000000;
  }
  
  .ed-schedule-panel .ed-hero-body-list::before {
    content: "TODAY'S PROGRAM";
    position: static;
    display: block;
    margin-bottom: 0.7rem;
    color: rgba(245, 247, 246, 0.5);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.18em;
  }
  
  .ed-schedule-panel .ed-hero-body-list::after {
    display: none;
  }
  
  .ed-schedule-panel .ed-hero-session-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: auto auto;
    column-gap: 1rem;
    row-gap: 0.45rem;
    min-height: 0;
    padding: 1rem 0;
    border: 0;
    border-top: 1px solid rgba(245, 247, 246, 0.16);
    border-radius: 0;
    background: transparent;
    transform: none;
    transition: background 0.2s ease, padding-left 0.2s ease;
  }
  
  .ed-schedule-panel .ed-hero-session-row:last-child {
    border-bottom: 1px solid rgba(245, 247, 246, 0.16);
  }
  
  .ed-schedule-panel .ed-hero-session-row:hover,
  .ed-schedule-panel .ed-hero-session-row:focus-visible {
    padding-left: 0.65rem;
    background: rgba(12, 230, 68, 0.07);
    outline: none;
  }
  
  .ed-schedule-panel .ed-hero-session-left {
    grid-column: 1;
    grid-row: 1;
    min-width: 0;
    padding: 0;
  }
  
  .ed-schedule-panel .ed-hero-session-marker {
    display: none;
  }
  
  .ed-schedule-panel .ed-hero-session-name {
    color: #f5f7f6;
    font-size: 0.94rem;
    font-weight: 600;
    line-height: 1.3;
  }
  
  .ed-schedule-panel .ed-hero-session-time {
    grid-column: 2;
    grid-row: 1;
    align-self: center;
    padding: 0;
    color: var(--color-primary);
    font-family: 'Inter', sans-serif;
    font-size: 0.84rem;
    font-weight: 700;
    white-space: nowrap;
  }
  
  .ed-schedule-panel .ed-session-status {
    grid-column: 1;
    grid-row: 2;
    min-width: 0;
    padding: 0;
    color: rgba(245, 247, 246, 0.58);
    border: 0;
    border-radius: 0;
    font-size: 0.65rem;
    text-align: left;
  }
  
  .ed-schedule-panel .is-done .ed-session-status {
    color: var(--color-primary);
  }
  
  .ed-schedule-panel .is-now .ed-session-status {
    color: #ffffff;
  }
  
  .ed-schedule-panel .ed-hero-footer-row {
    padding: 0.75rem 2rem 1.2rem;
    background: #000000;
  }
  
  @media (max-width: 640px) {
    .ed-schedule-panel .ed-hero-body-list {
      padding: 1rem 1.25rem 0.5rem;
    }
  
    .ed-schedule-panel .ed-hero-session-row {
      grid-template-columns: minmax(0, 1fr) auto;
      padding: 0.9rem 0;
    }
  
    .ed-schedule-panel .ed-hero-footer-row {
      padding: 0.7rem 1.25rem 1rem;
    }
  }

  /* Compact schedule card */
  .ed-schedule-panel .ed-stack-hero-inner {
    min-height: 0;
  }

  .ed-schedule-panel .ed-hero-top-block {
    min-height: 0;
    padding: 1.25rem 1.1rem;
  }

  .ed-schedule-panel .ed-hero-anchor-group {
    gap: 0.65rem;
  }

  .ed-schedule-panel .ed-hero-big-anchor {
    font-size: clamp(3.25rem, 5vw, 4.2rem);
  }

  .ed-schedule-panel .ed-hero-title-meta {
    padding-top: 0.55rem;
  }

  .ed-schedule-panel .ed-hero-body-list {
    padding: 1rem 1.35rem 0.35rem;
  }

  .ed-schedule-panel .ed-hero-body-list::before {
    margin-bottom: 0.35rem;
    font-size: 0.56rem;
  }

  .ed-schedule-panel .ed-hero-session-row {
    min-height: 3.65rem;
    padding: 0.62rem 0;
  }

  .ed-schedule-panel .ed-hero-session-name {
    font-size: 0.8rem;
  }

  .ed-schedule-panel .ed-hero-session-time {
    font-size: 0.7rem;
  }

  .ed-schedule-panel .ed-session-status {
    min-width: 3.8rem;
    padding: 0.28rem 0.4rem;
    font-size: 0.6rem;
  }

  .ed-schedule-panel .ed-hero-footer-row {
    padding: 0.6rem 1.35rem 0.85rem;
  }

  .ed-schedule-panel .ed-day-chip,
  .ed-schedule-panel .ed-hero-expand-link {
    min-height: 44px;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-hero-top-block {
      padding: 1rem;
    }

    .ed-schedule-panel .ed-hero-body-list {
      padding: 0.85rem 1rem 0.25rem;
    }

    .ed-schedule-panel .ed-hero-footer-row {
      padding: 0.55rem 1rem 0.75rem;
    }
  }

  /* Keep the day label inside the green rail. */
  .ed-schedule-panel .ed-hero-top-block {
    justify-content: flex-start;
    padding-bottom: 1.25rem;
  }

  .ed-schedule-panel .ed-hero-status-badge {
    position: static;
    margin: auto 0 0;
    align-self: flex-start;
    transform: translateX(-0.55rem);
    color: rgba(7, 17, 16, 0.82);
  }

  .ed-schedule-panel .ed-hero-status-pulse {
    background: #071110;
    box-shadow: none;
  }

  .ed-schedule-panel .ed-schedule-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .ed-schedule-panel .ed-schedule-weekday {
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .ed-schedule-panel .ed-schedule-track {
    color: #071110;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  /* Expanded schedule matches the default green-rail card. */
  .ed-schedule-panel .ed-schedule-expanded {
    overflow: hidden;
    border: 1px solid rgba(245, 247, 246, 0.16);
    border-radius: 6px;
    background: #000000;
    box-shadow: none;
  }

  .ed-schedule-panel .ed-schedule-row {
    display: grid;
    grid-template-columns: 8.5rem minmax(0, 1fr);
    gap: 0;
    min-width: 0;
    padding: 0;
    border-bottom: 1px solid rgba(245, 247, 246, 0.16);
    background: #000000;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .ed-schedule-panel .ed-schedule-row:last-child {
    border-bottom: 0;
  }

  .ed-schedule-panel .ed-schedule-row:hover,
  .ed-schedule-panel .ed-schedule-row.is-scrolled {
    background: #000000;
    transform: translateX(3px);
  }

  .ed-schedule-panel .ed-row-index {
    display: none;
  }

  .ed-schedule-panel .ed-row-date-block {
    justify-content: center;
    min-width: 0;
    padding: 1.1rem 1rem;
    background: var(--color-primary);
  }

  .ed-schedule-panel .ed-row-date {
    color: #071110;
    font-size: 0.9rem;
    line-height: 1.25;
    overflow-wrap: normal;
    white-space: normal;
  }

  .ed-schedule-panel .ed-row-day {
    color: rgba(7, 17, 16, 0.78);
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .ed-schedule-panel .ed-row-content {
    min-width: 0;
    padding: 1rem 1.25rem;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.85rem;
  }

  .ed-schedule-panel .ed-row-sessions {
    align-items: stretch;
    min-width: 0;
    gap: 0.7rem;
    width: 100%;
    text-align: left;
  }

  .ed-schedule-panel .ed-row-session-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
    width: 100%;
    color: #f5f7f6;
    font-size: 0.8rem;
    text-align: left;
  }

  .ed-schedule-panel .ed-row-session-dot {
    width: 0.5rem;
    height: 0.5rem;
    opacity: 1;
    background: var(--color-primary);
  }

  .ed-schedule-panel .ed-row-session-text {
    min-width: 0;
    flex: 1 1 auto;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .ed-schedule-panel .ed-row-session-time {
    flex: 0 0 auto;
    color: var(--color-primary);
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .ed-schedule-panel .ed-collapse-cta {
    min-height: 44px;
    margin-top: 0.5rem;
    color: var(--color-primary);
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-schedule-row {
      grid-template-columns: 7rem minmax(0, 1fr);
    }

    .ed-schedule-panel .ed-row-date-block {
      padding: 1rem 0.75rem;
    }

    .ed-schedule-panel .ed-row-content {
      padding: 0.9rem 1rem;
    }

    .ed-schedule-panel .ed-row-session-item {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .ed-schedule-panel .ed-row-session-time {
      grid-column: 2;
      justify-self: start;
      margin-top: -0.25rem;
    }
  }

  /* Final expanded-state spacing reset */
  .ed-schedule-panel .ed-schedule-expanded .ed-schedule-row {
    display: grid !important;
    grid-template-columns: minmax(8rem, 33.333%) minmax(0, 1fr) !important;
    align-items: stretch;
    width: 100%;
    min-width: 0;
    padding: 0 !important;
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-row-date-block {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    padding: 1.25rem;
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-row-content {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    justify-content: center !important;
    width: 100% !important;
    min-width: 0;
    box-sizing: border-box;
    padding: 1.25rem 1.5rem !important;
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-row-sessions {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    width: 100% !important;
    min-width: 0;
    gap: 0.75rem;
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-row-session-item {
    display: flex !important;
    flex-direction: row !important;
    align-items: center;
    width: 100% !important;
    min-width: 0;
    gap: 0.65rem;
    text-align: left !important;
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-row-session-text {
    flex: 1 1 auto;
    min-width: 0;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-row-session-time {
    flex: 0 0 auto;
    margin-left: auto;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-schedule-expanded .ed-schedule-row {
      grid-template-columns: minmax(7rem, 32%) minmax(0, 1fr) !important;
    }

    .ed-schedule-panel .ed-schedule-expanded .ed-row-date-block {
      padding: 1rem 0.8rem;
    }

    .ed-schedule-panel .ed-schedule-expanded .ed-row-content {
      padding: 1rem !important;
    }
  }

  /* Direct expanded-row columns after removing the nested content wrapper. */
  .ed-schedule-panel .ed-schedule-expanded .ed-row-date-block {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    padding: 1rem 1.25rem;
    background: var(--color-primary);
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-row-sessions {
    grid-column: 2;
    grid-row: 1;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center;
    align-items: stretch !important;
    width: 100% !important;
    min-width: 0;
    box-sizing: border-box;
    padding: 1rem 1.25rem;
    gap: 0.7rem;
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-row-session-item {
    display: flex !important;
    flex-direction: row !important;
    align-items: center;
    width: 100% !important;
    min-width: 0;
    gap: 0.6rem;
  }

  .ed-schedule-panel .ed-schedule-expanded .ed-schedule-row,
  .ed-schedule-panel .ed-schedule-expanded .ed-schedule-row:hover,
  .ed-schedule-panel .ed-schedule-expanded .ed-schedule-row.is-scrolled {
    transform: none !important;
  }

  @media (max-width: 640px) {
    .ed-schedule-panel .ed-schedule-expanded .ed-row-date-block,
    .ed-schedule-panel .ed-schedule-expanded .ed-row-sessions {
      padding: 0.9rem 0.8rem;
    }
  }

  /* Venue card rebuilt from the schedule card's green-rail grammar. */
  .ed-venue-panel .ed-venue-hero {
    overflow: hidden;
    border: 1px solid rgba(245, 247, 246, 0.16);
    border-radius: 6px;
    background: #000000;
    box-shadow: none;
  }

  .ed-venue-panel .ed-venue-hero .ed-stack-hero-inner {
    display: grid;
    grid-template-columns: minmax(8.5rem, 33.333%) minmax(0, 1fr);
    gap: 0;
    padding: 0;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-top-block {
    grid-column: 1;
    grid-row: 1 / span 2;
    display: flex;
    min-height: 225px;
    align-items: flex-start;
    padding: 1.35rem 1rem;
    background: #0ce644;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-anchor-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
    width: 100%;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-big-anchor {
    padding: 0;
    color: #071110;
    background: transparent;
    border: 0;
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(2.5rem, 5vw, 4rem) !important;
    line-height: 0.82;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-anchor-divider {
    display: none;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-title-meta {
    width: 100%;
    padding-top: 0.8rem;
    border-top: 1px solid rgba(7, 17, 16, 0.35);
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-main-title,
  .ed-venue-panel .ed-venue-hero .ed-hero-sub-meta,
  .ed-venue-panel .ed-venue-hero .ed-venue-address {
    color: #071110;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-main-title {
    font-size: 0.82rem;
    line-height: 1.22;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-sub-meta {
    display: block;
    margin-top: 0.3rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.57rem;
    line-height: 1.4;
  }

  .ed-venue-panel .ed-venue-hero .ed-venue-address {
    margin: 0.45rem 0 0;
    font-family: 'Inter', sans-serif;
    font-size: 0.62rem;
    line-height: 1.35;
    opacity: 0.72;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-status-badge {
    align-self: flex-start;
    margin: auto 0 0;
    padding: 0;
    color: rgba(7, 17, 16, 0.72);
    border: 0;
    background: transparent;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.56rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-status-pulse {
    background: #071110;
    box-shadow: none;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-body-list {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;
    align-self: stretch;
    margin: 0;
    padding: 1.1rem 1.25rem 0.6rem;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-row {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 3.75rem;
    padding: 0.7rem 0;
    border: 0;
    border-top: 1px solid rgba(245, 247, 246, 0.1);
    border-radius: 0;
    background: transparent;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-left {
    min-width: 0;
    flex: 1 1 auto;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-idx {
    flex: 0 0 2.1rem;
    color: var(--color-primary);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.56rem;
    letter-spacing: 0.08em;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-name {
    color: rgba(245, 247, 246, 0.9);
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-time {
    flex: 0 0 auto;
    margin-left: 0.7rem;
    color: rgba(245, 247, 246, 0.48);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.56rem;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-footer-row {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    padding: 0.75rem 1.25rem 1rem;
    border-top: 1px solid rgba(245, 247, 246, 0.1);
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-footer-count {
    color: rgba(245, 247, 246, 0.48);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-expand-link {
    color: var(--color-primary);
    font-family: 'Inter', sans-serif;
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  @media (max-width: 640px) {
    .ed-venue-panel .ed-venue-hero .ed-stack-hero-inner {
      display: flex;
      flex-direction: column;
    }

    .ed-venue-panel .ed-venue-hero .ed-hero-top-block {
      min-height: 0;
      padding: 1.25rem;
    }

    .ed-venue-panel .ed-venue-hero .ed-hero-body-list,
    .ed-venue-panel .ed-venue-hero .ed-hero-footer-row {
      width: 100%;
      box-sizing: border-box;
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }

    .ed-venue-panel .ed-venue-hero .ed-hero-footer-row {
      gap: 0.75rem;
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }

  /* Final venue treatment: one strong identity band, then scannable access data. */
  .ed-venue-panel .ed-venue-hero {
    border: 1px solid rgba(245, 247, 246, 0.16);
    border-radius: 6px;
    background: #050706;
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.3);
  }

  .ed-venue-panel .ed-venue-hero .ed-stack-hero-inner {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    padding: 0;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-top-block {
    position: relative;
    grid-column: 1;
    grid-row: 1;
    display: block;
    min-height: 0;
    padding: 1.25rem 1.35rem 1.15rem;
    background: #0ce644;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-anchor-group {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: auto auto;
    align-items: start;
    gap: 0 1rem;
    width: calc(100% - 5rem);
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-big-anchor {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: center;
    padding: 0;
    color: #071110;
    background: transparent;
    border: 0;
    font-family: 'Share Tech Mono', monospace;
    font-size: clamp(2.5rem, 5vw, 3.8rem) !important;
    line-height: 0.8;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-anchor-divider {
    display: none;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-title-meta {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
    width: auto;
    padding: 0 0 0 1rem;
    border-left: 1px solid rgba(7, 17, 16, 0.35);
    border-top: 0;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-main-title,
  .ed-venue-panel .ed-venue-hero .ed-hero-sub-meta,
  .ed-venue-panel .ed-venue-hero .ed-venue-address {
    color: #071110;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-main-title {
    font-size: clamp(0.84rem, 1.4vw, 1rem);
    line-height: 1.18;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-sub-meta {
    display: block;
    margin-top: 0.35rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.57rem;
    line-height: 1.3;
  }

  .ed-venue-panel .ed-venue-hero .ed-venue-address {
    margin: 0.28rem 0 0;
    font-family: 'Inter', sans-serif;
    font-size: 0.61rem;
    line-height: 1.3;
    opacity: 0.72;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-status-badge {
    position: absolute;
    top: 1.25rem;
    right: 1.35rem;
    margin: 0;
    padding: 0;
    color: rgba(7, 17, 16, 0.75);
    border: 0;
    background: transparent;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.56rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-status-pulse {
    background: #071110;
    box-shadow: none;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-body-list {
    grid-column: 1;
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0;
    align-self: auto;
    margin: 0;
    padding: 0 1.35rem;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-row {
    display: flex;
    align-items: center;
    min-width: 0;
    min-height: 4.4rem;
    padding: 0.8rem 1rem 0.8rem 0;
    border: 0;
    border-top: 1px solid rgba(245, 247, 246, 0.12);
    border-radius: 0;
    background: transparent;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-row + .ed-hero-session-row {
    padding-left: 1rem;
    border-left: 1px solid rgba(245, 247, 246, 0.12);
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-left {
    min-width: 0;
    flex: 1 1 auto;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-idx {
    display: block;
    margin-bottom: 0.3rem;
    color: #0ce644;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.56rem;
    letter-spacing: 0.08em;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-name {
    color: rgba(245, 247, 246, 0.9);
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    line-height: 1.3;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-time {
    display: block;
    margin: 0.25rem 0 0 0.5rem;
    color: rgba(245, 247, 246, 0.46);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.55rem;
    white-space: nowrap;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-footer-row {
    grid-column: 1;
    grid-row: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    padding: 0.8rem 1.35rem 0.95rem;
    border-top: 1px solid rgba(245, 247, 246, 0.12);
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-footer-count {
    color: rgba(245, 247, 246, 0.48);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.56rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-expand-link {
    color: #0ce644;
    font-family: 'Inter', sans-serif;
    font-size: 0.63rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  @media (max-width: 640px) {
    .ed-venue-panel .ed-venue-hero .ed-hero-anchor-group {
      width: calc(100% - 3rem);
      gap: 0 0.7rem;
    }

    .ed-venue-panel .ed-venue-hero .ed-hero-title-meta {
      padding-left: 0.7rem;
    }

    .ed-venue-panel .ed-venue-hero .ed-hero-body-list {
      display: block;
      padding: 0 1.25rem;
    }

    .ed-venue-panel .ed-venue-hero .ed-hero-session-row,
    .ed-venue-panel .ed-venue-hero .ed-hero-session-row + .ed-hero-session-row {
      padding: 0.75rem 0;
      border-left: 0;
    }
  }

  /* Override the shared schedule rule: the venue header is a real layout box. */
  .ed-venue-panel .ed-venue-hero .ed-stack-hero-inner {
    height: 300px;
    min-height: 300px;
    box-sizing: border-box;
  }

  .ed-venue-panel .ed-venue-hero .ed-stack-hero-inner > .ed-hero-top-block {
    display: block !important;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-anchor-group {
    display: block;
    width: 100%;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-title-meta {
    width: 100%;
    padding-left: 0;
    border-left: 0;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-main-title {
    font-size: clamp(1.3rem, 2.6vw, 2rem);
    line-height: 1.08;
  }

  .ed-venue-panel .ed-venue-hero .ed-venue-address {
    font-size: 0.78rem;
    line-height: 1.4;
    opacity: 0.82;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-sub-meta {
    display: none;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-main-title {
    max-width: 100%;
    margin: 0;
    font-size: clamp(1.45rem, 3vw, 2.15rem);
    line-height: 1.05;
  }

  .ed-venue-panel .ed-venue-hero .ed-venue-address {
    margin-top: 0.65rem;
    font-size: 0.82rem;
    line-height: 1.35;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-idx {
    font-size: 0.7rem;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-name {
    font-size: 0.9rem;
    line-height: 1.35;
  }

  .ed-venue-panel .ed-venue-hero .ed-hero-session-time {
    font-size: 0.65rem;
  }

  @media (max-width: 640px) {
    .ed-venue-panel .ed-venue-hero .ed-stack-hero-inner {
      height: auto;
      min-height: 0;
    }
  }

  /* Expanded venue view: summary strip followed by a map-first layout. */
  .ed-venue-panel .ed-venue-expanded {
    overflow: hidden;
    border: 1px solid rgba(12, 230, 68, 0.26);
    border-top: 2px solid #0ce644;
    border-radius: 6px;
    background: #050706;
    box-shadow: 0 18px 38px rgba(0, 0, 0, 0.35);
  }

  .ed-venue-panel .ed-venue-expanded .ed-schedule-row {
    display: block !important;
    padding: 0 !important;
    background: transparent;
    transform: none !important;
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-index {
    display: none;
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-content {
    display: block !important;
    width: 100%;
    padding: 0 !important;
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-date-block {
    display: block;
    width: 100%;
    min-height: 0;
    padding: 1.2rem 1.35rem 1.05rem;
    background: #0ce644;
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-date {
    color: #071110;
    font-size: clamp(1.05rem, 2vw, 1.35rem);
    line-height: 1.15;
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-day {
    margin-top: 0.35rem;
    color: rgba(7, 17, 16, 0.68);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.64rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-sessions {
    display: block !important;
    width: 100%;
    padding: 0.9rem 1.35rem 0.75rem;
    background: #050706;
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-session-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    min-height: 2.5rem;
    color: rgba(245, 247, 246, 0.86);
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-session-dot {
    flex: 0 0 0.45rem;
    width: 0.45rem;
    height: 0.45rem;
    background: #0ce644;
  }

  .ed-venue-panel .ed-venue-expanded .ed-row-session-text {
    font-size: 0.82rem;
  }

  .ed-venue-panel .ed-venue-expanded .ed-venue-map-row {
    padding: 1rem 1.35rem 1.2rem;
    border-top: 1px solid rgba(245, 247, 246, 0.12);
    border-bottom: 0;
    gap: 0.8rem;
  }

  .ed-venue-panel .ed-venue-expanded .ed-map-frame {
    height: clamp(190px, 24vw, 250px);
    border: 1px solid rgba(12, 230, 68, 0.28);
    border-radius: 4px;
  }

  .ed-venue-panel .ed-venue-expanded .ed-map-btn {
    min-height: 2.8rem;
    border: 1px solid rgba(12, 230, 68, 0.34);
    border-radius: 4px;
    color: #0ce644;
    background: rgba(12, 230, 68, 0.06);
  }

  .ed-venue-panel .ed-venue-expanded .ed-map-btn:hover {
    color: #071110;
    background: #0ce644;
  }

  @media (max-width: 640px) {
    .ed-venue-panel .ed-venue-expanded .ed-row-date-block,
    .ed-venue-panel .ed-venue-expanded .ed-row-sessions,
    .ed-venue-panel .ed-venue-expanded .ed-venue-map-row {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .ed-venue-panel .ed-venue-expanded .ed-map-frame {
      height: 190px;
    }
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
    month: "September",
    year: "2026",
    date: "September 19, 2026",
    weekday: "Saturday",
    track: "Cohort Opening",
    sessions: [
      { name: "Opening Ceremony", time: "09:30 AM", status: "done" },
      { name: "Domain Training", time: "01:30 PM", status: "upcoming" },
    ],
  },
  {
    dayNum: "20",
    month: "September",
    year: "2026",
    date: "September 20, 2026",
    weekday: "Sunday",
    track: "Hands-on Sprint",
    sessions: [
      { name: "Domain Training", time: "09:30 AM", status: "done" },
      { name: "Hands-on Projects", time: "01:30 PM", status: "upcoming" },
    ],
  },
  {
    dayNum: "26",
    month: "September",
    year: "2026",
    date: "September 26, 2026",
    weekday: "Saturday",
    track: "Career Track",
    sessions: [
      { name: "General Training", time: "09:30 AM", status: "now" },
      { name: "Aptitude & Resume Building", time: "01:30 PM", status: "upcoming" },
    ],
  },
  {
    dayNum: "27",
    month: "September",
    year: "2026",
    date: "September 27, 2026",
    weekday: "Sunday",
    track: "Grand Finale",
    sessions: [
      { name: "General Training", time: "09:30 AM", status: "upcoming" },
      { name: "Mock Interviews & Closing", time: "02:00 PM", status: "upcoming" },
    ],
  },
];

const VENUE = {
  name: "College of Applied Science",
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
  const cardRef = useRef(null);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 639px)");
    if (!mobileQuery.matches || !cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFlipped(entry.isIntersecting),
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

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
    <div ref={cardRef} className="ed-bay-cell" data-aos="fade-up" data-aos-delay={delay}>
      <div
        className={`ed-bay-wrap${flipped ? " is-flipped" : ""}`}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={flipped}
        aria-label={`${label}: ${frontVal}. Scroll to center or click to flip.`}
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
  const prefersReducedMotion = useReducedMotion();
  const [scheduleExpanded, setScheduleExpanded] = useState(false);
  const [venueExpanded, setVenueExpanded] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [isSchedulePaused, setIsSchedulePaused] = useState(false);
  const [activeScrollIdx, setActiveScrollIdx] = useState(-1);
  const scheduleListRef = useRef(null);
  const rowRefs = useRef([]);

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

  useEffect(() => {
    if (!scheduleExpanded) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveRow();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateActiveRow = () => {
      if (!scheduleListRef.current) return;
      const viewportCenter = window.innerHeight * 0.5;
      const containerRect = scheduleListRef.current.getBoundingClientRect();

      if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) {
        setActiveScrollIdx(-1);
        return;
      }

      let closestIdx = -1;
      let minDistance = Infinity;

      rowRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - viewportCenter);

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (distance < minDistance) {
            minDistance = distance;
            closestIdx = idx;
          }
        }
      });

      if (closestIdx !== -1 && minDistance < window.innerHeight * 0.45) {
        setActiveScrollIdx(closestIdx);
      } else {
        setActiveScrollIdx(-1);
      }
    };

    updateActiveRow();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scheduleExpanded]);

  const [isVenueScrolledActive, setIsVenueScrolledActive] = useState(false);
  const venueListRef = useRef(null);
  const venueRowRef = useRef(null);

  useEffect(() => {
    if (!venueExpanded) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateVenueRow();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateVenueRow = () => {
      if (!venueRowRef.current || !venueListRef.current) return;
      const viewportCenter = window.innerHeight * 0.5;
      const containerRect = venueListRef.current.getBoundingClientRect();

      if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) {
        setIsVenueScrolledActive(false);
        return;
      }

      const rect = venueRowRef.current.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const distance = Math.abs(rowCenter - viewportCenter);

      if (rect.top < window.innerHeight && rect.bottom > 0 && distance < window.innerHeight * 0.45) {
        setIsVenueScrolledActive(true);
      } else {
        setIsVenueScrolledActive(false);
      }
    };

    updateVenueRow();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [venueExpanded]);

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

            <div className="ed-event-panel ed-schedule-panel" data-aos="fade-right" data-aos-delay="80">
              <div className="ed-subheading-wrap">
                <span className="ed-subheading-tag">Program timeline</span>
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
                                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.26, ease: "easeOut" }}
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
                                        {SCHEDULE[activeDayIdx].month} {SCHEDULE[activeDayIdx].year}
                                      </h5>
                                      <div className="ed-schedule-meta">
                                        <p className="ed-schedule-weekday">
                                          {SCHEDULE[activeDayIdx].weekday}
                                        </p>
                                        <span className="ed-schedule-track">
                                          {SCHEDULE[activeDayIdx].track}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="ed-hero-body-list">
                                  {SCHEDULE[activeDayIdx].sessions.map((session, idx) => (
                                    <div
                                      className={`ed-hero-session-row is-${session.status}`}
                                      key={idx}
                                      tabIndex={0}
                                      aria-label={`${session.name}, ${session.time}, ${session.status}`}
                                    >
                                      <div className="ed-hero-session-left">
                                        <span className="ed-hero-session-marker" aria-hidden="true" />
                                        <p className="ed-hero-session-name">
                                          {typeof session === "string" ? session : session.name}
                                        </p>
                                      </div>
                                      <span className="ed-hero-session-time">
                                        {typeof session === "string"
                                          ? (idx === 0 ? "09:30 AM" : "01:30 PM")
                                          : session.time}
                                      </span>
                                      <span className="ed-session-status">{session.status}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </AnimatePresence>

                            <div className="ed-hero-footer-row">
                              <div className="ed-day-switcher" role="group" aria-label="Choose schedule day">
                                {SCHEDULE.map((_, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    aria-label={`Go to Day ${i + 1}, ${SCHEDULE[i].date}`}
                                    aria-pressed={i === activeDayIdx}
                                    aria-current={i === activeDayIdx ? "step" : undefined}
                                    className={`ed-day-chip${i === activeDayIdx ? " is-active" : ""}`}
                                    onKeyDown={(e) => {
                                      const keyMap = {
                                        ArrowRight: 1,
                                        ArrowDown: 1,
                                        ArrowLeft: -1,
                                        ArrowUp: -1,
                                        Home: -activeDayIdx,
                                        End: SCHEDULE.length - 1 - activeDayIdx,
                                      };
                                      if (!(e.key in keyMap)) return;
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const nextIndex = Math.max(
                                        0,
                                        Math.min(SCHEDULE.length - 1, activeDayIdx + keyMap[e.key]),
                                      );
                                      setActiveDayIdx(nextIndex);
                                      requestAnimationFrame(() => {
                                        document.querySelectorAll(".ed-day-chip")[nextIndex]?.focus();
                                      });
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDayIdx(i);
                                    }}
                                  >
                                    D{i + 1}
                                  </button>
                                ))}
                                <span className="ed-day-count">Day {activeDayIdx + 1} of {SCHEDULE.length}</span>
                              </div>
                              <button
                                type="button"
                                className="ed-hero-expand-link"
                                aria-label="View all event dates"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setScheduleExpanded(true);
                                }}
                              >
                                View All Dates
                                <ChevronDown
                                  size={13}
                                  className="ed-action-chevron"
                                />
                              </button>
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
                      <div className="ed-schedule-expanded" ref={scheduleListRef}>
                        {SCHEDULE.map((item, index) => (
                          <motion.div
                            ref={(el) => (rowRefs.current[index] = el)}
                            className={`ed-schedule-row${activeScrollIdx === index ? " is-scrolled" : ""}`}
                            key={item.date}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              x: activeScrollIdx === index ? 4 : 0,
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

                            <div className="ed-row-date-block">
                              <h4 className="ed-row-date">{item.date}</h4>
                              <p className="ed-row-day">{item.weekday}</p>
                            </div>

                            <div className="ed-row-sessions">
                              {item.sessions.map((session, sIdx) => (
                                <div className="ed-row-session-item" key={sIdx}>
                                  <span className="ed-row-session-dot" />
                                  <p className="ed-row-session-text">
                                    {typeof session === "string" ? session : session.name}
                                  </p>
                                  {typeof session !== "string" && (
                                    <span className="ed-row-session-time">{session.time}</span>
                                  )}
                                </div>
                              ))}
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

            <div className="ed-event-panel ed-venue-panel" data-aos="fade-left" data-aos-delay="140">
              <div className="ed-subheading-wrap">
                <span className="ed-subheading-tag">Campus access</span>
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
                          className="ed-stack-hero ed-venue-hero"
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
                                <div className="ed-hero-title-meta">
                                  <h5 className="ed-hero-main-title">{VENUE.name}</h5>
                                  <p className="ed-venue-address">{VENUE.address}</p>
                                </div>
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
                      <div className="ed-schedule-expanded ed-venue-expanded" ref={venueListRef}>
                        <motion.div
                          ref={venueRowRef}
                          className={`ed-schedule-row${isVenueScrolledActive ? " is-scrolled" : ""}`}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            x: isVenueScrolledActive ? 4 : 0,
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
