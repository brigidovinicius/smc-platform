# Codex Audit Report – SaaS Market Cap (SMC)

## 1. Estrutura atual do código
- **Camadas**: App Router usado apenas para o marketing/blog (`app/(marketing)`), enquanto todo o produto (auth, dashboard, feed, API) continua no Pages Router (`pages/`). Mistura gera dois sistemas de layout e estilos diferentes.
- **Componentes compartilhados**: `components/` concentra UI (React em JS) e um subset em `components/ui/`; `app/(marketing)/_components` já usa TypeScript + Framer Motion isoladamente.
- **Dados e serviços**: inexistem módulos de domínio em Prisma. As ofertas e blog posts usados na aplicação vivem em arquivos estáticos (`lib/offers.js`, `lib/blogPosts.js`, `lib/blog.ts`), e não há camada de serviços/testes.
- **Automação de conteúdo**: `scripts/generateDailyPost.js` e `scripts/scheduleGeneratePost.js` dependem de OpenAI, mas o output cai em `content/blog/` sem integração automática no frontend além da leitura síncrona em `lib/blog.ts`.
- **Infra/Config**: Prisma está configurado apenas com o modelo padrão do NextAuth; `lib/profiles.js` tenta usar `@vercel/postgres` mas não é chamado em nenhum lugar. Pastas “Saas Market Cap (SMC) v1” e “Saas Market Cap v1” (com espaços) permanecem na raiz sem uso.

## 2. Bugs, riscos e problemas potenciais
1. **Fluxo de login inconsistente** – Middleware aponta `signIn: '/login'` (`middleware.js:7`) enquanto NextAuth retorna `/auth/login` (`pages/api/auth/[...nextauth].ts:17`). Usuários deslogados que tocam rotas protegidas recebem redirect para `/login`, mas o fluxo de credenciais existe apenas em `/auth/login`, causando UX confusa e necessidade de manter duas telas.
2. **Sessão não carrega `role/id`** – `pages/profile.jsx:22-27` renderiza `session.user.role` e `session.user.id`, porém o callback (`pages/api/auth/[...nextauth].ts:45-57`) só injeta `user.id` na sessão e não existe campo `role` no schema. Interface mostra placeholders vazios.
3. **Dados de domínio hardcoded** – `lib/offers.js`, `pages/dashboard/index.jsx` e `lib/blog.ts` usam arrays/mock synchronous `fs.readFileSync`. Não há validação nem fallback caso `content/blog` não siga o padrão MDX esperado → risco de crash no build se algum arquivo JSON estiver inválido.
4. **Scripts de geração com variáveis placeholder** – `scripts/generateDailyPost.js:20` fixa `BASE_URL = "https://seu-dominio.com"`, então JSON-LD/meta enviados para Google apontam para domínio errado; cover images são salvas em `/public/blog-images` mas não há limpeza/verificação de slug duplicado.
5. **Middleware protege apenas `/dashboard` e `/offers`** – Rotas sensíveis como `/profile`, `/wizard`, `/home` contam apenas com SSR `getServerSideProps` e podem ser pré-carregadas sem session no cliente. Inconsistência facilita estados intermediários e flash de conteúdo privado.
6. **Pastas antigas e arquivos deletados** – Git mostra `pages/blog/*` e `pages/index.jsx` como deletados permanentes; manutenção em paralelo do App Router + Pages Router aumenta risco de regressão caso alguém restaure arquivos legados.
7. **Ferramenta de perfis em @vercel/postgres não conectada** – `lib/profiles.js` nunca é importado; mesmo que o banco esteja configurado, nenhum lugar cria/consome perfis/roles, invalidando o objetivo de RBAC.
8. **Falta de testes e observabilidade** – não há `tests/` nem scripts de cobertura; qualquer regressão em `/feed` ou nos scripts de geração passará despercebida.

## 3. Tabela de riscos prioritários
| ID | Risco | Local | Impacto | Prob. | Observação |
| --- | --- | --- | --- | --- | --- |
| R1 | Inconsistência de login / redirects quebrados | `middleware.js`, `pages/api/auth/[...nextauth].ts`, `pages/login.jsx` | Usuário pode ficar preso fora do fluxo de credenciais | Média | Manter duas telas de login aumenta esforço e falhas.
| R2 | Dados estáticos + FS síncrono | `lib/offers.js`, `lib/blog.ts`, `pages/dashboard/index.jsx` | Feed/blog não refletem realidade e crasham se arquivo estiver inválido | Alta | Sem DB ou try/catch robusto.
| R3 | Automação aponta para domínio errado | `scripts/generateDailyPost.js` | SEO negativo e links quebrados nas páginas geradas | Alta | Todos os artigos gerados herdam URL inválida.
| R4 | RBAC inexistente | `prisma/schema.prisma`, `lib/profiles.js`, componentes Auth | Impossível restringir dashboards/admin, aumentando risco de acesso indevido | Alta | Roadmap fala em roles, mas schema não suporta.
| R5 | Pastas legadas + mix App/Pages Router | raiz + `pages/` + `app/` | Build/review difíceis; risco de duplicar rotas | Média | Postergar refactor só aumenta dívida.

## 4. Melhorias de arquitetura
- **Modelagem Prisma**: Expandir `prisma/schema.prisma` com `Profile`, `SaaSAsset`, `Offer`, `Transaction` conforme blueprint existente. Migrar seeds para `/prisma/seed.ts` e ligar NextAuth aos perfis (roles).
- **Camada de serviços**: Criar `lib/services/{offers,assets,profiles}.ts` e validadores com Zod. APIs e páginas consumiriam essa camada, reduzindo mocks espalhados.
- **Unificar roteamento**: Escolher App Router para tudo ou manter Pages Router, mas não ambos. App Router + Server Components simplificaria dashboard/feed/offer.
- **Feature flags para scripts**: Encapsular automação em módulo (ex.: `src/pipelines/generatePost.ts`) com validação de env e logging estruturado.

