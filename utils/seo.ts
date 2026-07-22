// Shared SEO helpers — set meta tags, canonical, OG, Twitter, JSON-LD

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://trailer-strore-client-3.vercel.app";
const SITE_NAME = "ПричепМаркет";
const DEFAULT_OG_IMAGE = "/og-image.png";

export interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

/**
 * Apply SEO meta tags to the current page.
 * Sets: title, description, canonical, OG (title/description/image/url/type/locale), Twitter cards, robots.
 */
export function setMeta({ title, description, canonical, ogImage, noindex }: SeoMeta): void {
  // Title
  document.title = title;

  // Description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement("meta");
    descTag.setAttribute("name", "description");
    document.head.appendChild(descTag);
  }
  descTag.setAttribute("content", description);

  // Canonical
  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }

  // Open Graph
  setOg("og:title", title);
  setOg("og:description", description);
  setOg("og:url", canonical || SITE_URL);
  if (ogImage) setOg("og:image", ogImage);
  setOg("og:site_name", SITE_NAME);
  setOg("og:locale", "uk_UA");

  // Twitter
  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", title);
  setMetaTag("twitter:description", description);
  if (ogImage) setMetaTag("twitter:image", ogImage);

  // Robots
  if (noindex) {
    setMetaTag("robots", "noindex, nofollow");
  } else {
    // Remove noindex if it was set by a previous page
    const robotsTag = document.querySelector('meta[name="robots"]');
    if (robotsTag?.content.includes("noindex")) {
      robotsTag.remove();
    }
  }
}

function setOg(property: string, content: string): void {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setMetaTag(nameOrProperty: string, content: string, isProperty = false): void {
  const attr = isProperty ? "property" : "name";
  let tag = document.querySelector(`meta[${attr}="${nameOrProperty}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, nameOrProperty);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Remove a script tag by id (used to avoid duplicate JSON-LD on re-renders).
 */
export function setJsonLd(data: Record<string, unknown>, id: string): void {
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function removeJsonLd(id: string): void {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
}

/**
 * Build Product JSON-LD schema.
 */
export function productSchema(product: {
  name: string;
  image: string;
  description: string;
  brand: string;
  sku?: string;
  price: number;
  currency: string;
  inStock: boolean;
  slug: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.sku || product.slug,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };
}

/**
 * Build BreadcrumbList JSON-LD.
 */
export function breadcrumbSchema(items: { name: string; item?: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.item || undefined,
    })),
  };
}

/**
 * Organization JSON-LD (site-wide, inject once).
 */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon_transparent.ico`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+380679372731",
      contactType: "customer service",
      areaServed: "UA",
      availableLanguage: "Ukrainian",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ворзель",
      addressRegion: "Київська область",
      streetAddress: "вул. Яблунська, 11",
      addressCountry: "UA",
    },
    sameAs: [],
  };
}

/**
 * WebSite schema with SearchAction.
 */
export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE };
