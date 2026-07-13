import type { Metadata } from "next";
import type { Article, Author, Category } from "./types";

export const SITE_URL = "https://destinyra.vercel.app";
export const SITE_NAME = "Destinyra";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build Next.js Metadata for an article page. */
export function articleMetadata(
  article: Article,
  author?: Author
): Metadata {
  const title = article.seoTitle ?? article.title;
  const description = article.seoDescription ?? article.excerpt;
  const url = absoluteUrl(`/articles/${article.slug}`);
  const ogImage = absoluteUrl("/image/og-banner.png");

  return {
    title,
    description,
    keywords: article.tags,
    authors: author ? [{ name: author.name }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      publishedTime: article.publishedAt,
      authors: author ? [author.name] : undefined,
      tags: article.tags,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** JSON-LD Article schema. */
export function articleJsonLd(
  article: Article,
  author?: Author,
  category?: Category
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription ?? article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: author
      ? { "@type": "Person", name: author.name }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/image/og-banner.png"),
      },
    },
    image: absoluteUrl("/image/og-banner.png"),
    articleSection: category?.name,
    keywords: article.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/articles/${article.slug}`),
    },
  };
}

/** JSON-LD BreadcrumbList schema. */
export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
