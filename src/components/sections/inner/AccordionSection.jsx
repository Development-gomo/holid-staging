"use client";

import { useState } from "react";

function getIconSvg(color) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.02595 1.21868e-06V5.97445H13V7.02627L7.02595 7.02556V13H5.97407L5.97478 7.02556H0V5.97445H5.97405L5.97476 0L7.02595 1.21868e-06Z" fill={color} />
    </svg>
  );
}

export default function AccordionSection({ data }) {
  if (!data) return null;

  const backgroundType = data?.background_type || "light";
  const sectionBgClass = backgroundType === "dark"
    ? "bg-[#000821] text-white"
    : "bg-white text-[#1F1C1C]";

  const items = data?.accordion_details || [];
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className={`w-full py-12 ${sectionBgClass}`}>
      <div className="web-width px-6">
        <div className="max-w-5xl mx-auto">
          {items.map((item, idx) => {
            const faq = item?.faq || {};
            const question = faq?.question || "";
            const answer = faq?.answer || "";
            const isOpen = openIdx === idx;

            return (
              <div key={idx} className="border-b border-dashed border-[#B9C0C7]">
                <button
                  className="cursor-pointer w-full flex items-center justify-between py-5 text-left focus:outline-none"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-medium">{question}</span>
                  <span
                    className={`transition-transform duration-300 ml-4 ${isOpen ? "rotate-45" : "rotate-0"}`}
                    style={{ display: "inline-block" }}
                  >
                    {getIconSvg(backgroundType === "dark" ? "white" : "#1F1C1C")}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  style={{}}
                >
                  {isOpen && (
                    <div className="pb-5 text-base">
                      {answer}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
