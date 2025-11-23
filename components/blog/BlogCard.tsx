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
  <Card className="bg-[#050b1a] border-white/5 hover:border-white/10 transition-colors h-full flex flex-col">
    <CardHeader className="pb-3">
      {category && (
        <Badge variant="outline" className="w-fit mb-2 text-xs">
          {category}
        </Badge>
      )}
      <CardTitle className="text-xl sm:text-2xl leading-tight">
        <Link href={`/blog/${slug}`} className="hover:text-primary transition-colors line-clamp-2">
          {title}
        </Link>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 flex-1 flex flex-col">
      <CardDescription className="text-slate-300 text-sm line-clamp-3 flex-1">
        {excerpt}
      </CardDescription>
      <p className="text-xs text-slate-500 mt-auto">{new Date(date).toLocaleDateString('pt-BR')}</p>
    </CardContent>
  </Card>
);

export default BlogCard;
