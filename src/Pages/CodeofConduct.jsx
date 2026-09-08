import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&display=swap");

  .coc-section {
    background: #000000;
    min-height: 100vh;
    padding: clamp(5rem, 10vh, 7rem) clamp(1.25rem, 6vw, 5rem) clamp(3rem, 6vh, 5rem);
    position: relative;
    overflow: hidden;
  }

  .coc-inner {
    max-width: 860px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* ── Header ── */
  .coc-header {
    text-align: center;
    margin-bottom: clamp(2.5rem, 5vh, 4rem);
  }

  .coc-title {
    font-family: "Mechsuit", sans-serif;
    font-size: clamp(1.8rem, 4.5vw, 3rem);
    letter-spacing: 0.04em;
    color: var(--color-text);
    line-height: 1.1;
    margin: 0 0 0.5rem;
  }

  .coc-title span {
    color: var(--color-primary);
    text-shadow: 0 0 20px rgba(12,230,68,0.25);
  }

  /* divider matching Event Details & Learning Tracks */
  .coc-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 1.2rem auto clamp(1.8rem, 3vh, 2.5rem);
  }

  .coc-divider-line {
    height: 1px;
    width: clamp(40px, 8vw, 90px);
    background: linear-gradient(90deg, transparent, rgba(12, 230, 68, 0.5));
  }

  .coc-divider-line:last-child {
    background: linear-gradient(270deg, transparent, rgba(12, 230, 68, 0.5));
  }

  .coc-divider-diamond {
    width: 6px;
    height: 6px;
    background: var(--color-primary, #0CE644);
    transform: rotate(45deg);
    box-shadow: 0 0 8px 2px rgba(12, 230, 68, 0.5);
  }

  /* intro box */
  .coc-intro {
    max-width: 860px;
    border: 1px solid rgba(12,230,68,0.15);
    border-left: 3px solid rgba(12,230,68,0.6);
    border-radius: 0 4px 4px 0;
    padding: clamp(1rem, 2.5vw, 1.4rem) clamp(1.25rem, 3vw, 2rem);
    background: #080808;
    text-align: left;
  }

  .coc-intro p {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.93rem, 1.4vw, 1.02rem);
    line-height: 1.8;
    color: rgba(245,247,246,0.68);
    margin: 0;
  }

  /* ── Section list ── */
  .coc-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: clamp(2rem, 4vh, 3rem);
  }

  .coc-item {
    border-bottom: 1px solid rgba(12,230,68,0.12);
    transition: background 0.2s;
  }

  .coc-item:first-child {
    border-top: 1px solid rgba(12,230,68,0.12);
  }

  .coc-item:hover {
    background: #0a0a0a;
  }

  /* warning item */
  .coc-item-warn {
    border-bottom: 1px solid rgba(255,80,80,0.15);
    border-left: 2px solid rgba(255,80,80,0.5);
    padding-left: 1.1rem;
    background: rgba(255,50,50,0.02);
    transition: background 0.2s, border-left-color 0.2s, box-shadow 0.2s;
  }

  .coc-item-warn:hover {
    background: rgba(255,50,50,0.06);
    border-left-color: rgba(255,80,80,0.9);
    box-shadow: inset 3px 0 12px rgba(255,60,60,0.08);
  }

  /* ack item */
  .coc-item-ack {
    border-top: 1px solid rgba(12,230,68,0.12);
    border-bottom: 1px solid rgba(12,230,68,0.12);
    background: #080808;
    transition: background 0.2s;
  }

  .coc-item-ack:hover {
    background: #0e0e0e;
  }

  /* inner row: number + content */
  .coc-row {
    display: flex;
    gap: 1.25rem;
    padding: clamp(1.25rem, 2.8vh, 1.7rem) 0;
    align-items: flex-start;
  }

  .coc-num {
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.72rem, 1.1vw, 0.82rem);
    color: rgba(12,230,68,0.45);
    letter-spacing: 0.12em;
    flex-shrink: 0;
    width: 2rem;
    padding-top: 0.22em;
    transition: color 0.2s;
  }

  .coc-num-warn {
    font-family: "Share Tech Mono", monospace;
    font-size: 1rem;
    color: rgba(255,100,100,0.6);
    flex-shrink: 0;
    width: 2rem;
    padding-top: 0.05em;
    line-height: 1;
  }

  /* ack star — tighter gap */
  .coc-num-ack {
    font-family: "Share Tech Mono", monospace;
    font-size: 0.85rem;
    color: rgba(12,230,68,0.5);
    flex-shrink: 0;
    width: 1.5rem;
    padding-top: 0.18em;
    transition: color 0.2s;
  }

  .coc-item:hover .coc-num,
  .coc-item-ack:hover .coc-num-ack {
    color: rgba(12,230,68,0.9);
  }

  .coc-content {
    flex: 1;
    min-width: 0;
  }

  /* headings — green from the start */
  .coc-heading {
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.82rem, 1.5vw, 0.98rem);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-primary);
    margin: 0 0 0.65rem;
    line-height: 1.4;
    position: relative;
    display: inline-block;
    transition: text-shadow 0.25s, letter-spacing 0.25s;
  }

  /* hover: glow + slight letter spacing expand */
  .coc-item:hover .coc-heading,
  .coc-item-ack:hover .coc-heading {
    text-shadow: 0 0 12px rgba(12,230,68,0.55), 0 0 28px rgba(12,230,68,0.2);
    letter-spacing: 0.22em;
  }

  .coc-heading-warn {
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.82rem, 1.5vw, 0.98rem);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,130,130,0.95);
    margin: 0 0 0.65rem;
    line-height: 1.4;
    transition: text-shadow 0.25s, letter-spacing 0.25s;
  }

  /* warning hover — red pulse glow */
  @keyframes warn-pulse {
    0%   { text-shadow: 0 0 6px rgba(255,80,80,0.4); }
    50%  { text-shadow: 0 0 16px rgba(255,80,80,0.75), 0 0 32px rgba(255,80,80,0.2); }
    100% { text-shadow: 0 0 6px rgba(255,80,80,0.4); }
  }

  .coc-item-warn:hover .coc-heading-warn {
    animation: warn-pulse 1.4s ease-in-out infinite;
    letter-spacing: 0.22em;
  }

  .coc-body {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.9rem, 1.4vw, 1rem);
    line-height: 1.8;
    color: rgba(245,247,246,0.68);
    margin: 0;
  }

  .coc-body + .coc-body {
    margin-top: 0.6rem;
  }

  .coc-body strong {
    color: rgba(255,130,130,0.9);
    font-weight: 600;
  }

  .coc-body-ack {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.9rem, 1.4vw, 1rem);
    line-height: 1.78;
    color: rgba(245,247,246,0.65);
    font-weight: 500;
    margin: 0;
  }

  /* bullet sub-lists */
  .coc-bullets {
    list-style: none;
    margin: 0.75rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .coc-bullets li {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    font-family: "Inter", sans-serif;
    font-size: clamp(0.9rem, 1.4vw, 1rem);
    line-height: 1.7;
    color: rgba(245,247,246,0.58);
  }

  .coc-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(12,230,68,0.55);
    flex-shrink: 0;
    margin-top: 0.55em;
  }

  .coc-dot-warn {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255,80,80,0.6);
    flex-shrink: 0;
    margin-top: 0.55em;
  }
