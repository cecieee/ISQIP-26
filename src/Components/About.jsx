import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600&display=swap");

  .ab-section {
    position: relative;
    background: var(--color-background);
    overflow: hidden;
  }

  .ab-outer {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    align-items: center;
    min-height: clamp(500px, 75vh, 760px);
  }
  @media (max-width: 900px) {
    .ab-outer {
      grid-template-columns: 1fr;
      min-height: 0;
    }
  }

  .ab-textcol {
    position: relative;
    padding: clamp(3.5rem, 8vh, 5.5rem) clamp(1.5rem, 4vw, 3.5rem);
    padding-right: clamp(1.5rem, 3vw, 2.5rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  @media (max-width: 900px) {
    .ab-textcol { padding: clamp(3rem, 8vh, 4.5rem) clamp(1.5rem, 5vw, 2.5rem) 2rem; }
  }

  .ab-content-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
  }

  .ab-heading {
    font-family: var(--font-mech);
    font-size: clamp(2.2rem, 4.2vw, 3.6rem);
    line-height: 1;
    margin: 0 0 2.4rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    white-space: nowrap;
    display: flex;
    align-items: baseline;
    gap: 0.5em;
  }
  .ab-heading-stroke {
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(245, 247, 246, 0.85);
    text-stroke: 1.5px rgba(245, 247, 246, 0.85);
    filter: drop-shadow(0 0 10px rgba(245, 247, 246, 0.15));
  }
  .ab-heading span.ab-heading-accent {
    color: var(--color-primary);
    -webkit-text-stroke: 0;
    text-stroke: 0;
    text-shadow: 0 0 16px rgba(12, 230, 68, 0.65), 0 0 32px rgba(12, 230, 68, 0.25);
  }

  /* Unified body paragraphs with consistent font size and clean line height */
  .ab-body-flow {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    width: 100%;
  }

  .ab-paragraph {
    font-family: 'Inter', sans-serif;
    font-size: clamp(1.02rem, 1.35vw, 1.15rem);
    line-height: 1.78;
    color: rgba(245, 247, 246, 0.75);
    margin: 0;
    font-weight: 400;
    width: 100%;
  }

  .ab-paragraph strong {
    font-weight: 700;
    color: #FFFFFF;
  }

  .ab-paragraph em {
    font-style: italic;
    color: var(--color-primary);
    font-weight: 500;
  }

  .ab-imgcol {
    position: relative;
    height: clamp(380px, 52vw, 680px);
    clip-path: polygon(5% 0, 100% 0, 100% 100%, 0% 100%);
  }
  @media (max-width: 900px) {
    .ab-imgcol {
      height: clamp(260px, 62vw, 420px);
      clip-path: none;
      margin: 0 clamp(1.5rem, 6vw, 3rem);
    }
  }

  .ab-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 85% 26%;
    display: block;
    filter: saturate(0.92) contrast(1.03);
  }


  .ab-link-wrap {
    margin-top: 1.6rem;
  }

  .ab-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-primary);
    text-decoration: none;
    position: relative;
    padding-bottom: 2px;
    transition: color 0.2s ease;
  }

  .ab-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 1px;
    background: var(--color-primary);
    transition: width 0.25s ease;
  }

  .ab-link:hover {
    color: #FFFFFF;
  }

  .ab-link:hover::after {
    width: 100%;
    background: #FFFFFF;
  }

  .ab-link-icon {
    font-size: 1rem;
    line-height: 1;
    transition: transform 0.25s ease;
  }

  .ab-link:hover .ab-link-icon {
    transform: translate(3px, -3px);
  }
`;

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, offset: 60, easing: "ease-out" });
  }, []);

  return (
    <section id="about" className="ab-section">
      <style>{STYLES}</style>

      <div className="ab-outer">
        <div className="ab-textcol" data-aos="fade-down">
          <div className="ab-content-wrap">
            <h2 className="ab-heading">
              <span className="ab-heading-stroke">About</span>{" "}
              <span className="ab-heading-accent">ISQIP</span>
            </h2>

            <div className="ab-body-flow">
              <p className="ab-paragraph">
                <strong>IEEE Student Quality Improvement Programme (ISQIP '25)</strong> is a structured initiative designed to transform students into{" "}
                <em>industry-ready professionals</em>. The program features comprehensive domain-specific training with hands-on projects for{" "}
                <em>CSE</em>, <em>ECE</em>, and <em>EEE</em> students.
              </p>

              <p className="ab-paragraph">
                Beyond technical skills, <em>ISQIP '25</em> includes essential professional development through{" "}
                <strong>group discussions</strong>, <strong>mock interviews</strong>,{" "}
                <strong>aptitude training</strong>, <strong>resume building</strong>, and{" "}
                <strong>LinkedIn profile enhancement</strong>. Led by <em>industry experts</em>, the program ensures career readiness and opens doors to internship opportunities.
              </p>

              <div className="ab-link-wrap">
                <a
                  href="https://cecieee.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ab-link"
                >
                  <span>About IEEE SB CEC</span>
                  <span className="ab-link-icon">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="ab-imgcol" data-aos="fade-up" data-aos-delay="160">
          <img
            src="/isqip-photo.jpg"
            alt="ISQIP participants"
            className="ab-image"
          />
        </div>
      </div>
    </section>
  );
}