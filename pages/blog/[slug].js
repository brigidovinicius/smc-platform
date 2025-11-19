import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blogPosts';

const BLOG_BASE_URL = 'https://seu-dominio.com/blog';

const RelatedPosts = ({ currentSlug, posts }) => {
  const related = posts.filter((post) => post.slug !== currentSlug).slice(0, 3);

  if (!related.length) {
    return null;
  }

  return (
    <aside className="mt-14 bg-[#0b1230] border border-white/5 rounded-3xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Artigos relacionados</h3>
      <ul className="space-y-4 text-slate-300">
        {related.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="text-blue-400 hover:text-blue-200">
              {post.title}
            </Link>
            <p className="text-sm text-slate-400">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const BlogPostPage = ({ post, relatedPosts }) => {
  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#050711] text-white">
        <p>Página não encontrada.</p>
      </main>
    );
  }

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `${BLOG_BASE_URL}/${post.slug}`,
    image: post.coverImage,
    keywords: post.tags,
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
    }
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://seu-dominio.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: BLOG_BASE_URL
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${BLOG_BASE_URL}/${post.slug}`
      }
    ]
  };

  const contentBlocks = post.content.split('\n').filter((line) => line.trim().length > 0);

  return (
    <>
      <Head>
        <title>{post.title} | SaaS Market Cap</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`${BLOG_BASE_URL}/${post.slug}`} />
        <meta property="og:image" content={post.coverImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </Head>

      <main className="min-h-screen bg-[#050711] py-14 px-4 text-white">
        <article className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center text-sm text-blue-300 gap-2">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/blog">Blog</Link>
            <span>›</span>
            <span className="text-slate-300">{post.title}</span>
          </div>

          <Link href="/blog" className="text-sm text-blue-400 hover:text-blue-200 inline-flex items-center mb-4">
            ← Voltar para o blog
          </Link>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Artigo</p>
            <h1 className="text-4xl font-bold">{post.title}</h1>
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

          <div className="mt-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-72 object-cover rounded-3xl border border-white/10 shadow-2xl shadow-black/70"
            />
          </div>

          <section className="prose prose-invert prose-headings:text-white prose-a:text-blue-400 mt-10 max-w-none">
            {contentBlocks.map((block, index) =>
              block.startsWith('###') ? (
                <h3 key={index}>{block.replace('###', '').trim()}</h3>
              ) : (
                <p key={index}>{block}</p>
              )
            )}
          </section>

          <RelatedPosts currentSlug={post.slug} posts={relatedPosts} />

          <div className="mt-10">
            <Link href="/blog" className="text-blue-400 hover:text-blue-200">
              ← Ver todos os artigos
            </Link>
          </div>
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
  const posts = getAllPosts();

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
      relatedPosts: posts.filter((item) => item.slug !== post.slug)
    }
  };
}

export default BlogPostPage;
