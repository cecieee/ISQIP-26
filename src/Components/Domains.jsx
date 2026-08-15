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

const DomainCard = ({
  domain,
  index,
  side,
  cardRef,
}) => {
  return (
    <div
      ref={cardRef}
      data-active="false"
      className={`
        group
        relative
        z-10
        w-full
        max-w-[300px]
        rounded-[6px]
        border
        border-[#0CE644]/20
        bg-black
        p-5
        transition-[border-color,box-shadow]
        duration-500
        ease-out

        sm:max-w-[360px]
        sm:p-6

        lg:max-w-[460px]

        data-[active=true]:border-[#0CE644]
        data-[active=true]:shadow-[0_0_30px_rgba(12,230,68,0.10)]
      `}
    >
      {/* =====================================================
          DESKTOP CONNECTOR
          ===================================================== */}

      <span
        data-connector
        data-active="false"
        className={`
          pointer-events-none
          absolute
          top-1/2
          hidden
          h-[2px]
          -translate-y-1/2
          bg-[#0CE644]/30
          transition-[background-color,box-shadow]
          duration-500

          lg:block

          data-[active=true]:bg-[#0CE644]
          data-[active=true]:shadow-[0_0_8px_#0CE644]

          ${
            side === "left"
              ? "right-[-24px] w-[24px]"
              : "left-[-24px] w-[24px]"
          }
        `}
      />

      {/* =====================================================
          TABLET / MOBILE LEFT CONNECTOR
          ===================================================== */}

      <span
        data-mobile-left
        data-active="false"
        className="
          pointer-events-none
          absolute
          left-0
          top-1/2
          h-[2px]
          w-[10px]
          -translate-x-full
          -translate-y-1/2
          bg-[#0CE644]/20
          transition-[background-color,box-shadow]
          duration-500

          data-[active=true]:bg-[#0CE644]
          data-[active=true]:shadow-[0_0_6px_#0CE644]

          lg:hidden
        "
      />

      {/* =====================================================
          TABLET / MOBILE RIGHT CONNECTOR
          ===================================================== */}

      <span
        data-mobile-right
        data-active="false"
        className="
          pointer-events-none
          absolute
          right-0
          top-1/2
          h-[2px]
          w-[10px]
          -translate-y-1/2
          translate-x-full
          bg-[#0CE644]/20
          transition-[background-color,box-shadow]
          duration-500

          data-[active=true]:bg-[#0CE644]
          data-[active=true]:shadow-[0_0_6px_#0CE644]

          lg:hidden
        "
      />

      {/* =====================================================
          TOP-LEFT CORNER
          ===================================================== */}

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

      {/* =====================================================
          BOTTOM-RIGHT CORNER
          ===================================================== */}

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

      {/* =====================================================
          NUMBER
          ===================================================== */}

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

      {/* =====================================================
          TITLE
          ===================================================== */}

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

      {/* =====================================================
          DESCRIPTION
          ===================================================== */}

      <p
        className="
          mt-4
          max-w-[360px]
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
  const sectionRef = useRef(null);

  /* =========================================================
     TREE REFS
     ========================================================= */

  const desktopTreeRef = useRef(null);
  const mobileTreeRef = useRef(null);

  const desktopCardRefs = useRef([]);
  const mobileCardRefs = useRef([]);

  useEffect(() => {
  let ticking = false;

  const handleScroll = () => {
    if (!sectionRef.current || ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      const section = sectionRef.current;

      if (!section) {
        ticking = false;
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const startPoint = viewportHeight * 0.8;

      const animationDistance =
        Math.max(
          section.offsetHeight - viewportHeight * 0.2,
          viewportHeight
        );

      let progress =
        (startPoint - rect.top) /
        animationDistance;

      progress = Math.max(
        0,
        Math.min(1, progress)
      );

      /*
        Smooth easing
      */

      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 -
            Math.pow(
              -2 * progress + 2,
              2
            ) / 2;

      /*
        =====================================================
        GROW DESKTOP TREE
        =====================================================
      */

      if (desktopTreeRef.current) {
        desktopTreeRef.current.style.height =
          `${eased * 100}%`;
      }

      /*
        =====================================================
        GROW MOBILE / TABLET TREE
        =====================================================
      */

      if (mobileTreeRef.current) {
        mobileTreeRef.current.style.height =
          `${eased * 100}%`;
      }

      /*
        =====================================================
        ACTIVATE DOMAINS
        =====================================================
      */

      const thresholds = [
        0.18,
        0.40,
        0.62,
        0.84,
      ];

      domains.forEach((_, index) => {
        const active =
          eased >= thresholds[index];

        const value = active
          ? "true"
          : "false";

        /*
          ---------------------------------------------------
          DESKTOP CARD
          ---------------------------------------------------
        */

        const desktopCard =
          desktopCardRefs.current[index];

        if (desktopCard) {
          desktopCard.dataset.active = value;

          const connector =
            desktopCard.querySelector(
              "[data-connector]"
            );

          if (connector) {
            connector.dataset.active = value;
          }
        }

        /*
          ---------------------------------------------------
          MOBILE / TABLET CARD
          ---------------------------------------------------
        */

        const mobileCard =
          mobileCardRefs.current[index];

        if (mobileCard) {
          mobileCard.dataset.active = value;

          const mobileLeft =
            mobileCard.querySelector(
              "[data-mobile-left]"
            );

          if (mobileLeft) {
            mobileLeft.dataset.active = value;
          }

          const mobileRight =
            mobileCard.querySelector(
              "[data-mobile-right]"
            );

          if (mobileRight) {
            mobileRight.dataset.active = value;
          }
        }
      });

      ticking = false;
    });
  };

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  /*
    Initial calculation
  */

  handleScroll();

  return () => {
    window.removeEventListener(
      "scroll",
      handleScroll
    );
  };
}, []);

  return (
    <section
      ref={sectionRef}
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
      {/* =====================================================
          HEADING
          ===================================================== */}

      <div
        className="
          relative
          z-20
          mb-16
          text-center

          sm:mb-20
        "
      >
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

        <div
          className="
            mx-auto
            mt-4
            h-[2px]
            w-14
            bg-[#0CE644]
          "
        />
      </div>

      {/* =====================================================
          TREE CONTAINER
          ===================================================== */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1050px]
        "
      >
        {/* ===================================================
            DESKTOP TREE
            =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-1/2
            top-0
            hidden
            w-full
            -translate-x-1/2

            lg:block
          "
        >
          {/* Faint trunk */}

          <div
            className="
              absolute
              bottom-0
              left-1/2
              top-0
              w-[2px]
              -translate-x-1/2
              bg-[#0CE644]/10
            "
          />

          {/* Growing trunk */}

          <div
            ref={desktopTreeRef}
            className="
                absolute
                left-1/2
                top-0
                w-[2px]
                -translate-x-1/2
                bg-[#0CE644]
                shadow-[0_0_10px_#0CE644]
                will-change-[height]
            "
            style={{
                height: "0%",
            }}
          />
        </div>

        {/* ===================================================
            TABLET / MOBILE TREE
            =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-1/2
            top-0
            block
            w-full
            -translate-x-1/2

            lg:hidden
          "
        >
          {/* Faint LEFT rail */}

          <div
            className="
              absolute
              bottom-0
              left-[calc(30%-160px)]
              top-0
              w-[2px]
              bg-[#0CE644]/10

              sm:left-[calc(50%-190px)]
            "
          />

          {/* Faint RIGHT rail */}

          <div
            className="
              absolute
              bottom-0
              left-[calc(30%+160px)]
              top-0
              w-[2px]
              bg-[#0CE644]/10

              sm:left-[calc(50%+190px)]
            "
          />

          {/* Growing tree rails */}

        <div
            ref={mobileTreeRef}
            className="
                absolute
                bottom-0
                left-1/2
                top-0
                w-[320px]
                origin-top
                -translate-x-1/2
                border-l-2
                border-r-2
                border-[#0CE644]
                shadow-[0_0_8px_rgba(12,230,68,0.15)]
                will-change-transform

                sm:w-[380px]
            "
            style={{
                transform:
                "translateX(-50%) scaleY(0)",
            }}
        />
        </div>

        {/* ===================================================
            DOMAIN ROWS
            =================================================== */}

        <div className="relative">
          {domains.map((domain, index) => {
            const side =
              index % 2 === 0
                ? "left"
                : "right";

            return (
              <div
                key={domain.id}
                className="
                  relative
                  mb-16
                  min-h-[210px]
                  last:mb-0
                  sm:mb-20
                  sm:min-h-[230px]
                  lg:grid
                  lg:min-h-[250px]
                  lg:grid-cols-2
                  lg:gap-12
                "
              >
                {/* =================================================
                    DESKTOP LEFT
                    ================================================= */}

                <div
                  className={`
                    hidden
                    items-center
                    lg:flex

                    ${
                      side === "left"
                        ? "justify-end"
                        : "invisible"
                    }
                  `}
                >
                  {side === "left" && (
                    <DomainCard
                      domain={domain}
                      index={index}
                      side="left"
                      cardRef={(el) => {
                        desktopCardRefs.current[index] =
                          el;
                      }}
                    />
                  )}
                </div>

                {/* =================================================
                    DESKTOP RIGHT
                    ================================================= */}

                <div
                  className={`
                    hidden
                    items-center
                    lg:flex

                    ${
                      side === "right"
                        ? "justify-start"
                        : "invisible"
                    }
                  `}
                >
                  {side === "right" && (
                    <DomainCard
                      domain={domain}
                      index={index}
                      side="right"
                      cardRef={(el) => {
                        desktopCardRefs.current[index] =
                          el;
                      }}
                    />
                  )}
                </div>

                {/* =================================================
                    TABLET / MOBILE
                    ================================================= */}

                <div
                  className="
                    flex
                    min-h-[210px]
                    items-center
                    justify-center

                    sm:min-h-[230px]

                    lg:hidden
                  "
                >
                  <DomainCard
                    domain={domain}
                    index={index}
                    side="center"
                    cardRef={(el) => {
                      mobileCardRefs.current[index] =
                        el;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Domains;
