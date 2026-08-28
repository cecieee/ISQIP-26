import { useEffect, useState } from "react";

const EVENT_DATE = new Date(
  "2026-09-15T10:00:00+05:30"
).getTime();

const getTimeRemaining = () => {
  const difference = Math.max(EVENT_DATE - Date.now(), 0);

  return {
    days: Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ),

    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ),

    minutes: Math.floor(
      (difference / (1000 * 60)) % 60
    ),

    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
};

/* =========================================================
   CRT TEXT
   ========================================================= */

const ScanText = ({
  children,
  className = "",
  small = false,
}) => {
  return (
    <span
      className={`
        ${small ? "crt-text-sm" : "crt-text"}
        crt-jitter
        relative
        inline-block
        ${className}
      `}
    >
      {children}

      <span
        aria-hidden="true"
        className="
          crt-text-scan
          pointer-events-none
          absolute
          inset-0
        "
      />
    </span>
  );
};

/* =========================================================
   COUNTDOWN UNIT
   ========================================================= */

const GlitchUnit = ({
  value,
  label,
  isGlitching,
  theme = "green",
}) => {
  const displayValue = String(value).padStart(2, "0");

  const [glitchDigits, setGlitchDigits] = useState([]);
  const [glitchValues, setGlitchValues] = useState({});

  useEffect(() => {
    if (!isGlitching) {
      setGlitchDigits([]);
      setGlitchValues({});
      return;
    }

    // 30% chance that both digits glitch
    const glitchBoth = Math.random() < 0.3;

    // Otherwise glitch only one digit
    const digitsToGlitch = glitchBoth
      ? [0, 1]
      : [Math.random() < 0.5 ? 0 : 1];

    const fakeValues = {};

    digitsToGlitch.forEach((index) => {
      let fakeDigit = Math.floor(
        Math.random() * 10
      ).toString();

      // Make sure the fake digit is different
      while (fakeDigit === displayValue[index]) {
        fakeDigit = Math.floor(
          Math.random() * 10
        ).toString();
      }

      fakeValues[index] = fakeDigit;
    });

    setGlitchDigits(digitsToGlitch);
    setGlitchValues(fakeValues);

    // Clear glitch after 220ms
    const timeout = setTimeout(() => {
      setGlitchDigits([]);
      setGlitchValues({});
    }, 220);

    return () => clearTimeout(timeout);
  }, [isGlitching, displayValue]);

  const isGreen = theme === "green";
  const numColorClass = isGreen
    ? "text-[#0CE644] [text-shadow:0_0_8px_rgba(12,230,68,0.7),0_0_22px_rgba(12,230,68,0.3)]"
    : "text-[#F5F7F6] [text-shadow:0_0_8px_rgba(245,247,246,0.7),0_0_22px_rgba(245,247,246,0.25)]";

  // Inverted text color for the label
  const labelColorClass = isGreen
    ? "text-[#F5F7F6]/75"
    : "text-[#0CE644]/75";

  return (
    <div
      className="
        flex
        min-w-0
        flex-1
        flex-col
        items-center
        gap-2
      "
    >
      {/* Number */}
      <div
        className={`
          flex
          flex-nowrap
          items-baseline
          justify-center
          whitespace-nowrap
          font-mech
          font-mechsuit
          text-4xl
          leading-none
          ${numColorClass}
          sm:text-5xl
          md:text-7xl
          lg:text-8xl
        `}
        style={{ fontFamily: "'Mechsuit', sans-serif" }}
      >
        {displayValue.split("").map((digit, index) => {
          const isDigitGlitching =
            glitchDigits.includes(index);

          return (
            <span
              key={index}
              className={
                isDigitGlitching
                  ? "crt-number-glitch inline-block tracking-normal"
                  : "inline-block tracking-normal"
              }
            >
              {isDigitGlitching
                ? glitchValues[index]
                : digit}
            </span>
          );
        })}
      </div>

      {/* Label */}
      <span
        className={`
          mt-3
          whitespace-nowrap
          font-mech
          font-mechsuit
          text-[10px]
          tracking-[0.25em]
          ${labelColorClass}
          sm:mt-4
          sm:text-[11px]
          md:mt-6
          md:text-[13px]
          lg:mt-7
          lg:text-base
        `}
      >
        <ScanText small>{label}</ScanText>
      </span>
    </div>
  );
};

/* =========================================================
   COUNTDOWN
   ========================================================= */

