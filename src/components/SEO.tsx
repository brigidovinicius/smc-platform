/**
 * SEO Component
 * 
 * Reusable SEO component for Pages Router (legacy support)
 * For App Router, use generateMetadata with buildMetadata() from lib/seo.ts
 */

import Head from 'next/head';
import { SITE_CONFIG } from '@/lib/site-config';

export interface SEOProps {
  title: string;
  description?: string;
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

export function SEO({
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
}: SEOProps) {
  const fullTitle = title.includes('CounterX') ? title : `${title} | CounterX`;
  const canonicalUrl = url || SITE_CONFIG.url;
  const ogImage = image || `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />
      
      {/* Article-specific OG tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {authors && authors.map((author, i) => (
            <meta key={i} property="article:author" content={author} />
          ))}
          {tags && tags.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitter.handle} />
    </Head>
  );
}

