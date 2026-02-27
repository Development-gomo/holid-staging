"use client";

import Link from "next/link";

export default function SpecialHeadingWithCta({ data }) {
  if (!data) return null;

  const main_heading = data?.main_heading || "";
  const text_above_heading = data?.text_above_heading || "";
  const text_below_heading = data?.text_below_heading || "";
  const cta = data?.cta || null;
  const backgroundType = data?.background_type || "light"; // Fetch the background type from ACF

  // Set the background and text color based on the background_type
  const sectionBgClass = backgroundType === "dark" ? "bg-[#000821] text-white" : "bg-white text-[#1F1C1C]";

  return (
    <section className={`w-full py-12 pb-0 ${sectionBgClass}`}>
      <div className="web-width px-6">
        <div className="max-w-3xl mx-auto text-center">

          {text_above_heading && (
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="w-3 h-3 bg-blue-600 block rounded-sm" aria-hidden="true" />
              <p className="sub-heading-above">{text_above_heading}</p>
            </div>
          )}

          {main_heading && (
            <h2 className="special-heading" dangerouslySetInnerHTML={{ __html: main_heading }} />
          )}

          <div>
            {text_below_heading && (
              <p className="mt-6 sub-heading-above">{text_below_heading}</p>
            )}

            {cta && cta.url && (
              <div className="mt-6">
                <Link
                  href={cta.url}
                  target={cta.target || "_self"}
                  className={`inline-flex bg-white px-6 py-3 text-black btn-blue ${
                    backgroundType === "dark"
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {cta.title || "Learn more"}
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}