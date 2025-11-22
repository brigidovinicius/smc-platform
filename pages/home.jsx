import Head from 'next/head';
import Link from 'next/link';
import { useSession, getSession } from 'next-auth/react';

const quickActions = [
  { title: 'Explorar ativos', description: 'Ver oportunidades curadas e memorandos públicos.', href: '/feed', tone: 'primary' },
  { title: 'Criar ativo', description: 'Envie dados e receba valuation automático.', href: '/wizard', tone: 'ghost' },
  { title: 'Ir ao dashboard', description: 'Acompanhe readiness e ofertas recebidas.', href: '/dashboard', tone: 'outline' }
];

const readinessPillars = [
  { label: 'Dados auditados', detail: 'Padronize MRR, churn e CAC antes de abrir negociação.' },
  { label: 'Valuation sugerido', detail: 'Múltiplos baseados em comparáveis recentes.' },
  { label: 'Checklist de due diligence', detail: 'Documentos, cohort e governança em um lugar.' }
];

const timeline = [
  { title: 'Atualizar métricas', desc: 'Adicione MRR, churn, LTV e ticket para manter o dossiê atual.' },
  { title: 'Listar ativo', desc: 'Publique no marketplace e compartilhe com compradores verificados.' },
  { title: 'Negociar', desc: 'Receba propostas, libere data-room e avance para closing.' }
];

const statCards = [
  { label: 'Inventário curado', value: '50+', hint: 'Ofertas filtradas por governança' },
  { label: 'Investidores ativos', value: '2.4k', hint: 'Funds, flippers e operadores' },
  { label: 'Tempo médio de venda', value: '34 dias', hint: 'Do publish ao closing' }
];

const HomeAliasPage = () => {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Founder';

  return (
    <main className="min-h-screen bg-[#050711] text-white">
      <Head>
        <title>Home · SMC Platform</title>
        <meta
          name="description"
          content="Acompanhe seus ativos digitais, valuation automático e ofertas recebidas na SMC."
        />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1a3a] via-[#0b1230] to-[#111829] p-8 md:p-12 shadow-2xl">
          <div
            className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,#3b82f6,transparent_35%),radial-gradient(circle_at_bottom_left,#8b5cf6,transparent_30%)]"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
                Área logada · SMC
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Olá, {firstName}. <span className="text-blue-200">Prepare seus ativos</span> e avance com compradores verificados.
                </h1>
                <p className="text-slate-300 text-lg max-w-2xl">
                  Monitore readiness, acesse memorandos e compartilhe dados com segurança. Use os atalhos abaixo para seguir
                  na jornada de venda ou aquisição.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {quickActions.map(({ title, description, href, tone }) => (
                  <Link
                    key={title}
                    href={href}
                    className={`group rounded-2xl px-5 py-4 min-w-[220px] border transition hover:-translate-y-1 ${
                      tone === 'primary'
                        ? 'bg-white text-[#050711] border-white shadow-lg shadow-blue-500/20'
                        : tone === 'ghost'
                          ? 'border-white/15 bg-white/5 text-white hover:border-white/30'
                          : 'border-white/15 text-white hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{title}</span>
                      <span aria-hidden>→</span>
                    </div>
                    <p className="text-xs text-slate-200/80 mt-1">{description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-blue-200 uppercase tracking-[0.25em] mb-4">Radar rápido</p>
                <div className="grid grid-cols-2 gap-3">
                  {statCards.map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-[#0b1230]/80 border border-white/5 p-4">
                      <p className="text-sm text-slate-300">{stat.label}</p>
                      <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.hint}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1230] p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Próximos passos sugeridos
                </div>
                <div className="space-y-2">
                  {timeline.map((item) => (
                    <div key={item.title} className="rounded-xl border border-white/5 bg-white/5 p-3">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-slate-300">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-[#081024] p-6 shadow-xl">
            <header className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Checklist</p>
                <h2 className="text-2xl font-semibold">Preparação para due diligence</h2>
              </div>
              <span className="rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-xs border border-emerald-500/30">
                Status: em progresso
              </span>
            </header>
            <div className="space-y-3">
              {readinessPillars.map((item) => (
                <div key={item.label} className="flex gap-3 items-start">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-slate-300">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">NDA e blur automático</span>
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">Valuation automático</span>
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">Acesso a deal-room</span>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#081024] p-6 shadow-xl space-y-4">
            <header>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Memorandos e inventário</p>
              <h2 className="text-2xl font-semibold">Explore o feed curado</h2>
              <p className="text-slate-300 mt-2">
                Receba memorandos completos, filtros por ticket e nicho e histórico de atualizações a cada rodada.
              </p>
            </header>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-300">Ofertas abertas</p>
                <p className="text-2xl font-semibold">+50</p>
                <p className="text-xs text-slate-400 mt-1">Atualizado diariamente</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-300">Memorandos completos</p>
                <p className="text-2xl font-semibold">Inclui métricas, cohort e múltiplos</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/feed" className="button primary">
                Ver oportunidades
              </Link>
              <Link href="/wizard" className="button secondary">
                Listar meu ativo
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

export default HomeAliasPage;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    };
  }

  return { props: { session } };
};
