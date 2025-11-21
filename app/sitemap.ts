import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories, getAllAuthors } from '@/lib/blog';
import { SITE_URL } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_URL;
    const currentDate = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
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
            url: `${baseUrl}/wizard`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8
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
        },
        {
            url: `${baseUrl}/auth/login`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.4
        },
        {
            url: `${baseUrl}/auth/register`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.4
        }
    ];

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
        url: `${baseUrl}/blog/categories/${category.category}`,
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

    return [...staticPages, ...blogPosts, ...categoryPages, ...authorPages];
}
