import { useRef, useEffect } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaPhoneFlip,
  FaHeart,
} from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { BiGlobe } from "react-icons/bi";
import ieeeLogo from "../assets/ieee-sb-cec.png";

const GREEN        = "12,230,68";
const CONNECT_DIST = 90;    
const CURSOR_DIST  = 170;  
const REPEL_DIST   = 120;
const REPEL_FORCE  = 0.07;
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
  const canvasRef = useRef(null);
  const stateRef  = useRef({ stars: [], cx: -9999, cy: -9999, time: 0, animId: null });

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
      const { stars, cx, cy } = s;
      s.time += 0.012;
      const t = s.time;

      ctx.clearRect(0, 0, W, H);

      // ── Update star positions ───
      for (const st of stars) {
        const dx   = st.x - cx;
        const dy   = st.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DIST && dist > 0.5) {
          const str = ((REPEL_DIST - dist) / REPEL_DIST) * REPEL_FORCE;
          st.vx += (dx / dist) * str;
          st.vy += (dy / dist) * str;
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
        const dx     = st.x - cx;
        const dy     = st.y - cy;
        const dist   = Math.sqrt(dx * dx + dy * dy);
        const near   = dist < REPEL_DIST * 1.3;

        const twinkle = 0.75 + 0.25 * Math.sin(t * st.speed + st.phase);

        if (st.major) {
          const glowR = st.r * (near ? 5 : 3.5) * twinkle;
          const grad  = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, glowR);
          grad.addColorStop(0,   `rgba(${GREEN},${(near ? 0.18 : 0.1).toFixed(2)})`);
          grad.addColorStop(1,   `rgba(${GREEN},0)`);
          ctx.beginPath();
          ctx.arc(st.x, st.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        const r      = st.r * twinkle * (near ? 1.5 : 1);
        const alpha  = near
          ? (st.major ? 1.0 : 0.9)
          : (st.major ? 0.85 : 0.55) * twinkle;

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
    stateRef.current.cx = e.clientX - rect.left;
    stateRef.current.cy = e.clientY - rect.top;
  }
  function handleMouseLeave() {
    stateRef.current.cx = -9999;
    stateRef.current.cy = -9999;
  }

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
        background: "#071110",
        borderTop: "1px solid rgba(12,230,68,0.25)",
        boxShadow: "0 -1px 0 0 rgba(12,230,68,0.08)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(12,230,68,0.07) 0%, transparent 70%)" }} />
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 py-10 sm:px-10 lg:grid-cols-4 lg:px-12">

        {/* IEEE SB CEC */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex min-h-20 items-center">
            <img src={ieeeLogo} alt="IEEE Student Branch CEC" className="w-64 object-contain" style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(12,230,68,0.25))" }} />
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

        {/* Pages */}
        <div className="hidden flex-col gap-4 lg:flex">
          <div className="mb-1">
            <h3 className="font-mech text-[11px] uppercase tracking-widest text-primary" style={headingStyle}>Pages</h3>
            <div style={{ height: "1px", marginTop: "6px", background: "linear-gradient(to right, rgba(12,230,68,0.55), rgba(12,230,68,0.08) 70%, transparent)" }} />
          </div>
          <div className="flex flex-col gap-1">
            {pageLinks.map((link, index) => (
              <a key={index} href={link.link} className="flex items-center gap-2 text-sm text-text/60" style={{ transition: "all 0.22s ease", paddingTop: "3px", paddingBottom: "3px" }} onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}>
                <span className="lbar" style={lbarStyle} />{link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="hidden flex-col gap-4 lg:flex">
          <div className="mb-1">
            <h3 className="font-mech text-[11px] uppercase tracking-widest text-primary" style={headingStyle}>Sections</h3>
            <div style={{ height: "1px", marginTop: "6px", background: "linear-gradient(to right, rgba(12,230,68,0.55), rgba(12,230,68,0.08) 70%, transparent)" }} />
          </div>
          <div className="flex flex-col gap-1">
            {sectionLinks.map((link, index) => (
              <a key={index} href={link.link} className="flex items-center gap-2 text-sm text-text/60" style={{ transition: "all 0.22s ease", paddingTop: "3px", paddingBottom: "3px" }} onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}>
                <span className="lbar" style={lbarStyle} />{link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <div className="mb-1">
            <h3 className="font-mech text-[11px] uppercase tracking-widest text-primary" style={headingStyle}>Contact Us</h3>
            <div style={{ height: "1px", marginTop: "6px", background: "linear-gradient(to right, rgba(12,230,68,0.55), rgba(12,230,68,0.08) 70%, transparent)" }} />
          </div>
          <div className="flex flex-col gap-5">
            {contactInfo.map((contact, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{contact.name}</span>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-text/60" style={{ transition: "all 0.22s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#0CE644"; e.currentTarget.style.transform = "translateX(5px)"; e.currentTarget.style.textShadow = "0 0 10px rgba(12,230,68,0.45)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = ""; e.currentTarget.style.transform = ""; e.currentTarget.style.textShadow = ""; }}
                ><FaPhoneFlip className="text-xs" />{contact.phone}</a>
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
