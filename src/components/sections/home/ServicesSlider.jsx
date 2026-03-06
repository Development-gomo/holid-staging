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
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" className="__web-inspector-hide-shortcut__">
  <circle cx="20" cy="20" r="20" fill="#DBE2E9" />
  <path 
    fillRule="evenodd" 
    clipRule="evenodd" 
    d="M28.62 25.6457H21.0393V27.9864H25.0502C25.2564 27.9864 25.424 28.154 25.424 28.3602C25.424 28.5663 25.2564 28.732 25.0502 28.732H13.9498C13.7437 28.732 13.5761 28.5663 13.5761 28.3602C13.5761 28.154 13.7437 27.9864 13.9498 27.9864H17.9607V25.6457H10.38V23.5073H28.62V25.6457ZM10.38 22.7618V12.3298H28.62V22.7618H10.38ZM13.3102 14.5973H17.5176C17.7238 14.5973 17.8914 14.763 17.8914 14.9691V20.4326C17.8914 20.6388 17.7238 20.8064 17.5176 20.8064H13.3102C13.1041 20.8064 12.9365 20.6388 12.9365 20.4326V14.9691C12.9365 14.763 13.1041 14.5973 13.3102 14.5973ZM17.1458 15.3429H13.682V20.0608H17.1458V15.3429ZM25.5299 20.0608C25.7361 20.0608 25.9037 20.2284 25.9037 20.4326C25.9037 20.6388 25.7361 20.8064 25.5299 20.8064H22.2549C22.0488 20.8064 21.8811 20.6388 21.8811 20.4326C21.8811 20.2284 22.0488 20.0608 22.2549 20.0608H25.5299ZM25.5299 17.3907C25.7361 17.3907 25.9037 17.5564 25.9037 17.7625C25.9037 17.9687 25.7361 18.1363 25.5299 18.1363H20.654C20.4478 18.1363 20.2822 17.9687 20.2822 17.7625C20.2822 17.5564 20.4478 17.3907 20.654 17.3907H25.5299ZM25.5299 14.7206C25.7361 14.7206 25.9037 14.8863 25.9037 15.0924C25.9037 15.2986 25.7361 15.4662 25.5299 15.4662H19.6368C19.4326 15.4662 19.265 15.2986 19.265 15.0924C19.265 14.8863 19.4326 14.7206 19.6368 14.7206H25.5299Z" 
    fill="black" 
  />
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
      className="w-full bg-[#050A1C] pt-[60px] pb-[60px] md:pt-[120px] md:pb-[120px] relative overflow-hidden"
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
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:blur-sm"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        priority={idx < 3}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 transition-all duration-300 group-hover:blur-sm" />
                    )}

                    {/* Dark Overlay */}
                    <div className="overlay absolute inset-0 bg-black opacity-30"></div>

                    {/* Top row: title + icon button */}
                    <div className="absolute inset-x-0 top-0 p-8 flex items-start justify-between">
                      <p className="text-white text-lg md:!text-2xl leading-[26px] font-bld">{title}</p>

                      <Link
                        href={href || "#"}
                        className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center
                                   hover:bg-white  transition"
                        aria-label={`Open ${title}`}
                      >
                        {serviceIconUrl ? (
                          <img
                            src={serviceIconUrl}
                            alt={`${title} icon`}
                            className="w-[20px] h-[20px] object-contain"
                          />
                        ) : (
                          <Icon type={iconTypeByIndex(idx)} />
                        )}
                      </Link>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:bottom-[-50px] group-hover:bottom-0 transition-all duration-300">
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
              className="cursor-pointer w-[48px] h-[48px] rounded-full border border-white/20 text-white/80
                         flex items-center justify-center hover:border-white/35 hover:text-white transition"
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