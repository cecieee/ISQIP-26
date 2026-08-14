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
  const count = Math.min(Math.round((W * H) / 1800), 220);
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
    { name: "Contact Name", phone: "+91 XXXXX XXXXX" },
    { name: "Contact Name", phone: "+91 XXXXX XXXXX" },
  ];

  const watermarkLetters = ["I", "S", "Q", "I", "P", "2", "6"];
  const letterRefs = useRef([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [letterOpacities, setLetterOpacities] = useState([0, 0, 0, 0, 0, 0, 0]);

  const handleCopy = (phone, index) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const footerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef  = useRef({ stars: [], cx: -9999, cy: -9999, targetCx: -9999, targetCy: -9999, time: 0, animId: null });

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

      s.cx += (s.targetCx - s.cx) * 0.12;
      s.cy += (s.targetCy - s.cy) * 0.12;
      const { cx, cy } = s;

      ctx.clearRect(0, 0, W, H);

      if (cx > -1000 && cy > -1000) {
        const cursorGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
        cursorGlow.addColorStop(0, `rgba(${GREEN}, 0.14)`);
        cursorGlow.addColorStop(0.4, `rgba(${GREEN}, 0.04)`);
        cursorGlow.addColorStop(1, `rgba(${GREEN}, 0)`);
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const st of stars) {
        if (cx > -1000 && cy > -1000) {
          const dx = st.x - cx;
          const dy = st.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 1) {
            const force = ((130 - dist) / 130) * 0.04;
            st.vx += (dx / dist) * force;
            st.vy += (dy / dist) * force;
          }
        }
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

      for (const st of stars) {
        const twinkle = 0.75 + 0.25 * Math.sin(t * st.speed + st.phase);

        if (st.major) {
          const glowR = st.r * 3.5 * twinkle;
          const grad  = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, glowR);
          grad.addColorStop(0,   `rgba(${GREEN},0.12)`);
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

  function handleMouseMove(e) {
    const footer = footerRef.current;
    if (!footer) return;
    const rect = footer.getBoundingClientRect();
    stateRef.current.targetCx = e.clientX - rect.left;
    stateRef.current.targetCy = e.clientY - rect.top;

    const newOpacities = watermarkLetters.map((_, i) => {
      const el = letterRefs.current[i];
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const lx = r.left + r.width / 2;
      const ly = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - lx, e.clientY - ly);
      const radius = 140;
      if (dist < radius) {
        return Math.min(1, (1 - dist / radius) * 1.2);
      }
      return 0;
    });

    setLetterOpacities(newOpacities);
  }
  function handleMouseLeave() {
    stateRef.current.targetCx = -9999;
    stateRef.current.targetCy = -9999;
    setLetterOpacities([0, 0, 0, 0, 0, 0, 0]);
  }

  const headingStyle = {
    letterSpacing: "0.18em",
    opacity: 0.9,
  };
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        .ft-bracket-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ft-bracket-link::before,
        .ft-bracket-link::after {
          font-family: monospace;
          font-weight: 700;
          color: #0CE644;
          opacity: 0;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          text-shadow: 0 0 8px rgba(12, 230, 68, 0.8);
          pointer-events: none;
          position: absolute;
        }
        .ft-bracket-link::before {
          content: "[";
          left: -12px;
          transform: translateX(6px);
        }
        .ft-bracket-link::after {
          content: "]";
          right: -12px;
          transform: translateX(-6px);
        }
        .ft-bracket-link:hover::before,
        .ft-bracket-link:hover::after {
          opacity: 1;
          transform: translateX(0);
        }
        .ft-bracket-link:hover {
          color: #0CE644;
          text-shadow: 0 0 10px rgba(12, 230, 68, 0.45);
        }
      `}</style>
      
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none px-6 py-4"
      >
        <div className="flex items-center justify-center gap-1 sm:gap-2 font-mech text-[clamp(2.5rem,7.5vw,6.5rem)] uppercase leading-none tracking-wider whitespace-nowrap text-center">
          {watermarkLetters.map((char, index) => {
            const op = letterOpacities[index] || 0;
            return (
              <span
                key={index}
                ref={(el) => (letterRefs.current[index] = el)}
                className="inline-block transition-all duration-200 ease-out"
                style={{
                  opacity: op * 0.88,
                  color: "#0CE644",
                  textShadow: op > 0.05
                    ? `0 0 ${Math.round(24 * op)}px rgba(12,230,68,${(0.7 * op).toFixed(2)})`
                    : "none",
                  transform: `scale(${1 + 0.08 * op})`,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

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
              className="transition-all duration-250 hover:opacity-80 hover:drop-shadow-[0_0_10px_rgba(12,230,68,0.5)]"
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
              className="transition-all duration-250 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(12,230,68,0.5)]"
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
                style={{
                  color: "rgba(245,247,246,0.55)",
                  fontSize: "1.25rem",
                  transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                  display: "flex",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color     = "#0CE644";
                  e.currentTarget.style.filter    = "drop-shadow(0 0 10px rgba(12,230,68,0.7))";
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color     = "rgba(245,247,246,0.55)";
                  e.currentTarget.style.filter    = "none";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* EXPLORE */}
        <div className="flex flex-col items-center gap-4 lg:col-span-4 lg:items-start">
          <div className="w-full mb-1">
            <h3 className="font-mech text-[11px] uppercase tracking-widest text-primary" style={headingStyle}>
              ROOT LINKS
            </h3>
            <div style={{ height: "1px", marginTop: "6px", background: "linear-gradient(to right, rgba(12,230,68,0.55), rgba(12,230,68,0.08) 70%, transparent)" }} />
          </div>

          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3.5 sm:gap-x-8">
            {navDirectory.map((item) => (
              <a
                key={item.num}
                href={item.link}
                className="group ft-bracket-link inline-flex items-center gap-2 py-1 text-xs"
              >
                <span className="font-mono text-xs font-bold text-primary transition-transform duration-250 group-hover:scale-105">
                  {item.num}
                </span>
                <span className="font-inter text-sm font-medium text-text/70 transition-colors group-hover:text-primary">
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
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-semibold text-text/90">
                    {contact.name}
                  </span>

                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="ft-bracket-link inline-flex items-center gap-2 text-xs text-text/60 hover:text-primary"
                  >
                    <FaPhoneFlip className="rotate-90 text-[11px] text-primary" />
                    <span>{contact.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div
        onMouseEnter={handleMouseLeave}
        onMouseMove={(e) => {
          e.stopPropagation();
          handleMouseLeave();
        }}
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(12,230,68,0.03)", backdropFilter: "blur(4px)" }}
      >
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-5 text-center sm:flex-row sm:gap-5">
          <p className="text-sm font-medium text-text/70">© {new Date().getFullYear()} IEEE Student Branch CEC. All rights reserved.</p>
          <span className="hidden sm:inline" style={{ color: "rgba(12,230,68,0.35)" }}>|</span>
          <p className="flex items-center gap-1 text-sm font-medium text-text/70">Made with <FaHeart style={{ color: "#0CE644", filter: "drop-shadow(0 0 4px rgba(12,230,68,0.6))" }} /> by IEEE SB CEC Web Team</p>
        </div>
      </div>
    </footer>
  );
}