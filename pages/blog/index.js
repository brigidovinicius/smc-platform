import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blogPosts';

const BLOG_URL = 'https://seu-dominio.com/blog';
const accent = 'text-blue-400';

const TagFilter = ({ tags, activeTag, onSelect }) => (
  <nav aria-label="Filtros por tag" className="flex flex-wrap gap-3">
    <button
      className={`px-4 py-2 rounded-full text-sm border transition ${
        !activeTag ? 'border-blue-500/40 text-white bg-blue-500/10' : 'border-white/10 text-slate-300'
      }`}
      onClick={() => onSelect(null)}
    >
      Todas
    </button>
    {tags.map((tag) => (
      <button
        key={tag}
        className={`px-4 py-2 rounded-full text-sm border transition ${
          activeTag === tag ? 'border-blue-500/40 text-white bg-blue-500/10' : 'border-white/10 text-slate-300'
        }`}
        onClick={() => onSelect(tag)}
      >
        {tag}
      </button>
    ))}
  </nav>
);

const BlogCard = ({ post }) => (
  <article className="bg-[#0b1230] border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col">
    <img src={post.coverImage} alt={post.title} className="h-52 w-full object-cover" />
    <div className="p-6 flex flex-col flex-1">
      <div className="flex items-center text-xs uppercase tracking-wide text-slate-400 gap-3">
        <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
        <span>•</span>
        <span>{post.readingTime}</span>
      </div>
      <h2 className="text-2xl font-semibold text-white mt-3">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="text-slate-300 mt-3 flex-1">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-200">
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex items-center text-sm text-blue-400">
        Ler artigo →
      </Link>
    </div>
  </article>
);

const BlogIndex = ({ posts }) => {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const allTags = useMemo(() => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(), [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesTag = !activeTag || post.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [posts, query, activeTag]);

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog SaaS Market Cap',
    description: 'Conteúdo pensado para investidores, founders e operadores de SaaS.',
    url: BLOG_URL
  };

  return (
    <>
      <Head>
        <title>Blog SaaS Market Cap | Ativos Digitais e SaaS</title>
        <meta
          name="description"
          content="Guias, análises e insights sobre compra e venda de SaaS, valuation e gestão de ativos digitais."
        />
        <meta
          name="keywords"
          content="ativos digitais, SaaS, comprar SaaS, vender SaaS, valuation de SaaS, marketplace de SaaS"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog SaaS Market Cap" />
        <meta
          property="og:description"
          content="Guias, análises e insights sobre compra, venda e gestão de ativos digitais."
        />
        <meta property="og:url" content={BLOG_URL} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog SaaS Market Cap" />
        <meta name="twitter:description" content="Conteúdo premium sobre aquisição de ativos digitais." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      </Head>

      <main className="min-h-screen bg-[#050711] py-16 px-4 text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="space-y-5 text-center">
            <p className="tracking-[0.4em] uppercase text-xs text-blue-200">Blog SMC</p>
            <h1 className="text-4xl md:text-5xl font-bold">Blog SaaS Market Cap</h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Guias, análises e insights sobre compra, venda e gestão de ativos digitais. Conteúdo pensado para
              investidores, founders e operadores de SaaS, aplicativos, sites e newsletters.
            </p>
            <p className="text-sm text-slate-400">Conteúdo pensado para investidores, founders e operadores de SaaS.</p>
          </header>

          <section className="space-y-6" aria-label="Ferramentas do blog">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <label className="flex-1">
                <span className="sr-only">Buscar posts</span>
                <input
                  type="search"
                  placeholder="Buscar por título ou tópico"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full rounded-2xl bg-[#080f1f] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </label>
            </div>
            <TagFilter tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />
          </section>

          <section aria-label="Lista de posts" className="grid gap-8 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
            {filteredPosts.length === 0 && (
              <p className="text-slate-400">Nenhum post corresponde aos filtros selecionados.</p>
            )}
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
