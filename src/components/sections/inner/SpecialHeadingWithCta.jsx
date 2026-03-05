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
    <section className={`w-full ${sectionBgClass} pt-[60px] pb-0 md:pt-[120px] md:pb-0`}>
      <div className="web-width px-6">
        <div className="max-w-3xl mx-auto text-center">

          {text_above_heading && (
            <div className="inline-flex items-center justify-center gap-2 dash-border mb-4">
              <span className="w-[5px] h-[5px] bg-[#2A3EF4] block" aria-hidden="true" />
              <p className="sub-heading-above !text-[12px] !leading-[26px] text-[#90979F]">{text_above_heading}</p>
              
            </div>

            
          )}

          {main_heading && (
            <h2 className="special-heading !text-[32px] !sm:text-[32px] md:!text-[56px] font-medium" dangerouslySetInnerHTML={{ __html: main_heading }} />
          )}

          <div>
            {text_below_heading && (
              <p className="mt-4 sub-heading-above">{text_below_heading}</p>
            )}

            {cta && cta.url && (
              <div className="mt-8">
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