// src/components/sections/inner/InnerHeroSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";

function getRatioClass(ratio) {
  switch (ratio) {
    case "60_40":
      return "md:grid-cols-[60%_40%]";
    case "40_60":
      return "md:grid-cols-[40%_60%]";
    case "80_20":
      return "md:grid-cols-[80%_20%]";
    case "20_80":
      return "md:grid-cols-[20%_80%]";
    case "50_50":
    default:
      return "md:grid-cols-2";
  }
}

export default function InnerHeroSection({ data }) {
  if (!data) return null;

  const {
    background_color,
    heading,
    subheading,
    hero_image,
    button,
    column_ratio, // ✅ NEW ACF field
  } = data;

  // ACF image return format can be object or string
  const heroImgUrl =
    hero_image?.url ||
    hero_image?.source_url ||
    (typeof hero_image === "string" ? hero_image : "");

  const heroImgAlt = hero_image?.alt || heading || "Service hero";

  const hasBgImage = Boolean(heroImgUrl);
  const bgStyle = !hasBgImage
    ? { backgroundColor: background_color || "#0b1220" }
    : undefined;

  const ratioClass = getRatioClass(column_ratio || "50_50");

  return (
    <section
      className="w-full relative flex items-center min-h-[75vh] py-12 md:py-16"
      style={bgStyle}
    >
      {/* Background image */}
      {hasBgImage ? (
        <div className="absolute inset-0">
          <Image
            src={heroImgUrl}
            alt={heroImgAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ) : null}

      {/* Content container */}
      <div className="web-width px-6 py-10 relative z-10 w-full">
        <div className={`grid gap-10 ${ratioClass}`}>
          {/* Left column (content) */}
          <div className="text-white text-left">
            {heading && <h1 className="text-4xl font-bold">{heading}</h1>}

            {subheading && (
              <div
                className="mt-3 max-w-full text-lg mb-6"
                dangerouslySetInnerHTML={{ __html: subheading }}
              />
            )}

            {button?.url && (
              <Link
                href={button.url}
                target={button.target || "_self"}
                className={`inline-flex bg-white px-6 py-3 text-black btn-blue ${
                  bgStyle?.backgroundColor === "#0b1220"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }`}
              >
                {button.title}
              </Link>
            )}
          </div>

          {/* Right column (empty spacer to respect ratio) */}
          <div aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}