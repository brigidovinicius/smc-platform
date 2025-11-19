import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { getOfferBySlug } from '@/lib/offers';

const OfferDetailsPage = ({ offer }) => {
  if (!offer) {
    return (
      <main className="min-h-screen bg-[#050711] flex items-center justify-center text-white">
        <p>Oferta não encontrada.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050711] py-16 px-4 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <nav className="text-sm text-blue-300 flex items-center gap-2">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/feed">Feed</Link>
          <span>›</span>
          <span className="text-slate-300">{offer.title}</span>
        </nav>

        <header className="space-y-4">
          <p className="uppercase tracking-[0.4em] text-xs text-blue-200">{offer.classification}</p>
          <h1 className="text-4xl font-bold">{offer.title}</h1>
          <p className="text-slate-300">{offer.summary}</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span>{offer.niche}</span>
            <span>•</span>
            <span>{offer.valuationMultiple}</span>
            <span>•</span>
            <span>{offer.revenueRange}</span>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-4 bg-[#0b1230] border border-white/5 rounded-3xl p-6">
          <div>
            <p className="text-slate-400 text-xs uppercase mb-1">Investimento estimado</p>
            <h2 className="text-2xl font-semibold text-white">
              {offer.investmentRange
                ? `R$ ${(offer.investmentRange.min / 1000).toFixed(0)}k – R$ ${(offer.investmentRange.max / 1000).toFixed(0)}k`
                : 'Sob consulta'}
            </h2>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase mb-1">MRR atual</p>
            <h2 className="text-2xl font-semibold text-white">{offer.metrics?.mrr}</h2>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase mb-1">Churn</p>
            <p>{offer.metrics?.churn}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase mb-1">CAC</p>
            <p>{offer.metrics?.cac}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase mb-1">LTV</p>
            <p>{offer.metrics?.ltv}</p>
          </div>
        </section>

        <section className="space-y-4 bg-[#0b1230] border border-white/5 rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Diferenciais</h2>
          <div className="flex flex-wrap gap-2">
            {offer.badges?.map((badge) => (
              <span key={badge} className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-200">
                {badge}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-[#0b1230] border border-white/5 rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Próximos passos</h2>
          <p className="text-slate-300">
            Esta área é exclusiva para membros logados. Ao prosseguir você receberá o memorando completo, dados financeiros e
            checkpoints técnicos para due diligence.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/wizard" className="button primary">
              Cadastrar meu ativo
            </Link>
            <Link href="/profile" className="button secondary">
              Falar com um advisor
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=/offers/${context.params.slug}`,
        permanent: false
      }
    };
  }

  const offer = getOfferBySlug(context.params.slug) || null;

  return {
    props: { offer }
  };
}

export default OfferDetailsPage;
