// src/lib/seo.js

export function buildMetadataFromYoast(page) {
  const yoast = page?.yoast_head_json;

  if (!yoast) {
    return {
      title: page?.title?.rendered || "Website",
      description: "",
    };
  }

  return {
    title: yoast.title || page?.title?.rendered,
    description: yoast.description || "",
    robots: yoast.robots || undefined,

    openGraph: {
      title: yoast.og_title,
      description: yoast.og_description,
      url: yoast.og_url,
      siteName: yoast.og_site_name,
      images: yoast.og_image?.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      })),
      type: yoast.og_type,
    },

    twitter: {
      card: yoast.twitter_card,
      title: yoast.twitter_title,
      description: yoast.twitter_description,
      images: yoast.twitter_image ? [yoast.twitter_image] : [],
    },
  };
}
