import PageBuilder from "@/components/PageBuilder";
import { fetchPageData, fetchMediaById } from "@/lib/api/wp";
import { buildMetadataFromYoast } from "@/lib/seo";

// Recursive function to resolve only known media ID fields to URLs
async function resolveMediaIds(data) {
  if (typeof data !== 'object' || data === null) return data;

  if (Array.isArray(data)) {
    return Promise.all(data.map(item => resolveMediaIds(item)));
  }

  const resolved = { ...data };
  
  // List of field names that contain media IDs
  const mediaFields = [
    'usp_icon',
    'usp_main_image',
    'bg_image',
    'background_image',
    'foreground_image',
    'image',
    'icon',
    'thumbnail',
    'avatar',
    'logo',
    'client_logo',
    'feature_icon',
    'featured_image',
    'brand_logo',
  ];

  for (const [key, value] of Object.entries(resolved)) {
    // Only resolve numeric values in known media field names
    if (typeof value === 'number' && mediaFields.includes(key)) {
      const media = await fetchMediaById(value);
      resolved[key] = media?.source_url || '';
    }
    // If value is an object or array, recursively resolve
    else if (typeof value === 'object' && value !== null) {
      resolved[key] = await resolveMediaIds(value);
    }
  }

  return resolved;
}

export default async function HomePage() {
  // Fetch home page data
  const data = await fetchPageData("home");

  if (!data || !data.length) {
    return null;
  }

  const acf = data[0].acf || {};
  const builder = acf.page_builder || [];

  // Resolve all numeric media IDs to URLs
  const resolvedBuilder = await Promise.all(
    builder.map(section => resolveMediaIds(section))
  );

  return (
    <main className="min-h-screen">
      <PageBuilder sections={resolvedBuilder} />
    </main>
  );
}

/**
 * ✅ SEO for Home page (Yoast → Next.js)
 */
export async function generateMetadata() {
  const data = await fetchPageData("home");
  if (!data || !data.length) return {};

  return buildMetadataFromYoast(data[0]);
}
