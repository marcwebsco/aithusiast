import { useEffect } from "react";
import { SITE } from "@/lib/api";

/**
 * Lightweight SEO hook — manages document head tags (title, description, OG, canonical).
 * Use on each page. Falls back to defaults from /public/index.html if not called.
 */
export function useSEO({
  title,
  description,
  canonical,
  image,
  type = "website",
  noindex = false,
  jsonLd,
} = {}) {
  useEffect(() => {
    if (title) {
      document.title = title.includes(SITE.name) ? title : `${title} — ${SITE.name}`;
    }

    const setMeta = (selector, attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    if (image) {
      setMeta('meta[property="og:image"]', "property", "og:image", image);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

    // Canonical
    const canon = canonical || window.location.origin + window.location.pathname;
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.setAttribute("rel", "canonical");
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute("href", canon);
    setMeta('meta[property="og:url"]', "property", "og:url", canon);

    // Optional JSON-LD
    let scriptEl = document.getElementById("page-jsonld");
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.type = "application/ld+json";
        scriptEl.id = "page-jsonld";
        document.head.appendChild(scriptEl);
      }
      scriptEl.text = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, canonical, image, type, noindex, JSON.stringify(jsonLd || {})]); // eslint-disable-line react-hooks/exhaustive-deps
}
