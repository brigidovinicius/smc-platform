import { getPostBySlug } from '@/lib/blog';

interface HeadProps {
  params: { slug: string };
}

export default function Head({ params }: HeadProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return (
      <>
        <title>Post não encontrado – SMC</title>
      </>
    );
  }
  return (
    <>
      <title>{`${post.title} | SMC Blog`}</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
    </>
  );
}
