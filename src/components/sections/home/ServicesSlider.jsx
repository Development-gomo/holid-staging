'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

// If you already have this in your project (like in Header.jsx), keep it.
// Otherwise, pass apiBase as a prop and remove this import.
import { WP_BASE } from "@/config";

/**
 * Services slider (Swiper) — pulls posts from WP REST API CPT: `services` (fallback: `service`)
 * Matches the provided screenshot layout.
 */
export default function ServicesSlider({ data }) {
  if (!data) return null;

  // Destructure from ACF data
  const {
    main_heading,
    text_above_heading,
    text_below_heading,
    apiBase,
    restBase = "services",
    limit = 6,
    hrefBase = "/services",
  } = data;

  const API_BASE = (apiBase || WP_BASE || "").replace(/\/$/, "");
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const stripHtml = (html = "") =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  const endpointsToTry = useMemo(() => {
    const candidates = [restBase];
    // common fallback if your CPT is registered as "service"
    if (restBase !== "service") candidates.push("service");
    // de-dupe
    return [...new Set(candidates)];
  }, [restBase]);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      if (!API_BASE) return;

      for (const base of endpointsToTry) {
        const url = `${API_BASE}/${base}?per_page=${limit}&_embed`;
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;

          const data = await res.json();
          if (!cancelled && Array.isArray(data)) {
            setItems(data);
            return;
          }
        } catch (e) {
          // try next endpoint
        }
      }
    }

    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, endpointsToTry, limit]);

  // Debug: log featured image URLs for the first few items to help diagnose missing images
  useEffect(() => {
    if (!items || items.length === 0) return;
    try {
      const urls = items.map((p) => {
        const fm = p?._embedded?.["wp:featuredmedia"]?.[0];
        return (
          fm?.media_details?.sizes?.large?.source_url ||
          fm?.media_details?.sizes?.medium_large?.source_url ||
          fm?.source_url ||
          null
        );
      });
      // show first 5
      console.debug("ServicesSlider featured image URLs:", urls.slice(0, 5));
    } catch (e) {
      console.debug("ServicesSlider image debug error", e);
    }
  }, [items]);

  // Wire external navigation buttons after refs exist
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;

    // Re-init navigation
    swiper.navigation?.destroy?.();
    swiper.navigation?.init?.();
    swiper.navigation?.update?.();
  }, [items.length]);

  const getFeaturedImage = (post) => {
    const fm = post?._embedded?.["wp:featuredmedia"]?.[0];
    return (
      fm?.media_details?.sizes?.large?.source_url ||
      fm?.media_details?.sizes?.medium_large?.source_url ||
      fm?.source_url ||
      ""
    );
  };

  const getServiceIconUrl = (post) => {
    const url = post?.acf?.service_icon;
    return typeof url === "string" ? url : "";
  };

  const getTitle = (post) => stripHtml(post?.title?.rendered || "");
  const getExcerpt = (post) => {
    const ex = post?.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : "";
    const content = post?.content?.rendered ? stripHtml(post.content.rendered) : "";
    return ex || content || "";
  };

  const Icon = ({ type = "arrow" }) => {
    // Simple inline icons (no extra libraries)
    if (type === "monitor") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 5h16v11H4V5Z" stroke="currentColor" strokeWidth="2" />
          <path d="M8 19h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    if (type === "doc") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 3h7l3 3v15H7V3Z" stroke="currentColor" strokeWidth="2" />
          <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    }
    // arrow up-right
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 17 17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 7h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  };

  // mimic screenshot: different icon per card (fallback)
  const iconTypeByIndex = (i) => (i % 3 === 1 ? "monitor" : i % 3 === 2 ? "doc" : "arrow");

  return (
    <section
      id="services-slider"
      className="w-full bg-[#050A1C] py-16 md:py-20 relative overflow-hidden"
    >
      <div className="web-width px-6">
        {/* Text Above Heading */}
        <div className="flex items-center justify-center gap-2 text-white/55 text-xs md:text-sm">
          <span className="inline-block w-1.5 h-1.5 bg-[#2D5BFF] rounded-sm" />
          <span>{text_above_heading}</span>
        </div>

        {/* Main Heading */}
        <h2
          className="mt-6 text-center text-white whitespace-pre-line font-[Merriweather] font-medium
                     text-4xl md:text-6xl leading-[1.05] max-w-3xl mx-auto"
        >
          {main_heading}
        </h2>

        {/* Text Below Heading */}
        <p className="mt-6 text-center text-white/65 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          {text_below_heading}
        </p>

        {/* Slider */}
        <div className="mt-12 md:mt-14">
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex || 0)}
            spaceBetween={24}
            slidesPerView={1.05}
            breakpoints={{
              640: { slidesPerView: 1.35, spaceBetween: 24 },
              768: { slidesPerView: 2.1, spaceBetween: 28 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            className="!pb-8"
          >
            {items.map((post, idx) => {
              const title = getTitle(post);
              const excerpt = getExcerpt(post);
              const img = getFeaturedImage(post);
              const serviceIconUrl = getServiceIconUrl(post);

              const href = `${hrefBase}/${post?.slug || ""}`.replace(/\/+$/, "");

              return (
                <SwiperSlide key={post?.id || idx} className="!h-auto">
                  <div
                    className={`group relative min-h-[460px] overflow-hidden bg-white/5 ring-1 ring-white/10`}
                  >
                    {/* Background image */}
                    {img ? (
                      <Image
                        src={img}
                        alt={title || "Service"}
                        fill
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:blur-sm"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        priority={idx < 3}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 transition-all duration-300 group-hover:blur-sm" />
                    )}

                    {/* Minimal overlay so background image remains true-to-color */}
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.001)' }} />

                    {/* Top row: title + icon button */}
                    <div className="absolute inset-x-0 top-0 p-6 flex items-start justify-between">
                      <p className="text-white text-lg md:text-xl font-medium">{title}</p>

                      <Link
                        href={href || "#"}
                        className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center
                                   hover:bg-white transition"
                        aria-label={`Open ${title}`}
                      >
                        {serviceIconUrl ? (
                          <img
                            src={serviceIconUrl}
                            alt={`${title} icon`}
                            className="w-[18px] h-[18px] object-contain"
                          />
                        ) : (
                          <Icon type={iconTypeByIndex(idx)} />
                        )}
                      </Link>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-white/85 text-xs md:text-sm leading-relaxed max-w-[34ch] transform transition-transform duration-300 translate-y-0 group-hover:-translate-y-3">
                        {excerpt}
                      </p>

                      <div className="mt-4 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                        <Link
                          href={href || "#"}
                          className="inline-flex items-center gap-2 bg-[#2D5BFF] text-white text-xs md:text-sm
                                     px-4 py-2"
                        >
                          <span className="inline-block w-1.5 h-1.5 bg-white" />
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Bottom navigation (matches screenshot) */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <button
              ref={prevRef}
              type="button"
              className="w-11 h-11 rounded-full border border-white/20 text-white/80
                         flex items-center justify-center hover:border-white/35 hover:text-white transition"
              aria-label="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <button
              ref={nextRef}
              type="button"
              className="w-11 h-11 rounded-full bg-[#2D5BFF] text-white
                         flex items-center justify-center hover:opacity-90 transition"
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
