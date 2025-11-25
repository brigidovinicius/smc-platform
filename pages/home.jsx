import Head from 'next/head';
import Link from 'next/link';
import { ShieldCheck, Lightning, FileText, TrendUp, ListChecks } from '@phosphor-icons/react';
import { useSession, getSession } from 'next-auth/react';

const quickActions = [
  { title: 'Explore assets', description: 'View curated opportunities and public memorandums.', href: '/feed', tone: 'primary', Icon: TrendUp },
  { title: 'Create asset', description: 'Submit data and receive automated valuation.', href: '/wizard', tone: 'ghost', Icon: FileText },
  { title: 'Go to dashboard', description: 'Track readiness and received offers.', href: '/dashboard', tone: 'outline', Icon: Lightning }
];

const readinessPillars = [
  { label: 'Audited data', detail: 'Standardize MRR, churn and CAC before opening negotiations.', Icon: ShieldCheck },
  { label: 'Suggested valuation', detail: 'Multiples based on recent comparables.', Icon: TrendUp },
  { label: 'Due diligence checklist', detail: 'Documents, cohort and governance in one place.', Icon: ListChecks }
];

const timeline = [
  { title: 'Update metrics', desc: 'Add MRR, churn, LTV and ticket to keep the dossier current.' },
  { title: 'List asset', desc: 'Publish on marketplace and share with verified buyers.' },
  { title: 'Negotiate', desc: 'Receive proposals, release data room and advance to closing.' }
];

const statCards = [
  { label: 'Curated inventory', value: '50+', hint: 'Offers filtered by governance' },
  { label: 'Active investors', value: '2.4k', hint: 'Funds, flippers and operators' },
  { label: 'Average time to sale', value: '34 days', hint: 'From publish to closing' }
];

const HomeAliasPage = () => {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Founder';

  return (
    <div className="min-h-screen bg-[#050711] text-white -mx-4 -my-8 px-4 py-8">
      <Head>
        <title>Home · CounterX</title>
        <meta
          name="description"
          content="Track your digital assets, automated valuation and received offers on CounterX."
        />
      </Head>

      <div className="max-w-6xl mx-auto space-y-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1a3a] via-[#0b1230] to-[#111829] p-8 md:p-12 shadow-2xl">
          <div
            className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,#3b82f6,transparent_35%),radial-gradient(circle_at_bottom_left,#8b5cf6,transparent_30%)]"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
                Logged area · CounterX
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Hello, {firstName}. <span className="text-blue-200">Prepare your assets</span> and advance with verified buyers.
                </h1>
                <p className="text-slate-300 text-lg max-w-2xl">
                  Monitor readiness, access memorandums and share data securely. Use the shortcuts below to continue
                  on your sale or acquisition journey.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {quickActions.map(({ title, description, href, tone, Icon }) => (
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
                      <span className="flex items-center gap-2">
                        {Icon && <Icon size={18} weight="fill" />}
                        {title}
                      </span>
                      <span aria-hidden>→</span>
                    </div>
                    <p className="text-xs text-slate-200/80 mt-1">{description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-blue-200 uppercase tracking-[0.25em] mb-4">Quick radar</p>
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
                  Suggested next steps
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
                <h2 className="text-2xl font-semibold">Due diligence preparation</h2>
              </div>
              <span className="rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-xs border border-emerald-500/30">
                Status: in progress
              </span>
            </header>
            <div className="space-y-3">
              {readinessPillars.map((item) => (
                <div key={item.label} className="flex gap-3 items-start">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                      {item.Icon && <item.Icon size={18} weight="fill" />}
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-slate-300">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">Automatic NDA and blur</span>
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">Automated valuation</span>
              <span className="rounded-full bg-white/10 px-3 py-1 border border-white/10">Deal room access</span>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#081024] p-6 shadow-xl space-y-4">
            <header>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Memorandums & inventory</p>
              <h2 className="text-2xl font-semibold">Explore the curated feed</h2>
              <p className="text-slate-300 mt-2">
                Receive complete memorandums, filters by ticket and niche, and update history for each round.
              </p>
            </header>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-300">Open offers</p>
                <p className="text-2xl font-semibold">+50</p>
                <p className="text-xs text-slate-400 mt-1">Updated daily</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-300">Complete memorandums</p>
                <p className="text-2xl font-semibold">Includes metrics, cohort and multiples</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/feed" className="button primary">
                View opportunities
              </Link>
              <Link href="/wizard" className="button secondary">
                List my asset
              </Link>
            </div>
          </article>
        </section>
      </div>
    </div>
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
