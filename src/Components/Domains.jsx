import { useState, useEffect, useRef } from "react";

const domains = [
  {
    id: 0,
    number: "01",
    title: "CS ISQIP",
    description:
      "Dive into hands-on sessions that explore the latest tools, technologies, threats, and defenses in cybersecurity. This track introduces participants to important concepts in network security, ethical hacking, secure systems, digital forensics, and modern cyber defense practices.",
  },
  {
    id: 1,
    number: "02",
    title: "EC ISQIP",
    description:
      "Gain a deeper understanding of VLSI design principles by exploring circuit architectures, digital and analog design methodologies, semiconductor technologies, and modern approaches to hardware development. Participants will get an opportunity to understand how complex electronic systems are designed and implemented.",
  },
  {
    id: 2,
    number: "03",
    title: "EE ISQIP",
    description:
      "Learn to model, simulate, and analyze solar PV systems using PVsyst while developing an understanding of system design, performance evaluation, energy generation, and real-world yield assessment. The track provides participants with practical exposure to renewable energy technologies and helps them understand how engineering principles can be applied.",
  },
];

const DomainCard = ({ domain, index, isLoaded }) => {
  return (
    <div
      className={`
        group
        relative
        w-full
        h-full
        flex
        flex-col
        justify-between
        rounded-[4px]
        p-6
        sm:p-7
        crt-hud-panel
        crt-card-hover
        transition-all
        duration-500
        ${isLoaded ? "crt-card-booting opacity-100" : "opacity-0 translate-y-8"}
      `}
    >
      {/* SCANLINE SWEEP BAR ON LOAD */}
      {isLoaded && <div className="crt-scan-bar" />}

      {/* OUTER CRT HUD L-BRACKETS */}
      <span className="crt-outer-l-bracket -top-2 -left-2 border-t-2 border-l-2" />
      <span className="crt-outer-l-bracket -top-2 -right-2 border-t-2 border-r-2" />
      <span className="crt-outer-l-bracket -bottom-2 -left-2 border-b-2 border-l-2" />
      <span className="crt-outer-l-bracket -bottom-2 -right-2 border-b-2 border-r-2" />

      {/* DOMAIN TITLE & NUMBER HEADER */}
      <div className="flex items-start justify-between gap-3 border-b border-[#0CE644]/25 pb-4">
        <div>
          <h3 className="font-mechsuit text-xl sm:text-2xl tracking-wide text-[#0CE644] crt-chromatic-text crt-phosphor-glow group-hover:crt-phosphor-bright group-hover:text-white transition-all duration-300">
            {domain.title}
          </h3>
          <p className="mt-1 font-mono text-[11px] tracking-widest text-[#0CE644]/70">
            TRACK // 
          </p>
        </div>

        <div className="font-mechsuit text-3xl sm:text-4xl text-[#0CE644]/30 group-hover:text-[#0CE644] group-hover:crt-phosphor-glow transition-all duration-300 select-none">
          {domain.number}
        </div>
      </div>

      {/* MINIMAL CRT DESCRIPTION BOX (Equal height on desktop) */}
      <div className="crt-inner-box p-4 mt-5 flex-1 flex flex-col justify-start">
        <p className="text-xs sm:text-sm leading-relaxed text-white/75 group-hover:text-white/95 transition-colors duration-300">
          {domain.description}
        </p>
      </div>
    </div>
  );
};

const Domains = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [loadedCards, setLoadedCards] = useState([false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Procedural Staggered Loading Sequence (01 -> 02 -> 03)
  useEffect(() => {
    if (inView) {
      domains.forEach((_, idx) => {
        setTimeout(() => {
          setLoadedCards((prev) => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }, idx * 240);
      });
    }
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        crt-old-screen-bg
        crt-vignette
        crt-monitor-container
        crt-screen-flicker
        my-8
        px-4
        py-16
        sm:px-8
        sm:py-24
        lg:px-12
        lg:py-28
      "
    >
      {/* HEAVY RETRO CRT SCREEN OVERLAY LAYERS */}
      {/* 1. Heavy Static Noise Layer */}
      <div className="pointer-events-none absolute inset-0 crt-heavy-static" />

      {/* 2. Glass Glare Reflection */}
      <div className="crt-glass-glare" />

      {/* 3. Rolling CRT Scanline Refresh Bar */}
      <div className="crt-rolling-bar" />

      {/* 4. RGB Subpixel Aperture Grille Mask */}
      <div className="pointer-events-none absolute inset-0 crt-aperture-mask opacity-80" />

      {/* HEADER SECTION */}
      <div className="relative z-20 mb-12 text-center sm:mb-16">
        {/* Minimal Oscillating DOMAINS Title */}
        <h2 className="font-mechsuit text-4xl sm:text-5xl lg:text-6xl tracking-[0.14em] text-[#0CE644] crt-chromatic-text crt-heading-anim">
          DOMAINS
        </h2>

        {/* Retro Double Line Underline */}
        <div className="mx-auto mt-4 max-w-xs font-mono text-xs tracking-widest text-[#0CE644] crt-chromatic-text">
          ====================================
        </div>
      </div>

      {/* RESPONSIVE GRID LAYOUT FOR 3 DOMAINS (Equal height containers on desktop) */}
      <div
        className="
          relative
          z-20
          mx-auto
          grid
          w-full
          max-w-[1150px]
          grid-cols-1
          gap-8
          md:grid-cols-3
          md:items-stretch
          lg:gap-8
        "
      >
        {domains.map((domain, index) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            index={index}
            isLoaded={loadedCards[index]}
          />
        ))}
      </div>
    </section>
  );
};

export default Domains;





