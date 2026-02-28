// src/components/major/TocSmoothScroll.jsx
"use client";

import { useEffect } from "react";

export default function TocSmoothScroll({
  tocSelector = ".toc",
  headerSelector = "header",
}) {
  useEffect(() => {
    const toc = document.querySelector(tocSelector);
    if (!toc) return;

    const getHeaderOffset = () => {
      const header = document.querySelector(headerSelector);
      return header ? header.getBoundingClientRect().height : 0;
    };

    const onClick = (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      const headerOffset = getHeaderOffset();
      const elementTop = el.getBoundingClientRect().top + window.scrollY;
      const targetY = Math.max(0, elementTop - headerOffset - 12); // extra gap

      window.history.pushState(null, "", href);

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    };

    toc.addEventListener("click", onClick);
    return () => toc.removeEventListener("click", onClick);
  }, [tocSelector, headerSelector]);

  return null;
}