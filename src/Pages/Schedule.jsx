import { useEffect, useRef, useState } from "react";

const STYLES = `
	.sc-section {
		position: relative;
		background: var(--color-background);
		padding: clamp(7rem, 14vh, 9rem) clamp(1.5rem, 6vw, 4rem) clamp(4rem, 10vh, 6rem);
	}

	.sc-heading {
		font-family: var(--font-mech);
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		color: var(--color-text);
		text-transform: uppercase;
		line-height: 1;
		margin: 0 0 0.5rem;
		text-align: center;
	}
	.sc-heading span { color: var(--color-primary); }

	.sc-sub {
		text-align: center;
		font-family: 'Inter', sans-serif;
		color: rgba(245,247,246,0.55);
		max-width: 60ch;
		margin: 1.25rem auto clamp(2.5rem, 6vh, 3.5rem);
		font-size: clamp(1rem, 1.4vw, 1.1rem);
		line-height: 1.6;
	}

	.sc-phasegroup {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		margin-bottom: 1.75rem;
	}
	.sc-phasebtn {
		font-family: var(--font-mech);
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		padding: 0.55rem 1.4rem;
		border: 1px solid rgba(12,230,68,0.3);
		background: transparent;
		color: rgba(245,247,246,0.55);
		cursor: pointer;
		clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
		transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
	}
	.sc-phasebtn.sc-active {
		background: rgba(12,230,68,0.12);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.sc-phasewrap { text-align: center; margin-bottom: 1.75rem; }

	.sc-tabs {
		position: relative;
		display: inline-flex;
		gap: 0.35rem;
		padding: 0.3rem;
		background: var(--color-primary);
		clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
	}
	.sc-tabs::before {
		content: "";
		position: absolute;
		z-index: 0;
		inset: 1px;
		background: var(--color-background);
		clip-path: polygon(7px 0, 100% 0, calc(100% - 7px) 100%, 0 100%);
		pointer-events: none;
	}
	.sc-tab-slider {
		position: absolute;
		z-index: 1;
		top: 0.3rem;
		bottom: 0.3rem;
		left: 0.3rem;
		width: calc((100% - 0.95rem) / 2);
		background: var(--color-primary);
		clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
		pointer-events: none;
		transition: transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.sc-tab {
		position: relative;
		z-index: 1;
		flex: 1;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.82rem;
		letter-spacing: 0.03em;
		padding: 0.45rem 1.2rem;
		border: none;
		background: transparent;
		color: rgba(245,247,246,0.55);
		cursor: pointer;
		clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
		transition: background 0.25s ease, color 0.25s ease;
	}
	.sc-tab:hover {
		color: var(--color-text);
	}
	.sc-tab.sc-active {
		color: var(--color-background);
		font-weight: 600;
	}

	.sc-panel {
		width: 80vw;
		max-width: 80vw;
		margin: 0 auto;
		border: 1px solid rgba(12,230,68,0.2);
		background: rgba(245,247,246,0.02);
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
	}
	.sc-visible .sc-panel { opacity: 1; transform: translateY(0); }

	.sc-panelhead {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 1.5rem clamp(1.25rem, 4vw, 2.25rem) 1.1rem;
		border-bottom: 1px solid rgba(12,230,68,0.15);
	}
	.sc-daytitle {
		font-family: var(--font-mech);
		color: var(--color-text);
		font-size: 1.4rem;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		margin: 0;
	}
	.sc-daydate {
		font-family: 'Share Tech Mono', monospace;
		color: var(--color-primary);
		font-size: 0.82rem;
		display: block;
		margin-top: 0.25rem;
		letter-spacing: 0.02em;
	}
	.sc-tag {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-primary);
		border: 1px solid rgba(12,230,68,0.35);
		padding: 0.32rem 0.8rem;
		white-space: nowrap;
		align-self: flex-start;
	}

	.sc-rows { padding: 0.4rem clamp(1.25rem, 4vw, 2.25rem) 0.6rem; }

	@keyframes scRowIn {
		from { opacity: 0; transform: translateY(10px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.sc-row {
		display: grid;
		grid-template-columns: minmax(148px, 180px) auto 1fr;
		align-items: baseline;
		gap: clamp(1rem, 3vw, 2rem);
		padding: 1.3rem 0;
		border-bottom: 1px solid rgba(245,247,246,0.06);
		animation: scRowIn 0.55s cubic-bezier(0.16,1,0.3,1) both;
		transition: padding-left 0.25s ease, background 0.25s ease;
	}
	.sc-row:last-child { border-bottom: none; }
	.sc-row:hover {
		padding-left: 0.5rem;
		background: rgba(12,230,68,0.03);
	}

	.sc-sep {
		font-family: 'Share Tech Mono', monospace;
		color: rgba(12,230,68,0.7);
		font-size: 1.15rem;
		letter-spacing: 0.1em;
		padding: 0 0.5rem;
		align-self: center;
		text-shadow: 0 0 6px rgba(12,230,68,0.5);
	}

	.sc-time {
		display: inline-block;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: #020a04;
		white-space: nowrap;
		padding: 0.3rem 0.65rem;
		background: #0CE644;
		box-shadow: 0 0 10px rgba(12,230,68,0.5);
	}

	.sc-title {
		position: relative;
		display: inline-block;
		justify-self: start;
		font-family: "Share Tech Mono", monospace;
		font-size: clamp(0.95rem, 1.7vw, 1.1rem);
		letter-spacing: 0.03em;
		line-height: 1.45;
		color: var(--color-text);
		padding-bottom: 0.2rem;
	}
	.sc-title::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 0%;
		height: 1px;
		background: var(--color-primary);
		transition: width 0.35s ease;
	}
	.sc-row:hover .sc-title::after { width: 100%; }

	@media (max-width: 640px) {
		.sc-row {
			grid-template-columns: 1fr;
			grid-template-areas:
				"time"
				"title";
			row-gap: 0.4rem;
		}
		.sc-time { grid-area: time; }
		.sc-title { grid-area: title; }
		.sc-sep { display: none; }
	}

	.sc-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.1rem clamp(1.25rem, 4vw, 2.25rem);
		border-top: 1px solid rgba(12,230,68,0.15);
	}
	.sc-navslot { min-width: 140px; }
	.sc-navslot-right { text-align: right; }
	.sc-navbtn {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.78rem;
		color: rgba(245,247,246,0.65);
		background: transparent;
		border: 1px solid rgba(245,247,246,0.15);
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: border-color 0.2s ease, color 0.2s ease;
	}
	.sc-navbtn:hover { border-color: var(--color-primary); color: var(--color-primary); }
	.sc-navhint {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.72rem;
		color: rgba(245,247,246,0.35);
		text-align: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.sc-panel, .sc-row, .sc-title::after {
			transition: none !important; animation: none !important;
			transform: none !important; opacity: 1 !important;
		}
	}
`;

