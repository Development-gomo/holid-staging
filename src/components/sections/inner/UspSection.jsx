"use client";

import Image from "next/image";
import Link from "next/link";

// Helper to safely extract image URL (string or ACF image object)
function getImageUrl(field) {
  if (!field) return null;

  if (typeof field === "string") {
    const s = field.trim();
    return s ? s : null;
  }

  if (typeof field === "object") {
    const s = (field?.url || field?.source_url || field?.src || "").trim();
    return s ? s : null;
  }

  return null;
}

export default function UspSection({ data }) {
  if (!data) return null;

  const usps = Array.isArray(data?.usps) ? data.usps : [];

  // Fetch background type (light or dark)
  const backgroundType = data?.background_type || "light"; // Default to "light" if not provided

  // Set the background and text color classes based on the background_type
  const sectionBgClass =
    backgroundType === "dark"
      ? "bg-[#000821] text-white"
      : "bg-white text-[#1F1C1C]";

  return (
    <section id="inner-usp" className={`w-full py-12 ${sectionBgClass}`}>
      <div className="web-width px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[35px]">
          {usps.map((usp, index) => {
            const uspIconUrl = getImageUrl(usp?.usp_icon); // ✅ safe (never "")
            const usp_title = (usp?.usp_title || "").trim();
            const usp_subtext = (usp?.usp_subtext || "").trim();

            // For dark: border only, no shadow. For light: shadow only, no border.
            const style =
              backgroundType === "dark"
                ? { border: "1px solid #ffffff59", boxShadow: "none", padding: 20 }
                : { boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)", border: "none", padding: 20 };

            return (
              <div
                key={index}
                className="flex flex-col justify-between h-full usp-col-box"
                style={style}
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {uspIconUrl ? (
                      <Image
                        src={uspIconUrl}
                        alt={usp_title || "USP Icon"}
                        width={28}
                        height={28}
                        className="flex-shrink-0"
                      />
                    ) : null}

                    {usp_title ? <p className="fs24 fw500">{usp_title}</p> : null}
                  </div>

                  {usp_subtext ? <p>{usp_subtext}</p> : null}
                </div>

                <div>
                  {usp?.btn?.href ? (
                    <Link
                      href={usp.btn.href}
                      target={usp.btn.target || "_self"}
                      className={`inline-flex bg-white px-6 py-3 text-black btn-blue ${
                        backgroundType === "dark" ? "bg-white text-black" : "bg-black text-white"
                      }`}
                    >
                      {usp.btn.title}
                    </Link>
                  ) : null}

                  {usp?.cta?.url ? (
                    <Link
                      href={usp.cta.url}
                      target={usp.cta.target || "_self"}
                      className={`inline-flex bg-white px-6 py-3 text-black btn-blue ${
                        backgroundType === "dark" ? "bg-white text-black" : "bg-black text-white"
                      }`}
                    >
                      {usp.cta.title}
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .usp-col-box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          min-height: 220px;
        }
        @media (max-width: 768px) {
          .usp-col-box {
            min-height: 180px;
          }
        }
      `}</style>
    </section>
  );
}