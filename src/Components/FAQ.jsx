import { useState } from "react";
import { IoMail, IoCall } from "react-icons/io5";

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap");

  .faq-section {
    background: var(--color-background);
    padding: clamp(3rem, 7vh, 5.5rem) clamp(1rem, 5vw, 5rem);
    position: relative;
    overflow: hidden;
  }

  .faq-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 50% at 50% 50%, rgba(12,230,68,0.045) 0%, transparent 70%);
    pointer-events: none;
  }

  .faq-eyebrow {
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.65rem, 1.1vw, 0.75rem);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--color-primary);
    text-shadow: 0 0 8px rgba(12,230,68,0.55);
    margin-bottom: 0.55rem;
  }

  .faq-header {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .faq-title {
    font-family: "Mechsuit", sans-serif;
    font-size: clamp(1.35rem, 4.5vw, 2.2rem);
    letter-spacing: 0.04em;
    color: var(--color-text);
    line-height: 1.2;
    text-align: center;
    text-wrap: balance;
    word-break: break-word;
    margin: 0 0 clamp(2rem, 4.5vh, 3.5rem);
  }

  .faq-title span {
    color: var(--color-primary);
    text-shadow:
      0 0 4px rgba(12,230,68,0.7),
      0 0 18px rgba(12,230,68,0.3);
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 860px;
    margin: 0 auto;
    width: 100%;
  }

  .faq-item {
    border-bottom: 1px solid rgba(12,230,68,0.12);
    transition: border-color 0.25s;
  }
  .faq-item:first-child {
    border-top: 1px solid rgba(12,230,68,0.12);
  }
  .faq-item.faq-open {
    border-bottom-color: rgba(12,230,68,0.25);
  }

  .faq-trigger {
    width: 100%;
    background: transparent;
    border: none;
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(0.75rem, 2.5vw, 1.25rem);
    padding: clamp(1rem, 2.2vh, 1.5rem) 0;
    text-align: left;
    color: var(--color-text);
    transition: color 0.2s;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }
  .faq-trigger::-webkit-details-marker,
  .faq-trigger::marker {
    display: none;
  }
  .faq-trigger:active,
  .faq-trigger:focus,
  .faq-trigger:focus-visible {
    background: transparent;
    outline: none;
  }
  .faq-trigger:hover .faq-q {
    color: var(--color-primary);
    text-shadow: 0 0 6px rgba(12,230,68,0.45);
  }
  .faq-open .faq-trigger .faq-q {
    color: var(--color-primary);
    text-shadow: 0 0 6px rgba(12,230,68,0.45);
  }

  .faq-q {
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.92rem, 1.8vw, 1.18rem);
    letter-spacing: 0.02em;
    line-height: 1.45;
    flex: 1;
    min-width: 0;
    transition: color 0.2s, text-shadow 0.2s;
  }

  .faq-idx {
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.75rem, 1.2vw, 0.85rem);
    color: rgba(12,230,68,0.5);
    letter-spacing: 0.12em;
    flex-shrink: 0;
    width: 2.2rem;
    text-align: left;
    transition: color 0.2s;
  }
  .faq-open .faq-trigger .faq-idx {
    color: rgba(12,230,68,0.85);
  }

  .faq-chevron {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .faq-chevron::before,
  .faq-chevron::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 1.5px;
    background: var(--color-primary);
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 4px rgba(12,230,68,0.5);
  }
  .faq-chevron::before {
    transform: rotate(-45deg) translateX(2.5px);
  }
  .faq-chevron::after {
    transform: rotate(45deg) translateX(-2.5px);
  }
  .faq-open .faq-chevron::before {
    transform: rotate(45deg) translateX(2.5px);
  }
  .faq-open .faq-chevron::after {
    transform: rotate(-45deg) translateX(-2.5px);
  }

  /* smooth height reveal — grid trick */
  .faq-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .faq-open .faq-body {
    grid-template-rows: 1fr;
  }
  .faq-body-inner {
    overflow: hidden;
  }

  .faq-answer {
    font-family: "Inter", sans-serif;
    font-size: clamp(0.85rem, 1.1vw, 0.95rem);
    line-height: 1.72;
    color: rgba(245,247,246,0.68);
    padding-bottom: clamp(1rem, 2vh, 1.35rem);
    padding-left: clamp(1.5rem, 3.5vw, 2.75rem);
    padding-right: 0.5rem;
    margin: 0;
  }

  .faq-contact {
    max-width: 860px;
    margin: clamp(2.5rem, 5vh, 4rem) auto 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    border: 1px solid rgba(12,230,68,0.18);
    border-radius: 4px;
    padding: clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 3vw, 2rem);
    background: rgba(12,230,68,0.03);
    flex-wrap: wrap;
    width: 100%;
  }

  .faq-contact-text {
    flex: 1;
    min-width: 180px;
  }

  .faq-contact-label {
    font-family: "Share Tech Mono", monospace;
    font-size: clamp(0.62rem, 1vw, 0.7rem);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(12,230,68,0.5);
    margin-bottom: 0.25rem;
  }

  .faq-contact-heading {
    font-family: "Mechsuit", sans-serif;
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    letter-spacing: 0.05em;
    color: var(--color-text);
  }

  .faq-contact-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .faq-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    font-family: "Share Tech Mono", monospace;
    font-size: 0.76rem;
    letter-spacing: 0.08em;
    padding: 0.55rem 1rem;
    border-radius: 3px;
    text-decoration: none;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }

  .faq-btn-primary {
    background: var(--color-primary);
    color: #071110;
    border: 1px solid var(--color-primary);
    box-shadow: 0 0 10px rgba(12,230,68,0.2);
  }
  .faq-btn-primary:hover {
    background: rgba(12,230,68,0.82);
    box-shadow: 0 0 20px rgba(12,230,68,0.4);
  }

  .faq-btn-ghost {
    background: transparent;
    color: var(--color-primary);
    border: 1px solid rgba(12,230,68,0.3);
  }
  .faq-btn-ghost:hover {
    background: rgba(12,230,68,0.07);
    border-color: rgba(12,230,68,0.6);
    box-shadow: 0 0 10px rgba(12,230,68,0.12);
  }

  /* Mobile view optimizations preserving current design */
  @media (max-width: 600px) {
    .faq-title {
      white-space: normal;
    }
    .faq-idx {
      width: 1.75rem;
    }
    .faq-answer {
      padding-left: 1.75rem;
      padding-right: 0;
    }
    .faq-contact {
      flex-direction: column;
      align-items: stretch;
      gap: 1.1rem;
    }
    .faq-contact-actions {
      width: 100%;
      display: flex;
      gap: 0.6rem;
    }
    .faq-btn {
      flex: 1 1 0%;
      padding: 0.6rem 0.75rem;
    }
  }

  @media (max-width: 360px) {
    .faq-trigger {
      gap: 0.5rem;
    }
    .faq-idx {
      width: 1.5rem;
      font-size: 0.72rem;
    }
    .faq-answer {
      padding-left: 1.5rem;
    }
    .faq-contact-actions {
      flex-direction: column;
    }
    .faq-btn {
      width: 100%;
    }
  }
