import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
}

const BlogCard = ({ slug, title, excerpt, date, category }: BlogCardProps) => (
  <Card 
    className="bg-card border-border hover:border-primary/50 transition-colors h-full flex flex-col"
    aria-label={`Blog post: ${title}`}
  >
    <CardHeader className="pb-3">
      {category && (
        <Badge 
          variant="outline" 
          className="w-fit mb-2 text-xs"
          aria-label={`Category: ${category}`}
        >
          {category}
        </Badge>
      )}
      <CardTitle className="text-xl sm:text-2xl leading-tight">
        <Link 
          href={`/blog/${slug}`} 
          className="hover:text-primary transition-colors line-clamp-2"
          aria-label={`Read post: ${title}`}
        >
          {title}
        </Link>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 flex-1 flex flex-col">
      <CardDescription 
        className="text-muted-foreground text-sm line-clamp-3 flex-1"
        aria-label={`Resumo: ${excerpt}`}
      >
        {excerpt}
      </CardDescription>
      <p 
        className="text-xs text-muted-foreground mt-auto"
        aria-label={`Publication date: ${new Date(date).toLocaleDateString('en-US')}`}
      >
        {new Date(date).toLocaleDateString('en-US')}
      </p>
    </CardContent>
  </Card>
);

export default BlogCard;