## 5. Melhorias de performance
- Trocar leituras síncronas (`lib/blog.ts`) por `fs.promises` + cache em memória (ex.: `Map` + `revalidateTag` em rotas App Router).
- Introduzir paginação real em `/feed` consumindo dados de banco ou API com `revalidate` configurado; hoje a página carrega todas as ofertas no client.
- Remover dependências não usadas (`@vercel/postgres`, `@next/mdx`?) ou configurá-las corretamente para reduzir peso de build.
- Usar `next/image` em `pages/profile.jsx:22-30` e `components/Navbar.jsx:30-39` para evitar os warnings constantes e melhorar LCP.

## 6. Melhorias de segurança
- Implementar envio real de e-mail e expiração/uso único para tokens (`pages/api/auth/register.ts` & `verify.ts`) + rate limiting básico (ex.: via Upstash ou middleware custom) para evitar spam de cadastro.
- Guardar senhas com requisitos mínimos (tamanho/complexidade) e aplicar `zod`/`yup` server-side.
- Adicionar `helmet`-like headers através de `next.config.mjs` ou middleware (`Content-Security-Policy`, `Referrer-Policy`).
- Revisar `scripts/generateDailyPost.js` para não logar tokens nem salvar arquivos com nomes previsíveis antes de validação de slug.

## 7. Melhorias de acessibilidade
- Assegurar que todos os CTAs/buttons tenham `aria-labels` onde necessário e que os componentes do marketing usem contraste mínimo; hoje `FloatingCTA` e `hero` usam texto branco sobre gradiente sem checagem.
- Incluir `alt` descritivo em todos os `<img>` e migrar para `<Image>` com `priority` onde for crítico (Navbar/Profile, cards do blog).
- Revisar formulário de `pages/auth/login.tsx` para usar `<label>` semanticamente associado (não envolver o input dentro do label impede screen readers de anunciar status).

## 8. Organização de pastas e padrões
- Remover ou arquivar pastas antigas “Saas Market Cap (SMC) v1” e “Saas Market Cap v1` (contêm espaços e atrapalham scripts). Documentar se devem ficar fora do repo.
- Migrar componentes para TypeScript e padronizar extensão `.tsx`. Hoje há mistura de `.jsx`, `.js` e `.ts` no mesmo diretório.
- Criar `tests/` com subpastas `unit/` e `integration/` para preparar cobertura futura.
- Centralizar estilos: marketing usa tokens claros, mas pages router ainda consome classes custom em `styles/globals.css`. Avaliar Tailwind/vanilla-extract unificados.

## 9. Plano de ação
### Correções imediatas (prioridade máxima)
1. **Alinhar rotas de login** – Atualizar `middleware.js` para apontar para `/auth/login` ou remover `/login.jsx` duplicado.
2. **Corrigir scripts de conteúdo** – Parametrizar `BASE_URL`/`SECTION` em `scripts/generateDailyPost.js` e validar existência de `public/blog-images/<slug>/` antes de escrever.
3. **Resolver warnings de `<img>`** – Migrar imagens em `pages/profile.jsx` e `components/Navbar.jsx` para `next/image`.
4. **Documentar/arquivar pastas legadas** – Mover “Saas Market Cap (SMC) v1*” para fora do repo ou adicionar instruções no README.

### Melhorias essenciais (curto prazo)
1. **Modelar domínio no Prisma** e executar `prisma migrate dev` com seeds iniciais (perfis, ativos, ofertas, transactions).
2. **Camada de serviços + APIs REST** – Criar `/pages/api/assets|offers` ou `/app/api/...` com paginação, filtros e cache tags.
3. **Integração real do feed** – `/feed` deve consumir dados do banco via `getServerSideProps`/ISR com fallback, removendo `lib/offers.js`.
4. **Fluxo de cadastro/verificação completo** – Enviar e-mails reais, permitir reenvio de token, expirando tokens antigos.

### Refatorações estruturais (médio prazo)
1. **Migrar produto para App Router** com layouts compartilhados e Server Components; elimina `_app.js`/`pages/*` legados.
2. **Desacoplar scripts do OpenAI** – Transformar `generateDailyPost` em módulo reutilizável com testes; adicionar dry-run/preview.
3. **Implementar roles e RBAC** – Atualizar NextAuth callbacks para carregar `role` do Prisma, e criar guardas em dashboards/admin.
4. **Observabilidade/testes** – Introduzir Jest/Vitest + Playwright, além de logging estruturado (ex.: `lib/utils/logger.ts`).

### Evoluções futuras (longo prazo)
1. **Dashboard conectado** – Substituir mocks em `pages/dashboard/index.jsx` por dados reais (ativos, offers, gamificação) e gráficos interativos.
2. **APIs públicas** – Disponibilizar endpoints versionados para consulta de ativos e valuations (com cache e rate limit).
3. **Sistema de valuation** – Criar `/api/valuation` com fórmula baseada em MRR/churn/CAC e persistir histórico.
4. **Infra multi-ambiente** – Configurar pipelines CI/CD, testes automatizados e revisão de qualidade antes do deploy.

---
Gerado na branch `codex-audit` após `npm run lint` e `npm run build` (ambos OK com warnings de `<img>`). Ajustes recomendados devem seguir as prioridades acima.
