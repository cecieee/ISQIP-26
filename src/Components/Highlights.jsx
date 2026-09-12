import React, { useEffect } from "react";

const highlightsRow1 = [
  "/Highlights/DSC03708.webp",
  "/Highlights/review.webp",
  "/Highlights/ISQUP'25.webp",
  "/Highlights/DSC03721.webp",
  "/Highlights/Inaguration.webp",
  "/Highlights/IMG_2695.webp",
];

const highlightsRow2 = [
  "/Highlights/IMG_1626.webp",
  "/Highlights/IMG_2729.webp",
  "/Highlights/IMG_4069.webp",
  "/Highlights/DSC03729.webp",
  "/Highlights/DSC03851.webp",
  "/Highlights/DSC04105.webp",
];

const HighlightCard = React.memo(({ image, index }) => {
  return (
    <div
      className="
        group
        relative
        h-[200px]
        w-[270px]
        shrink-0
        overflow-hidden
        rounded-[6px]
        border
        border-[#0CE644]/20
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-[#0CE644]/30
        hover:shadow-[0_8px_30px_rgba(12,230,68,0.12)]
        sm:h-[350px]
        sm:w-[320px]
        md:h-[350px]
        md:w-[370px]
        transform-gpu
      "
    >
      <img
        src={image}
        alt={`Event highlight ${index + 1}`}
        decoding="async"
        className="
          h-full
          w-full
          object-cover
          transition-transform
          duration-500
          ease-out
          group-hover:scale-[1.03]
          transform-gpu
        "
      />

      {/* Top-left corner */}
      <span
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-5
          w-5
          border-l-4
          border-t-4
          border-[#0CE644]
          opacity-0
          transition-all
          duration-300
          group-hover:h-8
          group-hover:w-8
          group-hover:opacity-100
        "
      />

      {/* Bottom-right corner */}
      <span
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-5
          w-5
          border-b-2
          border-r-2
          border-[#0CE644]
          opacity-0
          transition-all
          duration-300
          group-hover:h-8
          group-hover:w-8
          group-hover:opacity-100
        "
      />
    </div>
  );
});

HighlightCard.displayName = "HighlightCard";

const Highlights = () => {
  // Pre-decode images quietly in background thread to eliminate scroll stalls
  useEffect(() => {
    const allImages = [...highlightsRow1, ...highlightsRow2];
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }, []);

  return (
    <section 
    id="highlights"
    className="w-full overflow-hidden bg-background py-16 sm:py-20">

      {/* Heading */}
      <div className="mb-10 text-center md:mb-14">
        <h2 className="font-mech text-2xl tracking-wide text-[#0CE644] sm:text-6xl">
          HIGHLIGHTS <span className="text-white">'25</span>
        </h2>
      </div>

      <div className="flex flex-col gap-5">

        {/* ROW 1 → */}
        <div className="highlights-carousel overflow-hidden">
          <div className="highlights-track highlights-track-forward flex w-max gap-4">
            {highlightsRow1.map((image, index) => (
              <HighlightCard
                key={`row1-a-${index}`}
                image={image}
                index={index}
              />
            ))}

            {/* Duplicate */}
            {highlightsRow1.map((image, index) => (
              <HighlightCard
                key={`row1-b-${index}`}
                image={image}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* ROW 2 ← */}
        <div className="highlights-carousel overflow-hidden">
          <div className="highlights-track highlights-track-reverse flex w-max gap-4">
            {highlightsRow2.map((image, index) => (
              <HighlightCard
                key={`row2-a-${index}`}
                image={image}
                index={index}
              />
            ))}

            {/* Duplicate */}
            {highlightsRow2.map((image, index) => (
              <HighlightCard
                key={`row2-b-${index}`}
                image={image}
                index={index}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Highlights;


