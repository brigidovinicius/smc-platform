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
  <article className="max-w-3xl mx-auto bg-card rounded-lg p-8 md:p-12 shadow-sm border border-border">
    <header className="mb-10 space-y-4">
      {category && (
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      )}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {author && <span>{author}</span>}
        {author && <Separator orientation="vertical" className="h-4" />}
        <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</time>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <Separator className="mt-6" />
    </header>
    <div className="blog-content max-w-none">
      <ReactMarkdown components={MDXComponents as any}>{content}</ReactMarkdown>
    </div>
  </article>
);

export default BlogPost;
