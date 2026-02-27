'use client';

import Image from "next/image";

export default function HomeUsp({ data }) {
  if (!data) return null;

  const uspVideo = data?.usp_main_image || '';
  const usps = data?.usps || [];

  return (
    <section id="main-usp" className="w-full pt-0 pb-12 bg-drk">
      {/* Content container */}
      <div className="web-width px-6 pb-10 flex flex-col items-center">
        {/* Main USP Video */}
        {uspVideo && (
          <div
            className="mx-auto p-[13px] "
            style={{
              background: "#1B2444",
              boxShadow: "0 0 0 1.5px rgba(255,255,255,0.08), 0 32px 80px 0 rgba(0,0,0,0.55)",
            }}
          >
            <div className="w-[974.651px] h-[482.403px] overflow-hidden ">
              <video
                src={uspVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        )}

        {/* USP Repeater (Three USPs in a Row) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[145px] mt-20">
          {usps.map((usp, index) => {
            const uspIconUrl = usp?.usp_icon || '';
            const usp_title = usp?.usp_title || '';
            const usp_subtext = usp?.usp_subtext || '';

            return (
              <div key={index} className="flex flex-col">
                {/* Icon and Title in one line */}
                <div className="flex items-center gap-4 mb-4">
                  {/* USP Icon */}
                  {uspIconUrl ? (
                    <Image
                      src={uspIconUrl}
                      alt={usp_title || 'USP Icon'}
                      width={28}
                      height={28}
                      className="flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span>No Icon</span>
                    </div>
                  )}

                  {/* USP Title */}
                  {usp_title && (
                    <p className="text-white fs24 fw500">{usp_title}</p>
                  )}
                </div>

                {/* USP Subtext */}
                {usp_subtext && (
                  <p className="text-white">{usp_subtext}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
