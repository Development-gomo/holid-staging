'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WP_BASE } from "@/config";
import InsightsCardAlt from "./InsightsCardAlt";

export default function InsightsSection({ data }) {
  if (!data) return null;
  const pathname = usePathname();

  // Destructure from ACF data
  const {
    main_heading,
    text_above_heading,
    text_below_heading,
    apiBase,
    limit = 3,
    postsPath = "/insights",
    card_variant,
  } = data;

  const useAltCardDesign =
    card_variant === "alt" || card_variant === "insights" || pathname === "/insights";

  const API_BASE = (apiBase || WP_BASE || "").replace(/\/$/, "");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    // WP embeds terms as: _embedded["wp:term"] = [ [categories...], [tags...] ]
    const cats = post?._embedded?.["wp:term"]?.[0] || [];
    return cats?.[0]?.name || "";
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      if (!API_BASE) return;

      setLoading(true);
      try {
        const url = `${API_BASE}/posts?per_page=${limit}&_embed&orderby=date&order=desc`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        if (!cancelled && Array.isArray(data)) {
          setPosts(data);
        }
      } catch (e) {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, limit]);

  return (
    <section id="insights" className="w-full bg-white py-16 md:py-20">
      <div className="web-width px-6">

         {/* Text Above Heading */}
         {text_above_heading && (
        <div className="flex items-center justify-center gap-2 text-black/60 text-xs md:text-sm">
          <span className="inline-block w-1.5 h-1.5 bg-[#2D5BFF] rounded-sm" />
          <span>{text_above_heading}</span>
        </div>
          )}

        {/* Main Heading */}
        {main_heading && (
        <h2 className="mt-6 text-center text-black font-[Merriweather] font-medium text-4xl md:text-6xl leading-[1.05] max-w-3xl mx-auto">
          {main_heading}
        </h2>
          )}

        {/* Text Below Heading */}
         {text_below_heading && (
          <p className="mt-6 text-center text-black/60 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          {text_below_heading}
           </p>
          )}

        {/* Cards */}
        <div className={`mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${useAltCardDesign ? "gap-6" : "gap-8"}`}>
          {loading ? (
            Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="p-4 ring-1 ring-black/5" style={{ backgroundColor: 'rgba(219, 226, 233, 0.35)' }}>
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
                <article key={post?.id} className="p-4 ring-1 ring-black/5 flex flex-col">
                  {/* Image (only render if present) */}
                  {img ? (
                    <div className="relative w-full h-[170px] overflow-hidden bg-black/10">
                      <Image
                        src={img}
                        alt={title || "Post image"}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  ) : null}

                  {/* Category tag */}
                  {category ? (
                    <div className="mt-5 inline-flex">
                      <span className="text-[11px] md:text-xs px-3 py-1 text-[#2D5BFF]" style={{ backgroundColor: '#DBE2E9' }}>
                        {category}
                      </span>
                    </div>
                  ) : null}

                  {/* Title */}
                  <h3 className="mt-4 font-medium" style={{ color: '#1F1C1C', fontFamily: 'Inter', fontSize: '18px', fontWeight: 500, lineHeight: '26px' }}>
                    {title}
                  </h3>

                  {/* Date */}
                  {date ? (
                    <p className="mt-3" style={{ color: '#90979F', fontFamily: 'Inter', fontSize: '12px', fontWeight: 400, lineHeight: '24px' }}>{date}</p>
                  ) : null}

                  {/* Button */}
                  <div className="mt-auto pt-6">
                    <Link
                      href={href || "#"}
                      className="inline-flex items-center gap-2 bg-[#2D5BFF] text-white text-xs md:text-sm px-5 py-3"
                      aria-label={`Read article: ${title}`}
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-white" />
                      Read article
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center text-black/60">
              No posts found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
