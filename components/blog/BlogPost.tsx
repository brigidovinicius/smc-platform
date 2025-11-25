import ReactMarkdown from 'react-markdown';
import MDXComponents from './MDXComponents';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BlogPostProps {
  title: string;
  date: string;
  author?: string;
  content: string;
  category?: string;
  tags?: string[];
}

const BlogPost = ({ title, date, author, content, category, tags }: BlogPostProps) => (
  <article className="max-w-3xl mx-auto bg-card rounded-lg p-4 sm:p-6 md:p-8 lg:p-12 shadow-sm border border-border">
    <header className="mb-6 sm:mb-8 md:mb-10 space-y-3 sm:space-y-4">
      {category && (
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      )}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight break-words">{title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        {author && <span className="break-words">{author}</span>}
        {author && <Separator orientation="vertical" className="hidden sm:block h-4" />}
        {author && <Separator orientation="horizontal" className="sm:hidden" />}
        <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</time>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <Separator className="mt-4 sm:mt-6" />
    </header>
    <div className="blog-content max-w-none prose prose-sm sm:prose-base prose-invert max-w-none">
      <ReactMarkdown components={MDXComponents as any}>{content}</ReactMarkdown>
    </div>
  </article>
);

export default BlogPost;
