"use client";

import { useEffect, useMemo, useState } from "react";

export default function HomeHero({ data }) {
  const { bg_video, bg_image, logo_gallery } = data || {};
  const [batchIndex, setBatchIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const batchSize = 9;
  const animationDuration = 620;
  const holdDuration = 2600;

  const logoItems = useMemo(() => {
    if (!Array.isArray(logo_gallery)) return [];
    return logo_gallery;
  }, [logo_gallery]);

  const totalBatches = useMemo(() => {
    return Math.max(1, Math.ceil(logoItems.length / batchSize));
  }, [logoItems.length]);

  const getLogoUrl = (logo) => {
    return (
      (typeof logo === "string" ? logo : "") ||
      (typeof logo?.client_logo === "string" ? logo.client_logo : "") ||
      logo?.client_logo?.source_url ||
      logo?.client_logo?.url ||
      (typeof logo?.logo === "string" ? logo.logo : "") ||
      logo?.logo?.source_url ||
      logo?.logo?.url ||
      (typeof logo?.image === "string" ? logo.image : "") ||
      logo?.image?.source_url ||
      logo?.image?.url ||
      logo?.url ||
      logo?.source_url ||
      ""
    );
  };

  useEffect(() => {
    if (totalBatches <= 1) return;

    let holdTimeoutId;
    let animationTimeoutId;

    const runCycle = () => {
      setIsAnimating(true);

      animationTimeoutId = setTimeout(() => {
        setBatchIndex((prev) => (prev + 1) % totalBatches);
        setIsAnimating(false);
        holdTimeoutId = setTimeout(runCycle, holdDuration);
      }, animationDuration);
    };

    holdTimeoutId = setTimeout(runCycle, holdDuration);

    return () => {
      if (holdTimeoutId) clearTimeout(holdTimeoutId);
      if (animationTimeoutId) clearTimeout(animationTimeoutId);
    };
  }, [totalBatches, holdDuration, animationDuration]);

  useEffect(() => {
    if (batchIndex > totalBatches - 1) {
      setBatchIndex(0);
      setIsAnimating(false);
    }
  }, [batchIndex, totalBatches]);

  const startIndex = batchIndex * batchSize;
  const activeBatch = logoItems.slice(startIndex, startIndex + batchSize);
  const visibleLogos = Array.from({ length: batchSize }, (_, index) => activeBatch[index] || null);
  const nextBatchIndex = totalBatches > 1 ? (batchIndex + 1) % totalBatches : 0;
  const nextStartIndex = nextBatchIndex * batchSize;
  const nextBatch = logoItems.slice(nextStartIndex, nextStartIndex + batchSize);
  const upcomingLogos = Array.from({ length: batchSize }, (_, index) => nextBatch[index] || null);

  const bgImageUrl =
    (typeof bg_image === "string" ? bg_image : "") ||
    bg_image?.source_url ||
    bg_image?.url ||
    data?.bg_image_url ||
    "";
  const bgVideo = bg_video || "";

  return (
    <section id="main-hero" className="w-full relative flex flex-col md:flex-row items-center justify-between 
    min-h-[682px] py-12  md:py-16">
      {/* Full-width background section */}
      {bgVideo ? (
        <video
          className="absolute w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div
          className="absolute w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImageUrl || "#111"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Content container - added gap-[10%] for spacing between columns */}
      <div className="web-width  px-6 pt-20 pb-4 relative z-10 flex w-full flex-col md:flex-row md:gap-[10%]">
        {/* Left side (50%) for Title, Subtitle, and Button */}
        <div className="w-full md:w-1/2 text-white">
          <h1 className="text-4xl font-bold">{data?.heading}</h1>

          {data?.subheading && (
            <p className="mt-3 max-w-xl !text-[18px] !font-normal !leading-[26px] mb-32">{data.subheading}</p>
          )}

          {data?.button_label && data?.button_url && (
            <a
              href={data.button_url}
              className="inline-flex bg-white px-6 py-3 text-black btn-blue"
            >
              {data.button_label}
            </a>
          )}
        </div>

        {/* Right side (40%) for logo gallery - removed pl-6, adjusted width */}
        <div className="w-full md:w-[40%] mt-big">
          {/* Loop through logo_gallery ACF field and display logos */}
          <div className="mt-6 grid grid-cols-3 gap-0">
            {visibleLogos.map((logo, index) => {
                const isLastColumn = (index + 1) % 3 === 0;
                const isLastRow = index >= 6;
                const logoUrl = getLogoUrl(logo);
                const nextLogoUrl = getLogoUrl(upcomingLogos[index]);

                return (
                  <div
                    key={index}
                    className={`flex justify-center items-center p-6 border-dashed border-white/20
                      ${!isLastColumn ? 'border-r' : ''} 
                      ${!isLastRow ? 'border-b' : ''}`}
                  >
                    <div className="relative h-12 w-full overflow-hidden flex items-center justify-center">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={`Client Logo ${index + 1}`}
                          className="h-12 w-auto object-contain absolute"
                          style={{
                            transform: isAnimating ? "translateY(-135%)" : "translateY(0%)",
                            opacity: isAnimating ? 0.75 : 1,
                            transition: isAnimating
                              ? `transform ${animationDuration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${animationDuration}ms ease`
                              : "none",
                            willChange: isAnimating ? "transform, opacity" : "auto",
                          }}
                        />
                      ) : (
                        <div className="h-12 w-20 absolute" />
                      )}

                      {nextLogoUrl ? (
                        <img
                          src={nextLogoUrl}
                          alt={`Client Logo ${index + 1} upcoming`}
                          className="h-12 w-auto object-contain absolute"
                          style={{
                            transform: isAnimating ? "translateY(0%)" : "translateY(135%)",
                            opacity: isAnimating ? 1 : 0.75,
                            transition: isAnimating
                              ? `transform ${animationDuration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${animationDuration}ms ease`
                              : "none",
                            willChange: isAnimating ? "transform, opacity" : "auto",
                          }}
                        />
                      ) : (
                        <div className="h-12 w-20 absolute" />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
