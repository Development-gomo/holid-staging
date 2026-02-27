// src/components/major/Footer.jsx

import Image from "next/image";
import FooterWidget from "./FooterWidget";
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
      <style>{`
        .widget-title, .footer-social-title {
          font-size: 18px;
          line-height: 24px;
          font-weight: 500;
          margin-bottom: 24px;
          color: #FFFFFF;
        }
        .widget {
          font-size: 14px !important;
          line-height: 28px !important;
          color: #FFFFFF99 !important;
        }
        .footer-copyright p{
          font-size: 12px !important;
          line-height: 24px !important;
          color: #FFFFFF99 !important;
          font-weight: 400 !important;
        }

      `}</style>
      <div className="web-width px-6 pt-20">
        {/* ================= MAIN FOOTER ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8 lg:mb-20">
          {/* COLUMN 1: LOGO */}
          <div>
            {footer_logo?.url && (
              <div className="max-w-[100px] h-[31px] relative mb-6">
                <Image
                  src={footer_logo.url}
                  alt="Footer Logo"
                  fill
                  sizes="(max-width: 768px) 100px, 100px"
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>

          {/* COLUMN 2: CONTACT DETAILS */}
          <div>
            <FooterWidget html={widgets?.["contact-details"] || ""} />
          </div>

          {/* COLUMN 3: SERVICES */}
          <div>
            <FooterWidget html={widgets?.["services"] || ""} />
          </div>

          {/* COLUMN 4: QUICK LINKS */}
          <div>
            <FooterWidget html={widgets?.["quick-links"] || ""} />
          </div>

          {/* COLUMN 5: SOCIAL ICONS */}
              <div className="footer-social flex flex-col  justify-start">
                <span className="footer-social-title">Follow us on</span>
                <div className="flex flex-row gap-4">
                  {social_media.map((item, i) => (
                    <a
                      key={i}
                      href={item.social_media_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-icon w-[30px] h-[30px] flex items-center !justify-center bg-[#DBE2E9] p-[7px]"
                    >
                      {item.social_media_icon?.url && (
                        <Image
                          src={item.social_media_icon.url}
                          alt="Social icon"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      )}
                    </a>
                  ))}
                </div>
              </div>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="border-white/20 border-none lg:border-dashed border-t-[0.5px] md:py-4 lg:py-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 lg:gap-6">
          <div
            className="footer-copyright"
            dangerouslySetInnerHTML={{
              __html: footer_copyright_text || "",
            }}
          />
          <div
            className="footer-copyright md:text-right"
            dangerouslySetInnerHTML={{
              __html: footer_copyright_links || "",
            }}
          />
        </div>
      </div>
    </footer>
  );
}