const CountDown = () => {
  const [time, setTime] = useState(getTimeRemaining);

  // Global glitch state
  const [glitchUnits, setGlitchUnits] = useState([]);

  /* =========================================================
     TIMER
     ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     GLOBAL GLITCH
     ========================================================= */

  useEffect(() => {
    const triggerGlitch = () => {
      // ALL counters glitch simultaneously
      setGlitchUnits([
        "days",
        "hours",
        "minutes",
        "seconds",
      ]);

      // Glitch lasts 220ms
      setTimeout(() => {
        setGlitchUnits([]);
      }, 220);
    };

    // Check every 5 seconds
    const interval = setInterval(() => {
      // 40% chance of triggering
      if (Math.random() < 0.4) {
        triggerGlitch();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const eventStarted =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  return (
    <section
      className="
        crt-screen
        relative
        flex
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-[#020502]
        py-16
        md:py-20
        lg:py-24
      "
    >
      {/* =================================================
          FULL-SECTION CRT EFFECTS (LINE BG)
          ================================================= */}

      {/* Fine CRT scanlines across entire section */}
      <div
        className="
          crt-scanlines
          pointer-events-none
          absolute
          inset-0
          z-40
        "
      />

      {/* Widely spaced horizontal interference across entire section */}
      <div className="crt-horizontal-lines" />

      {/* Static / grain across entire section */}
      <div
        className="
          crt-static
          pointer-events-none
          absolute
          inset-0
          z-40
        "
      />

      {/* Additional static lines across entire section */}
      <div
        className="
          crt-static-lines-bg
          pointer-events-none
          absolute
          inset-0
          z-40
        "
      />

      {/* Jagged interference */}
      <div
        className="
          crt-jagged-lines
          pointer-events-none
          absolute
          inset-0
          z-40
        "
      />

      {/* Vignette */}
      <div
        className="
          crt-vignette
          pointer-events-none
          absolute
          inset-0
          z-50
        "
      />

      {/* Subtle center CRT glow */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(12,230,68,0.08)_0%,transparent_70%)]" />

      {/* =================================================
          CONTENT (FLOATING DIRECTLY OVER CRT LINE BG)
          ================================================= */}

      <div
        className="
          crt-flicker
          relative
          z-10
          flex
          w-full
          max-w-6xl
          flex-col
          items-center
          px-4
          sm:px-6
          md:px-8
        "
      >
        {/* =================================================
            HEADER
            ================================================= */}

        <p
          className="
            mb-8
            font-mechsuit
            text-[18px]
            tracking-[0.25em]
            text-[#0CE644]/75
            [text-shadow:0_0_10px_rgba(12,230,68,0.4)]
            sm:text-[22px]
            md:mb-12
            md:text-3xl
          "
        >
          <ScanText>
            EVENT STARTS IN
          </ScanText>
        </p>

        {/* =================================================
            COUNTDOWN
            ================================================= */}

        {eventStarted ? (
          <h2
            className="
              mb-8
              font-mechsuit
              text-[18px]
              tracking-[0.25em]
              text-[#0CE644]/75
              [text-shadow:0_0_10px_rgba(12,230,68,0.4)]
              sm:text-[22px]
              md:mb-12
              md:text-3xl
            "
          >
            <ScanText>
              EVENT STARTED
            </ScanText>
          </h2>
        ) : (
          <div
            className="
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              sm:gap-3
              md:gap-6
            "
          >
            {/* DAYS - Green */}
            <GlitchUnit
              value={time.days}
              label="DAYS"
              theme="green"
              isGlitching={glitchUnits.includes(
                "days"
              )}
            />

            {/* Separator */}
            <span
              className="
                mb-6
                shrink-0
                font-mech
                font-mechsuit
                text-2xl
                text-[#F5F7F6]/60
                [text-shadow:0_0_8px_rgba(245,247,246,0.4)]
                sm:mb-8
                sm:text-4xl
                md:mb-12
                md:text-6xl
                lg:text-7xl
              "
              style={{ fontFamily: "'Mechsuit', sans-serif" }}
            >
              :
            </span>

            {/* HOURS - White */}
            <GlitchUnit
              value={time.hours}
              label="HOURS"
              theme="white"
              isGlitching={glitchUnits.includes(
                "hours"
              )}
            />

            {/* Separator */}
            <span
              className="
                mb-6
                shrink-0
                font-mech
                font-mechsuit
                text-2xl
                text-[#0CE644]/80
                [text-shadow:0_0_8px_rgba(12,230,68,0.5)]
                sm:mb-8
                sm:text-4xl
                md:mb-12
                md:text-6xl
                lg:text-7xl
              "
              style={{ fontFamily: "'Mechsuit', sans-serif" }}
            >
              :
            </span>

            {/* MINUTES - Green */}
            <GlitchUnit
              value={time.minutes}
              label="MINS"
              theme="green"
              isGlitching={glitchUnits.includes(
                "minutes"
              )}
            />

            {/* Separator */}
            <span
              className="
                mb-6
                shrink-0
                font-mech
                font-mechsuit
                text-2xl
                text-[#F5F7F6]/60
                [text-shadow:0_0_8px_rgba(245,247,246,0.4)]
                sm:mb-8
                sm:text-4xl
                md:mb-12
                md:text-6xl
                lg:text-7xl
              "
              style={{ fontFamily: "'Mechsuit', sans-serif" }}
            >
              :
            </span>

            {/* SECONDS - White */}
            <GlitchUnit
              value={time.seconds}
              label="SECS"
              theme="white"
              isGlitching={glitchUnits.includes(
                "seconds"
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CountDown;