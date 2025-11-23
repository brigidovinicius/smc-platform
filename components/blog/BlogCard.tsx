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
  <Card className="bg-[#050b1a] border-white/5 hover:border-white/10 transition-colors">
    <CardHeader>
      {category && (
        <Badge variant="outline" className="w-fit mb-2">
          {category}
        </Badge>
      )}
      <CardTitle className="text-2xl">
        <Link href={`/blog/${slug}`} className="hover:text-primary transition-colors">
          {title}
        </Link>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <CardDescription className="text-slate-300">{excerpt}</CardDescription>
      <p className="text-xs text-slate-500">{new Date(date).toLocaleDateString('pt-BR')}</p>
    </CardContent>
  </Card>
);

export default BlogCard;
