# Saas Market Cap (SMC) — Visão Geral Atualizada

Plataforma Next.js voltada para aquisição e venda de ativos digitais (SaaS, marketplaces, newsletters) com autenticação via Google, feed público de oportunidades, blog editorial e automações de conteúdo usando OpenAI.

## Objetivo e Contexto
- Oferecer um **frontdoor completo** para investidores e founders: feed público (`/feed`), páginas detalhadas de ofertas (`/offers/[slug]`), blog SEO e áreas autenticadas (dashboard, perfil e wizard de listagem).
- Manter **narrativa em português** com foco em tickets entre R$ 20 mil e R$ 2 mi e métricas como MRR, churn, CAC e múltiplos.
- Automatizar geração de artigos para o blog via scripts (`scripts/generateDailyPost.js` + `scripts/scheduleGeneratePost.js`) integrados ao OpenAI.

## Stack & Dependências Principais
- **Next.js 14.2 + React 18** em `pages/` e `pages/api/`.
- **NextAuth 4.24** com Google OAuth e middleware (`middleware.js`) protegendo `/dashboard`.
- **@vercel/postgres** + helper em `lib/profiles.js` para manter tabela `profiles` (id, email, role).
- **Prisma** (`prisma/schema.prisma`) descreve camada futura com perfis, assets, métricas, negociações e favoritos.
- **Tailwind CSS 4 / PostCSS** para estilos globais (`styles/globals.css`) + tokens do feed/blog.
- **OpenAI SDK + gray-matter + node-cron** suportam geração automática de posts Markdown e agendamento diário.

## Estrutura Relevante
| Caminho | Descrição |
| --- | --- |
| `pages/_app.js` | Envolve tudo com `SessionProvider` + `components/Layout.jsx` (Navbar persistente). |
| `middleware.js` | Requer login em `/dashboard` (SSR reforçado em `pages/dashboard/index.jsx`). |
| `pages/login.jsx` | CTA único para `signIn('google')` respeitando `callbackUrl`. |
| `pages/feed.jsx` | Feed público filtrável de oportunidades (investimento, nicho, MRR). |
| `pages/offers/[slug].jsx` | Página estática com SEO+JSON-LD para cada ativo (dados de `lib/offers.js`). |
| `pages/blog/index.js` & `[slug].js` | Listagem + artigo completo com Schema.org, filtros por tags e conteúdo de `lib/blogPosts.js`. |
| `pages/home.jsx`, `pages/profile.jsx`, `pages/wizard.jsx` | Rotas protegidas via `getServerSideProps` (redirecionam a `/login`). |
| `components/Navbar.jsx` | Mostra avatar/nome/email/role, botão Sair e CTA de login. |
| `components/RegisterWizard.jsx` & `lib/wizardSteps.js` | Wizard em 9 etapas com validação mínima de 40 caracteres e cálculo de progresso. |
| `lib/profiles.js` | Repositório Postgres (auto `CREATE TABLE IF NOT EXISTS`) usado nos callbacks do NextAuth. |
| `content/blog/` | Diretório onde os scripts salvam posts Markdown e assets gerados por IA. |
| `scripts/generateDailyPost.js` | Pipeline (briefing → artigo → otimização → imagem) usando `OPENAI_API_KEY`. |
| `scripts/scheduleGeneratePost.js` | Executor cron (via `node-cron`) chamando `npm run generate:post`. |

## Fluxos Essenciais
- **Autenticação**: `_app.js` injeta sessão; middleware + SSR em `/dashboard`, `/home`, `/wizard` e `/profile` garantem acesso autenticado; handler em `pages/api/auth/[...nextauth].js` persiste perfis no Postgres e força redirect pós-login para `/dashboard`.
- **Feed & Ofertas**: `lib/offers.js` guarda seed de oportunidades; `/feed` renderiza filtros e marcações; `/offers/[slug]` adiciona breadcrumbs, JSON-LD e CTAs privados (`/profile`, `/wizard`).
- **Blog SEO-first**: `lib/blogPosts.js` sustenta build estático; páginas incluem `<Head>` completo, filtros por tags, componentes relacionados e placeholders para imagens.
- **Perfil & Wizard**: `/profile` consome `session.user.role/id` retornados pelo callback; `/wizard` reutiliza `RegisterWizard` para captar pitches com validação.
- **Automação OpenAI**: `generateDailyPost.js` chama 3 “agentes” (briefing, redação, otimização) + DALL·E (via `images.generate`), salva Markdown e JSON-LD, e o `schedule:posts` roda em CRON configurável.

## Execução & Variáveis de Ambiente
1. `npm install`
2. Configure `.env.local` / `.env`:
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `POSTGRES_URL` **ou** `DATABASE_URL` (mesmo valor usado pelo Prisma; necessário para `lib/profiles.js`)
   - `OPENAI_API_KEY` (scripts de conteúdo)
   - `GENERATOR_CRON` (opcional, ex: `30 6 * * 1-5`)
   - `GENERATOR_TZ` (default `America/Sao_Paulo`)
3. `npm run dev` (ou use `PORT=3001 npm run dev` caso 3000 esteja bloqueada).

Scripts disponíveis:
- `npm run build` / `npm start` — build e produção Next.js.
- `npm run generate:post` — dispara pipeline de conteúdo (requer OpenAI).
- `npm run schedule:posts` — inicia serviço cron que roda `generate:post` automaticamente.

## Backlog & Próximos Passos
1. Integrar Prisma + Postgres de fato (migrar `lib/offers.js` e `lib/blogPosts.js` para consultas reais).
2. Persistir submissões do wizard e relacionar com `Profile`.
3. Exibir posts gerados (Markdown em `content/blog/`) usando `gray-matter` + `react-markdown`.
4. Cobrir fluxo com testes (Playwright para auth e filtros do feed; Jest/RTL para componentes críticos).
5. Adicionar dashboard autenticado real (cards de ativos favoritos, métricas do perfil, CTA para diligências).
