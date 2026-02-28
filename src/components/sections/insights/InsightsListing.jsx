// src/components/sections/InsightsListing.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { WP_BASE } from "@/config";
import InsightsCardAlt from "../home/InsightsCardAlt";

/**
 * InsightsListing.jsx
 * - Uses WP posts endpoint: /wp/v2/posts
 * - Optional category filter (ACF taxonomy field) that can return:
 *    - single ID (number)
 *    - multiple IDs (array of numbers)
 * - 3-column grid
 * - Shows 9 initially; Load more loads next posts without reload
 * - Load more shows only if total posts > perPage
 *
 * ACF fields expected (optional):
 * - apiBase: string
 * - postsPath: string (default "/insights")
 * - card_variant: string ("alt" / "insights" => uses InsightsCardAlt)
 * - perPage: number (default 9)
 * - category: number | number[]   (your taxonomy field name shown in screenshot)
 */
export default function InsightsListing({ data }) {
  const {
    apiBase,
    postsPath = "/insights",
    card_variant,
    perPage = 9,
    category, // taxonomy field (can be id or ids)
  } = data || {};

  const API_BASE = (apiBase || WP_BASE || "").replace(/\/$/, "");
  const useAltCardDesign = card_variant === "insights" || card_variant === "alt";

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  // Normalize category field to an array of IDs
  const categoryIds = useMemo(() => {
    if (!category) return [];
    if (Array.isArray(category)) return category.filter(Boolean).map(Number).filter(Boolean);
    return [Number(category)].filter(Boolean);
  }, [category]);

  const categoriesParam = useMemo(() => {
    // WP REST accepts comma-separated category IDs
    return categoryIds.length ? `&categories=${categoryIds.join(",")}` : "";
  }, [categoryIds]);

  const endpoint = useMemo(() => {
    return `${API_BASE}/posts`;
  }, [API_BASE]);

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

  const computeHasMore = (total, currentCount) => {
    if (!total) return false;
    return currentCount < total;
  };

  // Reset & fetch initial page when filters change
  useEffect(() => {
    let cancelled = false;

    async function fetchInitial() {
      if (!API_BASE) return;

      setLoading(true);
      setPage(1);

      try {
        const url = `${endpoint}?per_page=${perPage}&page=1&_embed&orderby=date&order=desc${categoriesParam}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch posts");

        const json = await res.json();
        const total = Number(res.headers.get("X-WP-Total") || 0);

        if (!cancelled) {
          const list = Array.isArray(json) ? json : [];
          setPosts(list);
          setTotalPosts(total);
          setHasMore(computeHasMore(total, list.length));
        }
      } catch {
        if (!cancelled) {
          setPosts([]);
          setTotalPosts(0);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInitial();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, endpoint, perPage, categoriesParam]);

  async function handleLoadMore() {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const url = `${endpoint}?per_page=${perPage}&page=${nextPage}&_embed&orderby=date&order=desc${categoriesParam}`;
      const res = await fetch(url, { cache: "no-store" });

      // WP returns 400 when page is out of range
      if (!res.ok) {
        setHasMore(false);
        return;
      }

      const json = await res.json();
      const newPosts = Array.isArray(json) ? json : [];

      setPosts((prev) => {
        const merged = [...prev, ...newPosts];
        setHasMore(computeHasMore(totalPosts, merged.length));
        return merged;
      });

      setPage(nextPage);
    } catch {
      // keep existing content; optionally setHasMore(false) if you want
    } finally {
      setLoadingMore(false);
    }
  }

  const showLoadMore = totalPosts > perPage && hasMore;

  return (
    <section id="insights-listing" className="w-full bg-white py-16 md:py-20">
      <div className="web-width px-6">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
            useAltCardDesign ? "gap-6" : "gap-8"
          }`}
        >
          {loading ? (
            Array.from({ length: perPage }).map((_, i) => (
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
          ) : posts.length ? (
            posts.map((post) => {
              const title = stripHtml(post?.title?.rendered || "");
              const categoryName = getPrimaryCategory(post);
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
                      category: categoryName,
                      date,
                      excerpt,
                      image: img,
                      href,
                    }}
                  />
                );
              }

              return (
                <InsightsCardAlt
                    key={post?.id}
                    post={{
                      id: post?.id,
                      title,
                      category: categoryName,
                      date,
                      excerpt,
                      image: img,
                      href,
                    }}
                  />
              );
            })
          ) : (
            <div className="col-span-full text-center text-black/60">No posts found.</div>
          )}
        </div>

        {showLoadMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center btn-blue gap-2 bg-[#2D5BFF] text-white text-xs md:text-sm px-7 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}