# SMC Frontend – Agent Guidelines

## Project Overview
SaaS Market Cap (SMC) is a Next.js 14 (pages router) app focused on autenticação via NextAuth (Google), um dashboard privado e um blog público. A base atual usa JavaScript, Tailwind CSS (via `@tailwindcss/postcss`), e alias `@/` apontando para a raiz. As pastas mais relevantes:

```
components/      # Layout, Navbar e demais shells reutilizáveis
lib/             # utilitários client-side (ex.: blogPosts)
pages/           # rotas do Next (auth, dashboard, blog, wizard, etc.)
styles/          # Tailwind + tokens globais
docs/            # documentação adicional
```

Privacidade das rotas é controlada por `middleware.js` (protege apenas `/dashboard/**`). O blog (`/blog` e `/blog/[slug]`) precisa permanecer público.

## Build & Development Commands
- `npm install` – instala dependências (Next.js, NextAuth, Tailwind).
- `npm run dev` – sobe o Next com HMR em http://localhost:3000.
- `npm run build` / `npm start` – build e execução em modo produção.
- `npm run lint` – usa o ESLint padrão do Next.

Sempre derrube instâncias antigas (`lsof -nP -iTCP:3000 ...`) antes de subir outra, evitando múltiplos processos ocupando a porta.

## Coding Style & Naming
- Use componentes funcionais com hooks; mantenha estado local minimalista.
- Prefira arquivos `.jsx`/`.js` no diretório `components/` para blocos reutilizáveis.
- Páginas residem em `pages/`. Use `getStaticProps`, `getStaticPaths` ou `getServerSideProps` conforme o fluxo (SSR para áreas privadas, SSG para blog).
- Estilos: combine utilitários Tailwind com classes globais (`styles/globals.css`). Evite CSS-in-JS adicional.
- SEO é obrigatório para páginas públicas: `<Head>`, Open Graph/Twitter e JSON-LD usando `dangerouslySetInnerHTML`.

## Testing & QA
Ainda não há suíte automatizada. Ao implementar recursos sensíveis (ex.: autenticação, blog público), valide manualmente:
- `npm run dev` + navegação das rotas críticas (`/`, `/login`, `/dashboard`, `/blog`).
- Verifique redirecionamentos protegidos (usuário não logado deve ser mandado a `/login`).
- Teste responsividade básica (mobile/desktop) dos layouts dark.

## Commit & PR Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `chore:`). Inclua o contexto (ex.: `feat(blog): melhorar página pública`).
- PRs precisam de: objetivos, lista de mudanças, prints/gifs quando UI muda, e resultado dos comandos relevantes (`npm run lint`, etc.).
- Aponte se há impacto em variáveis de ambiente ou credenciais.

## Security & Configuration
- Segredos ficam em `.env.local` (Google OAuth, NEXTAUTH_SECRET). Não comite esse arquivo.
- Sempre atualize `postcss.config.js` para usar `@tailwindcss/postcss`; evitar plugins deprecados.
- Middleware deve proteger apenas rotas privadas. Não envolva `/blog` e `/blog/**`.
- Ao lidar com dados fictícios (ex.: `lib/blogPosts.js`), mantenha o conteúdo editorial neutro e sem dados sensíveis.

## UX/Design Guardrails
- Tema dark predominante (#050711 / azul elétrico). Use as utilidades Tailwind para espaçamento e tipografia confortável.
- Navbar fixa com CTA de login/logout e breadcrumbs coerentes nas páginas de conteúdo.
- Os cards e páginas do blog precisam comunicar claramente: capa > meta info > título > resumo > tags > CTA.
- Para artigos, priorize leitura fluída (`prose prose-invert` ou equivalente) e blocos relacionados no rodapé.

## 📚 Documentação Técnica Completa

Este projeto possui documentação técnica completa disponível em:

- **`docs/TECHNICAL-DOCUMENTATION.md`** - Documentação técnica completa (1.653 linhas)
  - Arquitetura completa do sistema
  - Stack tecnológico detalhado
  - Estrutura de pastas e componentes
  - Fluxos de dados e interações
  - Banco de dados (Prisma schema)
  - APIs e rotas
  - Design System
  - Padrões de código
  - Deploy e infraestrutura

- **`docs/TECHNOLOGY-STACK.md`** ⭐ **VERSÕES EXATAS E REGRAS DE ATUALIZAÇÃO**
  - Versões fixas de todas as tecnologias
  - Regras de compatibilidade
  - Processo de atualização
  - Mapeamento por área do projeto
  - **CONSULTE ANTES DE ATUALIZAR QUALQUER DEPENDÊNCIA**

- **`docs/PROMPT-SYSTEM.md`** - Referência rápida para prompts
  - Contexto rápido do projeto
  - Arquitetura resumida
  - Exemplos práticos
  - Regras importantes

**IMPORTANTE:** Sempre consulte estas documentações antes de fazer mudanças significativas no projeto. Elas contêm informações precisas sobre:
- Estrutura híbrida (App Router + Pages Router)
- Componentes e suas responsabilidades
- Fluxos de autenticação e dados
- Padrões de código estabelecidos
- Convenções de nomenclatura
- **Versões exatas das tecnologias (TECHNOLOGY-STACK.md)**

## Referências Rápidas

- **Arquitetura:** Ver `docs/TECHNICAL-DOCUMENTATION.md` seção 2
- **Componentes:** Ver `docs/TECHNICAL-DOCUMENTATION.md` seção 5
- **Autenticação:** Ver `docs/TECHNICAL-DOCUMENTATION.md` seção 7
- **Banco de Dados:** Ver `docs/TECHNICAL-DOCUMENTATION.md` seção 8
- **Design System:** Ver `docs/TECHNICAL-DOCUMENTATION.md` seção 10