import { getAllPosts } from './blog';
import { SITE_CONFIG, SITE_URL } from './config/site-config';

export function generateRssFeed() {
  const posts = getAllPosts();
  const items = posts
    .map((post) => {
      return ` <item>
        <title>${post.title}</title>
        <link>${SITE_URL}/blog/${post.slug}</link>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt}]]></description>
      </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>${SITE_CONFIG.name} Blog</title>
      <link>${SITE_URL}/blog</link>
      <description>${SITE_CONFIG.description}</description>
      ${items}
    </channel>
  </rss>`;
}
