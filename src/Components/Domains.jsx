import { useState, useEffect, useRef, useCallback } from "react";
import crtTvFrame from "../assets/tv-s.webp";

const DOMAIN_FEEDS = [
  {
    camId: "CAM 01",
    channelNum: "01",
    title: "GENERAL ISQIP",
    trackTag: "CAREER READINESS",
    badgeIcon: "🛡️",
    baseSignal: 94,
    signalBars: 15,
    totalBars: 16,
    frequency: "433.92 MHz",
    location: "CAM 01 // MAIN ARENA",
    description:
      "Tailored for career readiness, this track focuses on essential soft skills, placement preparedness, aptitude, technical foundations, and holistic professional development to excel in industry hiring drives.",
  },
  {
    camId: "CAM 02",
    channelNum: "02",
    title: "CS ISQIP",
    trackTag: "CYBERSECURITY",
    badgeIcon: "⚔️",
    baseSignal: 98,
    signalBars: 16,
    totalBars: 16,
    frequency: "868.10 MHz",
    location: "CAM 02 // NETWORK CORE",
    description:
      "Dive into hands-on sessions that explore the latest tools, technologies, threats, and defenses in cybersecurity. This track introduces participants to important concepts in network security, ethical hacking, secure systems, digital forensics, and modern cyber defense practices.",
  },
  {
    camId: "CAM 03",
    channelNum: "03",
    title: "EC ISQIP",
    trackTag: "VLSI & HARDWARE",
    badgeIcon: "⚡",
    baseSignal: 92,
    signalBars: 14,
    totalBars: 16,
    frequency: "915.00 MHz",
    location: "CAM 03 // SILICON FAB",
    description:
      "Gain a deeper understanding of VLSI design principles by exploring circuit architectures, digital and analog design methodologies, semiconductor technologies, and modern approaches to hardware development. Participants will get an opportunity to understand how complex electronic systems are designed and implemented.",
  },
];

const INITIALIZATION_LOGS = [
  "> CRT DOMAIN SYSTEM",
  "> INITIALIZING...",
  "> SIGNAL CHECK...",
  "> SURVEILLANCE SYSTEM ONLINE",
  "> CAMERA NETWORK CONNECTED",
  "> 3 CHANNELS AVAILABLE",
  "> CAMERA SYSTEM ONLINE",
];

const TV_BREAKPOINT = 580;

