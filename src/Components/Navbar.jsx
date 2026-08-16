import { useEffect, useState } from "react";
import logo from "../assets/isqip26.webp";

const NAV_LINKS = [
  { label: "Home",         href: "#home" },
  { label: "About",        href: "#about" },
  { label: "Benefits",     href: "#benefits" },
  { label: "Tracks",       href: "#tracks" },
  { label: "Highlights",   href: "#highlights" },
  { label: "Certificates", href: "#certificates" },
  { label: "Schedule",     href: "#schedule" },
];

const STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

  @keyframes nb-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes nb-glow   { 0%{opacity:.6}30%{opacity:1}60%{opacity:.75}100%{opacity:1} }
  @keyframes nb-flicker{ 0%,100%{opacity:1} 20%{opacity:.2} 35%{opacity:1} 55%{opacity:.35} 65%{opacity:1} }

  
  .nb {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    height: 52px;
    display: flex;
    align-items: center;
    background: rgba(8, 12, 8, 0.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(12,230,68,0.18);
    border-radius: 8px;
    overflow: clip;
    white-space: nowrap;
    transition:
      width   0.8s cubic-bezier(0.34,1.56,0.64,1),
      opacity 0.6s  cubic-bezier(0.25, 0.46, 0.45, 0.94),
      transform 0.8s cubic-bezier(0.34,1.56,0.64,1),
      box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .nb.nb-off {
    opacity: 0;
    transform: translateX(-50%) translateY(-18px);
    pointer-events: none;
  }
  .nb.nb-on {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    box-shadow: 0 4px 32px rgba(0,0,0,0.55), 0 0 16px rgba(12,230,68,0.06);
  }
  .nb.nb-on:hover {
    border-color: rgba(12,230,68,0.3);
    box-shadow: 0 6px 40px rgba(0,0,0,0.65), 0 0 24px rgba(12,230,68,0.1);
  }

  
  .nb-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    padding: 0 18px 0 20px;
    height: 100%;
    border-right: 1px solid rgba(12,230,68,0.12);
    flex-shrink: 0;
  }
  .nb-logo img    { height: 30px; width: auto; object-fit: contain; display: block; }
  .nb-logo-dot    { width:7px; height:7px; border-radius:50%; background:#0CE644; box-shadow:0 0 7px #0CE644; flex-shrink:0; animation:nb-blink 1.2s step-start infinite; }

  
  .nb-links {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0 8px;
    height: 100%;
    flex: 1;
    justify-content: center;
    gap: 0;
  }
  .nb-links li {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .nb-links li + li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 14px;
    background: rgba(12,230,68,0.15);
    border-radius: 1px;
  }
  .nb-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #8FAE95;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 0.84rem;
    letter-spacing: 0.04em;
    padding: 0 clamp(0.6rem, 1.2vw, 1rem);
    height: 52px;
    transition: color 0.18s, background 0.18s;
    white-space: nowrap;
  }
  .nb-link:hover {
    color: #0CE644;
    background: rgba(12,230,68,0.05);
    animation: nb-flicker 0.3s linear;
  }

  
  .nb-cta-wrap {
    padding: 0 10px 0 0;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .nb-cta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    padding: 8px 20px;
    border-radius: 5px;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    color: #0A0D0A;
    background: #0CE644;
    white-space: nowrap;
    transition: box-shadow 0.2s, transform 0.1s;
  }
  .nb-cta:hover {
    animation: nb-glow 0.28s ease forwards;
    box-shadow: 0 0 16px rgba(12,230,68,0.6), 0 0 32px rgba(12,230,68,0.2);
    transform: translateY(-1px);
  }

  
  .nb-ham {
    display: none;
    background: none;
    border: 1px solid rgba(12,230,68,0.25);
    border-radius: 5px;
    padding: 6px 9px;
    cursor: pointer;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    flex-shrink: 0;
  }

  
  .nb-drop {
    position: fixed;
    top: 76px;
    left: 50%;
    transform: translateX(-50%);
    width: min(92vw, 960px);
    background: rgba(8,12,8,0.97);
    border: 1px solid rgba(12,230,68,0.15);
    border-radius: 10px;
    padding: 1.2rem 1.5rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 9998;
    backdrop-filter: blur(18px);
    max-height: min(75vh, 560px);
    overflow-y: auto;
  }

  @media (max-width: 860px) {
    .nb-links    { display: none !important; }
    .nb-cta-wrap { display: none !important; }
    .nb-ham      { display: flex !important; }
  }
`;

export default function Navbar() {
  const [scrollY,  setScrollY]  = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    // Track viewport height for consistent behavior
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    const fn = () => { 
      setScrollY(window.scrollY); 
      if (window.scrollY <= 0) setMenuOpen(false); 
    };
    window.addEventListener("scroll", fn, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", fn);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const scrollVH = viewportHeight > 0 ? scrollY / viewportHeight : 0;
  
  const progress       = Math.min(1, Math.max(0, scrollY / 300));
  const visible        = scrollVH > 2.2; // Show navbar after 2.2 viewport heights
  const contentOpacity = Math.max(0, (progress - 0.3) / 0.7);
  const width          = visible
    ? `min(${Math.round(38 + progress * 54)}vw, ${Math.round(380 + progress * 720)}px)`
    : '48px';

  return (
    <>
      <style>{STYLES}</style>

      <nav className={`nb ${visible ? "nb-on" : "nb-off"}`} style={{ width }}
        role="navigation" aria-label="Main navigation">

        {}
        <a href="#home" className="nb-logo" style={{ opacity: contentOpacity, transition: 'opacity 0.3s' }}>
          <span className="nb-logo-dot" />
          <img src={logo} alt="ISQIP '26" />
        </a>

        {}
        <ul className="nb-links" style={{ opacity: contentOpacity, transition: 'opacity 0.3s' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}><a href={href} className="nb-link">{label}</a></li>
          ))}
        </ul>

        {}
        <div className="nb-cta-wrap" style={{ opacity: contentOpacity, transition: 'opacity 0.3s' }}>
          <a href="#register" className="nb-cta">Register →</a>
        </div>

        {}
        <button className="nb-ham" onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu" style={{ opacity: contentOpacity, transition: 'opacity 0.3s' }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              display:"block", width:"20px", height:"2px",
              background:"#0CE644", borderRadius:"2px", transition:"all 0.2s",
              opacity: menuOpen && i===1 ? 0 : 1,
              transform: menuOpen
                ? i===0 ? "rotate(45deg) translate(4px,4px)"
                : i===2 ? "rotate(-45deg) translate(4px,-4px)" : "none"
                : "none",
            }}/>
          ))}
        </button>
      </nav>

      {}
      {menuOpen && (
        <div className="nb-drop">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="nb-link"
              style={{ fontSize:"1rem", padding:"0.3rem 0" }}
              onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a href="#register" className="nb-cta"
            style={{ justifyContent:"center", marginTop:"0.3rem" }}
            onClick={() => setMenuOpen(false)}>Register →</a>
        </div>
      )}
    </>
  );
}