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

  /* ── Simple Top Description ── */
  .coc-intro {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
  }

  .coc-intro p {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.93rem, 1.4vw, 1.02rem);
    line-height: 1.8;
    color: rgba(245, 247, 246, 0.85);
    margin: 0;
  }

  .coc-intro strong {
    color: #FFFFFF;
    font-weight: 600;
  }

  .coc-intro .coc-highlight-green {
    color: var(--color-primary);
    font-weight: 500;
  }

  /* ── Section list (clean, no hover effects) ── */
  .coc-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: clamp(2rem, 4vh, 3rem);
  }

  .coc-item {
    border-bottom: 1px solid rgba(12,230,68,0.12);
    position: relative;
  }

  .coc-item:first-child {
    border-top: 1px solid rgba(12,230,68,0.12);
  }

  /* warning item */
  .coc-item-warn {
    border-bottom: 1px solid rgba(255,80,80,0.15);
    border-left: 2px solid rgba(255,80,80,0.7);
    padding-left: 1.1rem;
    background: rgba(255,50,50,0.02);
  }

  /* ack item */
  .coc-item-ack {
    border-top: 1px solid rgba(12,230,68,0.12);
    border-bottom: 1px solid rgba(12,230,68,0.12);
    background: #080808;
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
    color: var(--color-primary);
    letter-spacing: 0.12em;
    flex-shrink: 0;
    width: 2rem;
    padding-top: 0.22em;
  }

  .coc-num-warn {
    font-family: "Share Tech Mono", monospace;
    font-size: 1rem;
    color: rgba(255,100,100,0.95);
    flex-shrink: 0;
    width: 2rem;
    padding-top: 0.05em;
    line-height: 1;
  }

  /* ack star — tighter gap */
  .coc-num-ack {
    font-family: "Share Tech Mono", monospace;
    font-size: 0.85rem;
    color: var(--color-primary);
    flex-shrink: 0;
    width: 1.5rem;
    padding-top: 0.18em;
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
  }

  .coc-heading-warn {
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.82rem, 1.5vw, 0.98rem);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,130,130,0.95);
    margin: 0 0 0.65rem;
    line-height: 1.4;
  }

  .coc-body {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.9rem, 1.4vw, 1rem);
    line-height: 1.8;
    color: rgba(245,247,246,0.85);
    margin: 0;
  }

  .coc-body + .coc-body {
    margin-top: 0.6rem;
  }

  .coc-body strong {
    color: rgba(255,130,130,0.95);
    font-weight: 600;
  }

  .coc-body-ack {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.9rem, 1.4vw, 1rem);
    line-height: 1.78;
    color: rgba(245,247,246,0.85);
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
    color: rgba(245,247,246,0.85);
  }

  .coc-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-primary);
    flex-shrink: 0;
    margin-top: 0.55em;
  }

  .coc-dot-warn {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255,80,80,0.95);
    flex-shrink: 0;
    margin-top: 0.55em;
  }

  /* ── Terminal acknowledgment ── */
  .coc-terminal {
    margin-top: clamp(1.5rem, 3vh, 2.5rem);
    border: 1px solid rgba(12,230,68,0.18);
    border-radius: 4px;
    overflow: hidden;
    background: #050505;
  }

  .coc-terminal-bar {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.6rem 1rem;
    background: rgba(12,230,68,0.03);
    border-bottom: 1px solid rgba(12,230,68,0.12);
  }

  .coc-terminal-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
  .coc-terminal-dot:nth-child(1) { background: #ff5f56; }
  .coc-terminal-dot:nth-child(2) { background: #ffbd2e; }
  .coc-terminal-dot:nth-child(3) { background: #27c93f; }

  .coc-terminal-label {
    font-family: "Share Tech Mono", monospace;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    color: rgba(12,230,68,0.5);
    margin-left: 0.4rem;
  }

  .coc-terminal-body {
    padding: clamp(1.1rem, 2.5vw, 1.6rem) clamp(1.25rem, 3vw, 1.8rem);
  }

  .coc-terminal-line {
    display: flex;
    align-items: baseline;
    gap: 0.65rem;
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.82rem, 1.3vw, 0.92rem);
    line-height: 1.8;
  }

  .coc-terminal-prompt {
    color: rgba(12,230,68,0.45);
    flex-shrink: 0;
    user-select: none;
  }

  .coc-terminal-cmd {
    color: rgba(245,247,246,0.7);
  }

  .coc-terminal-out {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.88rem, 1.35vw, 0.96rem);
    line-height: 1.75;
    color: rgba(245,247,246,0.68);
    padding-left: 1.25rem;
    margin: 0.35rem 0 0.85rem;
  }

  .coc-terminal-green {
    color: var(--color-primary);
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
                All participants, mentors, and volunteers of{" "}
                <span className="coc-highlight-green">ISQIP &apos;26</span> are
                expected to uphold the values of{" "}
                <strong>IEEE</strong> and maintain a professional,
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

            {/* Acknowledgment — terminal */}
            <div className="coc-terminal" data-aos="fade-up" data-aos-delay="100">
              <div className="coc-terminal-bar">
                <span className="coc-terminal-dot" />
                <span className="coc-terminal-dot" />
                <span className="coc-terminal-dot" />
                <span className="coc-terminal-label">acknowledgment.sh</span>
              </div>
              <div className="coc-terminal-body">
                <div className="coc-terminal-line">
                  <span className="coc-terminal-prompt">$</span>
                  <span className="coc-terminal-cmd">
                    cat <span className="coc-terminal-green">agreement.txt</span>
                  </span>
                </div>
                <div className="coc-terminal-out">
                  By registering and participating in{" "}
                  <span className="coc-terminal-green">ISQIP &apos;26</span>, you agree to
                  abide by this Code of Conduct and contribute to a safe, respectful,
                  and enriching environment for all.
                </div>
                <div className="coc-terminal-line">
                  <span className="coc-terminal-prompt">$</span>
                  <span className="coc-terminal-cmd">
                    echo <span className="coc-terminal-green">&quot;Welcome to ISQIP &apos;26&quot;</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
