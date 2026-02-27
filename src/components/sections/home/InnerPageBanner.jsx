"use client";

import Image from "next/image";
import Link from "next/link";

export default function InnerPageBanner({ data }) {
  if (!data) return null;

  const { background_color, heading, subheading, hero_image, button_label, button_url } = data;

  const heroImgUrl =
    hero_image?.url || hero_image?.source_url || (typeof hero_image === "string" ? hero_image : "");
  const heroImgAlt = hero_image?.alt || heading || "Banner";

  const hasBgImage = Boolean(heroImgUrl);
  const bgStyle = !hasBgImage
    ? { backgroundColor: background_color || "#0b1220" }
    : undefined;

  return (
    <section
      className="w-full relative flex items-center min-h-[75vh] py-12"
      style={bgStyle}
    >
      {/* Background image has priority */}
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

      <div className="web-width px-6 py-10 relative z-10 flex w-full flex-col md:flex-row md:gap-[10%] items-start">
        <div className="w-full md:w-1/2 text-white text-left">
          {heading && <h1 className="text-4xl font-bold">{heading}</h1>}

          {subheading && (
            <div
              className="mt-3 max-w-full text-lg mb-6"
              dangerouslySetInnerHTML={{ __html: subheading }}
            />
          )}

          {button_url && (
            <Link href={button_url} className="inline-flex bg-white px-6 py-3 text-black btn-blue">
              {button_label || "Learn more"}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
