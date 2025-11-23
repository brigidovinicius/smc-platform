interface BlogHeroProps {
  title: string;
  description: string;
}

const BlogHero = ({ title, description }: BlogHeroProps) => (
  <section 
    className="space-y-4 text-center py-12"
    role="banner"
    aria-label={`Blog: ${title}`}
  >
    <p className="text-xs uppercase tracking-[0.4em] text-primary" aria-label="SMC Blog">SMC Blog</p>
    <h1 className="text-4xl font-bold text-foreground">{title}</h1>
    <p className="text-muted-foreground max-w-2xl mx-auto" aria-label={`Descrição: ${description}`}>
      {description}
    </p>
  </section>
);

export default BlogHero;
