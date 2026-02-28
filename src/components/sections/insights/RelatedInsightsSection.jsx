// src/components/sections/RelatedInsightsSection.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WP_BASE } from "@/config";
import InsightsCardAlt from "../home/InsightsCardAlt";

/**
 * RelatedInsightsSection.jsx
 * Shows 3 latest related posts based on current post's categories.
 *
 * Props:
 * - currentPostId: number (required) -> to exclude current post
 * - categoryIds: number[] (required) -> categories of the current post
 * - apiBase?: string -> WP REST base, defaults to WP_BASE
 * - postsPath?: string -> default "/insights"
 * - card_variant?: string -> "alt" / "insights" uses InsightsCardAlt
 * - heading?: string -> section heading
 */
export default function RelatedInsightsSection({
  currentPostId,
  categoryIds = [],
  apiBase,
  postsPath = "/insights",
  card_variant = "alt",
  heading = "Related insights",
}) {
  const API_BASE = (apiBase || WP_BASE || "").replace(/\/$/, "");
  const useAltCardDesign = card_variant === "alt" || card_variant === "insights";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoriesParam = useMemo(() => {
    const ids = Array.isArray(categoryIds)
      ? categoryIds.filter(Boolean).map(Number).filter(Boolean)
      : [];
    return ids.length ? `&categories=${ids.join(",")}` : "";
  }, [categoryIds]);

  const stripHtml = (html = "") =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(d);
    } catch {
      return "";
    }
  };

  const getFeaturedImage = (post) => {
    const fm = post?._embedded?.["wp:featuredmedia"]?.[0];
    return (
      fm?.media_details?.sizes?.large?.source_url ||
      fm?.media_details?.sizes?.medium_large?.source_url ||
      fm?.source_url ||
      ""
    );
  };

  const getPrimaryCategory = (post) => {
    const cats = post?._embedded?.["wp:term"]?.[0] || [];
    return cats?.[0]?.name || "";
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchRelated() {
      if (!API_BASE) return;

      // If there are no categories, you can either:
      // - show latest 3 posts (fallback), OR
      // - show nothing.
      // Here we fallback to latest 3 posts.
      setLoading(true);

      try {
        const url = `${API_BASE}/posts?per_page=4&_embed&orderby=date&order=desc${categoriesParam}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch related posts");

        const data = await res.json();
        if (!cancelled) {
          const list = Array.isArray(data) ? data : [];

          // Exclude current post and limit to 3
          const filtered = list
            .filter((p) => Number(p?.id) !== Number(currentPostId))
            .slice(0, 3);

          setPosts(filtered);
        }
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRelated();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, categoriesParam, currentPostId]);

  if (!loading && posts.length === 0) return null;

  return (
    <section id="related-insights" className="w-full bg-white py-16 md:py-20">
      <div className="web-width px-6">
        {heading ? (
          <h2 className="text-center text-black font-[Merriweather] !text-[28px] md:!text-[40px] font-bold">
            {heading}
          </h2>
        ) : null}

        <div
          className={`mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
            useAltCardDesign ? "gap-6" : "gap-8"
          }`}
        >
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-4 ring-1 ring-black/5"
                style={{ backgroundColor: "rgba(219, 226, 233, 0.35)" }}
              >
                <div className="w-full h-[160px] bg-black/10" />
                <div className="mt-5 h-5 w-20 bg-black/10" />
                <div className="mt-3 h-6 w-full bg-black/10" />
                <div className="mt-2 h-6 w-4/5 bg-black/10" />
                <div className="mt-4 h-4 w-28 bg-black/10" />
                <div className="mt-6 h-10 w-32 bg-black/10" />
              </div>
            ))
          ) : (
            posts.map((post) => {
              const title = stripHtml(post?.title?.rendered || "");
              const category = getPrimaryCategory(post);
              const date = formatDate(post?.date);
              const img = getFeaturedImage(post);
              const excerpt = stripHtml(post?.excerpt?.rendered || "")
                .replace(/\s*(\[\s*&hellip;\s*\]|\[\s*…\s*\]|&hellip;|…)\s*$/i, "")
                .trim();

              const href = `${postsPath}/${post?.slug || ""}`.replace(/\/+$/, "");

              if (useAltCardDesign) {
                return (
                  <InsightsCardAlt
                    key={post?.id}
                    post={{
                      id: post?.id,
                      title,
                      category,
                      date,
                      excerpt,
                      image: img,
                      href,
                    }}
                  />
                );
              }

              return (
                <article
                  key={post?.id}
                  className="p-5 flex flex-col h-full"
                  style={{ backgroundColor: "rgba(219, 226, 233, 0.35)" }}
                >
                  {img ? (
                    <div className="relative w-full h-[200px]">
                      <Image
                        src={img}
                        alt={title || "Related insight"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}

                  <div className="mt-6 flex items-center justify-between gap-3">
                    {category ? (
                      <span style={{ fontSize: "12px", color: "#2D5BFF", fontWeight: 400 }}>
                        {category}
                      </span>
                    ) : (
                      <span />
                    )}
                    {date ? (
                      <span style={{ fontSize: "12px", color: "#90979F", fontWeight: 400 }}>
                        {date}
                      </span>
                    ) : null}
                  </div>

                  <h3
                    className="mt-6 font-medium line-clamp-2"
                    style={{
                      color: "#1F1C1C",
                      fontFamily: "Inter",
                      fontSize: "18px",
                      fontWeight: 500,
                      lineHeight: "26px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    {title}
                  </h3>

                  {excerpt ? (
                    <p
                      className="mt-4 line-clamp-3"
                      style={{
                        fontSize: "14px",
                        color: "#90979F",
                        lineHeight: "22px",
                        fontWeight: 400,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                      }}
                    >
                      {excerpt}
                    </p>
                  ) : null}

                  <div className="mt-auto pt-6">
                    <Link
                      href={href || "#"}
                      className="inline-flex items-center btn-blue gap-2 bg-[#2D5BFF] text-white text-xs md:text-sm px-5 py-3"
                      aria-label={`Read article: ${title}`}
                    >
                      Read article
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}