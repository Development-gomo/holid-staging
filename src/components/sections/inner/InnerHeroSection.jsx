// src/components/sections/inner/InnerHeroSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function InnerHeroSection({ data }) {
  if (!data) return null;
  const {
    background_color,
    heading,
    subheading,
    hero_image,
    button,
  } = data;

  // ACF image return format can be object or string
  const heroImgUrl =
    hero_image?.url || hero_image?.source_url || (typeof hero_image === "string" ? hero_image : "");
  const heroImgAlt = hero_image?.alt || heading || "Service hero";

  const hasBgImage = Boolean(heroImgUrl);
  const bgStyle = !hasBgImage
    ? { backgroundColor: background_color || "#0b1220" }
    : undefined;

  return (
    <section className="w-full relative flex items-center min-h-[75vh] py-12 md:py-16" style={bgStyle}>
      {/* Background image option (if hero image exists AND user wants image-like hero)
          We do NOT force overlay; we keep it similar to your HomeHero approach.
          If you want always solid background, remove this block.
      */}
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
      <div className="web-width px-6 py-10 relative z-10 flex w-full flex-col md:flex-row md:gap-[10%]">
        <div className="w-full md:w-1/2 text-white text-left">
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
              target={button.target}
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
      </div>
    </section>
  );
}
