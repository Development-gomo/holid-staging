"use client";

import React, { useMemo, useState, useEffect } from "react";

function extractTitleAndBody(html) {
  if (!html) return { title: "", body: "" };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Prefer explicit heading or element with class 'widget-title'
    const heading = doc.querySelector(".widget-title, h1, h2, h3, h4, h5, h6");
    let title = "";
    if (heading) {
      title = heading.textContent.trim();
      heading.remove();
    } else {
      // fallback: use first child text
      const first = doc.body.firstElementChild;
      if (first) {
        title = first.textContent.trim();
        first.remove();
      }
    }

    const body = doc.body.innerHTML;
    return { title, body };
  } catch (e) {
    return { title: "", body: html };
  }
}

export default function FooterWidget({ html }) {
  const { title, body } = useMemo(() => extractTitleAndBody(html), [html]);
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Desktop: non-collapsible (normal). Other screens: collapsed by default.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const setFromMq = () => {
      setIsDesktop(mq.matches);
      setOpen(mq.matches);
    };
    setFromMq();
    if (mq.addEventListener) {
      mq.addEventListener("change", setFromMq);
      return () => mq.removeEventListener("change", setFromMq);
    } else if (mq.addListener) {
      mq.addListener(setFromMq);
      return () => mq.removeListener(setFromMq);
    }
  }, []);

  if (isDesktop) {
    return (
      <div>
        <div className="widget-title py-2 md:py-0">
          <span className="text-lg font-medium text-white">{title || "Details"}</span>
        </div>
        <div className="mt-2">
          <div className="widget" dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-dashed border-[#B9C0C780]">
      <button
        type="button"
        className="widget-title w-full !mb-0 flex justify-between items-center pb-4 md:pb-4 focus:outline-none"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        <p className="text-lg font-medium !leading-[24px] text-white">{title || "Details"}</p>
        <span className="text-2xl text-white-100">
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: open ? "rotate(45deg)" : "none", transition: "transform 150ms" }}
            aria-hidden="true"
          >
            <path
              d="M7.02595 0V5.97445H13V7.02627L7.02595 7.02556V13H5.97407L5.97478 7.02556H0V5.97445H5.97405L5.97476 0L7.02595 0Z"
              fill="white"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-[600px] mb-4" : "max-h-0"}`}>
        <div className="widget" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
}
