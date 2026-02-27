"use client";

import Image from "next/image";

// Helper function to get image URL
function getImageUrl(field) {
  if (!field) return null;
  if (typeof field === "string") return field || null;
  if (typeof field === "object") {
    return field?.url || field?.source_url || field?.src || null;
  }
  return null;
}

export default function TwoColStructure({ data }) {
  if (!data) return null;

  // ACF repeater for this layout is `column_details` (fallbacks included)
  const items = data?.column_details || data?.two_col_structure || data?.items || [];

  // Fetch background type (light or dark)
  const backgroundType = data?.background_type || "light"; // Default to "light" if not provided

  // Set the background and text color classes based on the background_type
  const sectionBgClass = backgroundType === "dark" ? "bg-[#000821] text-white" : "bg-white text-[#1F1C1C]";

  return (
    <section className={`w-full py-12 ${sectionBgClass}`}>
      <div className="web-width px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[35px]">
          {items.map((item, idx) => {
            const rawImg = item?.image || null;
            const img = getImageUrl(rawImg);
            const title = item?.title || "";
            const desc = item?.description || "";

            // For dark: border only, no shadow. For light: shadow only, no border.
            const style = backgroundType === "dark"
              ? { border: '1px solid #ffffff59', boxShadow: 'none', padding: 24 }
              : { boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)', border: 'none', padding: 24 };
            return (
              <div key={idx} className="flex flex-col" style={style}>
                {img ? (
                  <div className="w-full h-100 mb-4 overflow-hidden">
                    <Image src={img} alt={title || ""} width={800} height={400} className="object-contain w-full h-full" />
                  </div>
                ) : null}

                {title && <h3 className="fs24 fw500 text-lg font-medium mb-2 text-left">{title}</h3>}

                {desc && (
                  <div className="prose max-w-none text-left" dangerouslySetInnerHTML={{ __html: desc }} />
                )}

                {/* Example CTA usage: expects item.btn or item.cta */}
                {item?.btn?.href && (
                  <Link
                    href={item.btn.href}
                    target={item.btn.target || "_self"}
                    className={`inline-flex bg-white px-6 py-3 text-black btn-blue ${
                      backgroundType === "dark"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {item.btn.title}
                  </Link>
                )}
                {item?.cta?.url && (
                  <Link
                    href={item.cta.url}
                    target={item.cta.target || "_self"}
                    className={`inline-flex bg-white px-6 py-3 text-black btn-blue ${
                      backgroundType === "dark"
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {item.cta.title}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}