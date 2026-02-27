// src/components/sections/blog/BlogPostContent.jsx
"use client";

import Image from "next/image";

/**
 * Blog Post Content Section
 * Displays the full blog post with title, meta info, featured image, and content
 */

export default function BlogPostContent({ post }) {
  if (!post) return null;

  // Extract post data
  const title = post?.title?.rendered || "";
  const content = post?.content?.rendered || "";
  const date = post?.date;
  const featuredMedia = post?._embedded?.["wp:featuredmedia"]?.[0];
  const categories = post?._embedded?.["wp:term"]?.[0] || [];
  const author = post?._embedded?.["author"]?.[0];

  // Format date
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

  // Get featured image
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
    <section className="w-full bg-white py-12 md:py-16">
      <div className="web-width px-6">
        <article className="w-full">
          
          {/* Post Meta */}
          <div className="flex items-center gap-4 flex-wrap text-sm text-black/60 mb-6">
            {formattedDate && (
              <span className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-[#2D5BFF] rounded-sm" />
                {formattedDate}
              </span>
            )}
            {authorName && (
              <span>By {authorName}</span>
            )}
            {primaryCategory && (
              <span className="px-3 py-1 bg-[#DBE2E9] text-[#2D5BFF] text-xs">
                {primaryCategory}
              </span>
            )}
          </div>

          {/* Post Title */}
          {title && (
            <h1 
              className="insight-post-title font-bold text-black mb-8"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="relative w-full h-[400px] md:h-[500px] mb-10 overflow-hidden">
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
              className="insight-content prose prose-lg max-w-none prose-headings:font-[Merriweather] prose-headings:text-black prose-p:text-black/80 prose-a:text-[#2D5BFF] prose-img:rounded-lg"
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
                    className="px-3 py-1 bg-[#DBE2E9] text-[#2D5BFF] text-xs"
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
  );
}
