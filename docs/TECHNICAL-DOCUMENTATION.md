# 📚 DOCUMENTAÇÃO TÉCNICA COMPLETA - SaaS Market Cap (SMC)

**Versão:** 1.1.0  
**Última Atualização:** Janeiro 2025  
**Branch Ativa:** `codex-nightly`

**Changelog:**
- **v1.1.0 (Janeiro 2025):** Validação robusta de email, bloqueio de emails temporários, correções no login tradicional
- **v1.0.0 (Janeiro 2025):** Documentação inicial completa

---

## 📋 ÍNDICE

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Componentes e Responsabilidades](#5-componentes-e-responsabilidades)
6. [Fluxos de Dados e Interações](#6-fluxos-de-dados-e-interações)
7. [Autenticação e Autorização](#7-autenticação-e-autorização)
8. [Banco de Dados](#8-banco-de-dados)
9. [APIs e Rotas](#9-apis-e-rotas)
10. [Design System](#10-design-system)
11. [Padrões de Código](#11-padrões-de-código)
12. [Deploy e Infraestrutura](#12-deploy-e-infraestrutura)
13. [Scripts e Automações](#13-scripts-e-automações)

> **📦 Para versões exatas e regras de atualização:** Consulte `docs/TECHNOLOGY-STACK.md`  
> **🏗️ Para análise de arquitetura frontend/backend:** Consulte `docs/ARQUITETURA-FRONTEND-BACKEND.md`  
> **📋 Para convenções de código e onde colocar código novo:** Consulte `docs/CONVENCOES-CODIGO.md`

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Objetivo
SaaS Market Cap (SMC) é uma plataforma Next.js voltada para aquisição e venda de ativos digitais (SaaS, marketplaces, newsletters). A plataforma conecta investidores e founders através de um marketplace público, ferramentas de valuation, blog editorial e áreas autenticadas para gestão de transações.

### 1.2 Público-Alvo
- **Investidores:** Buscam oportunidades de aquisição de ativos digitais
- **Founders:** Desejam vender seus SaaS, marketplaces ou newsletters
- **Operadores:** Profissionais que gerenciam portfólios de ativos digitais

### 1.3 Funcionalidades Principais
1. **Feed Público de Ofertas** (`/feed`) - Listagem filtrada de oportunidades
2. **Marketplace** (`/marketplace`) - Visualização pública de ativos
3. **Blog Editorial** (`/blog`) - Conteúdo SEO sobre M&A digital
4. **Dashboard Privado** (`/dashboard`) - Área autenticada para gestão
5. **Wizard de Listagem** (`/wizard`) - Ferramenta para cadastrar ativos
6. **Calculadora de Valuation** (`/calculator`) - Estimativa de valor de SaaS
7. **Autenticação Google OAuth** - Login via NextAuth

---

## 2. ARQUITETURA DO SISTEMA

### 2.1 Arquitetura Híbrida Next.js

O projeto utiliza uma **arquitetura híbrida** combinando:

- **App Router** (`/app`) - Para páginas de marketing e blog
- **Pages Router** (`/pages`) - Para áreas autenticadas e APIs

#### 2.1.1 App Router (`/app`)
```
app/
├── (marketing)/          # Route Group - Marketing público
│   ├── _components/      # Componentes compartilhados do marketing
│   ├── blog/             # Blog com SSG
│   ├── calculator/      # Calculadora de valuation
│   ├── faq/              # FAQ interativo
│   ├── pricing/          # Página de planos
│   ├── recursos/         # Recursos disponíveis
│   ├── suporte/          # Página de suporte
│   ├── legal/            # Páginas legais (termos, privacidade, cookies)
│   └── page.tsx          # Homepage marketing
└── sitemap.ts            # Sitemap dinâmico
```

**Características:**
- TypeScript por padrão
- Server Components quando possível
- SSG (Static Site Generation) para blog
- SEO otimizado com metadata

#### 2.1.2 Pages Router (`/pages`)
```
pages/
├── _app.js               # Wrapper global com SessionProvider
├── api/                  # API Routes
│   └── auth/            # NextAuth handlers
├── auth/                 # Páginas de autenticação
├── dashboard/            # Área autenticada
├── feed.jsx              # Feed público
├── marketplace.jsx       # Marketplace público
├── offers/[slug].jsx     # Página de oferta individual
├── profile.jsx           # Perfil do usuário
└── wizard.jsx            # Wizard de listagem
```

**Características:**
- JavaScript/JSX por padrão
- SSR (Server-Side Rendering) para áreas protegidas
- API Routes para backend
- Middleware de autenticação

### 2.2 Fluxo de Requisição

```
1. Requisição HTTP
   ↓
2. Middleware (middleware.js)
   ├─ Rotas protegidas → Verifica autenticação
   └─ Rotas públicas → Passa direto
   ↓
3. Routing
   ├─ App Router → Server Components → Renderização
   └─ Pages Router → getServerSideProps/getStaticProps → Renderização
   ↓
4. Componentes
   ├─ Server Components → Renderização no servidor
   └─ Client Components ('use client') → Hidratação no cliente
   ↓
5. Resposta HTML/JSON
```

### 2.3 Camadas da Aplicação

```
┌─────────────────────────────────────┐
│   Presentation Layer (React)        │
│   - Components                      │
│   - Pages                           │
│   - Client-side state (hooks)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   API Layer (Next.js API Routes)   │
│   - /api/auth/*                    │
│   - /api/favorites/*               │
│   - Server-side logic              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Service Layer (lib/services/)    │
│   - Business logic                 │
│   - Data transformation            │
│   - External API calls             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Data Layer (Prisma)              │
│   - Database queries                │
│   - Schema definitions              │
│   - Migrations                      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Database (PostgreSQL/Supabase)   │
│   - User data                       │
│   - Assets                          │
│   - Offers                          │
│   - Transactions                    │
└─────────────────────────────────────┘
```

---

## 3. STACK TECNOLÓGICO

> **⚠️ IMPORTANTE:** Para versões exatas e regras de atualização, consulte `docs/TECHNOLOGY-STACK.md`

### 3.1 Core Framework

#### Next.js 14.2.0
- **Versão:** 14.2.0 (FIXA - Não alterar sem consenso)
- **Uso:** Framework React com SSR/SSG
- **Configuração:** `next.config.mjs`
- **Features Utilizadas:**
  - App Router (parcial)
  - Pages Router (principal)
  - API Routes
  - Image Optimization
  - MDX Support
  - Static Site Generation
  - Server-Side Rendering

#### React 18.3.1
- **Versão:** 18.3.1 (FIXA - Não alterar sem consenso)
- **Uso:** Biblioteca UI
- **Features:**
  - Server Components (App Router)
  - Client Components ('use client')
  - Hooks (useState, useEffect, etc.)
  - Context API (SessionProvider)

#### TypeScript 5.4.2
- **Versão:** 5.4.2 (devDependency)
- **Uso:** Tipagem estática
- **Configuração:** `tsconfig.json`

### 3.2 Autenticação

#### NextAuth 4.24.13
- **Versão:** 4.24.13 (FIXA - Não alterar sem consenso)
- **Uso:** Autenticação e gerenciamento de sessão
- **Configuração:** `pages/api/auth/[...nextauth].ts`
- **Providers:**
  - Google OAuth (`GoogleProvider`)
  - Credentials (`CredentialsProvider`)
- **Adapter:** PrismaAdapter (`@next-auth/prisma-adapter` ^1.0.7)
- **Session Strategy:** JWT
- **Callbacks:**
  - `jwt`: Injeta `id` e `role` no token
  - `session`: Expõe `id` e `role` na sessão

#### bcryptjs 3.0.3
- **Versão:** 3.0.3
- **Uso:** Hash de senhas (Credentials Provider)

### 3.3 Banco de Dados

#### Prisma 6.19.0
- **Versão:** 6.19.0 (FIXA - Não alterar sem consenso)
- **Uso:** ORM e gerenciamento de schema
- **Provider:** PostgreSQL
- **Schema:** `prisma/schema.prisma`
- **Models:**
  - User (NextAuth)
  - Account (NextAuth)
  - Session (NextAuth)
  - VerificationToken (NextAuth)
  - Profile (custom)
  - SaaSAsset (custom)
  - Offer (custom)
  - Transaction (custom)
  - Favorite (custom)

#### PostgreSQL (Supabase)
- **Provider:** Supabase PostgreSQL
- **Connection:** Via `DATABASE_URL`
- **Features:**
  - Connection Pooling (produção)
  - Direct Connection (desenvolvimento)

### 3.4 Estilização

#### Tailwind CSS 3.4.1
- **Versão:** 3.4.1 (FIXA - Não alterar sem consenso)
- **Uso:** Framework CSS utility-first
- **Configuração:** `tailwind.config.js`
- **Features:**
  - Dark mode (class-based)
  - Custom colors (shadcn/ui)
  - Custom animations
  - Responsive breakpoints

#### PostCSS 8.5.6 + Autoprefixer 10.4.22
- **Versão:** PostCSS 8.5.6, Autoprefixer 10.4.22
- **Uso:** Processamento CSS
- **Configuração:** `postcss.config.js`

#### Utilitários Tailwind
- **tailwindcss-animate:** ^1.0.7 - Animações Tailwind
- **tailwind-merge:** ^3.4.0 - Merge inteligente de classes
- **class-variance-authority:** ^0.7.1 - Variantes de componentes
- **clsx:** ^2.1.1 - Concatenação condicional de classes

#### shadcn/ui
- **Uso:** Componentes UI baseados em Radix UI
- **Configuração:** `components.json`
- **Versões Radix UI:**
  - @radix-ui/react-accordion: ^1.2.12
  - @radix-ui/react-dropdown-menu: ^2.1.16
  - @radix-ui/react-label: ^2.1.8
  - @radix-ui/react-popover: ^1.1.15
  - @radix-ui/react-select: ^2.2.6
  - @radix-ui/react-separator: ^1.1.8
  - @radix-ui/react-slot: ^1.2.4
  - @radix-ui/react-tabs: ^1.1.13
  - @radix-ui/react-toast: ^1.2.15
- **Componentes shadcn:**
  - Button (`components/ui/button.tsx`)
  - Card (`components/ui/card.tsx`)
  - Badge (`components/ui/badge.tsx`)
  - Input (`components/ui/input.tsx`)
  - Dialog (`components/ui/dialog.tsx`)
  - Table (`components/ui/table.tsx`)
  - Accordion (`components/ui/accordion.tsx`)
  - Select (`components/ui/select.tsx`)
  - Tabs (`components/ui/tabs.tsx`)
  - Label (`components/ui/label.tsx`)
  - Separator (`components/ui/separator.tsx`)
  - Skeleton (`components/ui/skeleton.tsx`)

#### Framer Motion 12.23.24
- **Versão:** 12.23.24 (FIXA - Não alterar sem consenso)
- **Uso:** Animações e transições
- **Componentes:**
  - `motion.div`
  - `motion.section`
  - Variants para animações complexas

#### Lucide React 0.554.0
- **Versão:** 0.554.0
- **Uso:** Ícones SVG
- **Padrão:** Importação nomeada (`import { Icon } from 'lucide-react'`)

#### @phosphor-icons/react 2.1.10
- **Versão:** 2.1.10 (Legacy - considerar migrar para Lucide)
- **Uso:** Ícones alternativos

### 3.5 Processamento de Conteúdo

#### MDX (@next/mdx)
- **Versão:** 16.0.3
- **Uso:** Markdown com componentes React
- **Configuração:** `next.config.mjs`
- **Plugins:**
  - `remark-gfm` ^4.0.1 - GitHub Flavored Markdown
  - `rehype-slug` ^6.0.0 - IDs automáticos em headings

#### react-markdown 10.1.0
- **Versão:** 10.1.0
- **Uso:** Renderização de Markdown no cliente

#### gray-matter 4.0.3
- **Versão:** 4.0.3
- **Uso:** Parsing de frontmatter em arquivos MDX

### 3.6 Automação e Scripts

#### OpenAI SDK 6.9.1
- **Versão:** 6.9.1
- **Uso:** Geração automática de conteúdo para blog
- **Scripts:**
  - `scripts/generateDailyPost.js` - Gera posts diários
  - `scripts/scheduleGeneratePost.js` - Agendamento via cron

#### node-cron 4.2.1
- **Versão:** 4.2.1
- **Uso:** Agendamento de tarefas (geração de posts)

#### nodemailer 7.0.10
- **Versão:** 7.0.10
- **Uso:** Envio de emails
- **Arquivo:** `lib/email.ts`

### 3.7 Deploy e Infraestrutura

#### Vercel
- **Plataforma:** Vercel
- **CLI:** vercel ^48.10.3
- **Speed Insights:** @vercel/speed-insights ^1.2.0
- **Configuração:** `vercel.json`
- **Build Command:** `npm run vercel-build`
- **Environment Variables:**
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `OPENAI_API_KEY` (opcional)

### 3.8 Desenvolvimento (devDependencies)

- **@types/node:** 20.11.17
- **@types/react:** 18.2.43
- **@types/react-dom:** 18.2.17
- **@types/nodemailer:** ^7.0.4
- **eslint:** 8.57.0
- **eslint-config-next:** 14.2.0

---

### ⚠️ REGRAS DE COMPATIBILIDADE

**IMPORTANTE:** Consulte `docs/TECHNOLOGY-STACK.md` para:
- Versões exatas de todas as tecnologias
- Regras de compatibilidade
- Processo de atualização
- Mapeamento por área do projeto

**Não atualize versões principais sem:**
1. Verificar breaking changes
2. Testar em branch separada
3. Atualizar documentação
4. Consenso da equipe

---

## 4. ESTRUTURA DE PASTAS

> **📖 Para análise detalhada sobre separação frontend/backend e recomendações de organização:**  
> Consulte [`docs/ARQUITETURA-FRONTEND-BACKEND.md`](./ARQUITETURA-FRONTEND-BACKEND.md)

### 4.1 Estrutura Completa

```
saas-market-cap/
├── app/                          # App Router (Next.js 14+)
│   └── (marketing)/              # Route Group - Marketing
│       ├── _components/          # Componentes compartilhados
│       │   ├── MarketingPageLayout.tsx
│       │   ├── marketing-home-content.tsx
│       │   ├── footer.tsx
│       │   └── structured-data.tsx
│       ├── blog/                 # Blog (SSG)
│       │   ├── [slug]/           # Post individual
│       │   ├── authors/          # Páginas de autores
│       │   └── categories/       # Páginas de categorias
│       ├── calculator/            # Calculadora de valuation
│       ├── faq/                   # FAQ
│       ├── pricing/               # Planos e preços
│       ├── recursos/              # Recursos disponíveis
│       ├── suporte/               # Suporte
│       ├── legal/                 # Páginas legais
│       ├── layout.tsx             # Layout do marketing
│       └── page.tsx               # Homepage
│
├── pages/                        # Pages Router (Next.js tradicional)
│   ├── _app.js                   # Wrapper global
│   ├── api/                      # API Routes
│   │   └── auth/
│   │       └── [...nextauth].ts  # NextAuth handler
│   ├── auth/                     # Páginas de autenticação
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── dashboard/                # Dashboard autenticado
│   │   └── index.jsx
│   ├── feed.jsx                  # Feed público
│   ├── marketplace.jsx           # Marketplace público
│   ├── offers/                   # Ofertas
│   │   └── [slug].jsx
│   ├── profile.jsx               # Perfil do usuário
│   └── wizard.jsx                 # Wizard de listagem
│
├── components/                    # Componentes React
│   ├── ui/                       # Componentes UI (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── marketing/                # Componentes de marketing
│   │   ├── GridBackground.tsx
│   │   ├── Marquee.tsx
│   │   ├── FeatureCards.tsx
│   │   └── HowItWorks.tsx
│   ├── blog/                     # Componentes do blog
│   │   ├── BlogCard.tsx
│   │   ├── BlogPost.tsx
│   │   └── ...
│   ├── Navbar.jsx                # Navbar global
│   ├── Layout.jsx                # Layout wrapper
│   ├── OfferCard.jsx             # Card de oferta
│   ├── AssetCard.jsx              # Card de ativo
│   └── RegisterWizard.jsx         # Wizard de registro
│
├── lib/                          # Utilitários e serviços
│   ├── services/                 # Camada de serviços
│   │   ├── assets.ts
│   │   ├── offers.ts
│   │   ├── profiles.ts
│   │   └── dashboard.ts
│   ├── prisma.ts                  # Cliente Prisma
│   ├── blog.ts                    # Utilitários do blog
│   ├── blogPosts.js               # Dados mock do blog
│   ├── offers.js                  # Dados mock de ofertas
│   ├── profiles.js                # Helpers de perfis
│   ├── utils.ts                   # Utilitários gerais (cn, etc.)
│   └── site-config.ts             # Configurações do site
│
├── styles/                       # Estilos globais
│   └── globals.css                # CSS global + Tailwind
│
├── prisma/                       # Prisma
│   ├── schema.prisma              # Schema do banco
│   └── migrations/                # Migrations
│
├── content/                      # Conteúdo estático
│   ├── blog/                      # Posts MDX
│   └── authors/                    # Dados de autores
│
├── public/                       # Arquivos estáticos
│   ├── images/                    # Imagens
│   └── blog-images/              # Imagens do blog
│
├── scripts/                      # Scripts Node.js
│   ├── generateDailyPost.js       # Geração de posts
│   ├── scheduleGeneratePost.js    # Agendamento
│   └── postinstall-safe.js        # Post-install seguro
│
├── docs/                         # Documentação
│   ├── TECHNICAL-DOCUMENTATION.md  # Este arquivo
│   └── ...
│
├── middleware.js                  # Middleware Next.js
├── next.config.mjs                # Config Next.js
├── tailwind.config.js             # Config Tailwind
├── components.json                # Config shadcn/ui
├── package.json                   # Dependências
└── vercel.json                    # Config Vercel
```

### 4.2 Convenções de Nomenclatura

#### Arquivos e Pastas
- **Componentes:** PascalCase (`Button.tsx`, `OfferCard.jsx`)
- **Utilitários:** camelCase (`blog.ts`, `utils.ts`)
- **Páginas:** kebab-case (`[slug].jsx`, `page.tsx`)
- **Rotas API:** kebab-case (`[...nextauth].ts`)

#### Componentes React
- **Server Components:** Sem 'use client', TypeScript
- **Client Components:** Com 'use client', podem ser JSX ou TSX
- **Hooks:** Prefixo `use` (`useFavorites.js`)

#### Variáveis e Funções
- **Constantes:** UPPER_SNAKE_CASE (`DATABASE_URL`)
- **Funções:** camelCase (`getServerSideProps`)
- **Componentes:** PascalCase (`MarketingPageLayout`)

---

## 5. COMPONENTES E RESPONSABILIDADES

### 5.1 Componentes de Layout

#### `components/Layout.jsx`
- **Tipo:** Client Component
- **Uso:** Wrapper global para páginas do Pages Router
- **Props:** `children`
- **Funcionalidades:**
  - Renderiza `Navbar`
  - Aplica estilos globais
  - Gerencia estado de autenticação

#### `components/Navbar.jsx`
- **Tipo:** Client Component
- **Uso:** Barra de navegação global
- **Funcionalidades:**
  - Exibe avatar/nome do usuário logado
  - Botão de logout
  - CTA de login para não autenticados
  - Links de navegação

#### `app/(marketing)/_components/MarketingPageLayout.tsx`
- **Tipo:** Client Component
- **Uso:** Layout compartilhado para páginas de marketing
- **Props:**
  - `children`: Conteúdo da página
  - `title`: Título do hero (opcional)
  - `description`: Descrição do hero (opcional)
  - `showHero`: Exibir hero section (boolean)
- **Funcionalidades:**
  - Navbar sticky com backdrop blur
  - Hero section com GridBackground
  - CTA section unificada
  - Footer integrado

### 5.2 Componentes de Marketing

#### `components/marketing/GridBackground.tsx`
- **Tipo:** Client Component
- **Uso:** Fundo animado com grid
- **Tecnologia:** Canvas API + requestAnimationFrame
- **Props:** `className` (opcional)
- **Funcionalidades:**
  - Grid animado com linhas e pontos
  - Cores configuráveis (indigo/purple)
  - Opacidade ajustável

#### `components/marketing/Marquee.tsx`
- **Tipo:** Client Component
- **Uso:** Efeito marquee para logos/textos
- **Tecnologia:** Framer Motion
- **Props:**
  - `items`: Array de strings
  - `speed`: Velocidade (número)
  - `direction`: 'left' | 'right'
  - `className`: Classes CSS
- **Funcionalidades:**
  - Animação infinita
  - Gradientes nas bordas
  - Duplicação automática de items

#### `components/marketing/FeatureCards.tsx`
- **Tipo:** Client Component
- **Uso:** Grid de features (Bento Grid)
- **Tecnologia:** Framer Motion
- **Props:**
  - `features`: Array de objetos Feature
  - `className`: Classes CSS
- **Estrutura Feature:**
  ```typescript
  {
    title: string;
    description: string;
    icon?: React.ComponentType;
    image?: string;
  }
  ```
- **Funcionalidades:**
  - Layout responsivo (3 colunas desktop)
  - Animações stagger
  - Hover effects
  - Gradientes por card

#### `components/marketing/HowItWorks.tsx`
- **Tipo:** Client Component
- **Uso:** Timeline de "Como funciona"
- **Tecnologia:** Framer Motion
- **Props:**
  - `steps`: Array de objetos Step
  - `iconMap`: Record<string, LucideIcon>
  - `className`: Classes CSS
- **Funcionalidades:**
  - Timeline vertical (desktop)
  - Alternância left/right
  - Animações de entrada
  - Ícones animados

### 5.3 Componentes de UI (shadcn/ui)

#### `components/ui/button.tsx`
- **Variantes:** default, destructive, outline, secondary, ghost, link
- **Tamanhos:** default, sm, lg, icon
- **Uso:** Botões padronizados

#### `components/ui/card.tsx`
- **Subcomponentes:** CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Uso:** Cards de conteúdo

#### `components/ui/badge.tsx`
- **Variantes:** default, secondary, destructive, outline
- **Uso:** Badges e tags

#### `components/ui/input.tsx`
- **Uso:** Inputs de formulário

#### `components/ui/dialog.tsx`
- **Subcomponentes:** DialogTrigger, DialogContent, DialogHeader, DialogFooter
- **Uso:** Modais e diálogos

### 5.4 Componentes de Negócio

#### `components/OfferCard.jsx`
- **Tipo:** Client Component
- **Uso:** Card de oferta no feed
- **Props:**
  - `offer`: Objeto de oferta
  - `onFavorite`: Callback de favoritar
  - `isFavorite`: Boolean
- **Funcionalidades:**
  - Exibe informações da oferta
  - Botão de favoritar
  - Link para detalhes
  - Badges de status

#### `components/AssetCard.jsx`
- **Tipo:** Client Component
- **Uso:** Card de ativo SaaS
- **Props:** `asset` (objeto de ativo)
- **Funcionalidades:**
  - Métricas (MRR, ARR, Churn)
  - Categoria
  - Link para detalhes

#### `components/RegisterWizard.jsx`
- **Tipo:** Client Component
- **Uso:** Wizard de registro de ativo
- **Props:** Nenhuma (usa contexto interno)
- **Funcionalidades:**
  - 9 etapas de cadastro
  - Validação de campos
  - Progresso visual
  - Submissão final

### 5.5 Componentes do Blog

#### `components/blog/BlogCard.tsx`
- **Tipo:** Server Component
- **Uso:** Card de post no blog
- **Props:** `post` (objeto de post)

#### `components/blog/BlogPost.tsx`
- **Tipo:** Server Component
- **Uso:** Renderização completa de post
- **Props:**
  - `title`, `date`, `author`, `content`
  - `category`, `tags` (opcionais)

#### `components/blog/Breadcrumbs.tsx`
- **Tipo:** Server Component
- **Uso:** Breadcrumbs de navegação
- **Props:** `items` (array de {label, href})

---

## 6. FLUXOS DE DADOS E INTERAÇÕES

### 6.1 Fluxo de Autenticação

```
1. Usuário acessa rota protegida (/dashboard)
   ↓
2. Middleware verifica token JWT
   ↓
3. Se não autenticado:
   ├─ Redireciona para /auth/login
   └─ Salva callbackUrl
   ↓
4. Usuário clica em "Entrar com Google"
   ↓
5. NextAuth redireciona para Google OAuth
   ↓
6. Google retorna com código de autorização
   ↓
7. NextAuth troca código por tokens
   ↓
8. Callback jwt() executa:
   ├─ Busca/ cria User no Prisma
   ├─ Busca Profile (ou cria com role USER)
   └─ Injeta id e role no token
   ↓
9. Callback session() executa:
   ├─ Expõe id e role na sessão
   └─ Retorna sessão completa
   ↓
10. Redireciona para callbackUrl ou /dashboard
```

### 6.2 Fluxo de Feed de Ofertas

```
1. Usuário acessa /feed
   ↓
2. Página renderiza (SSR)
   ├─ Busca ofertas do Prisma (ou lib/offers.js mock)
   └─ Aplica filtros iniciais (query params)
   ↓
3. Cliente interage:
   ├─ Filtros (categoria, preço, MRR)
   ├─ Ordenação (preço, data)
   ├─ Busca (texto livre)
   └─ Favoritar (se autenticado)
   ↓
4. Estado local atualiza:
   ├─ Filtros aplicados
   ├─ Ofertas filtradas
   └─ Query params sincronizados
   ↓
5. Favoritar:
   ├─ POST /api/favorites/[offerId]
   ├─ Prisma cria Favorite
   └─ UI atualiza (otimistic update)
   ↓
6. Comparar:
   ├─ Adiciona ao array de comparação
   └─ Abre modal de comparação
```

### 6.3 Fluxo de Wizard de Listagem

```
1. Usuário autenticado acessa /wizard
   ↓
2. RegisterWizard renderiza etapa 1
   ↓
3. Usuário preenche campos:
   ├─ Validação em tempo real
   ├─ Progresso atualizado
   └─ Navegação entre etapas
   ↓
4. Etapa 9 (revisão):
   ├─ Exibe todos os dados
   └─ Botão "Publicar"
   ↓
5. Submissão:
   ├─ Validação final
   ├─ POST para API (futuro)
   └─ Prisma cria SaaSAsset + Offer
   ↓
6. Redireciona para /dashboard
```

### 6.4 Fluxo de Blog (SSG)

```
1. Build time (npm run build)
   ↓
2. getStaticPaths() executa:
   ├─ Lê arquivos MDX de content/blog/
   ├─ Gera slugs
   └─ Retorna paths
   ↓
3. getStaticProps() executa para cada slug:
   ├─ Lê arquivo MDX
   ├─ Parse frontmatter (gray-matter)
   ├─ Processa Markdown
   └─ Retorna props
   ↓
4. Página estática gerada
   ↓
5. Runtime:
   ├─ HTML estático servido
   └─ Hidratação React no cliente
```

### 6.5 Fluxo de Geração Automática de Posts

```
1. Cron job executa (node-cron)
   ↓
2. scheduleGeneratePost.js chama generateDailyPost.js
   ↓
3. generateDailyPost.js:
   ├─ Gera briefing via OpenAI
   ├─ Gera artigo completo
   ├─ Otimiza para SEO
   ├─ Gera imagem via DALL·E
   └─ Salva em content/blog/
   ↓
4. Próximo build inclui novo post
```

---

## 7. AUTENTICAÇÃO E AUTORIZAÇÃO

### 7.1 NextAuth Configuration

**Arquivo:** `pages/api/auth/[...nextauth].ts`

#### Providers Configurados

1. **Google OAuth**
   ```typescript
   GoogleProvider({
     clientId: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET
   })
   ```

2. **Credentials** (Email/Password)
   ```typescript
   CredentialsProvider({
     authorize: async (credentials) => {
       // Valida credenciais
       // Busca usuário no Prisma
       // Verifica se email foi verificado
       // Valida senha com bcrypt
       // Retorna user object compatível com NextAuth
     }
   })
   ```
   
   **Validações Implementadas:**
   - Validação de formato de email
   - Verificação de email verificado (`emailVerified`)
   - Validação de senha com bcrypt
   - Tratamento de erros robusto
   - Mensagens de erro traduzidas para português

#### Callbacks

**jwt()**
```typescript
async jwt({ token, user }) {
  if (user) {
    token.sub = user.id;
    token.role = user.role ?? 'user';
  }
  return token;
}
```

**session()**
```typescript
async session({ session, token }) {
  if (session.user && token?.sub) {
    session.user.id = token.sub;
    session.user.role = token.role ?? 'user';
  }
  return session;
}
```

### 7.2 Middleware de Proteção

**Arquivo:** `middleware.js`

```javascript
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
  pages: {
    signIn: '/auth/login'
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/offers/:path*']
};
```

**Rotas Protegidas:**
- `/dashboard/**` - Dashboard autenticado
- `/offers/**` - Ofertas (futuro)

**Rotas Públicas:**
- `/` - Homepage
- `/feed` - Feed público
- `/blog/**` - Blog
- `/marketplace` - Marketplace público
- `/auth/login` - Login
- `/auth/register` - Registro

### 7.3 Verificação de Sessão em Páginas

**Pages Router (SSR):**
```javascript
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    };
  }
  
  return { props: { session } };
}
```

**App Router (Server Components):**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }
  
  return <div>Conteúdo protegido</div>;
}
```

### 7.4 Validação de Email no Registro

**Arquivo:** `lib/api/validators.ts`

#### Validação Robusta de Email

A plataforma implementa validação rigorosa de email para prevenir cadastros com emails temporários ou fake:

**Funcionalidades:**
1. **Validação de Formato RFC 5322**
   - Regex rigoroso para validação de formato
   - Validação de comprimento (máximo 254 caracteres)
   - Validação de estrutura (local part e domain)
   - Verificação de caracteres inválidos

2. **Bloqueio de Domínios Temporários**
   - Lista com 70+ domínios temporários conhecidos
   - Bloqueia serviços como:
     - 10minutemail, GuerrillaMail, Mailinator
     - TempMail, TrashMail, YopMail
     - E outros serviços temporários populares
   - Bloqueia domínios genéricos suspeitos (example.com, test.com, etc.)

3. **Validação em Tempo Real (Frontend)**
   - Feedback visual imediato ao digitar
   - Mensagens de erro específicas
   - Indicadores visuais (✓ para válido, ⚠ para erro)
   - Validação no blur e onChange

**Uso:**
```typescript
import { validateEmail, isValidEmail } from '@/lib/api/validators';

// Validação com mensagens de erro
const validation = validateEmail(email);
if (!validation.valid) {
  console.error(validation.error);
}

// Validação simples (boolean)
if (isValidEmail(email)) {
  // Email válido
}
```

**Mensagens de Erro:**
- "E-mails temporários não são permitidos. Use um e-mail pessoal ou corporativo."
- "Formato de e-mail inválido"
- "Domínio do e-mail inválido"
- "E-mail muito longo (máximo 254 caracteres)"

**Página de Registro:**
- Validação em tempo real no campo de email
- Feedback visual imediato
- Prevenção de submissão com email inválido
- Mensagens de erro claras e específicas

### 7.5 Correções no Login Tradicional

**Melhorias Implementadas (Janeiro 2025):**

1. **Tratamento de Erros Robusto**
   - Retorna `null` em vez de lançar erros genéricos
   - Propaga apenas erros específicos (ex: email não verificado)
   - Logs detalhados para debug

2. **Validação de Email**
   - Verifica se email é string válida antes de buscar no banco
   - Verifica se usuário encontrado tem email (não pode ser null)
   - Validação de estrutura antes da query

3. **Mensagens de Erro Traduzidas**
   - Mensagens em português na página de login
   - Mapeamento de códigos de erro para mensagens amigáveis
   - Feedback visual claro para o usuário

4. **Compatibilidade com NextAuth**
   - Objeto de retorno compatível com NextAuth
   - Inclui `id`, `email`, `name` e `image`
   - Funciona corretamente com JWT strategy

### 7.6 Roles e Permissões

**Enum Role (Prisma):**
```prisma
enum Role {
  USER
  ADMIN
}
```

**Uso:**
- `USER`: Usuário padrão (pode criar ofertas, favoritar)
- `ADMIN`: Administrador (acesso total, futuro)

**Verificação:**
```typescript
if (session.user.role === 'ADMIN') {
  // Acesso admin
}
```

---

## 8. BANCO DE DADOS

### 8.1 Schema Prisma

**Arquivo:** `prisma/schema.prisma`

#### Models Principais

**User** (NextAuth)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  
  accounts Account[]
  sessions Session[]
  profile  Profile?
  assets   SaaSAsset[]
  offers   Offer[]
  favorites Favorite[]
}
```

**Profile** (Custom)
```prisma
model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  role      Role     @default(USER)
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**SaaSAsset** (Custom)
```prisma
model SaaSAsset {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  category    String
  mrr         Decimal?
  arr         Decimal?
  churnRate   Float?
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  offers      Offer[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category])
  @@index([ownerId])
}
```

**Offer** (Custom)
```prisma
model Offer {
  id        String      @id @default(cuid())
  assetId   String
  asset     SaaSAsset   @relation(fields: [assetId], references: [id])
  sellerId  String
  seller    User        @relation(fields: [sellerId], references: [id])
  buyerId   String?
  buyer     User?       @relation(fields: [buyerId], references: [id])
  price     Decimal
  status    OfferStatus @default(ACTIVE)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  favorites Favorite[]
  transactions Transaction[]
  
  @@index([assetId])
  @@index([sellerId])
  @@index([status])
}
```

**Transaction** (Custom)
```prisma
model Transaction {
  id        String   @id @default(cuid())
  offerId   String
  offer     Offer    @relation(fields: [offerId], references: [id])
  sellerId  String
  seller    User     @relation(fields: [sellerId], references: [id])
  buyerId   String
  buyer     User     @relation(fields: [buyerId], references: [id])
  value     Decimal
  closedAt  DateTime @default(now())
  createdAt DateTime @default(now())
}
```

**Favorite** (Custom)
```prisma
model Favorite {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  offerId   String
  offer     Offer    @relation(fields: [offerId], references: [id])
  createdAt DateTime @default(now())
  
  @@unique([userId, offerId])
}
```

### 8.2 Enums

```prisma
enum Role {
  USER
  ADMIN
}

enum OfferStatus {
  ACTIVE
  UNDER_NEGOTIATION
  SOLD
  ARCHIVED
}
```

### 8.3 Relacionamentos

```
User 1:1 Profile
User 1:N SaaSAsset (owner)
User 1:N Offer (seller)
User 1:N Offer (buyer)
User 1:N Favorite
SaaSAsset 1:N Offer
Offer 1:N Transaction
Offer 1:N Favorite
```

### 8.4 Queries Comuns

**Buscar ofertas com filtros:**
```typescript
const offers = await prisma.offer.findMany({
  where: {
    status: 'ACTIVE',
    price: { gte: minPrice, lte: maxPrice },
    asset: {
      category: categoryFilter
    }
  },
  include: {
    asset: true,
    seller: { select: { name: true, email: true } },
    favorites: { where: { userId: session.user.id } }
  },
  orderBy: { createdAt: 'desc' }
});
```

**Buscar favoritos do usuário:**
```typescript
const favorites = await prisma.favorite.findMany({
  where: { userId: session.user.id },
  include: {
    offer: {
      include: { asset: true }
    }
  }
});
```

---

## 9. APIs E ROTAS

### 9.1 API Routes (Pages Router)

**Estrutura:** `pages/api/**/*.ts`

#### `/api/auth/[...nextauth]`
- **Handler:** NextAuth
- **Métodos:** GET, POST
- **Funcionalidades:**
  - Autenticação Google OAuth
  - Autenticação Credentials
  - Callbacks JWT e Session
  - Gerenciamento de sessão

#### `/api/favorites/[offerId]` (Futuro)
- **Métodos:** POST, DELETE
- **Funcionalidades:**
  - Adicionar favorito
  - Remover favorito

#### `/api/favorites` (Futuro)
- **Método:** GET
- **Funcionalidades:**
  - Listar favoritos do usuário

### 9.2 Rotas Públicas (Pages Router)

#### `/feed`
- **Tipo:** SSR
- **Funcionalidades:**
  - Feed público de ofertas
  - Filtros e busca
  - Paginação

#### `/marketplace`
- **Tipo:** SSR
- **Funcionalidades:**
  - Marketplace público
  - Grid de ativos

#### `/offers/[slug]`
- **Tipo:** SSG ou SSR
- **Funcionalidades:**
  - Página de oferta individual
  - SEO otimizado
  - JSON-LD

#### `/blog`
- **Tipo:** SSG
- **Funcionalidades:**
  - Listagem de posts
  - Filtros por categoria/tag

#### `/blog/[slug]`
- **Tipo:** SSG
- **Funcionalidades:**
  - Post individual
  - SEO otimizado
  - Breadcrumbs

### 9.3 Rotas Autenticadas (Pages Router)

#### `/dashboard`
- **Tipo:** SSR
- **Proteção:** Middleware
- **Funcionalidades:**
  - Dashboard do usuário
  - Estatísticas
  - Ofertas do usuário

#### `/profile`
- **Tipo:** SSR
- **Proteção:** getServerSideProps
- **Funcionalidades:**
  - Perfil do usuário
  - Edição de dados

#### `/wizard`
- **Tipo:** SSR
- **Proteção:** getServerSideProps
- **Funcionalidades:**
  - Wizard de listagem de ativo

### 9.4 Rotas de Marketing (App Router)

#### `/(marketing)/`
- **Tipo:** Server Component
- **Funcionalidades:**
  - Homepage marketing
  - SEO otimizado

#### `/(marketing)/pricing`
- **Tipo:** Client Component
- **Funcionalidades:**
  - Página de planos
  - Cards de preços

#### `/(marketing)/faq`
- **Tipo:** Client Component
- **Funcionalidades:**
  - FAQ interativo
  - Accordion

#### `/(marketing)/calculator`
- **Tipo:** Client Component
- **Funcionalidades:**
  - Calculadora de valuation
  - Formulário interativo

---

## 10. DESIGN SYSTEM

### 10.1 Cores (Tailwind + shadcn/ui)

**Variáveis CSS (globals.css):**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

**Cores de Marca (Legacy):**
- `smc-dark`: #050816
- `smc-surface`: #0b1224
- `smc-accent`: #22c55e

### 10.2 Tipografia

**Fontes:**
- Sistema: `system-ui, -apple-system, sans-serif`
- Monospace: `'Courier New', monospace` (código)

**Tamanhos (Tailwind):**
- `text-xs`: 0.75rem
- `text-sm`: 0.875rem
- `text-base`: 1rem
- `text-lg`: 1.125rem
- `text-xl`: 1.25rem
- `text-2xl`: 1.5rem
- `text-3xl`: 1.875rem
- `text-4xl`: 2.25rem
- `text-5xl`: 3rem

### 10.3 Espaçamento

**Sistema 4px:**
- `p-1`: 0.25rem (4px)
- `p-2`: 0.5rem (8px)
- `p-4`: 1rem (16px)
- `p-6`: 1.5rem (24px)
- `p-8`: 2rem (32px)

### 10.4 Border Radius

**Variáveis:**
- `--radius`: 0.5rem
- `rounded-sm`: calc(var(--radius) - 4px)
- `rounded-md`: calc(var(--radius) - 2px)
- `rounded-lg`: var(--radius)
- `rounded-xl`: 0.75rem
- `rounded-2xl`: 1rem
- `rounded-3xl`: 1.5rem

### 10.5 Animações

**Tailwind:**
- `animate-pulse`: Pulsação
- `animate-spin`: Rotação
- `animate-shimmer`: Efeito shimmer

**Framer Motion:**
- Variants para animações complexas
- Transições suaves
- Stagger animations

### 10.6 Breakpoints (Responsivo)

```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1400px'
}
```

**Uso:**
- Mobile-first
- `md:` prefix para desktop
- `lg:` prefix para telas grandes

---

## 11. PADRÕES DE CÓDIGO

### 11.1 Componentes React

#### Server Components (Padrão no App Router)
```typescript
// app/(marketing)/page.tsx
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

#### Client Components
```typescript
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  return <div>...</div>;
}
```

### 11.2 Hooks Customizados

**Estrutura:**
```typescript
// hooks/useFavorites.js
import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    // Fetch favorites
  }, []);
  
  const toggleFavorite = async (offerId) => {
    // Toggle logic
  };
  
  return { favorites, toggleFavorite };
}
```

### 11.3 Utilitários

**cn() - Merge de classes:**
```typescript
// lib/utils.ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

**Uso:**
```typescript
<div className={cn('base-class', condition && 'conditional-class')} />
```

### 11.4 Tratamento de Erros

**Try-Catch em APIs:**
```typescript
try {
  const result = await prisma.offer.findMany();
  return res.json(result);
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
}
```

**Error Boundaries (Futuro):**
```typescript
// components/ErrorBoundary.tsx
'use client';

export function ErrorBoundary({ children }) {
  // Error boundary logic
}
```

### 11.5 Validação

**Formulários:**
```typescript
const [errors, setErrors] = useState({});

const validate = (data) => {
  const newErrors = {};
  if (!data.name) newErrors.name = 'Nome obrigatório';
  if (data.name.length < 3) newErrors.name = 'Nome muito curto';
  return newErrors;
};
```

### 11.6 TypeScript

**Tipos Comuns:**
```typescript
// Tipos de oferta
interface Offer {
  id: string;
  assetId: string;
  sellerId: string;
  price: number;
  status: 'ACTIVE' | 'UNDER_NEGOTIATION' | 'SOLD' | 'ARCHIVED';
  createdAt: Date;
}

// Props de componente
interface OfferCardProps {
  offer: Offer;
  onFavorite?: (offerId: string) => void;
  isFavorite?: boolean;
}
```

---

## 12. DEPLOY E INFRAESTRUTURA

### 12.1 Vercel Configuration

**Arquivo:** `vercel.json`

```json
{
  "buildCommand": "npm run vercel-build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "SKIP_ENV_VALIDATION": "true"
  }
}
```

### 12.2 Build Script

**package.json:**
```json
{
  "scripts": {
    "vercel-build": "prisma generate && (prisma migrate deploy || echo 'Migrations skipped') && next build"
  }
}
```

**Fluxo:**
1. `prisma generate` - Gera Prisma Client
2. `prisma migrate deploy` - Aplica migrations (opcional)
3. `next build` - Build Next.js

### 12.3 Environment Variables

**Produção (Vercel):**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret para JWT
- `NEXTAUTH_URL` - URL da aplicação
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `OPENAI_API_KEY` - OpenAI API Key (opcional)

**Desenvolvimento (.env.local):**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### 12.4 Database Migrations

**Aplicar migrations:**
```bash
npx prisma migrate deploy
```

**Criar migration:**
```bash
npx prisma migrate dev --name migration_name
```

**Gerar Prisma Client:**
```bash
npx prisma generate
```

### 12.5 Postinstall Script

**scripts/postinstall-safe.js:**
```javascript
// Tenta gerar Prisma Client
// Se DATABASE_URL não estiver disponível, usa URL dummy
```

---

## 13. SCRIPTS E AUTOMAÇÕES

### 13.1 Geração de Posts

**scripts/generateDailyPost.js**
- **Uso:** Gera post diário para o blog
- **Dependências:** OpenAI SDK
- **Fluxo:**
  1. Gera briefing via GPT-4
  2. Gera artigo completo
  3. Otimiza para SEO
  4. Gera imagem via DALL·E
  5. Salva em `content/blog/`

**Execução:**
```bash
npm run generate:post
```

### 13.2 Agendamento de Posts

**scripts/scheduleGeneratePost.js**
- **Uso:** Agenda geração diária de posts
- **Dependências:** node-cron
- **Configuração:** Cron configurável

**Execução:**
```bash
npm run schedule:posts
```

### 13.3 Scripts de Configuração

**scripts/config-supabase.sh**
- **Uso:** Configura DATABASE_URL no Vercel
- **Funcionalidades:**
  - Solicita credenciais Supabase
  - Configura via Vercel CLI

---

## 14. CONVENÇÕES E BOAS PRÁTICAS

### 14.1 Commits

**Formato:** Conventional Commits
```
feat(marketing): adicionar página de pricing
fix(auth): corrigir redirect após login
chore(deps): atualizar dependências
docs(readme): atualizar documentação
```

### 14.2 Imports

**Ordem:**
1. React/Next.js
2. Bibliotecas externas
3. Componentes internos
4. Utilitários
5. Tipos
6. Estilos

**Exemplo:**
```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Offer } from '@/types';
```

### 14.3 Naming

- **Componentes:** PascalCase
- **Funções:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Arquivos:** kebab-case ou PascalCase (componentes)

### 14.4 Comentários

**Código:**
```typescript
// Explicação breve quando necessário
const result = complexCalculation();

/**
 * Função complexa que requer documentação
 * @param data - Dados de entrada
 * @returns Resultado processado
 */
function complexFunction(data) {
  // ...
}
```

---

## 15. PRÓXIMOS PASSOS E MELHORIAS

### 15.1 Prioridades

1. **Migração completa para App Router**
   - Migrar áreas autenticadas
   - Unificar estrutura

2. **Integração completa com Prisma**
   - Substituir mocks (`lib/offers.js`, `lib/blogPosts.js`)
   - Implementar APIs completas

3. **Testes**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright)

4. **Performance**
   - Otimização de imagens
   - Code splitting
   - Caching strategies

5. **Acessibilidade**
   - ARIA labels completos
   - Keyboard navigation
   - Screen reader support

---

## 16. CONTATOS E RECURSOS

### 16.1 Documentação Externa

- **Next.js:** https://nextjs.org/docs
- **NextAuth:** https://next-auth.js.org
- **Prisma:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Framer Motion:** https://www.framer.com/motion

### 16.2 Recursos Internos

- **AGENTS.md** - Guia para agentes AI
- **docs/overview.md** - Visão geral do projeto
- **codex-report-*.md** - Relatórios de auditoria

---

**Fim da Documentação Técnica**

*Última atualização: Janeiro 2025*

