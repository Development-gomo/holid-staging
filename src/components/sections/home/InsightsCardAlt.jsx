'use client';

import Link from "next/link";

export default function InsightsCardAlt({ post }) {
  const {
    id,
    title,
    category,
    date,
    excerpt,
    href,
  } = post;

  return (
    <article key={id} className="p-5 flex flex-col h-full" style={{ backgroundColor: 'rgba(219, 226, 233, 0.35)' }}>
      <div className="flex items-center justify-between gap-3">
        {category ? (
          <span className="text-xs text-[#2D5BFF]">
            {category}
          </span>
        ) : <span />}

        {date ? (
          <span className="text-xs text-[#90979F]">{date}</span>
        ) : null}
      </div>

      <h3
        className="mt-8 font-medium min-h-[60px]"
        style={{
          color: '#1F1C1C',
          fontFamily: 'Inter',
          fontSize: '20px',
          fontWeight: 500,
          lineHeight: '30px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {title}
      </h3>

      {excerpt ? (
        <p
          className="mt-4 text-[#555] text-base leading-7 min-h-[112px]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt}
        </p>
      ) : null}

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
}
