import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import mdx from '@next/mdx';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug]
  }
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
};

export default withMDX(nextConfig);
