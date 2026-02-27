// src/components/major/Footer.jsx

import Image from "next/image";
import { getFooterWidgets, getFooterOptions } from "@/lib/api/wp";

export default async function Footer() {
  const [widgets, options] = await Promise.all([
    getFooterWidgets(),
    getFooterOptions(),
  ]);

  const {
    footer_logo,
    social_media = [],
    footer_copyright_text,
    footer_copyright_links,
  } = options || {};

  return (
    <footer className="bg-[#0B1220] text-white">
      <div className="web-width px-6 py-12">
        {/* ================= MAIN FOOTER ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* COLUMN 1: LOGO */}
          <div>
            {footer_logo?.url && (
              <div className="max-w-[180px] h-[50px] relative">
                <Image
                  src={footer_logo.url}
                  alt="Footer Logo"
                  fill
                  sizes="(max-width: 768px) 180px, 180px"
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>

          {/* COLUMN 2: CONTACT DETAILS */}
          <div
            dangerouslySetInnerHTML={{
              __html: widgets?.["contact-details"] || "",
            }}
          />

          {/* COLUMN 3: SERVICES */}
          <div
            dangerouslySetInnerHTML={{
              __html: widgets?.["services"] || "",
            }}
          />

          {/* COLUMN 4: QUICK LINKS */}
          <div
            dangerouslySetInnerHTML={{
              __html: widgets?.["quick-links"] || "",
            }}
          />

          {/* COLUMN 5: SOCIAL ICONS */}
          <div className="flex gap-4 items-center justify-start md:items-start md:justify-start">
            {social_media.map((item, i) => (
              <a
                key={i}
                href={item.social_media_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                {item.social_media_icon?.url && (
                  <Image
                    src={item.social_media_icon.url}
                    alt="Social icon"
                    width={24}
                    height={24}
                    className="hover:opacity-70 transition"
                  />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="border-t border-white/20 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/70">
          <div
            dangerouslySetInnerHTML={{
              __html: footer_copyright_text || "",
            }}
          />
          <div
            className="md:text-right"
            dangerouslySetInnerHTML={{
              __html: footer_copyright_links || "",
            }}
          />
        </div>
      </div>
    </footer>
  );
}
