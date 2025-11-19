import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blogPosts';

const BLOG_URL = 'https://seu-dominio.com/blog';

const BlogIndex = ({ posts }) => {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SMC Blog',
    description:
      'Insights sobre como investir em SaaS, apps e micro negócios digitais. Conteúdo criado pelo SaaS Market Cap.',
    url: BLOG_URL,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://seu-dominio.com/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        '@type': 'Organization',
        name: 'SMC - SaaS Market Cap'
      },
      image: post.coverImage
    }))
  };

  return (
    <>
      <Head>
        <title>Blog SMC — Inteligência para investir em ativos digitais</title>
        <meta
          name="description"
          content="Artigos sobre compra e venda de SaaS, avaliação de ativos digitais e micro aquisições. Aprenda a investir com inteligência no SaaS Market Cap."
        />
        <meta
          name="keywords"
          content="blog SaaS, ativos digitais, marketplace SaaS, compra de SaaS, micro aquisições"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog SMC — Inteligência para investir em ativos digitais" />
        <meta
          property="og:description"
          content="Descubra como avaliar, comprar e vender SaaS e negócios digitais. Conteúdo exclusivo do SaaS Market Cap."
        />
        <meta property="og:url" content={BLOG_URL} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1501163268664-3fdf329d019f?auto=format" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      </Head>

      <main className="min-h-screen bg-[#050816] py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="text-center space-y-4">
            <p className="tracking-[0.3em] uppercase text-slate-400 text-xs">SMC BLOG</p>
            <h1 className="text-4xl font-bold text-white">Inteligência para investir em ativos digitais</h1>
            <p className="text-slate-300">
              Estudos rápidos sobre compra e venda de SaaS, validação de métricas e tudo que você precisa para negociar
              ativos digitais com confiança.
            </p>
          </header>

          <section className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-[#0a1124] border border-white/5 rounded-3xl overflow-hidden shadow-sm shadow-black/60 flex flex-col"
              >
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `linear-gradient(120deg, rgba(5,8,22,0.15), rgba(5,8,22,0.6)), url(${post.coverImage})` }}
                />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center text-xs uppercase tracking-wide text-slate-400 gap-3">
                    <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mt-3">{post.title}</h2>
                  <p className="text-slate-300 mt-3 flex-1">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex items-center text-sm text-smc-accent">
                    Ler artigo →
                  </Link>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async () => {
  const posts = getAllPosts();
  return {
    props: { posts }
  };
};

export default BlogIndex;