function useInView(threshold = 0.1) {
	const ref = useRef(null);
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ threshold }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold]);
	return [ref, inView];
}

const SCHEDULE = {
	1: {
		tag: "Domain Specific ISQIP",
		days: {
			1: {
				date: "Saturday, August 02, 2025",
				rows: [
					{ time: "08:00 AM - 09:00 AM", title: "Registration Starts" },
					{ time: "09:00 AM - 10:00 AM", title: "Inauguration" },
					{ time: "10:00 AM - 01:00 PM", title: "Session 1: Domain-Specific Session" },
					{ time: "01:00 PM - 02:00 PM", title: "Lunch Break" },
					{ time: "02:00 PM - 05:00 PM", title: "Session 2: Domain-Specific Session" },
					{ time: "05:00 PM - 05:15 PM", title: "Refreshments & Dispersal" },
				],
			},
			2: {
				date: "Sunday, August 03, 2025",
				rows: [
					{ time: "09:00 AM - 12:30 PM", title: "Session 1: Domain-Specific Session" },
					{ time: "12:30 PM - 01:30 PM", title: "Lunch Break" },
					{ time: "01:30 PM - 04:30 PM", title: "Session 2: Domain-Specific Session" },
					{ time: "04:30 PM - 05:00 PM", title: "Photo Session & Conclusion" },
					{ time: "05:00 PM - 05:15 PM", title: "Refreshments & Dispersal" },
				],
			},
		},
	},
	2: {
		tag: "General ISQIP",
		days: {
			1: {
				date: "Saturday, August 09, 2025",
				rows: [
					{ time: "09:00 AM - 10:30 AM", title: "Resume Building & LinkedIn Profile Optimisation Session" },
					{ time: "11:00 AM - 01:00 PM", title: "Aptitude Training Session" },
					{ time: "01:00 PM - 02:00 PM", title: "Lunch Break" },
					{ time: "02:15 PM - 04:30 PM", title: "GD & Interview Preparatory Session" },
					{ time: "04:30 PM - 05:00 PM", title: "Refreshments & Dispersal" },
				],
			},
			2: {
				date: "Sunday, August 10, 2025",
				rows: [
					{ time: "09:00 AM - 10:00 AM", title: "Aptitude Test" },
					{ time: "10:00 AM - 01:00 PM", title: "Group Discussion & Mock Interviews (Parallel Sessions)" },
					{ time: "01:00 PM - 02:00 PM", title: "Lunch Break" },
					{ time: "02:00 PM - 05:00 PM", title: "Group Discussion & Mock Interviews (Continued)" },
					{ time: "05:00 PM - 05:30 PM", title: "Refreshments, Photo Session & Closing Ceremony" },
				],
			},
		},
	},
};

