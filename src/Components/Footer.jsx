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
  }

  /* ── Ultra-Smooth Laser Top Edge Line ── */
  #footer .ft-topline {
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(12, 230, 68, 0.3) 15%,
      #0CE644 50%,
      rgba(12, 230, 68, 0.3) 85%,
      transparent 100%
    );
    box-shadow: 0 0 20px 2px rgba(12, 230, 68, 0.5);
    transform-origin: center;
    will-change: transform, opacity;
  }

  /* ── Cyberpunk Corner Brackets ── */
  #footer .ft-corner-tl {
    position: absolute;
    top: 16px;
    left: 20px;
    width: 14px;
    height: 14px;
    border-top: 2px solid #0CE644;
    border-left: 2px solid #0CE644;
    box-shadow: -2px -2px 10px rgba(12, 230, 68, 0.6);
    opacity: 0.8;
    z-index: 10;
  }

  #footer .ft-corner-tr {
    position: absolute;
    top: 16px;
    right: 20px;
    width: 14px;
    height: 14px;
    border-top: 2px solid #0CE644;
    border-right: 2px solid #0CE644;
    box-shadow: 2px -2px 10px rgba(12, 230, 68, 0.6);
    opacity: 0.8;
    z-index: 10;
  }

  /* ── Mechsuit Column Headings with Smooth Kinetic Spacing ── */
  #footer .ft-col-head {
    font-family: var(--font-mech), sans-serif;
    font-size: 11px;
    color: #0CE644;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
    opacity: 0.95;
    transition: letter-spacing 0.3s ease;
  }

  /* ── Glowing Accent Line Under Headings ── */
  #footer .ft-head-line {
    height: 1px;
    width: 100%;
    background: linear-gradient(
      to right,
      rgba(12, 230, 68, 0.6),
      rgba(12, 230, 68, 0.08) 70%,
      transparent
    );
    margin-bottom: 1.25rem;
  }

  /* ── Ultra-Smooth Link Hover Transitions ── */
  #footer .ft-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(245, 247, 246, 0.65);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    padding: 0.25rem 0;
    transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  #footer .ft-link-bar {
    display: inline-block;
    width: 2px;
    height: 0.85em;
    flex-shrink: 0;
    background: #0CE644;
    box-shadow: 0 0 8px rgba(12, 230, 68, 0.8);
    opacity: 0;
    transform: scaleY(0);
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  #footer .ft-link:hover {
    color: #0CE644;
    transform: translateX(6px);
    text-shadow: 0 0 12px rgba(12, 230, 68, 0.5);
  }

  #footer .ft-link:hover .ft-link-bar {
    opacity: 1;
    transform: scaleY(1);
  }

  /* ── Premium Social Links Hover ── */
  #footer .ft-social-link {
    color: rgba(245, 247, 246, 0.55);
    font-size: 1.25rem;
    display: flex;
    text-decoration: none;
    transition: color 0.25s ease, filter 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  #footer .ft-social-link:hover {
    color: #0CE644;
    filter: drop-shadow(0 0 8px rgba(12, 230, 68, 0.7));
    transform: translateY(-4px);
  }

  /* ── Phone Link Hover with 180 deg Rotated Icon ── */
  #footer .ft-phone-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(245, 247, 246, 0.65);
    font-size: 0.875rem;
    text-decoration: none;
    transition: color 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.25s ease;
  }

  #footer .ft-phone-icon {
    transform: rotate(180deg);
    color: #0CE644;
    font-size: 0.75rem;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  #footer .ft-phone-link:hover {
    color: #0CE644;
    transform: translateX(6px);
    text-shadow: 0 0 12px rgba(12, 230, 68, 0.5);
  }

  #footer .ft-phone-link:hover .ft-phone-icon {
    filter: drop-shadow(0 0 10px rgba(12, 230, 68, 0.95));
  }

  /* ── Compact Copyright Section ── */
  #footer .ft-copyright-bar {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(12, 230, 68, 0.02);
    backdrop-filter: blur(6px);
  }

  /* ── Column Motion Base ── */
  .ft-col-stagger {
    will-change: transform, opacity;
  }

  /* ── Reduced Motion Override ── */
  @media (prefers-reduced-motion: reduce) {
    #footer, .ft-col-stagger, .ft-topline {
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

  // Ultra-Smooth 60fps Lerp Scroll Physics Loop
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
      const total = rect.height || 350;

      target = Math.min(Math.max(visible / (total * 0.7), 0), 1);
    };

    const loop = () => {
      // Fluid exponential lerp momentum
      current += (target - current) * 0.08;
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

  // Staggered motion metrics for ultra-smooth column entrance
  const laserScaleX = Math.min(Math.max(scrollProgress * 1.05, 0), 1);
  const letterSpacing = 0.06 + scrollProgress * 0.14; // Kinetic heading tracking

  // Staggered column offsets
  const c1Offset = (1 - scrollProgress) * 18;
  const c2Offset = (1 - scrollProgress) * 28;
  const c3Offset = (1 - scrollProgress) * 38;
  const c4Offset = (1 - scrollProgress) * 48;

  const c1Opacity = Math.min(Math.max(scrollProgress * 1.3, 0), 1);
  const c2Opacity = Math.min(Math.max((scrollProgress - 0.08) * 1.3, 0), 1);
  const c3Opacity = Math.min(Math.max((scrollProgress - 0.16) * 1.3, 0), 1);
  const c4Opacity = Math.min(Math.max((scrollProgress - 0.24) * 1.3, 0), 1);

  return (
    <>
      <style>{STYLES}</style>
      
      <div className="ft-container">
        <footer
          id="footer"
          ref={footerRef}
          className="relative overflow-hidden bg-black text-[#F5F7F6]"
        >
          {/* Ultra-Smooth Laser Top Edge Line */}
          <div
            className="ft-topline"
            style={{
              transform: `scaleX(${laserScaleX.toFixed(3)})`,
              opacity: (0.3 + scrollProgress * 0.7).toFixed(3),
            }}
          />

          {/* Cyberpunk Corner Brackets */}
          <div className="ft-corner-tl" />
          <div className="ft-corner-tr" />

          {/* Ambient Top Radial Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 75% 55% at 50% 0%, rgba(12, 230, 68, ${(scrollProgress * 0.14).toFixed(3)}) 0%, transparent 75%)`,
            }}
          />

          {/* Main Content Layout */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-8 pb-8 sm:px-10 lg:px-12">
            
            {/* Live IEEE SB CEC Telemetry Status Bar */}
            <div
              className="flex items-center justify-between pb-4 mb-8 border-b border-white/10 text-xs font-mono transition-opacity duration-300"
              style={{ opacity: (0.3 + scrollProgress * 0.7).toFixed(3) }}
            >
              <div className="flex items-center gap-2 text-[#0CE644]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0CE644] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0CE644]" />
                </span>
                <span className="tracking-widest font-semibold uppercase">
                  IEEE SB CEC CORE • SYSTEM ACTIVE
                </span>
              </div>
              <div className="text-white/40 hidden sm:block tracking-wider uppercase">
                COLLEGE OF ENGINEERING CHENGANNUR
              </div>
            </div>

            {/* Staggered Grid Columns */}
            <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Column 1: IEEE Student Branch CEC Brand */}
              <div
                className="ft-col-stagger flex flex-col items-center lg:items-start"
                style={{
                  transform: `translate3d(0, ${c1Offset.toFixed(2)}px, 0)`,
                  opacity: c1Opacity.toFixed(3),
                }}
              >
                <div className="flex min-h-20 items-center">
                  <img
                    src={ieeeLogo}
                    alt="IEEE Student Branch CEC"
                    className="w-64 object-contain"
                    style={{
                      filter:
                        "brightness(0) invert(1) drop-shadow(0 0 10px rgba(12,230,68,0.25))",
                    }}
                  />
                </div>
                <div className="mt-4 text-center lg:text-left">
                  <p className="text-lg font-semibold leading-7 text-white/90">
                    IEEE Student Branch
                  </p>
                  <p className="text-sm leading-6 text-white/50">
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
              <div
                className="ft-col-stagger flex flex-col gap-4"
                style={{
                  transform: `translate3d(0, ${c2Offset.toFixed(2)}px, 0)`,
                  opacity: c2Opacity.toFixed(3),
                }}
              >
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
              <div
                className="ft-col-stagger flex flex-col gap-4"
                style={{
                  transform: `translate3d(0, ${c3Offset.toFixed(2)}px, 0)`,
                  opacity: c3Opacity.toFixed(3),
                }}
              >
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
              <div
                className="ft-col-stagger flex flex-col items-center lg:items-start gap-4"
                style={{
                  transform: `translate3d(0, ${c4Offset.toFixed(2)}px, 0)`,
                  opacity: c4Opacity.toFixed(3),
                }}
              >
                <div className="w-full text-center lg:text-left">
                  <h3
                    className="ft-col-head"
                    style={{ letterSpacing: `${letterSpacing.toFixed(3)}em` }}
                  >
                    Contact Us
                  </h3>
                  <div className="ft-head-line" />
                </div>
                <div className="flex flex-col gap-5 text-center lg:text-left">
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

          {/* Compact Copyright Bar */}
          <div className="ft-copyright-bar relative z-10">
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-4 text-center sm:flex-row sm:gap-5">
              <p className="text-sm font-medium text-white/70">
                © {new Date().getFullYear()} IEEE Student Branch CEC. All rights reserved.
              </p>
              <span className="hidden sm:inline text-[#0CE644]/35">|</span>
              <p className="flex items-center gap-1 text-sm font-medium text-white/70">
                Made with{" "}
                <FaHeart
                  style={{
                    color: "#0CE644",
                    filter: "drop-shadow(0 0 4px rgba(12,230,68,0.6))",
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
