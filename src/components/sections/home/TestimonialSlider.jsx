'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { WP_BASE } from "@/config";

export default function TestimonialSlider({ data }) {
  if (!data) return null;

  const {
    main_heading,
    text_above_heading,
    text_below_heading,
    background_image,
    testimonials, // relationship (should point to post type: testimonial)

    // fallback REST controls
    apiBase,
    restBase = "testimonial", // ✅ CPT rest base
    limit = 6,
  } = data;

  const API_BASE = (apiBase || WP_BASE || "").replace(/\/$/, "");

  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const stripHtml = (html = "") =>
    String(html || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const relationshipIsObjects =
    Array.isArray(testimonials) && testimonials.length > 0 && typeof testimonials[0] === "object";
  const relationshipIsIds =
    Array.isArray(testimonials) && testimonials.length > 0 && typeof testimonials[0] !== "object";

  const endpointsToTry = useMemo(() => {
    // ✅ ONLY testimonial variations now
    const candidates = [restBase, "testimonials", "testimonial"];
    return [...new Set(candidates.filter(Boolean))];
  }, [restBase]);

  // Use relationship post objects directly (keeps order)
  useEffect(() => {
    if (relationshipIsObjects) {
      setItems(testimonials);
      setActiveIndex(0);
    }
  }, [relationshipIsObjects, testimonials]);

  // If relationship returns IDs: fetch those posts (preserve order)
  useEffect(() => {
    let cancelled = false;

    async function fetchByIds(ids) {
      if (!API_BASE || !ids?.length) return;

      for (const base of endpointsToTry) {
        const url = `${API_BASE}/${base}?include=${ids.join(",")}&per_page=${Math.min(
          ids.length,
          100
        )}&_embed&orderby=include`;

        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;

          const json = await res.json();
          if (!cancelled && Array.isArray(json)) {
            setItems(json);
            setActiveIndex(0);
            return;
          }
        } catch (e) {
          // try next endpoint
        }
      }
    }

    if (relationshipIsIds) fetchByIds(testimonials);

    return () => {
      cancelled = true;
    };
  }, [relationshipIsIds, testimonials, API_BASE, endpointsToTry]);

  // Fallback: if relationship empty, fetch latest
  useEffect(() => {
    let cancelled = false;

    async function fetchLatest() {
      if (relationshipIsObjects || relationshipIsIds) return;
      if (!API_BASE) return;

      for (const base of endpointsToTry) {
        const url = `${API_BASE}/${base}?per_page=${limit}&_embed`;
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;

          const json = await res.json();
          if (!cancelled && Array.isArray(json)) {
            setItems(json);
            setActiveIndex(0);
            return;
          }
        } catch (e) {
          // try next endpoint
        }
      }
    }

    fetchLatest();
    return () => {
      cancelled = true;
    };
  }, [relationshipIsObjects, relationshipIsIds, API_BASE, endpointsToTry, limit]);

  // Wire external navigation buttons after refs exist
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;

    swiper.navigation?.destroy?.();
    swiper.navigation?.init?.();
    swiper.navigation?.update?.();
  }, [items.length]);

  // ---- Helpers ----
  const getTitle = (post) => stripHtml(post?.title?.rendered || post?.title || "");
  const readField = (post, key) => {
    if (!post) return "";

    // Try several common places ACF or REST consumers might expose fields
    const candidates = [
      // ACF plugin exposes under acf
      post?.acf?.[key],
      // ACF fields sometimes are objects with a value
      post?.acf?.[key]?.value,
      // Some backends expose custom fields under fields
      post?.fields?.[key],
      // WP REST meta area
      post?.meta?.[key],
      post?.meta?.acf?.[key],
      // Direct property on the post
      post?.[key],
    ];

    for (const v of candidates) {
      if (v !== undefined && v !== null && v !== "") return v;
    }

    return "";
  };

  const getQuote = (post) => {
    const raw =
      readField(post, "testimonial_quote") ||
      readField(post, "quote") ||
      // sometimes the quote might be in excerpt or content
      post?.excerpt?.rendered ||
      post?.content?.rendered ||
      "";

    return stripHtml(raw);
  };

  const getPersonName = (post) =>
    readField(post, "person_name") ||
    readField(post, "name") ||
    // fallback to title if person name stored as title
    stripHtml(post?.title?.rendered || post?.title || "") ||
    "";

  // ✅ Your fields: person_position (but also supports older keys)
  const getPersonPosition = (post) =>
    readField(post, "person_position") ||
    readField(post, "person_designation") ||
    readField(post, "person_role") ||
    readField(post, "designation") ||
    "";

  const getFeaturedImage = (post) => {
    const fm = post?._embedded?.["wp:featuredmedia"]?.[0];
    return (
      fm?.media_details?.sizes?.large?.source_url ||
      fm?.media_details?.sizes?.medium_large?.source_url ||
      fm?.source_url ||
      ""
    );
  };

  const bgUrl = background_image?.source_url || background_image?.url || background_image || "";

  const onTabClick = (idx) => {
    setActiveIndex(idx);
    const swiper = swiperRef.current;
    if (!swiper) return;

    if (swiper.params.loop && typeof swiper.slideToLoop === "function") {
      swiper.slideToLoop(idx, 450);
    } else {
      swiper.slideTo(idx, 450);
    }
  };

  return (
    <section
      id="testimonial-slider"
      className="w-full py-16 md:py-20 bg-cover bg-center bg-no-repeat"
      style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >

      <div className="web-width px-6 relative z-10">
        {/* text above heading */}
        {text_above_heading ? (
          <div className="flex items-center justify-center gap-2 text-white/55 text-xs md:text-sm">
            <span className="inline-block w-1.5 h-1.5 bg-[#2D5BFF] rounded-sm" />
            <span>{text_above_heading}</span>
          </div>
        ) : null}

        {/* heading */}
        {main_heading ? (
          <h2
            className="mt-6 text-center text-white whitespace-pre-line font-[Merriweather] font-medium
                       text-4xl md:text-6xl leading-[1.05] max-w-4xl mx-auto"
          >
            {main_heading}
          </h2>
        ) : null}

        {/* subtext */}
        {text_below_heading ? (
          <p className="mt-6 text-center text-white/65 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            {text_below_heading}
          </p>
        ) : null}

        {/* Tabs (titles) */}
        {items.length > 0 ? (
          <div className="mt-10 md:mt-12">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10 items-end">
              {items.map((post, idx) => {
                const label = getTitle(post) || `Item ${idx + 1}`;
                const isActive = activeIndex === idx;

                return (
                  <button
                    key={post?.id || idx}
                    type="button"
                    onClick={() => onTabClick(idx)}
                    className="group w-full cursor-pointer"
                    aria-current={isActive ? "true" : "false"}
                    style={{ textAlign: "center" }}
                  >
                    <div
                      className={[
                        "font-[Inter] text-xl leading-[24px] font-medium transition-opacity",
                        isActive ? "text-white opacity-100" : "text-white/80 opacity-100",
                      ].join(" ")}
                    >
                      {label}
                    </div>

                    <div className="mt-4 h-px w-full bg-white/35 relative overflow-hidden">
                      <div
                        className={[
                          "absolute inset-y-0 left-0 bg-white transition-all duration-300",
                          isActive ? "w-full opacity-100" : "w-[0%] opacity-0",
                        ].join(" ")}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Slider */}
        <div className="mt-8 md:mt-10">
          <Swiper
            modules={[Navigation, A11y]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex || 0)}
            slidesPerView={1}
            spaceBetween={24}
            loop={items.length > 1}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            className="!pb-10"
          >
            {items.map((post, idx) => {
              const title = getTitle(post);
              const quote = getQuote(post);
              const personName = getPersonName(post);
              const personPosition = getPersonPosition(post);
              const featuredImg = getFeaturedImage(post);

              return (
                <SwiperSlide key={post?.id || idx} className="!h-auto">
                  <div className="bg-[#F2F5F7] ring-1 ring-black/5">
                    <div className="grid grid-cols-1 md:grid-cols-[360px_1fr]">
                      {/* Left: featured image */}
                      <div className="relative w-full aspect-[16/11] md:aspect-auto md:min-h-[360px] bg-white">
                        {featuredImg ? (
                          <Image
                            src={featuredImg}
                            alt={title || "Testimonial image"}
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 360px, 100vw"
                            priority={idx < 1}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-black/40 text-sm">
                            Featured image
                          </div>
                        )}
                      </div>

                      {/* Right: quote + person */}
                      <div className="p-6 md:p-10">
                        {/* Inner card heading */}
                        {title ? (
                          <div
                            className="font-[Inter] text-[24px] leading-[24px] font-semibold"
                            style={{ color: "#1F1C1C" }}
                          >
                            {title}
                          </div>
                        ) : null}

                        {quote ? (
                          <p className="mt-6 text-[#0B0F1A]/80 text-sm md:text-base leading-relaxed max-w-[72ch]">
                            {`“${quote}”`}
                          </p>
                        ) : null}

                        {(personName || personPosition) ? (
                          <div className="mt-8">
                            {personName ? (
                              <div className="text-[#0B0F1A] font-semibold text-sm md:text-base">
                                {personName}
                              </div>
                            ) : null}

                            {personPosition ? (
                              <div className="mt-1 text-[#0B0F1A]/60 text-xs md:text-sm">
                                {personPosition}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Bottom navigation */}
          {items.length > 1 ? (
            <div className="mt-2 flex items-center justify-center gap-3">
              <button
                ref={prevRef}
                type="button"
                className="w-11 h-11 rounded-full border border-white/25 text-white/85
                           flex items-center justify-center hover:border-white/40 hover:text-white transition"
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
          ) : null}
        </div>
      </div>
    </section>
  );
}
