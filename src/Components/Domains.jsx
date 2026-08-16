import { useEffect, useRef } from "react";

const domains = [
  {
    id: 0,
    title: "GENERAL ISQIP",
    description:
      "Tailored for career readiness, this track focuses on essential soft skills, professional communication, leadership, teamwork, interview preparation, and placement preparedness. Participants will develop practical skills that help them approach professional environments with greater confidence while strengthening their ability to collaborate, communicate ideas effectively, and adapt to different workplace situations.",
  },
  {
    id: 1,
    title: "CS ISQIP",
    description:
      "Dive into hands-on sessions that explore the latest tools, technologies, threats, and defenses in cybersecurity. This track introduces participants to important concepts in network security, ethical hacking, secure systems, digital forensics, and modern cyber defense practices.",
  },
  {
    id: 2,
    title: "EC ISQIP",
    description:
      "Gain a deeper understanding of VLSI design principles by exploring circuit architectures, digital and analog design methodologies, semiconductor technologies, and modern approaches to hardware development. Participants will get an opportunity to understand how complex electronic systems are designed and implemented.",
  },
  {
    id: 3,
    title: "EE ISQIP",
    description:
      "Learn to model, simulate, and analyze solar PV systems using PVsyst while developing an understanding of system design, performance evaluation, energy generation, and real-world yield assessment. The track provides participants with practical exposure to renewable energy technologies and helps them understand how engineering principles can be applied.",
  },
];

const DomainCard = ({ domain, index, cardRef }) => {
  return (
    <div
      ref={cardRef}
      data-active="false"
      style={{ transitionDelay: `${(index % 2) * 120}ms` }}
      className="
        group
        relative
        w-full
        -translate-y-4
        rounded-[6px]
        border
        border-[#0CE644]/20
        bg-black
        p-6
        opacity-0
        transition-[opacity,transform,border-color,box-shadow]
        duration-700
        ease-out

        sm:p-7

        data-[active=true]:translate-y-0
        data-[active=true]:opacity-100
        data-[active=true]:border-[#0CE644]
        data-[active=true]:shadow-[0_0_30px_rgba(12,230,68,0.10)]
      "
    >
      {/* TOP-LEFT CORNER */}
      <span
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-4
          w-4
          border-l-2
          border-t-2
          border-[#0CE644]/30
          transition-[width,height,border-color]
          duration-500

          group-data-[active=true]:h-8
          group-data-[active=true]:w-8
          group-data-[active=true]:border-[#0CE644]
        "
      />

      {/* BOTTOM-RIGHT CORNER */}
      <span
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-4
          w-4
          border-b-2
          border-r-2
          border-[#0CE644]/30
          transition-[width,height,border-color]
          duration-500

          group-data-[active=true]:h-8
          group-data-[active=true]:w-8
          group-data-[active=true]:border-[#0CE644]
        "
      />

      {/* NUMBER */}
      <div
        className="
          font-mechsuit
          text-xs
          tracking-[0.3em]
          text-[#0CE644]/30
          transition-colors
          duration-500

          group-data-[active=true]:text-[#0CE644]
        "
      >
        0{index + 1}
      </div>

      {/* TITLE */}
      <h3
        className="
          mt-4
          font-mechsuit
          text-lg
          tracking-wide
          text-[#0CE644]/50
          transition-colors
          duration-500

          sm:text-xl

          group-data-[active=true]:text-[#0CE644]
        "
      >
        {domain.title}
      </h3>

      {/* DESCRIPTION */}
      <p
        className="
          mt-4
          text-sm
          leading-7
          text-white/30
          transition-colors
          duration-500

          group-data-[active=true]:text-white/70
        "
      >
        {domain.description}
      </p>
    </div>
  );
};

const Domains = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.active = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-black
        px-5
        py-24

        sm:px-8
        sm:py-28

        lg:px-12
        lg:py-32
      "
    >
      {/* HEADING */}
      <div className="relative z-20 mb-16 text-center sm:mb-20">
        <h2
          className="
            font-mechsuit
            text-3xl
            tracking-[0.12em]
            text-[#0CE644]

            sm:text-4xl
          "
        >
          Domains
        </h2>

        <div className="mx-auto mt-4 h-[2px] w-14 bg-[#0CE644]" />
      </div>

      {/* GRID */}
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1050px]
          grid-cols-1
          gap-6

          sm:grid-cols-2
          sm:gap-8
        "
      >
        {domains.map((domain, index) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            index={index}
            cardRef={(el) => {
              cardRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Domains;