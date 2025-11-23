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
    // typedRoutes: true // Disabled - causing build errors
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  async redirects() {
    return [
      // Redirects para rotas duplicadas (português → inglês)
      {
        source: '/precos',
        destination: '/pricing',
        permanent: true, // 301 redirect
      },
      {
        source: '/planos',
        destination: '/pricing',
        permanent: true, // 301 redirect
      },
      {
        source: '/calculadora-valuation',
        destination: '/calculator',
        permanent: true, // 301 redirect
      },
      {
        source: '/vender-ativo',
        destination: '/wizard',
        permanent: true, // 301 redirect
      },
      {
        source: '/marketplace',
        destination: '/feed',
        permanent: true, // 301 redirect
      },
      // Redirects para rotas legais (português → inglês ou vice-versa)
      // Mantendo ambas funcionando, mas redirecionando para versão principal
      {
        source: '/legal/termos-de-uso',
        destination: '/legal/terms',
        permanent: false, // 302 redirect - manter ambas indexadas
      },
      {
        source: '/legal/privacidade',
        destination: '/legal/privacy',
        permanent: false, // 302 redirect - manter ambas indexadas
      },
    ];
  },
};

export default withMDX(nextConfig);
