import Link from 'next/link';

interface BlogAuthorCardProps {
  slug: string;
  name: string;
  role?: string;
  bio?: string;
}

const BlogAuthorCard = ({ slug, name, role, bio }: BlogAuthorCardProps) => (
  <article className="bg-[#050b1a] border border-white/5 rounded-3xl p-6 space-y-3">
    <h3 className="text-xl font-semibold text-white">
      <Link href={`/blog/authors/${slug}`}>{name}</Link>
    </h3>
    {role && <p className="text-sm text-slate-400">{role}</p>}
    {bio && <p className="text-slate-300 text-sm">{bio}</p>}
  </article>
);

export default BlogAuthorCard;
