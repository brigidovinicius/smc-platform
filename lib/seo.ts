/**
 * SEO Helper Functions
 * 
 * Centralized utilities for building metadata and SEO configurations
 * across the CounterX platform.
 */

import type { Metadata } from 'next';
import { SITE_CONFIG } from './config/site-config';

export interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

/**
 * Build comprehensive metadata for a page
 * 
 * @param props - SEO configuration options
 * @returns Next.js Metadata object
 */
export function buildMetadata(props: SEOProps): Metadata {
  const {
    title,
    description,
    url,
    image,
    type = 'website',
    noIndex = false,
    keywords,
    publishedTime,
    modifiedTime,
    authors,
    tags
  } = props;

  const fullTitle = title.includes('CounterX') ? title : `${title} | CounterX`;
  const canonicalUrl = url || SITE_CONFIG.url;
  const ogImage = image || `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_CONFIG.url),
    keywords: keywords || [...SITE_CONFIG.keywords],
    authors: authors?.map((name) => ({ name })) || [{ name: 'CounterX' }],
    creator: 'CounterX',
    publisher: 'CounterX',
    alternates: {
      canonical: canonicalUrl
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    openGraph: {
      type: type === 'article' ? 'article' : type === 'product' ? 'website' : 'website',
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${fullTitle} - ${SITE_CONFIG.name}`
        }
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && authors.length > 0 && { authors })
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: SITE_CONFIG.twitter.handle
    }
  };

  // Add article-specific metadata
  if (type === 'article' && tags && metadata.openGraph) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      tags
    };
  }

  return metadata;
}

/**
 * Generate canonical URL
 * 
 * @param path - Path relative to site root (e.g., '/blog/my-post')
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Generate meta description from content
 * Truncates to ~160 characters without cutting words
 * 
 * @param content - Full content text
 * @param maxLength - Maximum length (default: 160)
 * @returns Truncated description
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  if (content.length <= maxLength) {
    return content;
  }

  // Find the last space before maxLength
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

