'use client';

export default function SpeacialHeading({ data }) {
  if (!data) return null;

  const main_heading = data?.main_heading || '';
  const text_above_heading = data?.text_above_heading || '';
  const text_below_heading = data?.text_below_heading || '';

  return (
    <section className="w-full pt-[60px] pb-[00px] md:py-12">
      <div className="web-width px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Small label with blue square + dashed border below, sized to label width */}
          {text_above_heading && (
            <div className="inline-flex flex-col items-center mb-4">
              <div className="inline-flex items-center justify-center gap-2">
                <span className="w-[5px] h-[5px] bg-[#2A3EF4] block" aria-hidden="true" />
                <p className="sub-heading-above !text-[12px] !leading-[26px] text-[#90979F]">{text_above_heading}</p>
              </div>
              <div className="w-full border-b border-dashed border-black/20 dark:border-white/30" />
            </div>
          )}

          {/* Main heading */}
          {main_heading && (
            <h2
              className="special-heading !text-[32px] !sm:text-[32px] md:!text-[56px] font-bold font-bold"
              dangerouslySetInnerHTML={{ __html: main_heading }}
            />
          )}

          {/* Supporting text below */}
          {text_below_heading && (
            <p className="sub-heading-above mt-4">{text_below_heading}</p>
          )}

        </div>
      </div>
    </section>
  );
}
