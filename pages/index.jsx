import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SMC - SaaS Market Cap',
    applicationCategory: 'BusinessApplication',
    description: 'Marketplace para comprar e vender SaaS, aplicativos e micro negócios digitais já validados.',
    url: 'https://seu-dominio.com',
    creator: {
      '@type': 'Organization',
      name: 'SMC - SaaS Market Cap'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL'
    }
  };

  return (
    <>
      <Head>
        <title>Marketplace de SaaS | Compre e Venda Aplicativos e Negócios Digitais | SMC</title>
        <meta
          name="description"
          content="Compre e venda SaaS, aplicativos e micro negócios digitais já validados. Cadastre seu projeto, organize métricas e negocie ativos digitais com linguagem simples."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SMC - Marketplace de SaaS e Negócios Digitais" />
        <meta
          property="og:description"
          content="Marketplace para listar, avaliar e negociar SaaS, apps e negócios digitais. Organize seus ativos digitais e prepare um pitch profissional."
        />
        <meta property="og:url" content="https://seu-dominio.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <div className="stack-lg">
        <section className="card" aria-labelledby="hero-title">
          <h1 id="hero-title" className="page-title">
            Compre e venda SaaS, aplicativos e negócios digitais já validados.
          </h1>
          <p className="page-subtitle">
            O SMC é um marketplace para listar, avaliar e negociar SaaS, apps e micro negócios digitais — com foco em
            métricas reais, processos simples e linguagem direta.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <Link href="/login">
              <button className="button primary">Acessar painel agora</button>
            </Link>
            <a href="#como-funciona">
              <button className="button secondary">Entender como funciona</button>
            </a>
          </div>
          <p className="muted" style={{ marginTop: 16 }}>
            Use seu login Google, cadastre seus ativos digitais (SaaS, aplicativos e sites) e comece a organizar seu
            portfólio digital para venda.
          </p>
        </section>

        <section id="como-funciona" className="card" aria-labelledby="como-funciona-title">
          <h2 id="como-funciona-title" className="page-title" style={{ fontSize: 20 }}>
            Como o marketplace de SaaS e ativos digitais do SMC funciona
          </h2>
          <div className="stack">
            <p className="muted">
              <strong>1. Cadastre seu ativo digital.</strong> Informe o tipo (SaaS, app, site), modelo de negócio e
              estágio atual.
            </p>
            <p className="muted">
              <strong>2. Estruture as informações.</strong> O SMC quebra o seu projeto em blocos: problema, produto,
              validação, métricas e modelo de negócio.
            </p>
            <p className="muted">
              <strong>3. Gere um pitch pronto para compra e venda.</strong> Você sai com um resumo claro do ativo para
              mostrar a potenciais compradores ou investidores.
            </p>
            <p className="muted">
              <strong>4. Negocie com segurança.</strong> Com as informações organizadas, fica muito mais fácil falar de
              preço, risco e potencial do seu negócio digital.
            </p>
          </div>
        </section>

        <section id="para-quem-e" className="card" aria-labelledby="para-quem-title">
          <h2 id="para-quem-title" className="page-title" style={{ fontSize: 20 }}>
            Para quem é o SaaS Market Cap
          </h2>
          <ul className="muted" style={{ paddingLeft: 18, margin: 0 }}>
            <li>
              <strong>Founders de SaaS</strong> que querem vender ou preparar uma saída estratégica do projeto.
            </li>
            <li>
              <strong>Desenvolvedores e makers</strong> que constroem apps e sites e querem uma vitrine séria para ativos
              digitais.
            </li>
            <li>
              <strong>Investidores</strong> interessados em micro aquisições de SaaS e negócios digitais já validados.
            </li>
          </ul>
        </section>

        <section id="beneficios" className="card" aria-labelledby="beneficios-title">
          <h2 id="beneficios-title" className="page-title" style={{ fontSize: 20 }}>
            Benefícios de usar o SMC como hub de ativos digitais
          </h2>
          <div className="stack">
            <p className="muted">
              <strong>Organização profissional.</strong> Seus ativos digitais deixam de ser ideia solta e viram “fichas”
              claras de avaliação.
            </p>
            <p className="muted">
              <strong>Clareza de valor.</strong> Fica mais simples enxergar se seu SaaS ou app está pronto para venda ou
              ainda precisa de validação.
            </p>
            <p className="muted">
              <strong>Velocidade na negociação.</strong> Com um pitch estruturado, você conversa com potenciais compradores
              sem perder tempo explicando o básico.
            </p>
            <p className="muted">
              <strong>Foco em métricas, não em achismo.</strong> O SMC incentiva você a registrar métricas reais — MRR,
              churn, crescimento, base de usuários — facilitando qualquer micro M&A digital.
            </p>
          </div>
        </section>

        <section className="card" aria-labelledby="cta-final-title">
          <h2 id="cta-final-title" className="page-title" style={{ fontSize: 20 }}>
            Comece a organizar seus ativos digitais hoje
          </h2>
          <p className="page-subtitle">
            Transforme seus SaaS, aplicativos e projetos digitais em ativos prontos para compra e venda.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
            <Link href="/login">
              <button className="button primary">Entrar no painel do SMC</button>
            </Link>
          </div>
          <p className="muted" style={{ marginTop: 16 }}>
            Leva poucos minutos para criar seu primeiro cadastro e enxergar seu negócio como um ativo digital com potencial
            de mercado.
          </p>
        </section>
      </div>
    </>
  );
};

export default Home;
