"use client";

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
    testimonials,
    apiBase,
    restBase = "testimonial",
    limit = 6,
  } = data;

  const API_BASE = (apiBase || WP_BASE || "").replace(/\/$/, "");

  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  // Callback refs to ensure navigation elements are wired when mounted
  const setPrev = (el) => {
    prevRef.current = el;
    const swiper = swiperRef.current;
    if (swiper && prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation?.destroy?.();
      swiper.navigation?.init?.();
      swiper.navigation?.update?.();
    }
  };

  const setNext = (el) => {
    nextRef.current = el;
    const swiper = swiperRef.current;
    if (swiper && prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation?.destroy?.();
      swiper.navigation?.init?.();
      swiper.navigation?.update?.();
    }
  };

  const stripHtml = (html = "") =>
    String(html || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const relationshipIsObjects =
    Array.isArray(testimonials) &&
    testimonials.length > 0 &&
    typeof testimonials[0] === "object";

  const relationshipIsIds =
    Array.isArray(testimonials) &&
    testimonials.length > 0 &&
    typeof testimonials[0] !== "object";

  const endpointsToTry = useMemo(() => {
    const candidates = [restBase, "testimonials", "testimonial"];
    return [...new Set(candidates.filter(Boolean))];
  }, [restBase]);

  useEffect(() => {
    if (relationshipIsObjects) {
      setItems(testimonials);
      setActiveIndex(0);
    }
  }, [relationshipIsObjects, testimonials]);

  useEffect(() => {
    let cancelled = false;

    async function fetchByIds(ids) {
      if (!API_BASE || !ids?.length) return;

      for (const base of endpointsToTry) {
        const url = `${API_BASE}/${base}?include=${ids.join(",")}&per_page=${Math.min(
          ids.length,
          100,
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
        } catch {}
      }
    }

    if (relationshipIsIds) fetchByIds(testimonials);

    return () => {
      cancelled = true;
    };
  }, [relationshipIsIds, testimonials, API_BASE, endpointsToTry]);

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
        } catch {}
      }
    }

    fetchLatest();
    return () => {
      cancelled = true;
    };
  }, [
    relationshipIsObjects,
    relationshipIsIds,
    API_BASE,
    endpointsToTry,
    limit,
  ]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;

    swiper.navigation?.destroy?.();
    swiper.navigation?.init?.();
    swiper.navigation?.update?.();
  }, [items.length]);

  const getTitle = (post) =>
    stripHtml(post?.title?.rendered || post?.title || "");

  const readField = (post, key) => {
    if (!post) return "";

    const candidates = [
      post?.acf?.[key],
      post?.acf?.[key]?.value,
      post?.fields?.[key],
      post?.meta?.[key],
      post?.meta?.acf?.[key],
      post?.[key],
    ];

    for (const v of candidates) {
      if (v !== undefined && v !== null && v !== "") return v;
    }
    return "";
  };

  const getQuote = (post) =>
    stripHtml(
      readField(post, "testimonial_quote") ||
        readField(post, "quote") ||
        post?.excerpt?.rendered ||
        post?.content?.rendered ||
        "",
    );

  const getPersonName = (post) =>
    readField(post, "person_name") ||
    readField(post, "name") ||
    stripHtml(post?.title?.rendered || post?.title || "");

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

  const bgUrl =
    background_image?.source_url ||
    background_image?.url ||
    background_image ||
    "";

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
        {text_above_heading && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex flex-col items-center">
              <div className="inline-flex items-center justify-center gap-2">
                <span className="w-[5px] h-[5px] bg-[#2A3EF4] block" />
                <p className="sub-heading-above !text-[12px] !leading-[26px] text-white/60">
                  {text_above_heading}
                </p>
              </div>
              <div className="w-full border-b border-dashed border-white/30" />
            </div>
          </div>
        )}
        {main_heading && (
          <h2 className="mt-6 text-center text-white font-[Merriweather] text-[32px] md:text-[56px] font-bold">
            {main_heading}
          </h2>
        )}
        {text_below_heading && (
          <p className="mt-6 text-center text-white/65 max-w-3xl mx-auto text-sm md:text-base">
            {text_below_heading}
          </p>
        )}
        {/* Tabs */}
        {items.length > 0 && (
          <div className="mt-10 md:mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 items-end">
              {items.map((post, idx) => {
                const label = getTitle(post);
                const isActive = activeIndex === idx;

                return (
                  <button
                    key={post?.id || idx}
                    type="button"
                    onClick={() => onTabClick(idx)}
                    className={[
                      "group w-full text-center cursor-pointer",
                      isActive ? "block" : "hidden",
                      "md:block",
                    ].join(" ")}
                    aria-current={isActive ? "true" : "false"}
                  >
                    <div className="font-[Inter] text-xl font-medium text-white">
                      {label}
                    </div>

                    <div className="mt-4 h-px w-full bg-white/35 relative overflow-hidden">
                      <div
                        className={[
                          "absolute inset-y-0 left-0 bg-white transition-all",
                          isActive ? "w-full" : "w-0",
                        ].join(" ")}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* Slider */}{" "}
        <div className="mt-8 md:mt-10">
          {" "}
          <Swiper
            modules={[Navigation, A11y]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex || 0)}
            slidesPerView={1}
            spaceBetween={24}
            loop={items.length > 1}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            className="!pb-10"
          >
            {" "}
            {items.map((post, idx) => {
              const title = getTitle(post);
              const quote = getQuote(post);
              const personName = getPersonName(post);
              const personPosition = getPersonPosition(post);
              const featuredImg = getFeaturedImage(post);
              return (
                <SwiperSlide key={post?.id || idx} className="!h-auto">
                  {" "}
                  <div className="bg-[#F2F5F7] ring-1 ring-black/5 p-6 md:p-12 h-full">
                    {" "}
                    <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-12 h-full">
                      {" "}
                      {/* Left: featured image (desktop only) */}{" "}
                      <div className="hidden md:block relative w-full aspect-[16/11] md:aspect-auto md:min-h-[360px] bg-white">
                        {" "}
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
                            {" "}
                            Featured image{" "}
                          </div>
                        )}{" "}
                      </div>{" "}
                      {/* Right: quote + person */}{" "}
                      <div className="flex flex-col h-full">
                        {" "}
                        {/* Inner card heading */}{" "}
                        {title ? (
                          <div
                            className="font-[Inter] text-[24px] leading-[24px] font-semibold"
                            style={{ color: "#1F1C1C" }}
                          >
                            {" "}
                            {title}{" "}
                          </div>
                        ) : null}{" "}
                        {quote ? (
                          <p
                            className="mt-6 text-[#0B0F1A]/80 max-w-[72ch]"
                            style={{
                              fontFamily: "Tinos, serif",
                              fontSize: "24px",
                              lineHeight: "34px",
                            }}
                          >
                            {" "}
                            {`“${quote}”`}{" "}
                          </p>
                        ) : null}{" "}
                        {personName || personPosition ? (
                          <div className="mt-8 hidden md:block">
                            {" "}
                            {personName ? (
                              <div className="text-[#0B0F1A] font-semibold text-sm md:text-base">
                                {" "}
                                {personName}{" "}
                              </div>
                            ) : null}{" "}
                            {personPosition ? (
                              <div className="mt-1 text-[#0B0F1A]/60 text-xs md:text-sm">
                                {" "}
                                {personPosition}{" "}
                              </div>
                            ) : null}{" "}
                          </div>
                        ) : null}{" "}

                        {/* Mobile compact person block: image left, name/position right */}
                        {(featuredImg || personName || personPosition) && (
                          <div className="mt-6 md:hidden flex items-end gap-4">
                            {featuredImg ? (
                              <div className="w-[87px] h-[97px] overflow-hidden bg-white flex-shrink-0">
                                <img src={featuredImg} alt={personName || title || ""} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-[87px] h-[97px] bg-black/10 flex-shrink-0" />
                            )}

                            <div className="flex flex-col">
                              {personName ? (
                                <div className="text-[#0B0F1A] font-semibold text-sm">
                                  {personName}
                                </div>
                              ) : null}
                              {personPosition ? (
                                <div className="text-[#0B0F1A]/60 text-xs">
                                  {personPosition}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}

                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </SwiperSlide>
              );
            })}{" "}
          </Swiper>{" "}
          {/* Bottom navigation */}{" "}
          {items.length > 1 ? (
            <div className="mt-2 flex items-center justify-center gap-3">
              {" "}
              <button
                ref={setPrev}
                type="button"
                className="w-11 h-11 rounded-full border border-white/25 text-white/85 flex items-center justify-center hover:border-white/40 hover:text-white transition"
                aria-label="Previous"
              >
                {" "}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  {" "}
                  <path
                    d="M15 18 9 12l6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />{" "}
                </svg>{" "}
              </button>{" "}
              <button
                ref={setNext}
                type="button"
                className="w-11 h-11 rounded-full bg-[#2D5BFF] text-white flex items-center justify-center hover:opacity-90 transition"
                aria-label="Next"
              >
                {" "}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  {" "}
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />{" "}
                </svg>{" "}
              </button>{" "}
            </div>
          ) : null}{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}
