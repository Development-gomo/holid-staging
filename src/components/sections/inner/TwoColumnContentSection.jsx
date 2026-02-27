// src/components/sections/inner/TwoColumnContentSection.jsx
"use client";

/**
 * Two Column Content Section (ACF layout: two_column_content_section)
 * Fields from your ACF JSON:
 * - background_type: none | light | dark | brand | custom
 * - background_color (only if custom)
 * - column_ratio: 50_50 | 60_40 | 40_60
 * - left_content (WYSIWYG HTML)
 * - right_content (WYSIWYG HTML)
 */

function getBgClass(backgroundType) {
  switch (backgroundType) {
    case "light":
      return "bg-gray-50 text-black";
    case "dark":
      return "bg-black text-white";
    case "brand":
      return "bg-[#00F5C4] text-black";
    case "custom":
    case "none":
    default:
      return "";
  }
}

function getRatioClass(ratio) {
  switch (ratio) {
    case "60_40":
      return "md:grid-cols-[60%_40%]";
    case "40_60":
      return "md:grid-cols-[40%_60%]";
    case "50_50":
    default:
      return "md:grid-cols-2";
  }
}

export default function TwoColumnContentSection({ data }) {
  if (!data) return null;

  const {
    background_type,
    background_color,
    column_ratio,
    left_content,
    right_content,
  } = data;

  const bgType = background_type || "none";
  const bgClass = getBgClass(bgType);
  const ratioClass = getRatioClass(column_ratio || "50_50");

  const sectionStyle =
    bgType === "custom" && background_color
      ? { backgroundColor: background_color }
      : undefined;

  return (
    <section className={`w-full py-12 md:py-16 ${bgClass}`} style={sectionStyle}>
      <div className="web-width px-6">
        <div className={`grid gap-10 ${ratioClass}`}>
          <div
            className={`prose max-w-none ${
              bgType === "dark" ? "prose-invert" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: left_content || "" }}
          />

          <div
            className={`prose max-w-none ${
              bgType === "dark" ? "prose-invert" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: right_content || "" }}
          />
        </div>
      </div>
    </section>
  );
}
