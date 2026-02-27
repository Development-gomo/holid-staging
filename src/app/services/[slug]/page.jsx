// src/app/services/[slug]/page.jsx

import { notFound } from "next/navigation";
import InnerPageBuilder from "@/components/InnerPageBuilder";
import { fetchMediaById } from "@/lib/api/wp";
import { buildMetadataFromYoast } from "@/lib/seo";
import { WP_BASE } from "@/config";

// Fetch service by slug (adjust endpoint if your CPT REST base differs)
async function fetchServiceBySlug(slug) {
  // Your CPT base is most likely "services" (plural). Keep only what you actually use.
  const bases = ["services"];

  for (const base of bases) {
    const baseUrl = WP_BASE.replace(/\/$/, "");
    const url = `${baseUrl}/${base}?slug=${encodeURIComponent(slug)}&_embed`;

    try {
      const res = await fetch(url, { next: { revalidate: 60 } });

      if (!res.ok) continue;

      const data = await res.json();

      // WP usually returns an array for ?slug=
      if (Array.isArray(data) && data.length) return data[0];

      // If some endpoint returns a single object
      if (data && typeof data === "object" && data.id) return data;
    } catch (e) {
      continue;
    }
  }

  return null;
}

/**
 * Recursive function to resolve only known media ID fields to URLs
 * (Same as your Home page approach)
 */
async function resolveMediaIds(data) {
  if (typeof data !== "object" || data === null) return data;

  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => resolveMediaIds(item)));
  }

  const resolved = { ...data };

  const mediaFields = [
    "usp_icon",
    "usp_main_image",
    "bg_image",
    "background_image",
    "foreground_image",
    "image",
    "icon",
    "thumbnail",
    "avatar",
    "logo",
    "client_logo",
    "feature_icon",
    "featured_image",
    "brand_logo",
    "service_icon",
    // add your service builder fields too (safe even if not present)
    "hero_image"
  ];

  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "number" && mediaFields.includes(key)) {
      const media = await fetchMediaById(value);
      resolved[key] = media?.source_url || "";
    } else if (typeof value === "object" && value !== null) {
      resolved[key] = await resolveMediaIds(value);
    }
  }

  return resolved;
}

export default async function ServiceSinglePage(props) {
  // ✅ Fix for: params is a Promise
  const params = await props.params;
  const slug = params?.slug;

  if (!slug) notFound();

  const service = await fetchServiceBySlug(slug);
  if (!service) notFound();

  const acf = service?.acf || {};
  const builder = acf?.inner_page_builder || [];

  // Resolve media IDs to URLs (same as home)
  const resolvedBuilder = await Promise.all(
    (builder || []).map((section) => resolveMediaIds(section))
  );

  return (
    <main className="min-h-screen">
      <InnerPageBuilder sections={resolvedBuilder} />
    </main>
  );
}

/**
 * ✅ SEO for Service page (Yoast → Next.js)
 * Uses the same helper you use on home.
 */
export async function generateMetadata(props) {
  const params = await props.params; // ✅ unwrap
  const slug = params?.slug;

  if (!slug) return {};

  const service = await fetchServiceBySlug(slug);
  if (!service) return {};

  return buildMetadataFromYoast(service);
}