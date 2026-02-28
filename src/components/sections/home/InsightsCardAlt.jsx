"use client";

import Link from "next/link";

function decodeHtmlEntities(str = "") {
  // Safest in browser/client components
  if (typeof window === "undefined") return str;
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

export default function InsightsCardAlt({ post }) {
  const { id, title, category, date, excerpt, href, image } = post || {};

  // Show image ONLY if present (supports string URL or { url, alt })
  const imageUrl = typeof image === "string" ? image : image?.url;
  const imageAlt =
    (typeof image === "object" && image?.alt) || title || "Insight image";

  return (
    <article
      key={id}
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "rgba(219, 226, 233, 0.35)",
        padding: 16,
      }}
    >
      {/* Image (only if present) */}
      {imageUrl ? (
        <div className="mb-4 overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-auto block object-cover"
          />
        </div>
      ) : null}

      {/* Category */}
      {category ? (
        <span
          className="w-fit"
          style={{
            display: "inline-flex",
            height: 24,
            padding: "10px 12px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#DBE2E9",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#2D5BFF",
              fontWeight: 400,
              lineHeight: "12px",
              fontFamily:
                "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
            }}
          >
            {category}
          </span>
        </span>
      ) : null}

      {/* Title */}
      {title ? (
        <h3
          className="mt-3 line-clamp-2"
          style={{
            color: "#1F1C1C",
            fontFamily:
              "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
            fontSize: 18,
            fontStyle: "normal",
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
      ) : null}

      {/* Excerpt (optional) */}
      {excerpt ? (
        <p
          className="mt-3 line-clamp-2"
          style={{
            fontSize: 14,
            lineHeight: "22px",
            fontWeight: 400,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            fontFamily:
              "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          }}
        >
          {excerpt}
        </p>
      ) : null}

      {/* Date */}
      {date ? (
        <p
          className="mt-5"
          style={{
            color: "#90979F",
            fontFamily:
              "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
            fontSize: 12,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "24px",
          }}
        >
          {date}
        </p>
      ) : null}

      {/* CTA */}
      <div className="mt-8">
        <Link
          href={href || "#"}
          className="inline-flex items-center btn-blue gap-2 bg-[#2D5BFF] text-white text-xs md:text-sm px-5 py-3"
          aria-label={`Read article: ${title || "article"}`}
        >
          Read article
        </Link>
      </div>
    </article>
  );
}