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
    aria-label={`Post do blog: ${title}`}
  >
    <CardHeader className="pb-3">
      {category && (
        <Badge 
          variant="outline" 
          className="w-fit mb-2 text-xs"
          aria-label={`Categoria: ${category}`}
        >
          {category}
        </Badge>
      )}
      <CardTitle className="text-xl sm:text-2xl leading-tight">
        <Link 
          href={`/blog/${slug}`} 
          className="hover:text-primary transition-colors line-clamp-2"
          aria-label={`Ler post: ${title}`}
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
        aria-label={`Data de publicação: ${new Date(date).toLocaleDateString('pt-BR')}`}
      >
        {new Date(date).toLocaleDateString('pt-BR')}
      </p>
    </CardContent>
  </Card>
);

export default BlogCard;
