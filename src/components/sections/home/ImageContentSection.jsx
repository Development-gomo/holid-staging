"use client";

import Image from "next/image";

export default function ImageContentSection({ data, index }) {
  if (!data) return null;

  const {
    foreground_image,
    background_image,
    image_position,
    content_section_title,
    short_description,
    icon_with_text,
  } = data || {};

  const fg = foreground_image?.source_url || foreground_image || "";
  const bg = background_image?.source_url || background_image || "";

  const isImageOnRight = image_position === 'right';

  return (
    <section className="w-full py-12">
      <div className="web-width px-6 relative">
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed border-[#DBE2E9]" />
        <div className="w-full grid grid-cols-1 gap-8 md:items-start md:grid-cols-[minmax(0,1fr)_64px_32px_64px_minmax(0,1fr)]">

          {/* Image Column */}
          <div className={`w-full ${isImageOnRight ? 'order-2 md:order-none md:col-start-5 md:row-start-1' : 'order-1 md:order-none md:col-start-1 md:row-start-1'}`}>
            <div className="relative">
              {bg && (
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}

              {fg && (
                <div
                  className="relative z-10"
                  style={{ padding: "105px 56px" }}
                >
                  <Image
                    src={fg}
                    alt={content_section_title || ''}
                    width={800}
                    height={600}
                    className="w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Step Counter */}
          <div className="hidden md:flex md:col-start-3 md:row-start-1 md:self-center justify-center items-center relative z-10">
            {typeof index === 'number' && index > 0 ? (
              <div
                style={{
                  borderRadius: "16px",
                  border: "1px solid #FFF",
                  background: "#FFF",
                  boxShadow: "0 3px 6px 0 #DBE2E9",
                  display: "flex",
                  width: "32px",
                  height: "32px",
                  padding: "4px 1px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span className="text-xs text-[#6B7280]">{index}</span>
              </div>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>

          {/* Content Column */}
          <div className={`w-full flex flex-col justify-start ${isImageOnRight ? 'order-1 md:order-none md:col-start-1 md:row-start-1' : 'order-2 md:order-none md:col-start-5 md:row-start-1'}`}>
            {content_section_title && (
              <h3 className="mt-0 text-2xl md:text-3xl font-semibold mb-4">{content_section_title}</h3>
            )}

            {short_description && (
              <div
                className="text-zinc-600 mb-6"
                dangerouslySetInnerHTML={{ __html: short_description }}
              />
            )}

            {icon_with_text && icon_with_text.length > 0 && (
              <ul className="space-y-4">
                {icon_with_text.map((item, idx) => {
                  const iconUrl = item?.feature_icon?.source_url || item?.feature_icon || '';
                  const text = item?.feature_text || '';

                  return (
                    <li key={idx} className="flex items-start gap-4">
                      {iconUrl ? (
                        <Image src={iconUrl} alt={text} width={36} height={36} className="w-9 h-9 object-contain flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 bg-gray-200 rounded flex-shrink-0" />
                      )}
                      <p className="text-base text-zinc-600">{text}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
