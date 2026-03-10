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
  const backgroundType = data?.background_type || "light";
  const sectionBgClass =
    backgroundType === "dark"
      ? "bg-[#000821] text-white"
      : "bg-white text-[#1F1C1C]";

  // Get number of columns from ACF field, default to 3 if not set
  const numberOfColumns = parseInt(data?.number_of_columns, 10) || 3;

  // Build grid class dynamically
  const gridClass = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${numberOfColumns} gap-8 lg:gap-[35px]`;

  // Helper to chunk array into rows
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // Chunk USPs into rows
  const uspRows = chunkArray(usps, numberOfColumns);

  return (
    <section id="inner-usp" className={`w-full ${sectionBgClass} pt-[30px] pb-[60px] md:pt-[48px] md:pb-[120px]`}>
      <div className="web-width px-6">
        {uspRows.map((row, rowIdx) => {
          // Add margin-bottom to all rows except the last
          const isLastRow = rowIdx === uspRows.length - 1;
          const rowClass = isLastRow ? gridClass : `${gridClass} mb-[35px]`;
          return (
            <div key={rowIdx} className={rowClass}>
              {row.map((usp, index) => {
                const uspIconUrl = getImageUrl(usp?.usp_icon);
                const usp_title = (usp?.usp_title || "").trim();
                const usp_subtext = (usp?.usp_subtext || "").trim();
                const style =
                  backgroundType === "dark"
                    ? { border: "1px solid #ffffff59", boxShadow: "none", padding: 32 }
                    : { boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)", border: "none", padding: 32 };
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
                      {usp?.btn && usp.btn.href ? (
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
                      {usp?.cta && usp.cta.url ? (
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
          );
        })}
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