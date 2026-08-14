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

const GlitchUnit = ({ value, label, isGlitching }) => {
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
        className="
          font-mechsuit
          text-3xl
          leading-none
          tracking-wider
          text-[#0CE644]
          [text-shadow:0_0_4px_rgba(12,230,68,0.65),0_0_12px_rgba(12,230,68,0.25)]
          sm:text-4xl
          md:text-6xl
          lg:text-7xl
        "
      >
        {displayValue.split("").map((digit, index) => {
          const isDigitGlitching =
            glitchDigits.includes(index);

          return (
            <span
              key={index}
              className={
                isDigitGlitching
                  ? "crt-number-glitch inline-block"
                  : "inline-block"
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
        className="
          whitespace-nowrap
          font-mechsuit
          text-[7px]
          tracking-[0.25em]
          text-[#0CE644]/50
          sm:text-[8px]
          md:text-[10px]
          lg:text-xs
        "
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
        relative
        flex
        w-full
        items-center
        justify-center
        overflow-hidden
        py-12
        md:py-16
      "
    >
      {/* =================================================
          CRT SCREEN
          ================================================= */}

      <div
        className="
          crt-screen
          relative
          w-full
          min-h-[250px]
          overflow-hidden
          rounded-[18px]
          border
          border-[#0CE644]/15
          bg-[#020402]
          px-4
          py-10
          sm:px-6
          md:px-10
          md:py-12
        "
      >
        {/* =================================================
            CRT EFFECTS
            ================================================= */}

        {/* Fine CRT scanlines */}

        <div
          className="
            crt-scanlines
            pointer-events-none
            absolute
            inset-0
            z-40
          "
        />

        {/* Widely spaced horizontal interference */}

        <div className="crt-horizontal-lines" />

        {/* Static / grain */}

        <div
          className="
            crt-static
            pointer-events-none
            absolute
            inset-0
            z-40
          "
        />

        {/* Additional static lines */}

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

        {/* =================================================
            CONTENT
            ================================================= */}

        <div
          className="
            crt-flicker
            relative
            z-10
            flex
            flex-col
            items-center
          "
        >
          {/* =================================================
              HEADER
              ================================================= */}

          <p
            className="
              mb-8
              font-mechsuit
              text-2xl
              tracking-[0.4em]
              text-[#0CE644]/70
              [text-shadow:0_0_8px_rgba(12,230,68,0.35)]
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
                my-8
                font-mechsuit
                text-2xl
                text-[#0CE644]
                [text-shadow:0_0_12px_rgba(12,230,68,0.55)]
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
                max-w-5xl
                items-center
                justify-center
              "
            >
              {/* DAYS */}

              <GlitchUnit
                value={time.days}
                label="DAYS"
                isGlitching={glitchUnits.includes(
                  "days"
                )}
              />

              {/* Separator */}

              <span
                className="
                  mb-5
                  shrink-0
                  font-mechsuit
                  text-lg
                  text-[#0CE644]/90
                  md:text-2xl
                  lg:text-3xl
                "
              >
                :
              </span>

              {/* HOURS */}

              <GlitchUnit
                value={time.hours}
                label="HOURS"
                isGlitching={glitchUnits.includes(
                  "hours"
                )}
              />

              {/* Separator */}

              <span
                className="
                  mb-5
                  shrink-0
                  font-mechsuit
                  text-lg
                  text-[#0CE644]/90
                  md:text-2xl
                  lg:text-3xl
                "
              >
                :
              </span>

              {/* MINUTES */}

              <GlitchUnit
                value={time.minutes}
                label="MINS"
                isGlitching={glitchUnits.includes(
                  "minutes"
                )}
              />

              {/* Separator */}

              <span
                className="
                  mb-5
                  shrink-0
                  font-mechsuit
                  text-lg
                  text-[#0CE644]/90
                  md:text-2xl
                  lg:text-3xl
                "
              >
                :
              </span>

              {/* SECONDS */}

              <GlitchUnit
                value={time.seconds}
                label="SECS"
                isGlitching={glitchUnits.includes(
                  "seconds"
                )}
              />
            </div>
          )}

          {/* =================================================
              TERMINAL STATUS
              ================================================= */}

          <div
            className="
              mt-10
              flex
              w-full
              items-center
              justify-center
              font-mechsuit
              text-[9px]
              tracking-[0.18em]
              text-[#0CE644]/40
              md:mt-9
              md:text-xl
            "
          >
            <span>
              <ScanText small>
                &gt; THE FUTURE IS LOADING......
              </ScanText>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountDown;