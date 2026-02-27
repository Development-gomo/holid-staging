'use client';

export default function SpeacialHeading({ data }) {
  if (!data) return null;

  const main_heading = data?.main_heading || '';
  const text_above_heading = data?.text_above_heading || '';
  const text_below_heading = data?.text_below_heading || '';

  return (
    <section className="w-full py-12">
      <div className="web-width px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Small label with blue square to the left */}
          {text_above_heading && (
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="w-3 h-3 bg-blue-600 block rounded-sm" aria-hidden="true" />
              <p className="sub-heading-above">{text_above_heading}</p>
            </div>
          )}

          {/* Main heading */}
          {main_heading && (
            <h2
              className="special-heading"
              dangerouslySetInnerHTML={{ __html: main_heading }}
            />
          )}

          {/* Dotted / dashed divider and supporting text below */}
          <div className="mt-6 pt-6 border-t border-dashed border-black/20">
            {text_below_heading && (
              <p className="sub-heading-above">{text_below_heading}</p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
