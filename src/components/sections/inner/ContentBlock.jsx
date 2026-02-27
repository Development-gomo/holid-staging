// src/components/sections/inner/ContentBlock.jsx
"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Content Block (ACF layout: content_block)
 * Fields from your ACF JSON:
 * - background_type: none | light | dark | brand | custom
 * - background_color (only if custom)
 * - layout_style: image_left | image_right | no_image
 * - heading
 * - content (WYSIWYG HTML)
 * - image (image array)
 * - button (link)
 */

function getBgClass(backgroundType) {
  switch (backgroundType) {
    case "light":
      return "bg-white text-black"; // Light background and black text
    case "dark":
      return "bg-[#000821] text-white"; // Dark background with #000821 and white text
    case "brand":
      return "bg-[#00F5C4] text-black"; // Brand color background with black text
    case "custom":
    case "none":
    default:
      return "";
  }
}

function getImageUrl(image) {
  if (!image) return "";
  return image?.url || image?.source_url || (typeof image === "string" ? image : "");
}

function getLink(link) {
  if (!link || !link.url) return null;
  return {
    href: link.url,
    title: link.title || "Learn more",
    target: link.target || "_self",
  };
}

export default function ContentBlock({ data }) {
  if (!data) return null;

  const {
    background_type,
    background_color,
    layout_style,
    heading,
    content,
    image,
    button,
  } = data;

  const bgType = background_type || "none";
  const bgClass = getBgClass(bgType);

  const sectionStyle =
    bgType === "custom" && background_color
      ? { backgroundColor: background_color }
      : undefined;

  const imgUrl = getImageUrl(image);
  const imgAlt = image?.alt || heading || "";
  const btn = getLink(button);

  const isNoImage = layout_style === "no_image";
  const isImageLeft = layout_style === "image_left";

  return (
    <section className={`w-full py-12 md:py-16 ${bgClass}`} style={sectionStyle}>
      <div className="web-width px-6">

        {/* If NO IMAGE → Full width content */}
        {isNoImage ? (
          <div className="w-full max-w-4xl mx-auto">
            {heading && (
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                {heading}
              </h2>
            )}

            {content && (
              <div
                className={`prose max-w-none mb-6 ${
                  bgType === "dark" ? "prose-invert" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {btn?.href && (
              <Link
                href={btn.href}
                target={btn.target}
                className={`inline-flex px-6 py-3 rounded-md transition ${
                  bgType === "dark"
                    ? "bg-white text-black hover:opacity-90"
                    : "bg-black text-white hover:opacity-90"
                }`}
              >
                {btn.title}
              </Link>
            )}
          </div>
        ) : (
          /* Normal image + content layout */
          <div
            className={`w-full flex flex-col md:flex-row gap-8 md:items-center ${
              !isImageLeft ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image Column */}
            <div className="w-full md:w-1/2">
              {imgUrl && (
                <div className="relative">
                  <Image
                    src={imgUrl}
                    alt={imgAlt}
                    width={900}
                    height={700}
                    className="w-full rounded-xl object-cover"
                  />
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              {heading && (
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  {heading}
                </h2>
              )}

              {content && (
                <div
                  className={`prose max-w-none mb-6 ${
                    bgType === "dark" ? "prose-invert" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}

              {btn?.href && (
                <Link
                  href={btn.href}
                  target={btn.target}
                  className={`inline-flex bg-white px-6 py-3 text-black btn-blue ${
                    bgType === "dark"
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {btn.title}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}