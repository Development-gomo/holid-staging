// src/app/[slug]/page.js

import PageBuilder from "@/components/PageBuilder";
import InnerPageBuilder from "@/components/InnerPageBuilder";
import { fetchPageData, fetchMediaById } from "@/lib/api/wp";
import { buildMetadataFromYoast } from "@/lib/seo";
import { notFound } from "next/navigation";

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
    "imageicon",
    "icon",
    "thumbnail",
    "avatar",
    "logo",
    "client_logo",
    "feature_icon",
    "featured_image",
    "brand_logo",
    "service_icon",
    "hero_image",
  ];

  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "number" && mediaFields.includes(key)) {
      const media = await fetchMediaById(value);
      // store the full media object when possible so components can
      // pick `url` or `source_url` as needed
      resolved[key] = media || null;
    } else if (typeof value === "object" && value !== null) {
      resolved[key] = await resolveMediaIds(value);
    }
  }

  return resolved;
}

export default async function DynamicPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) notFound();

  const data = await fetchPageData(slug);
  if (!data || !data.length) notFound();

  const acf = data[0].acf || {};

  // Support both builders
  const builder = acf.page_builder || acf.inner_page_builder || [];

  const resolvedBuilder = await Promise.all((builder || []).map((section) => resolveMediaIds(section)));

  const isInner = Boolean(acf.inner_page_builder);

  return (
    <main className="min-h-screen">
      {isInner ? <InnerPageBuilder sections={resolvedBuilder} /> : <PageBuilder sections={resolvedBuilder} />}
    </main>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug) return {};

  const data = await fetchPageData(slug);
  if (!data || !data.length) return {};

  return buildMetadataFromYoast(data[0]);
}
