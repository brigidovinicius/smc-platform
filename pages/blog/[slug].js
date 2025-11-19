import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blogPosts';

const BLOG_BASE_URL = 'https://seu-dominio.com/blog';

const BlogPostPage = ({ post }) => {
  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        <p>Página não encontrada.</p>
      </main>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'SMC - SaaS Market Cap'
    },
    publisher: {
      '@type': 'Organization',
      name: 'SMC - SaaS Market Cap',
      logo: {
        '@type': 'ImageObject',
        url: 'https://seu-dominio.com/logo.png'
      }
    },
    description: post.excerpt,
    url: `${BLOG_BASE_URL}/${post.slug}`
  };

  const contentBlocks = post.content.split('\n').filter((line) => line.trim().length > 0);

  return (
    <>
      <Head>
        <title>{post.title} | Blog SMC</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.title} | Blog SMC`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:url" content={`${BLOG_BASE_URL}/${post.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <main className="min-h-screen bg-[#050816] py-16 px-4">
        <article className="max-w-3xl mx-auto text-slate-100">
          <Link href="/blog" className="text-sm text-smc-accent mb-6 inline-flex items-center">
            ← Voltar para o blog
          </Link>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ARTIGO</p>
            <h1 className="text-4xl font-bold text-white">{post.title}</h1>
            <p className="text-slate-300">{post.excerpt}</p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="mt-10">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 object-cover rounded-3xl border border-white/10 shadow-sm shadow-black/70"
            />
          </div>

          <section className="mt-10 space-y-4 text-slate-200 leading-relaxed">
            {contentBlocks.map((block, index) =>
              block.startsWith('###') ? (
                <h3 key={index} className="text-2xl font-semibold text-white pt-4">
                  {block.replace('###', '').trim()}
                </h3>
              ) : (
                <p key={index} className="leading-relaxed">
                  {block}
                </p>
              )
            )}
          </section>
        </article>
      </main>
    </>
  );
};

export async function getStaticPaths() {
  const posts = getAllPosts();
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      notFound: true
    };
  }

  return {
    props: { post }
  };
}

export default BlogPostPage;
