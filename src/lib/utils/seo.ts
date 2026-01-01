import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

/**
 * Generate metadata for SEO
 */
export function generateSEOMetadata({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: SEOProps): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const metaDescription = description || siteConfig.description;
  const metaImage = ogImage || siteConfig.ogImage;
  const metaUrl = canonical || siteConfig.url;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords || siteConfig.keywords,
    authors: authors?.map((author) => ({ name: author })) || [
      { name: siteConfig.creator },
    ],
    creator: siteConfig.creator,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: siteConfig.language,
      type: type === "article" ? "article" : "website",
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors,
        section,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: "@amanmishra",
    },
    alternates: {
      canonical: metaUrl,
    },
    metadataBase: new URL(siteConfig.url),
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 */
export function generateArticleSchema(post: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.creator,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.url,
    },
  };
}

/**
 * Generate JSON-LD structured data for a person
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.creator,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/avatar.jpg`,
    sameAs: [
      "https://github.com/arien7011",
      "https://linkedin.com/in/aman-mishra-bb239b211",
    ],
    jobTitle: "Frontend Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Taazaa Tech Pvt Ltd",
    },
    description: siteConfig.description,
  };
}

/**
 * Generate JSON-LD structured data for a website
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.creator,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
