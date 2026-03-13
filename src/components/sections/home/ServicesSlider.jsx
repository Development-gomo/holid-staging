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
    limit = 10,
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
      // Debug ACF service_icon raw values
      console.debug(
        "ServicesSlider ACF service_icon raw values:",
        items.slice(0, 5).map((p) => ({ slug: p?.slug, service_icon: p?.acf?.service_icon, acf: p?.acf }))
      );
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
    const icon = post?.acf?.service_icon;
    if (!icon) return "";
    if (typeof icon === "string") return icon;
    if (typeof icon === "object") return icon?.url || icon?.sizes?.thumbnail || "";
    // ACF may return just the attachment ID (number) via REST — resolved below
    return "";
  };

  // Resolve ACF service_icon when it comes back as an attachment ID (number)
  useEffect(() => {
    if (!API_BASE || items.length === 0) return;
    let cancelled = false;

    async function resolveIcons() {
      const updated = await Promise.all(
        items.map(async (post) => {
          const icon = post?.acf?.service_icon;
          // Only fetch if the value is a numeric attachment ID
          if (typeof icon !== "number" || icon <= 0) return post;
          try {
            const res = await fetch(`${API_BASE}/media/${icon}`);
            if (!res.ok) return post;
            const media = await res.json();
            const url =
              media?.media_details?.sizes?.thumbnail?.source_url ||
              media?.source_url ||
              "";
            return {
              ...post,
              acf: { ...post.acf, service_icon: url },
            };
          } catch {
            return post;
          }
        })
      );
      if (!cancelled) setItems(updated);
    }

    // Only run if at least one icon is a numeric ID
    if (items.some((p) => typeof p?.acf?.service_icon === "number")) {
      resolveIcons();
    }

    return () => { cancelled = true; };
  }, [API_BASE, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTitle = (post) => stripHtml(post?.title?.rendered || "");
  const getExcerpt = (post) => {
    const ex = post?.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : "";
    const content = post?.content?.rendered ? stripHtml(post.content.rendered) : "";
    return ex || content || "";
  };

  return (
    <section
      id="services-slider"
      className="w-full bg-[#000821] pt-[60px] pb-[60px] md:pt-[120px] md:pb-[120px] relative overflow-hidden"
    >
      <div className="web-width px-6">
        {/* Text Above Heading */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex flex-col items-center">
            <div className="inline-flex items-center justify-center gap-2">
              <span className="w-[5px] h-[5px] bg-[#2A3EF4] block" aria-hidden="true" />
              <p className="sub-heading-above !text-[12px] !leading-[26px] text-[#90979F]">{text_above_heading}</p>
            </div>
            <div className="w-full border-b border-dashed border-white/30" />
          </div>
        </div>

        {/* Main Heading */}
        <h2
          className="mt-4 text-center text-white whitespace-pre-line  
                     !text-[32px] !sm:text-[32px] md:!text-[56px] font-bold mx-auto max-w-3xl"
        >
          {main_heading}
        </h2>

        {/* Text Below Heading */}
        <p className="mt-4 text-center text-white max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          {text_below_heading}
        </p>

        {/* Slider */}
        <div className="mt-12 md:mt-12">
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
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:blur-[10px] group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        priority={idx < 3}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 transition-all duration-500 group-hover:blur-[10px]" />
                    )}

                    {/* Noise overlay — appears on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[2]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "200px 200px",
                        mixBlendMode: "soft-light",
                      }}
                    />

                    {/* Dark Overlay */}
                    <div className="overlay absolute inset-0 bg-black opacity-30 z-[1]"></div>

                    {/* Top row: title + icon button */}
                    <div className="absolute inset-x-0 top-0 p-8 flex items-start justify-between z-[10]">
                      <p className="text-white text-lg md:!text-2xl leading-[26px] font-bld">{title}</p>

                      {serviceIconUrl && (
                        <Link
                          href={href || "#"}
                          className=" rounded-full text-black flex items-center justify-center"
                          aria-label={`Open ${title}`}
                        >
                          <img
                            src={serviceIconUrl}
                            alt={`${title} icon`}
                            className="w-[40px] h-[40px] object-contain"
                          />
                        </Link>
                      )}
                    </div>

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:bottom-[-65px] group-hover:bottom-0 transition-all duration-300 z-[10]">
                      <p className="text-white mb-4 text-xs md:text-sm leading-relaxed max-w-[34ch] transform transition-transform duration-300 translate-y-0 group-hover:-translate-y-3">
                        {excerpt}
                      </p>

                      <div className="btn-bluemt-4 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                        <Link
                          href={href || "#"}
                          className="fs-16 inline-flex btn-blue items-center gap-2 bg-[#2D5BFF] text-white text-xs md:text-sm
                                     px-4 py-2"
                        >
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
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              ref={prevRef}
              type="button"
              className="cursor-pointer w-[48px] h-[48px] rounded-full border border-white text-white
                         flex items-center justify-center hover:border-white hover:text-white transition"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M8.69778 0L9.54834 0.882601L1.73306 8.51499L9.36679 16.3612L8.51504 17.2129L0 8.51492L8.69778 0Z" fill="#DBE2E9"/>
              </svg>
            </button>

            <button
              ref={nextRef}
              type="button"
              className="cursor-pointer w-[48px] h-[48px] rounded-full bg-[#2D5BFF] text-white
                         flex items-center justify-center hover:opacity-90 transition"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="24" transform="matrix(-1 0 0 1 48 0)" fill="#2A3EF4"/>
                <path d="M20.3022 16L19.4517 16.8826L27.2669 24.515L19.6332 32.3612L20.485 33.2129L29 24.5149L20.3022 16Z" fill="#DBE2E9"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}