export default function Schedule() {
	const [sectionRef, visible] = useInView(0.1);
	const [activePhase, setActivePhase] = useState(1);
	const [activeDay, setActiveDay] = useState(1);

	const phase = SCHEDULE[activePhase];
	const dayKeys = Object.keys(phase.days).map(Number);
	const day = phase.days[activeDay];
	const isFirstDay = activeDay === Math.min(...dayKeys);
	const isLastDay = activeDay === Math.max(...dayKeys);

	const goPrev = () => setActiveDay((d) => Math.max(Math.min(...dayKeys), d - 1));
	const goNext = () => setActiveDay((d) => Math.min(Math.max(...dayKeys), d + 1));

	return (
		<section id="schedule" className={`sc-section ${visible ? "sc-visible" : ""}`} ref={sectionRef}>
			<style>{STYLES}</style>

			<h2 className="sc-heading">
				Program <span>Schedule</span>
			</h2>
			<p className="sc-sub">
				A comprehensive 4-day programme designed to provide intensive
				training, hands-on experience, and industry exposure.
			</p>

			<div className="sc-phasegroup">
				{Object.keys(SCHEDULE).map((p) => (
					<button
						key={p}
						className={`sc-phasebtn ${Number(p) === activePhase ? "sc-active" : ""}`}
						onClick={() => {
							setActivePhase(Number(p));
							setActiveDay(1);
						}}
					>
						Phase {p}
					</button>
				))}
			</div>

			<div className="sc-phasewrap">
				<div className="sc-tabs">
					<span
						className="sc-tab-slider"
						style={{ transform: `translateX(${activeDay === 2 ? "calc(100% + 0.35rem)" : "0"})` }}
						aria-hidden="true"
					/>
					{dayKeys.map((d) => (
						<button
							key={d}
							className={`sc-tab ${d === activeDay ? "sc-active" : ""}`}
							onClick={() => setActiveDay(d)}
						>
							Day {d}
						</button>
					))}
				</div>
			</div>

			<div className="sc-panel">
				<div className="sc-panelhead">
					<div>
						<h3 className="sc-daytitle">Day {activeDay}</h3>
						<span className="sc-daydate">{day.date}</span>
					</div>
					<span className="sc-tag">{phase.tag}</span>
				</div>

				<div className="sc-rows" key={`${activePhase}-${activeDay}`}>
					{day.rows.map((row, i) => (
						<div className="sc-row" style={{ animationDelay: `${i * 70}ms` }} key={i}>
							<span className="sc-time">{row.time}</span>
							<span className="sc-sep">✦</span>
							<span className="sc-title">{row.title}</span>
						</div>
					))}
				</div>

				<div className="sc-nav">
					<div className="sc-navslot">
						{!isFirstDay && (
							<button className="sc-navbtn" onClick={goPrev}>← Previous Day</button>
						)}
					</div>
					<span className="sc-navhint">Navigate through the daily schedule</span>
					<div className="sc-navslot sc-navslot-right">
						{!isLastDay && (
							<button className="sc-navbtn" onClick={goNext}>Next Day →</button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
