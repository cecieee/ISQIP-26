import { useRef, useEffect, useState } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaPhoneFlip,
  FaHeart,
} from "react-icons/fa6";
import { BiGlobe } from "react-icons/bi";
import ieeeLogo from "../assets/ieee-sb-cec.png";

const STYLES = `
  #footer *, #footer *::before, #footer *::after {
    box-sizing: border-box;
  }

  .ft-container {
    position: relative;
    width: 100%;
    background: #000000;
    overflow: hidden;
    color: #F5F7F6;
    perspective: 1000px;
  }

  /* ── Cyber Neon Laser Beam Sweep ── */
  #footer .ft-laser-topline {
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(12, 230, 68, 0.4) 20%,
      #0CE644 50%,
      rgba(12, 230, 68, 0.4) 80%,
      transparent 100%
    );
    box-shadow: 0 0 24px 4px rgba(12, 230, 68, 0.6);
    transform-origin: center;
    will-change: transform, opacity;
  }

  /* ── Cyberpunk Corner Accents ── */
  #footer .ft-corner-tl {
    position: absolute;
    top: 12px;
    left: 16px;
    width: 12px;
    height: 12px;
    border-top: 2px solid #0CE644;
    border-left: 2px solid #0CE644;
    opacity: 0.6;
  }

  #footer .ft-corner-tr {
    position: absolute;
    top: 12px;
    right: 16px;
    width: 12px;
    height: 12px;
    border-top: 2px solid #0CE644;
    border-right: 2px solid #0CE644;
    opacity: 0.6;
  }

  /* ── 3D Kinetic Folding Card Container ── */
  #footer .ft-3d-card {
    background: rgba(8, 14, 10, 0.85);
    border: 1px solid rgba(12, 230, 68, 0.18);
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(12, 230, 68, 0.15);
    transform-style: preserve-3d;
    will-change: transform, opacity;
  }

  /* ── Mechsuit Column Headings with Kinetic Letter Spacing ── */
  #footer .ft-col-head {
    font-family: var(--font-mech), sans-serif;
    font-size: 11px;
    color: #0CE644;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
    opacity: 0.95;
    transition: letter-spacing 0.3s ease;
  }

  /* ── Accent Line Under Headings ── */
  #footer .ft-head-line {
    height: 1px;
    width: 100%;
    background: linear-gradient(
      to right,
      rgba(12, 230, 68, 0.6),
      rgba(12, 230, 68, 0.1) 70%,
      transparent
    );
    margin-bottom: 1.25rem;
  }

  /* ── Link Hover styles ── */
  #footer .ft-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: rgba(245, 247, 246, 0.65);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    padding: 0.25rem 0;
    transition: color 0.22s ease, transform 0.22s ease, text-shadow 0.22s ease;
  }

  #footer .ft-link-bar {
    display: inline-block;
    width: 2px;
    height: 0.85em;
    flex-shrink: 0;
    background: #0CE644;
    box-shadow: 0 0 6px rgba(12, 230, 68, 0.7);
    opacity: 0;
    transform: scaleY(0);
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  #footer .ft-link:hover {
    color: #0CE644;
    transform: translateX(6px);
    text-shadow: 0 0 10px rgba(12, 230, 68, 0.45);
  }

  #footer .ft-link:hover .ft-link-bar {
    opacity: 1;
    transform: scaleY(1);
  }

  /* ── Social Links Hover ── */
  #footer .ft-social-link {
    color: rgba(245, 247, 246, 0.55);
    font-size: 1.25rem;
    display: flex;
    text-decoration: none;
    transition: all 0.22s ease;
  }

  #footer .ft-social-link:hover {
    color: #0CE644;
    filter: drop-shadow(0 0 6px rgba(12, 230, 68, 0.6));
    transform: translateY(-3px);
  }

  /* ── Phone link with 180 deg Icon ── */
  #footer .ft-phone-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(245, 247, 246, 0.65);
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.22s ease;
  }

  #footer .ft-phone-icon {
    transform: rotate(180deg);
    color: #0CE644;
    font-size: 0.75rem;
    transition: transform 0.25s ease, filter 0.25s ease;
  }

  #footer .ft-phone-link:hover {
    color: #0CE644;
    transform: translateX(5px);
    text-shadow: 0 0 10px rgba(12, 230, 68, 0.45);
  }

  #footer .ft-phone-link:hover .ft-phone-icon {
    filter: drop-shadow(0 0 8px rgba(12, 230, 68, 0.9));
  }

  /* ── Copyright Section ── */
  #footer .ft-copyright-bar {
    border-top: 1px solid rgba(12, 230, 68, 0.15);
    background: linear-gradient(180deg, rgba(12, 230, 68, 0.02) 0%, rgba(0, 0, 0, 1) 100%);
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.04);
  }

  /* ── Accessibility prefers-reduced-motion override ── */
  @media (prefers-reduced-motion: reduce) {
    #footer, .ft-3d-card, .ft-laser-topline {
      transform: none !important;
      opacity: 1 !important;
      transition: none !important;
    }
  }
`;

