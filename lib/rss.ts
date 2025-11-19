import { getAllPosts } from './blog';

export function generateRssFeed() {
  const posts = getAllPosts();
  const items = posts
    .map((post) => {
      return ` <item>
        <title>${post.title}</title>
        <link>https://saasmarketcap.com/blog/${post.slug}</link>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt}]]></description>
      </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>SaaS Market Cap Blog</title>
      <link>https://saasmarketcap.com/blog</link>
      <description>Atualizações sobre valuation e mercado secundário de ativos digitais.</description>
      ${items}
    </channel>
  </rss>`;
}
