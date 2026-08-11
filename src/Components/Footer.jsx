import { useRef, useEffect, useState } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaPhoneFlip,
  FaHeart,
  FaCopy,
  FaCheck,
} from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { BiGlobe } from "react-icons/bi";
import ieeeLogo from "../assets/ieee-sb-cec.png";
import isqipLogo from "../assets/isqip26.webp";

const GREEN        = "12,230,68";
const CONNECT_DIST = 90;    
const BASE_SPEED   = 0.22; 
const MAX_SPEED    = 1.2;

function makeStars(W, H) {
  const count = Math.min(Math.round((W * H) / 3000), 130);
  return Array.from({ length: count }, () => {
    const major = Math.random() < 0.18;   
    return {
      x:       Math.random() * W,
      y:       Math.random() * H,
      vx:      (Math.random() - 0.5) * BASE_SPEED * 2,
      vy:      (Math.random() - 0.5) * BASE_SPEED * 2,
      r:       major ? 2.2 + Math.random() * 1.3 : 0.6 + Math.random() * 1.0,
      phase:   Math.random() * Math.PI * 2,
      speed:   0.8 + Math.random() * 1.4,  
      major,
    };
  });
}

export default function Footer() {
  const socialLinks = [
    { name: "Instagram", icon: <FaInstagram />, link: "https://instagram.com/ieee_sb_cec" },
    { name: "LinkedIn",  icon: <FaLinkedin />,  link: "https://linkedin.com/company/ieee-sb-cec" },
    { name: "Website",   icon: <BiGlobe />,     link: "https://cecieee.org" },
  ];

  const navDirectory = [
    { num: "01", name: "Home", link: "#home" },
    { num: "02", name: "About ISQIP", link: "#about" },
    { num: "03", name: "Key Highlights", link: "#highlights" },
    { num: "04", name: "Track & Domains", link: "#domains" },
    { num: "05", name: "Event Details", link: "#event-details" },
    { num: "06", name: "Register Now", link: "#register" },
  ];

  const contactInfo = [
    { name: "Contact Name 1", role: "Event Lead", phone: "+91 XXXXX XXXXX" },
    { name: "Contact Name 2", role: "Student Coordinator", phone: "+91 XXXXX XXXXX" },
  ];

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (phone, index) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const footerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef  = useRef({ stars: [], time: 0, animId: null });

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = canvasRef.current;
    if (!footer || !canvas) return;

    function init() {
      canvas.width  = footer.offsetWidth;
      canvas.height = footer.offsetHeight;
      stateRef.current.stars = makeStars(canvas.width, canvas.height);
    }
    init();
    const ro = new ResizeObserver(init);
    ro.observe(footer);

    function draw() {
      const s   = stateRef.current;
      const ctx = canvas.getContext("2d");
      const W   = canvas.width;
      const H   = canvas.height;
      const { stars } = s;
      s.time += 0.012;
      const t = s.time;

      ctx.clearRect(0, 0, W, H);

      // ── Update star positions ───
      for (const st of stars) {
        const spd = Math.sqrt(st.vx * st.vx + st.vy * st.vy);
        if (spd > MAX_SPEED) { st.vx = (st.vx / spd) * MAX_SPEED; st.vy = (st.vy / spd) * MAX_SPEED; }
        st.vx *= 0.992;
        st.vy *= 0.992;
        st.x += st.vx;
        st.y += st.vy;
        if (st.x < -10)    st.x = W + 10;
        if (st.x > W + 10) st.x = -10;
        if (st.y < -10)    st.y = H + 10;
        if (st.y > H + 10) st.y = -10;
      }

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a  = stars[i];
          const b  = stars[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d > CONNECT_DIST) continue;
          const alpha = 0.2 * (1 - d / CONNECT_DIST);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${GREEN},${alpha.toFixed(3)})`;
          ctx.lineWidth   = 0.45;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const st of stars) {
        const twinkle = 0.75 + 0.25 * Math.sin(t * st.speed + st.phase);

        if (st.major) {
          const glowR = st.r * 3.5 * twinkle;
          const grad  = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, glowR);
          grad.addColorStop(0,   `rgba(${GREEN},0.10)`);
          grad.addColorStop(1,   `rgba(${GREEN},0)`);
          ctx.beginPath();
          ctx.arc(st.x, st.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        const r     = st.r * twinkle;
        const alpha = (st.major ? 0.85 : 0.55) * twinkle;

        ctx.globalAlpha = alpha;
        ctx.fillStyle   = "#0CE644";
        ctx.beginPath();
        ctx.arc(st.x, st.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      s.animId = requestAnimationFrame(draw);
    }

    stateRef.current.animId = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId);
    };
  }, []);

  const headingStyle = { letterSpacing: "0.18em", opacity: 0.85 };
  const lbarStyle = {
    display: "inline-block", width: "2px", height: "0.85em", flexShrink: 0,
    background: "#0CE644", boxShadow: "0 0 6px rgba(12,230,68,0.7)",
    opacity: 0, transform: "scaleY(0)", transition: "all 0.22s ease",
  };
  function onLinkEnter(e) {
    e.currentTarget.style.color      = "#0CE644";
    e.currentTarget.style.transform  = "translateX(5px)";
    e.currentTarget.style.textShadow = "0 0 10px rgba(12,230,68,0.45)";
    const bar = e.currentTarget.querySelector(".lbar");
    if (bar) { bar.style.opacity = "1"; bar.style.transform = "scaleY(1)"; }
  }
  function onLinkLeave(e) {
    e.currentTarget.style.color      = "";
    e.currentTarget.style.transform  = "";
    e.currentTarget.style.textShadow = "";
    const bar = e.currentTarget.querySelector(".lbar");
    if (bar) { bar.style.opacity = "0"; bar.style.transform = "scaleY(0)"; }
  }

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative overflow-hidden text-text"
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(12,230,68,0.25)",
        boxShadow: "0 -1px 0 0 rgba(12,230,68,0.08)",
      }}
    >
      {/* Cyber Flicker Animation Styles matching Navbar */}
      <style>{`
        @keyframes ft-flicker {
          0%, 100% { opacity: 1; }
          20% { opacity: 0.25; }
          35% { opacity: 1; }
          55% { opacity: 0.35; }
          65% { opacity: 1; }
        }
        .ft-hover-flicker:hover {
          animation: ft-flicker 0.3s linear;
        }
      `}</style>

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(12,230,68,0.07) 0%, transparent 70%)" }} />
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 py-10 sm:px-10 lg:grid-cols-12 lg:px-12">

        {/* IEEE SB CEC & ISQIP Logo Lockup */}
        <div className="flex flex-col items-center lg:col-span-4 lg:items-start">
          <div className="flex flex-wrap items-center justify-center gap-3.5 lg:justify-start">
            <a
              href="https://cecieee.org"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-hover-flicker transition-opacity duration-200 hover:opacity-80"
            >
              <img
                src={ieeeLogo}
                alt="IEEE Student Branch CEC"
                className="h-10 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(12,230,68,0.25))" }}
              />
            </a>

            <span className="text-xs font-medium tracking-widest text-text/50 uppercase">
              presents
            </span>

            <a
              href="#home"
              className="ft-hover-flicker transition-transform duration-200 hover:scale-105"
            >
              <img
                src={isqipLogo}
                alt="ISQIP 26"
                className="h-10 w-auto object-contain"
              />
            </a>
          </div>
          <div className="mt-5">
            <p className="text-lg font-semibold leading-7 text-text/90">IEEE Student Branch</p>
            <p className="text-sm leading-6 text-text/50">College of Engineering Chengannur</p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="ft-hover-flicker"
                style={{
                  color: "rgba(245,247,246,0.55)",
                  fontSize: "1.25rem",
                  transition: "all 0.22s ease",
                  display: "flex",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color     = "#0CE644";
                  e.currentTarget.style.filter    = "drop-shadow(0 0 6px rgba(12,230,68,0.6))";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color     = "rgba(245,247,246,0.55)";
                  e.currentTarget.style.filter    = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Directory */}
        <div className="flex flex-col items-center gap-4 lg:col-span-4 lg:items-start">
          <div className="w-full mb-1">
            <h3 className="font-mech text-[11px] uppercase tracking-widest text-primary" style={headingStyle}>
              NAVIGATION DIRECTORY
            </h3>
            <div style={{ height: "1px", marginTop: "6px", background: "linear-gradient(to right, rgba(12,230,68,0.55), rgba(12,230,68,0.08) 70%, transparent)" }} />
          </div>

          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {navDirectory.map((item) => (
              <a
                key={item.num}
                href={item.link}
                className="group ft-hover-flicker flex items-center gap-2.5 py-1 transition-all duration-200 hover:translate-x-1.5"
              >
                <span className="font-mono text-xs font-bold text-primary transition-colors group-hover:drop-shadow-[0_0_8px_rgba(12,230,68,0.8)]">
                  {item.num}
                </span>
                <span className="font-inter text-sm font-medium text-text/70 transition-colors group-hover:text-primary group-hover:drop-shadow-[0_0_10px_rgba(12,230,68,0.45)]">
                  {item.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* GET IN TOUCH */}
        <div className="flex flex-col items-center gap-4 lg:col-span-4 lg:items-start">
          <div className="w-full mb-1">
            <h3 className="font-mech text-[11px] uppercase tracking-widest text-primary" style={headingStyle}>GET IN TOUCH</h3>
            <div style={{ height: "1px", marginTop: "6px", background: "linear-gradient(to right, rgba(12,230,68,0.55), rgba(12,230,68,0.08) 70%, transparent)" }} />
          </div>
          <div className="flex w-full flex-col gap-4">
            {contactInfo.map((contact, index) => (
              <div
                key={index}
                className="group relative flex items-center justify-between gap-3 border-l-2 border-primary/40 pl-3.5 py-1 transition-all duration-200 hover:border-primary hover:translate-x-1"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-text/90 transition-colors group-hover:text-white">
                      {contact.name}
                    </span>
                    <span className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-primary">
                      {contact.role}
                    </span>
                  </div>

                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="ft-hover-flicker flex items-center gap-2 text-xs text-text/60 transition-colors hover:text-primary hover:drop-shadow-[0_0_8px_rgba(12,230,68,0.5)]"
                  >
                    <FaPhoneFlip className="rotate-90 text-[11px] text-primary" />
                    <span>{contact.phone}</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(contact.phone, index)}
                  title="Copy Phone Number"
                  aria-label={`Copy phone number for ${contact.name}`}
                  className="ft-hover-flicker flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-text/60 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-95"
                >
                  {copiedIndex === index ? (
                    <FaCheck className="text-xs text-primary" />
                  ) : (
                    <FaCopy className="text-xs" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(12,230,68,0.03)", backdropFilter: "blur(4px)" }}>
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-5 text-center sm:flex-row sm:gap-5">
          <p className="text-sm font-medium text-text/70">© {new Date().getFullYear()} IEEE Student Branch CEC. All rights reserved.</p>
          <span className="hidden sm:inline" style={{ color: "rgba(12,230,68,0.35)" }}>|</span>
          <p className="flex items-center gap-1 text-sm font-medium text-text/70">Made with <FaHeart style={{ color: "#0CE644", filter: "drop-shadow(0 0 4px rgba(12,230,68,0.6))" }} /> by IEEE SB CEC Web Team</p>
        </div>
      </div>
    </footer>
  );
}