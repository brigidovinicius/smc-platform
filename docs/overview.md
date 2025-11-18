# Saas Market Cap (SMC) — Visão Geral

Documentação rápida do que foi estruturado hoje no projeto **SMC (Saas Market Cap)** executado com Next.js e NextAuth.

## Objetivo e Contexto
- Aplicação web que centraliza a experiência inicial do marketplace de ativos SaaS.
- MVP cobre autenticação com Google, shell de navegação autenticada e um fluxo guiado de cadastro (pitch wizard) em nove passos.
- Conteúdo e cópia estão em português para aderir ao público-alvo da comunidade.

## Stack e Dependências
- **Next.js 14.2 + React 18** para as páginas (`pages/`) e API routes (`pages/api`).
- **TypeScript 5.4** (com tipagens em `src/types/`) e ESLint configurado via `eslint-config-next`.
- **NextAuth 4.24** com `GoogleProvider` para SSO; `SessionProvider` controla o estado em `_app.js`.
- **@vercel/postgres** persiste perfis de usuário através de `lib/profiles.ts`, garantindo a tabela `profiles`.
- Estilos globais em `styles/globals.css` (layout responsivo, botões e cards reutilizados).

## Estrutura Atual
| Caminho | Descrição |
| --- | --- |
| `pages/_app.js` | Envolve todas as páginas com `SessionProvider`. |
| `pages/index.tsx` / `pages/home.tsx` | Home principal + alias autenticado com a mesma mensagem de boas-vindas. |
| `pages/login.tsx` | Botão único para `signIn('google')`. |
| `pages/profile.tsx` | Página protegida com `getServerSideProps`, renderiza dados do usuário logado e botão de logout. |
| `pages/wizard.tsx` | Entrada autenticada para o cadastro guiado (`RegisterWizard`). |
| `pages/api/auth/[...nextauth].ts` | Handler do NextAuth com Google OAuth, sincronização de perfis e `NEXTAUTH_SECRET`. |
| `components/Layout.jsx` | Shell simples que injeta `Navbar` e o slot de conteúdo. |
| `components/Navbar.jsx` | Navegação principal com avatar, e-mail, role e ações de login/logout. |
| `components/RegisterWizard.tsx` | Fluxo completo do pitch com validação mínima de 40 caracteres, barra de conclusão e navegação Voltar/Próximo. |
| `lib/wizardSteps.ts` | Fonte única dos nove passos do registro (Problema → Preço). |
| `lib/profiles.ts` | Repositório Postgres com criação automática da tabela `profiles`. |
| `src/types/pitch.ts` | Tipos `PitchStep` e `ListingPitch` usados para futuras integrações com backend. |

## Fluxos Principais
- **Autenticação**: `getServerSideProps` em `/home`, `/profile` e `/wizard` bloqueia anônimos e redireciona ao `/login`. No layout, `useSession` decide entre botão Entrar ou avatar + botão Sair.
- **Profile**: Mostra nome, email, papel (`role`) vindo da tabela `profiles`, imagem de perfil e permite sair via `signOut()`. Estado "Carregando sessão" cobre SSR + hydration.
- **Profiles DB**: o callback `session` do NextAuth usa `session.user.email` para buscar/criar o registro na tabela `profiles` e devolve `id`/`role` ao cliente.
- **Cadastro guiado**:
  - Passos e textos vêm de `lib/wizardSteps.ts` garantindo consistência.
  - Cada passo exige mínimo de 40 caracteres (salvo os opcionais) e guarda progresso em `progress` + `errors`.
  - Cálculo de conclusão (`useMemo`) indica % de passos válidos preenchidos.
  - UI: cards de passo com estados `active` e `completed`, textarea com highlight de erro e rodapé com botões.

## Execução Local
1. `npm install`
2. Configure as variáveis abaixo em `.env.local`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `POSTGRES_URL` (ou `DATABASE_URL`/`POSTGRES_URL_NON_POOLING`) apontando para o banco que conterá `profiles`.
3. `npm run dev` (porta padrão 3000).

Scripts adicionais: `npm run build`, `npm start` e `npm run lint`.

## Próximas Oportunidades (Backlog Sugestivo)
1. Persistir o resultado do wizard (ex.: API route `POST /api/pitches`).
2. Popular a Home com cards reais (ranking OURO/PRATA/BRONZE usando `ListingPitch.highlightTier`).
3. Adicionar testes (React Testing Library / Playwright) cobrindo autenticação condicionais e validação do wizard.
4. Internacionalização futura (`next-intl`) caso exercícios multi-idioma sejam priorizados.
