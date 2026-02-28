// app/insights/[slug]/page.jsx

import { notFound } from "next/navigation";
import BlogPostContent from "@/components/sections/insights/InsightContent";
import RelatedInsightsSection from "@/components/sections/insights/RelatedInsightsSection";
import { fetchMediaById } from "@/lib/api/wp";
import { buildMetadataFromYoast } from "@/lib/seo";
import { WP_BASE } from "@/config";

async function fetchPostBySlug(slug) {
  const baseUrl = WP_BASE.replace(/\/$/, "");
  const url = `${baseUrl}/posts?slug=${encodeURIComponent(slug)}&_embed`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data) && data.length) return data[0];
    return null;
  } catch {
    return null;
  }
}

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
    "hero_image",
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

export default async function BlogSinglePage(props) {
  const params = await props.params; // ✅ FIX
  const slug = params?.slug;

  if (!slug) notFound();

  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen">
      <BlogPostContent post={post} />

      <RelatedInsightsSection
        currentPostId={post?.id}
        categoryIds={post?.categories || []}
        postsPath="/insights"
        card_variant="alt"
        heading="Related insights"
      />
    </main>
  );
}

export async function generateMetadata(props) {
  const params = await props.params; // ✅ FIX
  const slug = params?.slug;

  if (!slug) return {};

  const post = await fetchPostBySlug(slug);
  if (!post) return {};

  return buildMetadataFromYoast(post);
}