export default function Footer() {
  const socialLinks = [
    { name: "Instagram", icon: <FaInstagram />, link: "https://instagram.com/ieee_sb_cec" },
    { name: "LinkedIn",  icon: <FaLinkedin />,  link: "https://linkedin.com/company/ieee-sb-cec" },
    { name: "Website",   icon: <BiGlobe />,     link: "https://cecieee.org" },
  ];

  const pageLinks = [
    { name: "Home",     link: "#home" },
    { name: "Register", link: "#register" },
  ];

  const sectionLinks = [
    { name: "About",         link: "#about" },
    { name: "Highlights",    link: "#highlights" },
    { name: "Domains",       link: "#domains" },
    { name: "Event Details", link: "#event-details" },
  ];

  const contactInfo = [
    { name: "Contact Name", phone: "+91 XXXXX XXXXX" },
    { name: "Contact Name", phone: "+91 XXXXX XXXXX" },
  ];

  const footerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 3D Kinetic Scroll Physics Loop (60fps momentum)
  useEffect(() => {
    let animId;
    let target = 0;
    let current = 0;

    const handleScroll = () => {
      const footer = footerRef.current;
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visible = windowHeight - rect.top;
      const total = rect.height || 400;

      target = Math.min(Math.max(visible / (total * 0.7), 0), 1);
    };

    const loop = () => {
      current += (target - current) * 0.085;
      setScrollProgress(current);
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 3D Kinetic Transformations
  const rotateX = (1 - scrollProgress) * 14;      // 14deg ➔ 0deg 3D tilt
  const translateY = (1 - scrollProgress) * 45;   // 45px ➔ 0px lift
  const scale = 0.96 + scrollProgress * 0.04;     // 0.96 ➔ 1.0 scale
  const laserWidth = 0.2 + scrollProgress * 0.8;  // Laser expands center-out
  const letterSpacing = 0.06 + scrollProgress * 0.14; // Kinetic tracking spread

  return (
    <>
      <style>{STYLES}</style>
      
      <div className="ft-container">
        <footer
          id="footer"
          ref={footerRef}
          className="relative overflow-hidden bg-black text-[#F5F7F6] py-10 px-4 sm:px-8"
        >
          {/* Cyber Neon Laser Beam Sweep */}
          <div
            className="ft-laser-topline"
            style={{
              transform: `scaleX(${laserWidth.toFixed(3)})`,
              opacity: (0.4 + scrollProgress * 0.6).toFixed(3),
            }}
          />

          {/* Cyberpunk Corner Accents */}
          <div className="ft-corner-tl" />
          <div className="ft-corner-tr" />

          {/* Ambient Top Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(12, 230, 68, ${(scrollProgress * 0.14).toFixed(3)}) 0%, transparent 75%)`,
            }}
          />

          {/* 3D Kinetic Folding Card */}
          <div
            className="ft-3d-card relative z-10 mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12 my-4"
            style={{
              transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`,
              opacity: (0.4 + scrollProgress * 0.6).toFixed(3),
            }}
          >
            {/* Live Telemetry Status Pill */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#0CE644]">
                <span className="w-2 h-2 rounded-full bg-[#0CE644] animate-ping" />
                <span className="tracking-widest font-semibold uppercase">IEEE SB CEC CORE</span>
              </div>
              <div className="text-white/40 hidden sm:block tracking-wider uppercase">
                COLLEGE OF ENGINEERING CHENGANNUR
              </div>
            </div>

            {/* Grid Columns */}
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Column 1: IEEE Student Branch CEC Brand */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex min-h-20 items-center">
                  <img
                    src={ieeeLogo}
                    alt="IEEE Student Branch CEC"
                    className="w-64 object-contain"
                    style={{
                      filter:
                        "brightness(0) invert(1) drop-shadow(0 0 10px rgba(12,230,68,0.3))",
                    }}
                  />
                </div>
                <div className="mt-4 text-center lg:text-left">
                  <p className="text-base font-semibold leading-6 text-white/90">
                    IEEE Student Branch
                  </p>
                  <p className="text-xs leading-5 text-white/50">
                    College of Engineering Chengannur
                  </p>
                </div>
                
                {/* Original Social Links */}
                <div className="mt-6 flex items-center gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="ft-social-link"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 2: Pages */}
              <div className="flex flex-col gap-2">
                <div>
                  <h3
                    className="ft-col-head"
                    style={{ letterSpacing: `${letterSpacing.toFixed(3)}em` }}
                  >
                    Pages
                  </h3>
                  <div className="ft-head-line" />
                </div>
                <div className="flex flex-col gap-1">
                  {pageLinks.map((link, index) => (
                    <a key={index} href={link.link} className="ft-link">
                      <span className="ft-link-bar" />
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 3: Sections */}
              <div className="flex flex-col gap-2">
                <div>
                  <h3
                    className="ft-col-head"
                    style={{ letterSpacing: `${letterSpacing.toFixed(3)}em` }}
                  >
                    Sections
                  </h3>
                  <div className="ft-head-line" />
                </div>
                <div className="flex flex-col gap-1">
                  {sectionLinks.map((link, index) => (
                    <a key={index} href={link.link} className="ft-link">
                      <span className="ft-link-bar" />
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 4: Contact Us */}
              <div className="flex flex-col items-center lg:items-start gap-2">
                <div className="w-full text-center lg:text-left">
                  <h3
                    className="ft-col-head"
                    style={{ letterSpacing: `${letterSpacing.toFixed(3)}em` }}
                  >
                    Contact Us
                  </h3>
                  <div className="ft-head-line" />
                </div>
                <div className="flex flex-col gap-4 text-center lg:text-left">
                  {contactInfo.map((contact, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-white/90">
                        {contact.name}
                      </span>
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, "")}`}
                        className="ft-phone-link justify-center lg:justify-start"
                      >
                        <FaPhoneFlip className="ft-phone-icon" />
                        <span>{contact.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Copyright Section */}
          <div className="ft-copyright-bar relative z-10 rounded-b-2xl">
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-5 text-center sm:flex-row sm:gap-5">
              <p className="text-sm font-medium text-white/75">
                © {new Date().getFullYear()} IEEE Student Branch CEC. All rights reserved.
              </p>
              <span className="hidden sm:inline text-[#0CE644]/40">|</span>
              <p className="flex items-center gap-1.5 text-sm font-medium text-white/75">
                Made with{" "}
                <FaHeart
                  style={{
                    color: "#0CE644",
                    filter: "drop-shadow(0 0 6px rgba(12,230,68,0.7))",
                  }}
                />{" "}
                by IEEE SB CEC Web Team
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
