'use client';

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import InsightsCardAlt from "@/components/sections/home/InsightsCardAlt";

import "swiper/css";
import "swiper/css/navigation";

function stripHtml(html = "") {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

function getPrimaryCategory(post) {
  const cats = post?._embedded?.["wp:term"]?.[0] || [];
  return cats?.[0]?.name || "";
}

export default function RelatedPostsSlider({ posts = [], postsPath = "/blog" }) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="web-width px-6">
        <h2 className="text-black text-3xl md:text-4xl mb-8">Related Posts</h2>

        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;

            setTimeout(() => {
              if (!swiper || !prevRef.current || !nextRef.current) return;
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation?.destroy?.();
              swiper.navigation?.init?.();
              swiper.navigation?.update?.();
            }, 0);
          }}
          slidesPerView={1.05}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 1.4, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          className="!pb-8"
        >
          {posts.map((post) => {
            const title = stripHtml(post?.title?.rendered || "");
            const category = getPrimaryCategory(post);
            const date = formatDate(post?.date);
            const excerpt = stripHtml(post?.excerpt?.rendered || "")
              .replace(/\s*(\[\s*&hellip;\s*\]|\[\s*…\s*\]|&hellip;|…)\s*$/i, "")
              .trim();
            const href = `${postsPath}/${post?.slug || ""}`.replace(/\/+$/, "");

            return (
              <SwiperSlide key={post?.id} className="!h-auto">
                <div className="h-full">
                  <InsightsCardAlt
                    post={{
                      id: post?.id,
                      title,
                      category,
                      date,
                      excerpt,
                      href,
                    }}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="mt-2 flex items-center justify-center gap-3">
          <button
            ref={prevRef}
            type="button"
            className="w-11 h-11 rounded-full border border-black/20 text-black/80 flex items-center justify-center hover:border-black/35 hover:text-black transition"
            aria-label="Previous related posts"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            ref={nextRef}
            type="button"
            className="w-11 h-11 rounded-full bg-[#2D5BFF] text-white flex items-center justify-center hover:opacity-90 transition"
            aria-label="Next related posts"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
