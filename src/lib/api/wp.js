// src/lib/api/wp.js

import { WP_BASE } from "../../config";

/* ======================================================
   PAGES
====================================================== */

// Fetch page data by slug
export const fetchPageData = async (slug) => {
  try {
    const response = await fetch(
      `${WP_BASE}/pages?slug=${encodeURIComponent(slug)}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching page data:", error);
    throw error;
  }
};

/* ======================================================
   MEDIA
====================================================== */

// Fetch media (image) by ID
export const fetchMediaById = async (id) => {
  try {
    if (!id) return null;

    const response = await fetch(`${WP_BASE}/media/${id}`);

    if (!response.ok) {
      console.warn(`Media not found for ID: ${id}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching media:", error);
    return null;
  }
};

/* ======================================================
   SERVICES / CASE STUDIES / Testimonial
====================================================== */

export async function fetchServiceBySlug(slug) {
  const res = await fetch(
    `${WP_BASE}/services?slug=${encodeURIComponent(slug)}&_embed=1`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;

  const data = await res.json();
  return data?.[0] || null;
}

export async function fetchCaseStudyBySlug(slug) {
  const res = await fetch(
    `${WP_BASE}/case_study?slug=${encodeURIComponent(slug)}`
  );
  const data = await res.json();
  return data?.[0] || null;
}

export async function fetchTestimonialBySlug(slug) {
  const res = await fetch(
    `${WP_BASE}/testimonial?slug=${encodeURIComponent(slug)}`
  );
  const data = await res.json();
  return data?.[0] || null;
}

/* ======================================================
   FOOTER: WIDGETS (Custom REST API)
====================================================== */

export const getFooterWidgets = async () => {
  try {
    const base = WP_BASE.replace("/wp/v2", "");
    const res = await fetch(`${base}/hoild/v1/footer-widgets`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Footer widgets endpoint not available");
      return {};
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching footer widgets:", error);
    return {};
  }
};

/* ======================================================
   FOOTER: ACF OPTIONS
====================================================== */
export const getFooterOptions = async () => {
  try {
    const base = WP_BASE.replace("/wp/v2", "");
    const res = await fetch(`${base}/hoild/v1/footer-options`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Footer options endpoint not available");
      return {};
    }

    return await res.json();
  } catch (error) {
    console.error("Footer options fetch error:", error);
    return {};
  }
};
