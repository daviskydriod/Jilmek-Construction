import { useEffect } from "react";
import { SITE, PHONES } from "./site";

/**
 * Per-page SEO for a client-side SPA (C5).
 *
 * This sets real <title>/<meta>/<link rel=canonical> tags on navigation, which
 * fixes the "one static title for the whole site" problem. Google renders JS
 * and will pick these up.
 *
 * LIMITATION worth knowing: social scrapers (WhatsApp, Facebook, X) mostly do
 * NOT run JavaScript, so link previews will use whatever is in index.html.
 * If per-page link previews matter later, the options are prerendering
 * (vite-plugin-ssg / react-snap) or moving to SSR.
 */
type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Extra JSON-LD to inject for this page (e.g. BreadcrumbList). */
  jsonLd?: Record<string, unknown>;
};

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo({ title, description, path, image, jsonLd }: SeoInput) {
  // jsonLd is usually built inline at the call site, so a new object identity
  // arrives on every render. Serialise it so the effect only re-runs on real
  // content changes rather than on every single render.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const fullTitle = title.includes(SITE.shortName) ? title : `${title} | ${SITE.name}`;
    const url = `${SITE.url}${path}`;
    const ogImage = `${SITE.url}${image ?? "/images/projects/red-roof-colonnade-residence.jpeg"}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    if (!jsonLdKey) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.page = "true";
    script.textContent = jsonLdKey;
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [title, description, path, image, jsonLdKey]);
}

/** LocalBusiness structured data — injected once at app start. */
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: SITE.name,
  description:
    "Roofing sheet supply and installation, building and construction, POP and finishing works, and real estate services.",
  url: SITE.url,
  telephone: PHONES.map((p) => `+233${p.replace(/^0/, "")}`),
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: "GH",
  },
  areaServed: {
    "@type": "Country",
    name: "Ghana",
  },
  makesOffer: [
    "Roofing sheet supply",
    "Roofing installation",
    "Building and construction",
    "POP ceiling works",
    "Tiling works",
    "Tinted glass works",
    "Trusses and woodworks",
    "Land and property services",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export function injectLocalBusinessSchema() {
  if (document.head.querySelector('script[data-jilmek-schema="localbusiness"]')) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.jilmekSchema = "localbusiness";
  script.textContent = JSON.stringify(localBusinessJsonLd);
  document.head.appendChild(script);
}
