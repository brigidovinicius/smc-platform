# 🤖 PROMPT SYSTEM - CounterX

**Versão:** 1.0.0  
**Uso:** Referência rápida para instruções precisas sobre o projeto

---

## 📋 CONTEXTO RÁPIDO

**Projeto:** CounterX - Plataforma de M&A digital  
**Stack:** Next.js 14.2 (App Router + Pages Router), React 18, NextAuth, Prisma, PostgreSQL, Tailwind CSS  
**Branch:** `codex-nightly`  
**Deploy:** Vercel + Supabase PostgreSQL

---

## 🏗️ ARQUITETURA

### Híbrida Next.js
- **App Router** (`/app`) → Marketing e blog (TypeScript, Server Components)
- **Pages Router** (`/pages`) → Áreas autenticadas e APIs (JavaScript, SSR)

### Estrutura Principal
```
app/(marketing)/     → Páginas públicas (pricing, faq, calculator, etc.)
pages/               → Áreas autenticadas (dashboard, profile, wizard)
pages/api/           → API Routes (NextAuth, favorites)
components/          → Componentes React reutilizáveis
lib/                 → Utilitários e serviços
prisma/              → Schema e migrations
```

---

## 🔐 AUTENTICAÇÃO

**NextAuth 4.24** com:
- Google OAuth (principal)
- Credentials (email/password)
- JWT session strategy
- Middleware protege `/dashboard/**` e `/offers/**`

**Sessão expõe:**
- `session.user.id` (string)
- `session.user.role` ('USER' | 'ADMIN')
- `session.user.email`, `session.user.name`

---

## 🗄️ BANCO DE DADOS

**Prisma + PostgreSQL (Supabase)**

**Models principais:**
- `User` (NextAuth)
- `Profile` (role, bio)
- `SaaSAsset` (name, slug, mrr, arr, churnRate)
- `Offer` (assetId, sellerId, buyerId, price, status)
- `Transaction` (offerId, sellerId, buyerId, value)
- `Favorite` (userId, offerId)

**Enums:**
- `Role`: USER, ADMIN
- `OfferStatus`: ACTIVE, UNDER_NEGOTIATION, SOLD, ARCHIVED

---

## 🎨 DESIGN SYSTEM

**shadcn/ui + Tailwind CSS 3.4**

**Componentes principais:**
- `Button`, `Card`, `Badge`, `Input`, `Dialog`, `Table`, `Accordion`, `Select`, `Tabs`

**Cores:** CSS variables (HSL) + dark mode  
**Animações:** Framer Motion para interações complexas  
**Ícones:** Lucide React

---

## 📦 COMPONENTES PRINCIPAIS

### Marketing
- `MarketingPageLayout` → Layout compartilhado (navbar, hero, CTA)
- `GridBackground` → Fundo animado com grid
- `Marquee` → Efeito marquee
- `FeatureCards` → Bento grid de features
- `HowItWorks` → Timeline animada

### Negócio
- `OfferCard` → Card de oferta no feed
- `AssetCard` → Card de ativo SaaS
- `RegisterWizard` → Wizard de 9 etapas

### UI (shadcn)
- `button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `dialog.tsx`, etc.

---

## 🔄 FLUXOS PRINCIPAIS

### Autenticação
1. Usuário acessa rota protegida
2. Middleware verifica token
3. Se não autenticado → `/auth/login`
4. Google OAuth → Callback → JWT com id/role
5. Redireciona para `/dashboard` ou callbackUrl

### Feed de Ofertas
1. `/feed` renderiza (SSR)
2. Busca ofertas do Prisma (ou mock)
3. Filtros/ordenação/busca no cliente
4. Favoritar via API (`POST /api/favorites/[offerId]`)

### Blog (SSG)
1. Build time: `getStaticPaths()` gera slugs
2. `getStaticProps()` processa MDX
3. HTML estático servido
4. Hidratação React no cliente

---

## 🛠️ PADRÕES DE CÓDIGO

### Componentes
- **Server Components** (padrão App Router): Sem 'use client'
- **Client Components**: Com 'use client' quando necessário

### Imports
```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### Utilitários
- `cn()` → Merge de classes Tailwind (`lib/utils.ts`)
- `prisma` → Cliente Prisma (`lib/prisma.ts`)

### Commits
Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`

---

## 🚀 DEPLOY

**Vercel:**
- Build: `npm run vercel-build`
- Migrations: Aplicadas automaticamente (ou skip se DATABASE_URL não disponível)
- Env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Database:**
- Supabase PostgreSQL
- Connection Pooling (produção)
- Migrations via Prisma

---

## 📝 REGRAS IMPORTANTES

### ✅ FAZER
- Usar componentes shadcn/ui quando possível
- Seguir padrões de nomenclatura (PascalCase para componentes)
- Adicionar SEO em páginas públicas (metadata, JSON-LD)
- Usar Server Components quando possível
- Validar autenticação em rotas protegidas

### ❌ NÃO FAZER
- Não alterar `.env` ou credenciais
- Não quebrar autenticação NextAuth
- Não modificar schema Prisma sem migration
- Não usar CSS-in-JS (usar Tailwind)
- Não criar dependências desnecessárias

---

## 🔗 REFERÊNCIAS RÁPIDAS

**Documentação completa:** `docs/TECHNICAL-DOCUMENTATION.md`  
**Stack tecnológico:** `docs/TECHNOLOGY-STACK.md` ⭐ **CONSULTE PARA VERSÕES EXATAS**  
**Guia de agentes:** `AGENTS.md`  
**Overview:** `docs/overview.md`

**Stack:**
- Next.js: https://nextjs.org/docs
- NextAuth: https://next-auth.js.org
- Prisma: https://www.prisma.io/docs
- Tailwind: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

**⚠️ IMPORTANTE:** Antes de atualizar qualquer tecnologia, consulte `docs/TECHNOLOGY-STACK.md` para versões fixas e regras de compatibilidade.

---

## 💡 EXEMPLOS RÁPIDOS

### Criar página de marketing
```typescript
// app/(marketing)/nova-pagina/page.tsx
import { MarketingPageLayout } from '../_components/MarketingPageLayout';

export default function NovaPagina() {
  return (
    <MarketingPageLayout title="Título" description="Descrição" showHero={true}>
      <section className="py-24">
        {/* Conteúdo */}
      </section>
    </MarketingPageLayout>
  );
}
```

### Buscar ofertas no servidor
```typescript
import prisma from '@/lib/prisma';

const offers = await prisma.offer.findMany({
  where: { status: 'ACTIVE' },
  include: { asset: true, seller: true }
});
```

### Verificar autenticação
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const session = await getServerSession(authOptions);
if (!session) redirect('/auth/login');
```

---

**Última atualização:** Janeiro 2025

