import Link from 'next/link';

interface BlogAuthorCardProps {
  slug: string;
  name: string;
  role?: string;
  bio?: string;
}

const BlogAuthorCard = ({ slug, name, role, bio }: BlogAuthorCardProps) => (
  <article className="bg-card border border-border rounded-3xl p-6 space-y-3">
    <h3 className="text-xl font-semibold text-foreground">
      <Link href={`/blog/authors/${slug}`} className="hover:text-primary transition-colors">{name}</Link>
    </h3>
    {role && <p className="text-sm text-muted-foreground">{role}</p>}
    {bio && <p className="text-muted-foreground text-sm">{bio}</p>}
  </article>
);

export default BlogAuthorCard;
