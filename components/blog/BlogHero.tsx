interface BlogHeroProps {
  title: string;
  description: string;
}

const BlogHero = ({ title, description }: BlogHeroProps) => (
  <section className="space-y-4 text-center py-12">
    <p className="text-xs uppercase tracking-[0.4em] text-blue-200">SMC Blog</p>
    <h1 className="text-4xl font-bold text-white">{title}</h1>
    <p className="text-slate-300 max-w-2xl mx-auto">{description}</p>
  </section>
);

export default BlogHero;
