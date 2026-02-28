// src/components/sections/insights/InsightContent.jsx

"use client";

import Image from "next/image";
import TocSmoothScroll from "@/components/major/TocSmoothScroll";

export default function BlogPostContent({ post }) {
  if (!post) return null;

  const title = post?.title?.rendered || "";
  const content = post?.content?.rendered || "";
  const date = post?.date;
  const featuredMedia = post?._embedded?.["wp:featuredmedia"]?.[0];
  const categories = post?._embedded?.["wp:term"]?.[0] || [];
  const author = post?._embedded?.["author"]?.[0];

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

  const getFeaturedImage = () => {
    return (
      featuredMedia?.media_details?.sizes?.large?.source_url ||
      featuredMedia?.media_details?.sizes?.medium_large?.source_url ||
      featuredMedia?.source_url ||
      ""
    );
  };

  const featuredImageUrl = getFeaturedImage();
  const formattedDate = formatDate(date);
  const authorName = author?.name || "";
  const primaryCategory = categories?.[0]?.name || "";

  return (
    <>
      {/* ===== Header Section (Gradient Background) ===== */}
      <section
        className="w-full py-16 md:py-24 text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #0a1a63 0%, #06154f 55%, #031141 100%)",
        }}
      >
        <div className="web-width px-6">
          <div className="max-w-4xl">

            {/* Meta Info */}
            <div className="flex items-center gap-4 flex-wrap text-sm text-white/80 mb-6">
              {formattedDate && (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-white rounded-sm" />
                  {formattedDate}
                </span>
              )}
              {authorName && <span>By {authorName}</span>}
              {primaryCategory && (
                <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-sm">
                  {primaryCategory}
                </span>
              )}
            </div>

            {/* Title */}
            {title && (
              <h1
                className="font-[Merriweather] font-bold text-3xl md:text-5xl leading-tight"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
          </div>
        </div>
      </section>
            
        <TocSmoothScroll tocSelector=".toc" headerSelector="header" />
        {/* rest of the component */}

      {/* ===== Content Section ===== */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="web-width px-6">
          <article className="w-full max-w-4xl mx-auto">

            {/* Featured Image */}
            {featuredImageUrl && (
              <div className="relative w-full h-[350px] md:h-[500px] mb-12 overflow-hidden rounded-lg">
                <Image
                  src={featuredImageUrl}
                  alt={title || "Blog post image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              </div>
            )}

            {/* Post Content */}
            {content && (
              <div
                className="insight-content prose prose-lg max-w-none
                           prose-headings:font-[Merriweather]
                           prose-headings:text-black
                           prose-p:text-black/80
                           prose-a:text-[#2D5BFF]
                           prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Categories List */}
            {categories.length > 1 && (
              <div className="mt-12 pt-8 border-t border-black/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-black/60">Categories:</span>
                  {categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#DBE2E9] text-[#2D5BFF] text-xs rounded-sm"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
}