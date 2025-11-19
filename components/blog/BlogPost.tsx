import ReactMarkdown from 'react-markdown';
import MDXComponents from './MDXComponents';

interface BlogPostProps {
  title: string;
  date: string;
  author?: string;
  content: string;
}

const BlogPost = ({ title, date, author, content }: BlogPostProps) => (
  <article className="prose prose-invert max-w-3xl mx-auto">
    <header className="mb-10">
      <p className="text-xs uppercase tracking-[0.3em] text-blue-300">Post</p>
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      <p className="text-slate-400 text-sm">
        {author && <span>{author} · </span>}
        {new Date(date).toLocaleDateString('pt-BR')}
      </p>
    </header>
    <ReactMarkdown components={MDXComponents as any}>{content}</ReactMarkdown>
  </article>
);

export default BlogPost;
