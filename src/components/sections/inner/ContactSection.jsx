"use client";

import { useEffect, useRef } from "react";

export default function ContactSection({ data }) {
  if (!data) return null;

  const { section_heading, hubspot_form_embed, google_map_iframe } = data;
  const hubRef = useRef(null);

  useEffect(() => {
    if (!hubRef.current) return;

    const container = hubRef.current;
    container.innerHTML = hubspot_form_embed || "";

    // Remove any static <form> markup that might be included in the embed
    // (Some embeds include markup + a script that re-renders the form resulting in duplicates)
    const staticForms = Array.from(container.querySelectorAll("form, .hs-form, .hbspt-form"));
    staticForms.forEach((el) => el.parentNode && el.parentNode.removeChild(el));

    const scripts = Array.from(container.querySelectorAll("script"));

    // Execute scripts in sequence. Wait for external scripts to load before continuing.
    (async () => {
      for (const old of scripts) {
        const script = document.createElement("script");
        if (old.src) {
          script.src = old.src;
          script.async = old.async;

          // Append and wait for load (resolve on error to avoid blocking)
          await new Promise((resolve) => {
            script.onload = () => resolve(true);
            script.onerror = () => resolve(true);
            container.appendChild(script);
          });
        } else {
          // Inline script: append (will run immediately)
          try {
            script.text = old.innerHTML;
            container.appendChild(script);
          } catch (e) {
            const t = document.createTextNode(old.innerHTML || "");
            script.appendChild(t);
            container.appendChild(script);
          }
        }

        // Remove the old script tag to avoid duplicate execution
        if (old.parentNode) old.parentNode.removeChild(old);
      }
    })();
  }, [hubspot_form_embed]);

  return (
    <section className="w-full py-12">
      <div className="web-width px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            {section_heading && (
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">{section_heading}</h2>
            )}

            <div ref={hubRef} />
          </div>

          <div className="w-full md:w-1/2">
            {google_map_iframe ? (
              <div
                className="w-full h-64 md:h-full"
                dangerouslySetInnerHTML={{ __html: google_map_iframe }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
 
