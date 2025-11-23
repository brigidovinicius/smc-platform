import { getAllPosts, getAllCategories } from './blog';

export function generateBlogSitemap() {
  const baseUrl = 'https://smc-platform.vercel.app';
  const posts = getAllPosts();
  const categories = getAllCategories();

  const urls = [
    `${baseUrl}/blog`,
    `${baseUrl}/blog/categories`,
    `${baseUrl}/blog/authors`
  ];

  posts.forEach((post) => urls.push(`${baseUrl}/blog/${post.slug}`));
  categories.forEach((category) => urls.push(`${baseUrl}/blog/categories/${category}`));

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((url) => {
        return `<url><loc>${url}</loc><changefreq>weekly</changefreq></url>`;
      })
      .join('\n')}
  </urlset>`;
}
