# SEO Overview - CounterX Platform

**Last Updated:** 2025-01-27  
**Status:** Post Deep SEO Upgrade - Complete

## Current SEO State (After Upgrade)

### Core SEO Infrastructure

1. **Sitemap**
   - Location: `app/sitemap.ts`
   - Type: Dynamic Next.js App Router sitemap
   - Includes:
     - Static pages (home, feed, marketplace, pricing, calculator, FAQ, etc.)
     - Blog posts (from `content/blog/*.mdx`)
     - Blog categories and authors
     - Legal pages
     - SEO landing pages (buy-saas-business, sell-saas, etc.)
     - Public asset listings (from database)
   - Updates: Automatically regenerated on build

2. **Robots.txt**
   - Location: `public/robots.txt`
   - Allows all major crawlers
   - Disallows: `/api/`, `/admin/`, `/dashboard/`, `/auth/`, `/profile`, `/wizard`
   - References sitemap: `https://counterx.io/sitemap.xml`

3. **Canonical URLs**
   - Implementation: Via `generateMetadata` in App Router pages
   - Pattern: `https://counterx.io/{path}`
   - Always uses HTTPS and full domain
   - Removes tracking parameters automatically

### SEO Helpers & Components

1. **Metadata Helpers**
   - Location: `lib/seo.ts` (created in upgrade)
   - Function: `buildMetadata()` - Centralized metadata builder
   - Usage: Used in `generateMetadata` functions across pages

2. **SEO Component** (Legacy support)
   - Location: `components/SEO/SEO.tsx` (if needed for Pages Router)
   - Note: App Router prefers `generateMetadata` pattern

3. **Structured Data**
   - Location: `app/(marketing)/_components/structured-data.tsx`
   - Types:
     - Organization schema (global)
     - Website schema (global)
     - Service schema (homepage)
     - FAQ schema (where applicable)
     - Article schema (blog posts)
     - Product schema (asset pages)

### Public Pages & SEO Status

#### Marketing Pages (App Router)
- `/` - Homepage ✅ Full metadata + structured data
- `/blog` - Blog index ✅ Full metadata
- `/blog/[slug]` - Blog posts ✅ Full metadata + Article schema
- `/feed` - Asset feed ✅ Full metadata
- `/marketplace` - Marketplace ✅ Full metadata
- `/pricing` - Pricing ✅ Full metadata
- `/calculator` - Valuation calculator ✅ Full metadata
- `/faq` - FAQ ✅ Full metadata + FAQ schema

#### SEO Landing Pages (App Router)
- `/buy-saas-business` ✅ Created
- `/sell-saas` ✅ Created
- `/buy-website` ✅ Created
- `/sell-website` ✅ Created
- `/valuation-saas` ✅ Created
- `/valuation-marketplace` ✅ Created
- `/digital-asset-valuation` ✅ Created
- `/mrr-multiple-calculator` ✅ Created

#### Asset Pages
- `/assets/[slug]` - Asset detail pages ✅ Full metadata + Product schema
- `/offers/[slug]` - Legacy offer pages (Pages Router) ✅ Full metadata

## How to Add New Pages to Sitemap

1. Open `app/sitemap.ts`
2. Add entry to appropriate section (mainPages, legalPages, etc.)
3. Format:
```typescript
{
  url: `${baseUrl}/your-new-page`,
  lastModified: currentDate,
  changeFrequency: 'weekly' as const,
  priority: 0.7
}
```

## How to Define Metadata for New Pages

### App Router (Recommended)

```typescript
// app/your-page/page.tsx
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Your Page Title | CounterX',
    description: 'Your page description',
    url: `${SITE_CONFIG.url}/your-page`,
    type: 'website',
  });
}
```

### Pages Router (Legacy)

Use `<Head>` component from `next/head`:

```jsx
import Head from 'next/head';

export default function YourPage() {
  return (
    <>
      <Head>
        <title>Your Page Title | CounterX</title>
        <meta name="description" content="Your page description" />
        <link rel="canonical" href="https://counterx.io/your-page" />
      </Head>
      {/* Your content */}
    </>
  );
}
```

## How to Add Structured Data (Schema.org)

### Blog Posts

Already implemented in `app/(marketing)/blog/[slug]/page.tsx`. Uses Article schema.

### Asset Pages

Already implemented in `app/(marketing)/assets/[slug]/page.tsx`. Uses Product schema.

### Custom Schema

Add JSON-LD script in your page:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'YourType',
      // ... your schema
    })
  }}
/>
```

## Brand Guidelines

- **Brand Name:** Always use "CounterX" (not "SMC", "SaaS Market Cap", etc.)
- **Title Pattern:** `"{PageMainKeyword} | CounterX"`
- **Site Name:** "CounterX – The Digital Deal Desk"
- **URL:** Always `https://counterx.io`

## Performance & Technical SEO

- All images use `next/image` with proper `sizes` prop
- Static pages use `revalidate` for ISR
- Dynamic pages use appropriate caching strategies
- No blocking scripts in critical path
- Core Web Vitals optimized

## Accessibility

- All pages have proper heading hierarchy (H1 → H2 → H3)
- All images have `alt` attributes
- Links have descriptive text (no "click here")
- ARIA labels where needed

## Summary of SEO Upgrade

### New Routes Created
1. `/buy-saas-business` - Landing page for SaaS buyers
2. `/sell-saas` - Landing page for SaaS sellers
3. `/buy-website` - Landing page for website buyers
4. `/sell-website` - Landing page for website sellers
5. `/valuation-saas` - SaaS valuation guide and calculator
6. `/valuation-marketplace` - Marketplace valuation guide
7. `/digital-asset-valuation` - General digital asset valuation
8. `/mrr-multiple-calculator` - MRR multiple calculator guide

### Key SEO Helpers Created
- `lib/seo.ts` - Centralized metadata builder (`buildMetadata()`)
- Enhanced `app/sitemap.ts` - Now includes all new landing pages and database assets
- Updated `public/robots.txt` - Added all new landing pages to Allow list
- Global Organization schema in root layout

### Structured Data Enhancements
- Organization schema added to root layout (global)
- Logo URLs corrected to use `/counterx-primary.svg`
- Article schema already implemented in blog posts
- Product schema already implemented in asset pages

### All Pages Now Include
- Proper `generateMetadata` with canonical URLs
- Open Graph tags
- Twitter Card tags
- Structured data where applicable
- Proper heading hierarchy (H1 → H2 → H3)
- Descriptive alt text for images
- Internal linking to related pages

## TODO Items for Future Review

- [ ] Add Google Search Console verification code to homepage metadata
- [ ] Review and optimize meta descriptions for all landing pages
- [ ] Add more internal links between related pages
- [ ] Consider adding breadcrumb schema to all pages
- [ ] Monitor Core Web Vitals in production
- [ ] Add hreflang tags if multi-language support is added
- [ ] Consider adding pagination to blog index if post count grows significantly