const Knob = () => (
  <div
    className="
      relative
      w-8
      h-8
      rounded-full
      shrink-0
      bg-gradient-to-br
      from-gray-300
      via-gray-500
      to-gray-700
      border
      border-[#0CE644]/50
      shadow-[0_0_8px_rgba(12,230,68,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)]
    "
  >
    <span className="absolute top-0.5 left-1/2 h-2 w-[2px] -translate-x-1/2 bg-[#0CE644] shadow-[0_0_4px_#0CE644]" />
  </div>
);

const Domains = () => {
  const sectionRef = useRef(null);

  const bootTimerRef = useRef(null);
  const pendingTimeoutsRef = useRef([]);

  const imageScreenRef = useRef(null);
  const cssScreenRef = useRef(null);

  const [bootCompleted, setBootCompleted] = useState(false);
  const [booting, setBooting] = useState(false);
  const [visibleLogCount, setVisibleLogCount] = useState(0);

  const [activeCamIndex, setActiveCamIndex] = useState(0);
  const [prevCamIndex, setPrevCamIndex] = useState(null);

  const [isSwitching, setIsSwitching] = useState(false);
  const [acquiringSignal, setAcquiringSignal] = useState(false);
  const [isPoweringOn, setIsPoweringOn] = useState(false);

  const [timecode, setTimecode] = useState("00:14:22:00");

  const hasBootedRef = useRef(false);

  /*
   * ------------------------------------------------------------
   * TRACKED TIMEOUT
   * ------------------------------------------------------------
   */

  const trackedTimeout = useCallback((fn, delay) => {
    const id = window.setTimeout(() => {
      pendingTimeoutsRef.current = pendingTimeoutsRef.current.filter(
        (timeoutId) => timeoutId !== id
      );

      fn();
    }, delay);

    pendingTimeoutsRef.current.push(id);

    return id;
  }, []);

  /*
   * ------------------------------------------------------------
   * TIME CODE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    let frame = 0;

    const interval = setInterval(() => {
      frame = (frame + 1) % 30;

      const seconds = Math.floor(Date.now() / 1000) % 60;
      const minutes = Math.floor(Date.now() / 60000) % 60;
      const hours = Math.floor(Date.now() / 3600000) % 24;

      const pad = (number) => String(number).padStart(2, "0");

      setTimecode(
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frame)}`
      );
    }, 1000 / 15);

    return () => clearInterval(interval);
  }, []);

  /*
   * ------------------------------------------------------------
   * POWER ON / BOOT SEQUENCE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasBootedRef.current) {
          hasBootedRef.current = true;

          setIsPoweringOn(true);

          trackedTimeout(() => {
            setIsPoweringOn(false);
            setBooting(true);

            let logIdx = 0;

            bootTimerRef.current = setInterval(() => {
              logIdx++;

              setVisibleLogCount(logIdx);

              if (logIdx >= INITIALIZATION_LOGS.length) {
                clearInterval(bootTimerRef.current);

                trackedTimeout(() => {
                  setBooting(false);
                  setBootCompleted(true);
                }, 350);
              }
            }, 100);
          }, 450);
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (bootTimerRef.current) {
        clearInterval(bootTimerRef.current);
      }

      pendingTimeoutsRef.current.forEach((id) => {
        window.clearTimeout(id);
      });

      pendingTimeoutsRef.current = [];

      observer.disconnect();
    };
  }, [trackedTimeout]);

  /*
   * ------------------------------------------------------------
   * CAMERA SWITCHING
   * ------------------------------------------------------------
   */

  const handleSwitchCamera = useCallback(
    (targetIndex) => {
      if (
        targetIndex === activeCamIndex ||
        isSwitching ||
        booting
      ) {
        return;
      }

      setIsSwitching(true);
      setAcquiringSignal(true);

      setPrevCamIndex(activeCamIndex);
      setActiveCamIndex(targetIndex);

      // CRT static burst
      trackedTimeout(() => {
        setIsSwitching(false);
      }, 450);

      // Signal stabilization
      trackedTimeout(() => {
        setAcquiringSignal(false);
        setPrevCamIndex(null);
      }, 750);
    },
    [
      activeCamIndex,
      isSwitching,
      booting,
      trackedTimeout,
    ]
  );

  /*
   * ------------------------------------------------------------
   * KEYBOARD NAVIGATION
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!bootCompleted || isSwitching) {
        return;
      }

      if (event.key === "ArrowRight") {
        handleSwitchCamera(
          (activeCamIndex + 1) % DOMAIN_FEEDS.length
        );
      }

      if (event.key === "ArrowLeft") {
        handleSwitchCamera(
          (activeCamIndex - 1 + DOMAIN_FEEDS.length) %
            DOMAIN_FEEDS.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activeCamIndex,
    bootCompleted,
    isSwitching,
    handleSwitchCamera,
  ]);

  /*
   * ------------------------------------------------------------
   * RESET SCREEN SCROLL WHEN CAMERA CHANGES
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (imageScreenRef.current) {
      imageScreenRef.current.scrollTop = 0;
    }

    if (cssScreenRef.current) {
      cssScreenRef.current.scrollTop = 0;
    }
  }, [activeCamIndex]);

  const activeFeed = DOMAIN_FEEDS[activeCamIndex];

  const prevFeed =
    prevCamIndex !== null
      ? DOMAIN_FEEDS[prevCamIndex]
      : null;

  return (
    <section
      ref={sectionRef}
      id="domains"
      className="
        relative
        w-full
        bg-black
        text-[#0CE644]
        pt-20
        sm:pt-24
        pb-8
        sm:pb-12
        px-4
        sm:px-6
        lg:px-8
        overflow-hidden
        select-none
      "
    >
      {/* BACKGROUND SURVEILLANCE PATTERN */}
      <div className="pointer-events-none absolute inset-0 crt-crosshair-bg opacity-40" />

      {/* GLOBAL SCANLINES */}
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-50 z-10" />

      {/* AMBIENT GREEN PHOSPHOR GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[500px]
          h-[350px]
          bg-[#0CE644]/5
          blur-[100px]
          rounded-full
        "
      />

      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center">
        {/* =====================================================
            HEADER
            ===================================================== */}

        <div className="text-center mb-1 sm:mb-2">
          <h2
            className="
              font-mechsuit
              text-3xl
              sm:text-4xl
              lg:text-5xl
              tracking-[0.15em]
              text-[#0CE644]
              crt-phosphor-glow
              crt-jitter
              transition-transform
              duration-700
            "
          >
            DOMAINS
          </h2>

          {/* DIVIDER */}
          <div className="flex items-center justify-center gap-3 mt-2 mb-1">
            <span className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#0CE644]" />

            <span className="w-2 h-2 rotate-45 bg-[#0CE644] shadow-[0_0_8px_#0CE644]" />

            <span className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#0CE644]" />
          </div>

        </div>

        {/* =====================================================
            CRT CONTAINER
            ===================================================== */}

        <div className="relative w-full max-w-[980px] flex flex-col items-center">


          <div
            className="hidden min-[580px]:block w-full"
          >
            <div className="relative w-full">

              {/* SCREEN WINDOW */}

              <div
                className={`
                  absolute
                  z-0
                  overflow-hidden
                  rounded-[3.5%]
                  bg-black
                  crt-screen-flicker
                  top-[22.2%] left-[11.2%] right-[29.8%] bottom-[19.2%]
                  min-[700px]:top-[14%]
                  min-[700px]:left-[8.5%]
                  min-[700px]:right-[28.5%]
                  min-[700px]:bottom-[15%]

                  min-[580px]:top-[14%]
                  min-[580px]:left-[8%]
                  min-[580px]:right-[27%]
                  min-[580px]:bottom-[19%]
                  ${isSwitching ? "crt-switch-flicker" : ""}
                `}
              >
                {/* GLASS GLARE */}
                <div className="crt-glass-glare" />

                {/* GRAIN */}
                <div className="pointer-events-none absolute inset-0 crt-grain-overlay z-25 opacity-75" />

                {/* VIGNETTE */}
                <div className="pointer-events-none absolute inset-0 crt-vignette z-30" />

                {/* APERTURE */}
                <div className="pointer-events-none absolute inset-0 crt-aperture-mask opacity-85 z-20" />

                {/* ROLLING BAR */}
                <div className="crt-rolling-bar z-20 opacity-80" />


                {/* TOP STATUS BAR */}

                <div
                  className="
                    relative
                    z-30
                    px-6
                    sm:px-10
                    py-2
                    sm:py-2.5
                    bg-[#020a04]/40
                    flex
                    items-center
                    justify-between
                    gap-2
                    font-mono
                    text-sm
                    sm:text-base
                    text-[#0CE644]/90
                  "
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="inline-flex items-center gap-1.5 font-bold text-red-500 tracking-wider">
                  <span className="w-3 h-3 rounded-full bg-red-500 crt-rec-dot shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  REC
                </span>

                <span className="text-[#0CE644]/30 text-sm sm:text-base">
                  |
                </span>

                <span className="text-[#0CE644]/90 tracking-widest text-sm sm:text-base">
                  {timecode}
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="px-2 py-1 rounded bg-[#0CE644]/15 border border-[#0CE644]/40 font-bold text-[#0CE644] text-sm sm:text-base tracking-wider">
                  {activeFeed.camId}
                </span>
              </div>
                </div>

                {/* SCREEN CONTENT */}

                <div
                  ref={imageScreenRef}
                  className="
                    relative
                    z-20
                    h-[calc(100%-36px)]
                    mt-2
                    px-6
                    sm:px-10
                    py-2
                    sm:py-3
                    flex
                    flex-col
                    justify-between
                    bg-transparent
                    overflow-y-auto
                    custom-scrollbar
                  "
                >
                  {/* POWER ON */}

                  {isPoweringOn && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
                      <div className="w-full h-full crt-power-on-anim" />
                    </div>
                  )}

                  {/* SWITCH STATIC */}

                  {isSwitching && (
                    <div className="pointer-events-none absolute inset-0 z-40 crt-heavy-static crt-static-burst crt-switch-flicker" />
                  )}

                  {/* BOOT */}

                  {booting && (
                    <div className="flex-1 flex flex-col items-start justify-center font-mono text-xs sm:text-sm text-[#0CE644] space-y-1.5 py-4">
                      {INITIALIZATION_LOGS
                        .slice(0, visibleLogCount)
                        .map((log, idx) => (
                          <div
                            key={idx}
                            className="crt-boot-line crt-phosphor-glow flex items-center gap-2"
                          >
                            <span>{log}</span>

                            {idx === visibleLogCount - 1 && (
                              <span className="w-2 h-3.5 bg-[#0CE644] crt-cursor inline-block" />
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* PREVIOUS FEED GHOST */}

                  {prevFeed && isSwitching && (
                    <div className="absolute inset-3 sm:inset-5 crt-phosphor-ghost opacity-40 pointer-events-none select-none z-10">
                      <div className="font-mechsuit text-xl sm:text-3xl text-[#0CE644]">
                        {prevFeed.title}
                      </div>

                      <p className="mt-1 font-mono text-xs text-[#0CE644]/60 line-clamp-2">
                        {prevFeed.description}
                      </p>
                    </div>
                  )}

                  {/* MAIN FEED */}

                  {bootCompleted && (
                    <div
                      className={`
                        flex-1
                        flex
                        flex-col
                        justify-start
                        gap-2
                        sm:gap-3
                        transition-all
                        duration-300
                        ${
                          isSwitching
                            ? "crt-signal-glitch opacity-30"
                            : ""
                        }
                        ${
                          acquiringSignal
                            ? "crt-feed-acquire"
                            : "opacity-100"
                        }
                      `}
                    >
                      {/* FEED HEADER */}

                      <div>
                        <div className="flex flex-col items-center gap-2 md:flex-row md:items-start md:justify-between">
                          <h3 className="font-mechsuit text-lg sm:text-2xl md:text-3xl text-[#0CE644] crt-chromatic-text crt-phosphor-glow tracking-wider text-center md:text-left">
                            {activeFeed.title}
                          </h3>

                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0CE644]/15 border border-[#0CE644]/50 font-mono text-[8px] sm:text-xs font-bold text-[#0CE644] shadow-[0_0_12px_rgba(12,230,68,0.3)]">
                            <span>
                              {activeFeed.badgeIcon}
                            </span>

                            <span>
                              {activeFeed.trackTag}
                            </span>
                          </span>
                        </div>

                        {/* DIVIDER */}

                        <div className="flex items-center gap-2 mt-1 sm:mt-2 opacity-85">
                          <span className="h-[1px] flex-1 bg-gradient-to-r from-[#0CE644] via-[#0CE644]/50 to-transparent" />

                          <span className="w-1.5 h-1.5 rotate-45 bg-[#0CE644] shadow-[0_0_6px_#0CE644]" />

                          <span className="h-[1px] w-10 bg-[#0CE644]/40" />
                        </div>
                      </div>

                      {/* DESCRIPTION */}

                      <div className="crt-inner-box py-1 sm:py-2">
                        <p className="font-sans text-[11px] sm:text-xl md:text-xl leading-5 sm:leading-relaxed text-white/95 font-normal tracking-wide text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {activeFeed.description}
                        </p>
                      </div>

                      {/* SIGNAL */}

                      <div className="mt-auto mb-[30px] pr-[30px] pt-1 pb-0.5 flex items-center justify-end gap-2 font-mono text-[10px] sm:text-xs">
                        <span className="text-[#0CE644]/80 font-semibold tracking-wider">
                          SIGNAL: STABLE
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>


              <img
                src={crtTvFrame}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="
                  pointer-events-none
                  relative
                  z-20
                  block
                  w-full
                  h-auto
                  max-w-full
                  select-none
                "
              />
            </div>
          </div>

          {/* ===================================================
              VARIANT B — PURE CSS CRT
              < 580px

              NOTE: this range covers a wide span (a small phone up
              to just under 580px), and the chassis itself grows the
              whole time via w-full — so every text size below now
              has 2-3 steps (min-[380px] / min-[460px] / min-[520px])
              instead of one fixed tiny value, so it actually fills
              the extra room instead of sitting small with a lot of
              leftover space around it near the top of the range.
              =================================================== */}

          <div className="block min-[580px]:hidden w-full">
            <div
              className="
                relative
                w-full
                rounded-t-[7%]
                rounded-b-[3%]
                border-2
                border-[#3a3f3a]
                bg-gradient-to-b
                from-[#3a3f3a]
                to-[#151815]
                p-2
                shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.06)]
                crt-screen-flicker
              "
            >
              <div className="flex gap-2">

                {/* SCREEN SIDE */}

                <div className="relative flex-1 min-w-0 rounded-[4%] bg-black p-1.5 shadow-[inset_0_0_25px_rgba(0,0,0,0.9)]">
                  <div
                    className={`
                      relative
                      overflow-hidden
                      rounded-[3%]
                      bg-black
                      aspect-[4/3]
                      ${
                        isSwitching
                          ? "crt-switch-flicker"
                          : ""
                      }
                    `}
                  >
                    {/* GLASS */}
                    <div className="crt-glass-glare" />

                    {/* GRAIN */}
                    <div className="pointer-events-none absolute inset-0 crt-grain-overlay z-25 opacity-75" />

                    {/* VIGNETTE */}
                    <div className="pointer-events-none absolute inset-0 crt-vignette z-30" />

                    {/* APERTURE */}
                    <div className="pointer-events-none absolute inset-0 crt-aperture-mask opacity-85 z-20" />

                    {/* ROLLING BAR */}
                    <div className="crt-rolling-bar z-20 opacity-80" />

                    {/* TOP BAR */}

                    <div className="relative z-30 px-3 min-[420px]:px-4 py-1 bg-[#020a04]/40 flex items-center justify-between gap-2 font-mono text-xs min-[420px]:text-sm text-[#0CE644]/90">
                      <span className="inline-flex items-center gap-1 font-bold text-red-500 tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-red-500 crt-rec-dot shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

                        REC
                      </span>

                      <span className="px-1.5 min-[420px]:px-2 py-0.5 rounded bg-[#0CE644]/15 border border-[#0CE644]/40 font-bold text-[#0CE644] text-xs min-[420px]:text-sm tracking-wider">
                        {activeFeed.camId}
                      </span>
                    </div>

                    {/* SCREEN CONTENT */}

                    <div
                      ref={cssScreenRef}
                      className="
                        relative
                        z-20
                        h-[calc(100%-28px)]
                        mt-2
                        px-3
                        min-[420px]:px-4
                        min-[520px]:px-5
                        py-1
                        flex
                        flex-col
                        justify-between
                        bg-transparent
                        overflow-y-auto
                        custom-scrollbar
                      "
                    >
                      {/* POWER ON */}

                      {isPoweringOn && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
                          <div className="w-full h-full crt-power-on-anim" />
                        </div>
                      )}

                      {/* STATIC */}

                      {isSwitching && (
                        <div className="pointer-events-none absolute inset-0 z-40 crt-heavy-static crt-static-burst crt-switch-flicker" />
                      )}

                      {/* BOOT */}

                      {booting && (
                        <div className="flex-1 flex flex-col items-start justify-center font-mono text-[9px] min-[420px]:text-xs text-[#0CE644] space-y-1 py-2">
                          {INITIALIZATION_LOGS
                            .slice(0, visibleLogCount)
                            .map((log, idx) => (
                              <div
                                key={idx}
                                className="crt-boot-line crt-phosphor-glow flex items-center gap-2"
                              >
                                <span>{log}</span>

                                {idx ===
                                  visibleLogCount - 1 && (
                                  <span className="w-1.5 h-3 bg-[#0CE644] crt-cursor inline-block" />
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* PREVIOUS FEED */}

                      {prevFeed && isSwitching && (
                        <div className="absolute inset-2 crt-phosphor-ghost opacity-40 pointer-events-none select-none z-10">
                          <div className="font-mechsuit text-sm min-[420px]:text-base text-[#0CE644]">
                            {prevFeed.title}
                          </div>

                          <p className="mt-1 font-mono text-[9px] min-[420px]:text-[10px] text-[#0CE644]/60 line-clamp-2">
                            {prevFeed.description}
                          </p>
                        </div>
                      )}

                      {/* MAIN FEED */}

                      {bootCompleted && (
                        <div
                          className={`
                            flex-1
                            flex
                            flex-col
                            justify-start
                            gap-1.5
                            min-[420px]:gap-2
                            min-[520px]:gap-3
                            transition-all
                            duration-300
                            ${
                              isSwitching
                                ? "crt-signal-glitch opacity-30"
                                : ""
                            }
                            ${
                              acquiringSignal
                                ? "crt-feed-acquire"
                                : "opacity-100"
                            }
                          `}
                        >
                          {/* HEADER */}

                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3
                                className="
                                  font-mechsuit
                                  text-xs
                                  min-[380px]:text-sm
                                  min-[460px]:text-base
                                  min-[520px]:text-lg
                                  text-[#0CE644]
                                  crt-chromatic-text
                                  crt-phosphor-glow
                                  tracking-wider
                                  text-left
                                "
                              >
                                {activeFeed.title}
                              </h3>

                              <span
                                className="
                                  inline-flex
                                  shrink-0
                                  items-center
                                  gap-1
                                  px-1.5
                                  min-[420px]:px-2
                                  py-0.5
                                  min-[420px]:py-1
                                  rounded
                                  bg-[#0CE644]/15
                                  border
                                  border-[#0CE644]/50
                                  font-mono
                                  text-[6px]
                                  min-[380px]:text-[8px]
                                  min-[460px]:text-[9px]
                                  min-[520px]:text-[10px]
                                  font-bold
                                  text-[#0CE644]
                                  shadow-[0_0_12px_rgba(12,230,68,0.3)]
                                "
                              >
                                {activeFeed.trackTag}
                              </span>
                            </div>

                            {/* DIVIDER */}

                            <div className="flex items-center gap-2 mt-1 min-[420px]:mt-2 opacity-85">
                              <span className="h-[1px] flex-1 bg-gradient-to-r from-[#0CE644] via-[#0CE644]/50 to-transparent" />

                              <span className="w-1 h-1 min-[460px]:w-1.5 min-[460px]:h-1.5 rotate-45 bg-[#0CE644] shadow-[0_0_6px_#0CE644]" />
                            </div>
                          </div>

                          {/* DESCRIPTION */}

                          <div className="crt-inner-box flex-1 overflow-hidden flex items-center">
                            <p
                              className="
                                font-sans
                                text-[8px]
                                min-[380px]:text-[10px]
                                min-[460px]:text-xs
                                min-[520px]:text-sm
                                leading-4
                                min-[420px]:leading-5
                                min-[520px]:leading-relaxed
                                text-white/95
                                font-normal
                                tracking-wide
                                text-center
                                drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
                              "
                            >
                              {activeFeed.description}
                            </p>
                          </div>

                          {/* SIGNAL */}

                          <div className="mt-auto mb-[30px] pr-[30px] pt-0.5 flex items-center justify-end gap-2 font-mono text-[7px] min-[420px]:text-[9px] min-[520px]:text-[10px]">
                            <span className="text-[#0CE644]/80 font-semibold tracking-wider">
                              SIGNAL: STABLE
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* =================================================
                    CSS TV CONTROL PANEL
                    ================================================= */}

                <div className="flex w-10 min-[460px]:w-12 min-[520px]:w-14 shrink-0 flex-col items-center gap-2 py-1">

                  <Knob />
                  <Knob />

                  <div className="mt-1 flex w-full flex-1 flex-col justify-start gap-[3px] rounded-sm bg-[#0a0d0a] p-1">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-[2px] w-full rounded-full bg-black/70"
                      />
                    ))}
                  </div>

                </div>
              </div>

              {/* CSS TV FEET */}

              <div className="pointer-events-none absolute -bottom-1.5 left-[8%] h-2 w-6 rounded-b-md bg-[#151815]" />

              <div className="pointer-events-none absolute -bottom-1.5 right-[8%] h-2 w-6 rounded-b-md bg-[#151815]" />
            </div>
          </div>

          {/* =====================================================
              SHARED CAMERA CONTROLS
              ===================================================== */}

          <div
            className="
              relative
              z-30
              mt-0
              w-full
              bg-[#020a04]/95
              border-x
              border-b
              border-[#0CE644]/40
              rounded-b-xl
              px-3
              sm:px-4
              py-2
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-2
              shadow-[0_8px_25px_rgba(0,0,0,0.9)]
            "
          >
            {/* CAMERA BUTTONS */}

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
              {DOMAIN_FEEDS.map((feed, idx) => {
                const isActive =
                  idx === activeCamIndex;

                return (
                  <button
                    key={feed.camId}
                    onClick={() =>
                      handleSwitchCamera(idx)
                    }
                    disabled={
                      isSwitching || booting
                    }
                    className={`
                      crt-cam-btn
                      py-1.5
                      px-3
                      sm:px-4
                      rounded
                      text-xs
                      font-bold
                      tracking-wider
                      text-center
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      ${isActive ? "active" : ""}
                    `}
                    aria-label={`Switch screen to ${feed.camId} - ${feed.title}`}
                  >
                    <span className="block sm:inline">
                      {feed.camId}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* NAVIGATION */}

            <div className="font-mono text-[10px] text-[#0CE644]/60 text-center sm:text-right">
              <span>NAV: [← / → ARROWS]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Domains;