`;

const sections = [
  {
    title: "Respect Everyone",
    body: "Treat all fellow participants, speakers, mentors and coordinators with respect and courtesy.",
  },
  {
    title: "Inclusivity",
    body: "Discrimination or harassment based on gender, religion, ethnicity, disability, or background will not be tolerated.",
  },
  {
    title: "Professionalism",
    body: "Maintain a high standard of conduct — be punctual, prepared, and committed to learning.",
    bullets: [
      "Submit original work during technical sessions or project components",
      "Avoid plagiarism and misrepresentation",
      "Respect event resources, materials, and rules",
      "Use lab and technical equipment only as instructed",
    ],
  },
  {
    title: "Collaboration, Not Disruption",
    body: "Work constructively in your teams. Avoid behavior that distracts or disrupts learning.",
  },
  {
    title: "Guidelines and Decorum",
    body: "Participants should maintain good decorum and adhere to instructions given by organizers and volunteers.",
    bullets: [
      "Follow event schedule and timing",
      "Maintain discipline during sessions",
      "Respect venue rules and regulations",
      "Keep mobile devices on silent during sessions",
    ],
  },
  {
    title: "Reporting and Enforcement",
    body: "If you witness or experience any violation of this Code of Conduct, please report it immediately to the event organizers or volunteers. All reports will be handled confidentially and promptly.",
    body2: "Violations may result in warning, temporary suspension, or permanent removal from the event without refund, depending on the severity of the incident.",
  },
];

export default function CodeofConduct() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 40, easing: "ease-out" });
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <section className="coc-section">
        <div className="coc-inner">

          {/* Header */}
          <div className="coc-header" data-aos="fade-down">
            <h1 className="coc-title">
              Code Of <span>Conduct</span>
            </h1>
            <div className="coc-divider">
              <span className="coc-divider-line" />
              <span className="coc-divider-diamond" />
              <span className="coc-divider-line" />
            </div>
            <div className="coc-intro">
              <p>
                All participants, mentors, and volunteers of ISQIP '26 are
                expected to uphold the values of IEEE and maintain a professional,
                respectful, and inclusive environment throughout the event.
              </p>
            </div>
          </div>

          {/* Section list */}
          <div className="coc-list" data-aos="fade-up" data-aos-delay="80">

            {/* Regular sections */}
            {sections.map((sec, i) => (
              <div className="coc-item" key={i}>
                <div className="coc-row">
                  <span className="coc-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="coc-content">
                    <h2 className="coc-heading">{sec.title}</h2>
                    <p className="coc-body">{sec.body}</p>
                    {sec.body2 && <p className="coc-body">{sec.body2}</p>}
                    {sec.bullets && (
                      <ul className="coc-bullets">
                        {sec.bullets.map((b, j) => (
                          <li key={j}><span className="coc-dot" />{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Attendance Requirements — warning */}
            <div className="coc-item-warn">
              <div className="coc-row">
                <span className="coc-num-warn">!</span>
                <div className="coc-content">
                  <h2 className="coc-heading-warn">Attendance Requirements</h2>
                  <p className="coc-body">
                    <strong>Important: </strong>
                    Participants registered for both phases of ISQIP '26 must attend
                    both phases to be eligible for certificates, internship
                    opportunities, and any associated benefits. Those registered for
                    a single phase will remain eligible for benefits pertaining only
                    to that phase. Failure to attend both phases (where applicable)
                    will result in ineligibility for all benefits of the program.
                  </p>
                </div>
              </div>
            </div>

            {/* Prohibited Conduct — warning bullets */}
            <div className="coc-item">
              <div className="coc-row">
                <span className="coc-num">{String(sections.length + 1).padStart(2, "0")}</span>
                <div className="coc-content">
                  <h2 className="coc-heading">Prohibited Conduct</h2>
                  <p className="coc-body">
                    The following behaviors are strictly prohibited and may result
                    in immediate removal from the event:
                  </p>
                  <ul className="coc-bullets">
                    {[
                      "Harassment, intimidation, or discrimination of any kind",
                      "Disruptive behavior during presentations or workshops",
                      "Unauthorized use of equipment or materials",
                      "Substance abuse or inappropriate conduct",
                      "Violation of intellectual property rights",
                    ].map((b, j) => (
                      <li key={j}><span className="coc-dot-warn" />{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="coc-item-ack">
              <div className="coc-row">
                <span className="coc-num-ack">✦</span>
                <div className="coc-content">
                  <h2 className="coc-heading">Acknowledgment</h2>
                  <p className="coc-body-ack">
                    By registering and participating in ISQIP '26, you agree to abide
                    by this Code of Conduct and contribute to a safe, respectful, and
                    enriching environment for all.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
