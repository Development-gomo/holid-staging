import { notFound } from "next/navigation";
import InnerPageBuilder from "@/components/InnerPageBuilder";
import BlogPostContent from "@/components/sections/insights/insightcontent";
import RelatedPostsSlider from "@/components/sections/insights/RelatedPostsSlider";
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
    if (data && typeof data === "object" && data.id) return data;
    return null;
  } catch {
    return null;
  }
}

async function fetchRelatedPosts(currentPost) {
  const postId = currentPost?.id;
  const categories = Array.isArray(currentPost?.categories) ? currentPost.categories : [];
  const baseUrl = WP_BASE.replace(/\/$/, "");

  const query = new URLSearchParams({
    per_page: "8",
    _embed: "",
    orderby: "date",
    order: "desc",
  });

  if (categories.length) {
    query.set("categories", categories.join(","));
  }

  const url = `${baseUrl}/posts?${query.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.filter((item) => item?.id !== postId).slice(0, 6);
  } catch {
    return [];
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
  const params = await props.params;
  const slug = params?.slug;

  if (!slug) notFound();

  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await fetchRelatedPosts(post);

  const acf = post?.acf || {};
  const builder = acf?.inner_page_builder || [];

  const resolvedBuilder = await Promise.all(
    (builder || []).map((section) => resolveMediaIds(section))
  );

  return (
    <main className="min-h-screen">
      <section
        className="w-full relative flex flex-col md:flex-row items-center justify-between min-h-[95vh] py-12 md:py-16"
        style={{ backgroundColor: "#000821" }}
      >
        <div className="web-width px-6 py-10 relative z-10 flex w-full flex-col md:flex-row md:gap-[10%]">
          <div className="w-full md:w-1/2 text-white">
            <h1 className="text-4xl font-bold">Hoild Blog</h1>
            <p className="mt-3 max-w-xl text-lg mb-32">
              Discover insights, tips, and stories from our team. Stay updated with the latest trends and best practices in the industry.
            </p>
          </div>
        </div>
      </section>

      <BlogPostContent post={post} />

      <RelatedPostsSlider posts={relatedPosts} postsPath="/blog" />

      {resolvedBuilder.length > 0 && (
        <InnerPageBuilder sections={resolvedBuilder} />
      )}
    </main>
  );
}

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = params?.slug;

  if (!slug) return {};

  const post = await fetchPostBySlug(slug);
  if (!post) return {};

  return buildMetadataFromYoast(post);
}
