import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories, getAllAuthors } from '@/lib/blog';
import { SITE_URL } from '@/lib/site-config';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;
    const currentDate = new Date();

    // Static pages - Main pages
    const mainPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0
        },
        {
            url: `${baseUrl}/feed`,
            lastModified: currentDate,
            changeFrequency: 'hourly',
            priority: 0.9
        },
        {
            url: `${baseUrl}/marketplace`,
            lastModified: currentDate,
            changeFrequency: 'hourly',
            priority: 0.9
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${baseUrl}/calculator`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: `${baseUrl}/recursos`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: `${baseUrl}/resources`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: `${baseUrl}/suporte`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.6
        },
        {
            url: `${baseUrl}/support`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.6
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8
        },
        {
            url: `${baseUrl}/blog/categories`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.6
        },
        {
            url: `${baseUrl}/blog/authors`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.6
        }
    ];

    // Legal pages
    const legalPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/legal`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5
        },
        {
            url: `${baseUrl}/legal/terms`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.4
        },
        {
            url: `${baseUrl}/legal/termos-de-uso`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.4
        },
        {
            url: `${baseUrl}/legal/privacy`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.4
        },
        {
            url: `${baseUrl}/legal/privacidade`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.4
        },
        {
            url: `${baseUrl}/legal/cookies`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.4
        }
    ];

    // Auth pages (low priority, optional indexing)
    const authPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/auth/login`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.3
        },
        {
            url: `${baseUrl}/auth/register`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.3
        },
        {
            url: `${baseUrl}/auth/forgot-password`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.3
        }
    ];

    // Public pages that may require auth but are indexable
    const publicPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/vender-ativo`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7
        }
    ];

    // SEO Landing Pages (high-intent pages)
    const seoLandingPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/buy-saas-business`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${baseUrl}/sell-saas`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${baseUrl}/buy-website`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${baseUrl}/sell-website`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${baseUrl}/valuation-saas`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: `${baseUrl}/valuation-marketplace`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: `${baseUrl}/digital-asset-valuation`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: `${baseUrl}/mrr-multiple-calculator`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7
        }
    ];

    const staticPages = [...mainPages, ...legalPages, ...authPages, ...publicPages, ...seoLandingPages];

    // Blog posts
    const posts = getAllPosts();
    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7
    }));

    // Blog categories
    const categories = getAllCategories();
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/blog/categories/${category}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6
    }));

    // Blog authors
    const authors = getAllAuthors();
    const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
        url: `${baseUrl}/blog/authors/${author.slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.5
    }));

    // Published assets from database
    let assetPages: MetadataRoute.Sitemap = [];
    try {
        const publishedAssets = await prisma.asset.findMany({
            where: {
                status: 'PUBLISHED'
            },
            select: {
                slug: true,
                updatedAt: true
            }
        });

        assetPages = publishedAssets.map((asset) => ({
            url: `${baseUrl}/assets/${asset.slug}`,
            lastModified: asset.updatedAt || currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8
        }));
    } catch (error) {
        // If database is unavailable during build, continue without asset pages
        console.warn('Could not fetch assets for sitemap:', error);
    }

    return [...staticPages, ...blogPosts, ...categoryPages, ...authorPages, ...assetPages];
}
