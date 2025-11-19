export const blogPosts = [
  {
    slug: 'como-avaliar-um-saas-antes-de-comprar',
    title: 'Como avaliar um SaaS antes de comprar',
    excerpt:
      'Checklist prático para entender se um SaaS tem tração, produto e métricas suficientes antes de fechar qualquer aquisição.',
    date: '2024-10-15',
    readingTime: '6 min',
    tags: ['due diligence', 'investimento', 'SaaS'],
    coverImage:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    content: `### Checklist inicial
Entenda o problema que o SaaS resolve e valide se ainda é relevante hoje.
Mapeie quem são os clientes pagantes e quais segmentos têm maior retenção.

### Métricas essenciais
Recolha informações sobre MRR, churn, crescimento e CAC.
Busque tendências de 6-12 meses para enxergar se o negócio está acelerando ou desacelerando.

### Time e operação
Converse com o time atual e entenda onde estão os riscos operacionais.
Liste integrações críticas e fornecedores para evitar surpresas no handover.`
  },
  {
    slug: 'por-que-ativos-digitais-sao-o-novo-imovel',
    title: 'Por que ativos digitais são o novo imóvel',
    excerpt:
      'SaaS, apps e newsletters se transformaram em ativos com fluxo de caixa previsível. Veja por que investidores estão diversificando para o digital.',
    date: '2024-09-02',
    readingTime: '5 min',
    tags: ['ativos digitais', 'micro aquisições', 'tendências'],
    coverImage:
      'https://images.unsplash.com/photo-1501163268664-3fdf329d019f?auto=format&fit=crop&w=1200&q=80',
    content: `### Fluxo de caixa escalável
Um ativo digital bem gerido pode vender 24/7 sem depender de presença física.
Com processos de onboarding automatizados, a margem tende a ser muito maior que imóveis tradicionais.

### Liquidez global
Mercados como SMC permitem listar e negociar projetos de qualquer lugar.
Isso reduz fricção e aumenta o número de compradores interessados.

### Portfólio inteligente
Diversificar entre SaaS e apps protege contra ciclos econômicos regionais.
Além disso, é possível reinvestir rapidamente em crescimento ou em novos ativos complementares.`
  }
];

export const getAllPosts = () =>
  [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getPostBySlug = (slug) => blogPosts.find((post) => post.slug === slug);