`;

const faqData = [
  {
    question: "What is ISQIP '26?",
    answer:
      "IEEE Student Quality Improvement Programme (ISQIP '26) is a comprehensive 4-day intensive training program designed to bridge the gap between academic learning and industry requirements. It focuses on practical skills development across multiple engineering domains including Computer Science, Electronics & Communication, and Electrical & Electronics Engineering.",
  },
  {
    question: "Is ISQIP '26 really free for IEEE Members?",
    answer:
      "Yes, ISQIP '26 is completely free for all IEEE Members. This includes all training materials, project resources, mentorship sessions, and certificates. IEEE Student Branch CEC sponsors the entire program to support student development in the engineering community.",
  },
  {
    question: "What are the career development sessions?",
    answer:
      "Career development sessions include resume building workshops, interview preparation, industry insights, networking opportunities with professionals, guidance on higher studies, and career path planning. These sessions are conducted by HR professionals and industry veterans to prepare students for successful careers.",
  },
  {
    question: "Are there competitions and prizes?",
    answer:
      "Yes, ISQIP '26 features various competitions including project presentations, technical quizzes, and innovation challenges. Winners receive certificates, internship opportunities, and exciting prizes. All participants receive participation certificates and project completion certificates.",
  },
  {
    question: "Can I attend if I have no coding experience?",
    answer:
      "Absolutely! ISQIP '26 is designed for students at all skill levels. We provide foundational training and gradually progress to advanced topics. Our mentors are experienced in teaching beginners, and peer learning is encouraged. The program structure accommodates both beginners and those with prior experience.",
  },
  {
    question: "What makes ISQIP '26 special?",
    answer:
      "ISQIP '26 stands out due to its comprehensive approach combining theoretical knowledge with hands-on projects, industry mentor guidance, career development focus, networking opportunities, and completely free access to quality education. The program's emphasis on practical skills and industry readiness makes it unique among student development initiatives.",
  },
  {
    question: "Should I attend all 4 days?",
    answer:
      "Yes, attending all 4 days is compulsory to gain the full benefit of the program. Each day builds on the previous one, covering essential topics and skills. Missing any day may result in gaps in knowledge and skills development. Certificates are awarded only to those who complete the entire program.",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});
  const toggle = (i) => setOpenItems((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <>
      <style>{STYLES}</style>
      <section id="faq" className="faq-section">
        <div className="faq-header">
          <h2 className="faq-title">
            Frequently Asked <span>Questions</span>
          </h2>
        </div>
        <div className="faq-list">
          {faqData.map((item, i) => (
            <div
              key={i}
              className={`faq-item${openItems[i] ? " faq-open" : ""}`}
            >
              <button
                id={`faq-trigger-${i}`}
                className="faq-trigger"
                onClick={() => toggle(i)}
                aria-expanded={!!openItems[i]}
                aria-controls={`faq-body-${i}`}
              >
                <span className="faq-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-q">{item.question}</span>
                <span className="faq-chevron" aria-hidden="true" />
              </button>

              <div
                id={`faq-body-${i}`}
                className="faq-body"
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
              >
                <div className="faq-body-inner">
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="faq-contact" data-aos="fade-up" data-aos-duration="400">
          <div className="faq-contact-text">
            <p className="faq-contact-label">// Support</p>
            <p className="faq-contact-heading">Still have questions?</p>
          </div>
          <div className="faq-contact-actions">
            <a href="mailto:isqip@cecieee.org" className="faq-btn faq-btn-primary">
              <IoMail size={13} />
              Email Us
            </a>
            <a href="tel:+918075015042" className="faq-btn faq-btn-ghost">
              <IoCall size={13} />
              Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}