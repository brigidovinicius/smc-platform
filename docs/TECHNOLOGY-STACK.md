# 📦 STACK TECNOLÓGICO COMPLETO - SaaS Market Cap (SMC)

**Última Atualização:** Janeiro 2025  
**Fonte:** `package.json` + configurações do projeto

---

## 🔒 VERSÕES FIXAS (NÃO ALTERAR SEM CONSENSO)

Estas são as versões exatas em uso. **NÃO atualize sem discussão prévia** para evitar quebras e conflitos.

### Core Framework

| Tecnologia | Versão | Uso | Arquivo de Config |
|------------|--------|-----|-------------------|
| **Next.js** | `14.2.0` | Framework React com SSR/SSG | `next.config.mjs` |
| **React** | `18.3.1` | Biblioteca UI | - |
| **React DOM** | `18.3.1` | Renderização React | - |
| **TypeScript** | `5.4.2` | Tipagem estática | `tsconfig.json` |

**⚠️ IMPORTANTE:** Next.js 14.2.0 é estável. Não atualizar para 15.x sem migração completa.

---

### Autenticação e Sessão

| Tecnologia | Versão | Uso | Configuração |
|------------|--------|-----|--------------|
| **next-auth** | `^4.24.13` | Autenticação OAuth/Credentials | `pages/api/auth/[...nextauth].ts` |
| **@next-auth/prisma-adapter** | `^1.0.7` | Adapter Prisma para NextAuth | - |
| **bcryptjs** | `^3.0.3` | Hash de senhas | Credentials Provider |

**⚠️ IMPORTANTE:** NextAuth 4.x é estável. NextAuth 5.x (Auth.js) requer migração completa.

---

### Banco de Dados e ORM

| Tecnologia | Versão | Uso | Configuração |
|------------|--------|-----|--------------|
| **@prisma/client** | `^6.19.0` | Cliente Prisma | `lib/prisma.ts` |
| **prisma** | `^6.19.0` | CLI Prisma | `prisma/schema.prisma` |
| **@vercel/postgres** | `^0.10.0` | Driver PostgreSQL (legacy) | - |

**⚠️ IMPORTANTE:** Prisma 6.x é estável. Prisma 7.x pode ter breaking changes.

**Database:** PostgreSQL (Supabase)  
**Connection:** Via `DATABASE_URL` environment variable

---

### Estilização e UI

| Tecnologia | Versão | Uso | Configuração |
|------------|--------|-----|--------------|
| **tailwindcss** | `^3.4.1` | Framework CSS utility-first | `tailwind.config.js` |
| **autoprefixer** | `^10.4.22` | Prefixos CSS automáticos | `postcss.config.js` |
| **postcss** | `^8.5.6` | Processador CSS | `postcss.config.js` |
| **tailwindcss-animate** | `^1.0.7` | Animações Tailwind | Plugin |
| **tailwind-merge** | `^3.4.0` | Merge inteligente de classes | `lib/utils.ts` |
| **class-variance-authority** | `^0.7.1` | Variantes de componentes | shadcn/ui |
| **clsx** | `^2.1.1` | Concatenação condicional de classes | `lib/utils.ts` |

**⚠️ IMPORTANTE:** Tailwind CSS 3.4.1 é estável. Tailwind 4.x requer migração completa.

#### shadcn/ui (Componentes Baseados em Radix UI)

| Componente Radix | Versão | Componente shadcn |
|------------------|--------|-------------------|
| **@radix-ui/react-accordion** | `^1.2.12` | `accordion.tsx` |
| **@radix-ui/react-dropdown-menu** | `^2.1.16` | - |
| **@radix-ui/react-label** | `^2.1.8` | `label.tsx` |
| **@radix-ui/react-popover** | `^1.1.15` | - |
| **@radix-ui/react-select** | `^2.2.6` | `select.tsx` |
| **@radix-ui/react-separator** | `^1.1.8` | `separator.tsx` |
| **@radix-ui/react-slot** | `^1.2.4` | Base para componentes |
| **@radix-ui/react-tabs** | `^1.1.13` | `tabs.tsx` |
| **@radix-ui/react-toast** | `^1.2.15` | - |

**Configuração:** `components.json`

---

### Animações e Interações

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **framer-motion** | `^12.23.24` | Animações complexas |
| **lucide-react** | `^0.554.0` | Ícones SVG |
| **@phosphor-icons/react** | `^2.1.10` | Ícones alternativos (legacy) |

**⚠️ IMPORTANTE:** Framer Motion 12.x é estável. Versões mais novas podem ter breaking changes.

---

### Processamento de Conteúdo

| Tecnologia | Versão | Uso | Configuração |
|------------|--------|-----|--------------|
| **@next/mdx** | `^16.0.3` | Suporte MDX no Next.js | `next.config.mjs` |
| **react-markdown** | `^10.1.0` | Renderização Markdown | Componentes blog |
| **gray-matter** | `^4.0.3` | Parsing frontmatter | `lib/blog.ts` |
| **remark-gfm** | `^4.0.1` | GitHub Flavored Markdown | Plugin MDX |
| **rehype-slug** | `^6.0.0` | IDs automáticos em headings | Plugin MDX |

---

### Automação e Scripts

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **openai** | `^6.9.1` | Geração automática de conteúdo | `scripts/generateDailyPost.js` |
| **node-cron** | `^4.2.1` | Agendamento de tarefas | `scripts/scheduleGeneratePost.js` |
| **nodemailer** | `^7.0.10` | Envio de emails | `lib/email.ts` |

---

### Deploy e Infraestrutura

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **vercel** | `^48.10.3` | CLI Vercel | Deploy e configuração |
| **@vercel/speed-insights** | `^1.2.0` | Métricas de performance | - |

**Plataforma:** Vercel  
**Database:** Supabase PostgreSQL

---

### Desenvolvimento (devDependencies)

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **@types/node** | `20.11.17` | Tipos TypeScript para Node.js |
| **@types/react** | `18.2.43` | Tipos TypeScript para React |
| **@types/react-dom** | `18.2.17` | Tipos TypeScript para React DOM |
| **@types/nodemailer** | `^7.0.4` | Tipos TypeScript para Nodemailer |
| **eslint** | `8.57.0` | Linter JavaScript/TypeScript |
| **eslint-config-next** | `14.2.0` | Config ESLint para Next.js |

---

## 🎯 MAPEAMENTO POR ÁREA DO PROJETO

### App Router (`/app`)

**Tecnologias:**
- Next.js 14.2.0 (App Router)
- TypeScript 5.4.2
- React 18.3.1 (Server Components)
- Tailwind CSS 3.4.1
- shadcn/ui (componentes)
- Framer Motion 12.23.24 (animações)

**Páginas:**
- `app/(marketing)/page.tsx` - Homepage
- `app/(marketing)/pricing/page.tsx` - Planos
- `app/(marketing)/faq/page.tsx` - FAQ
- `app/(marketing)/calculator/page.tsx` - Calculadora
- `app/(marketing)/blog/**` - Blog (SSG)

---

### Pages Router (`/pages`)

**Tecnologias:**
- Next.js 14.2.0 (Pages Router)
- JavaScript/JSX (padrão)
- React 18.3.1
- Tailwind CSS 3.4.1
- NextAuth 4.24.13

**Páginas:**
- `pages/dashboard/index.jsx` - Dashboard (SSR)
- `pages/feed.jsx` - Feed público (SSR)
- `pages/profile.jsx` - Perfil (SSR)
- `pages/wizard.jsx` - Wizard (SSR)

**APIs:**
- `pages/api/auth/[...nextauth].ts` - NextAuth handler

---

### Componentes (`/components`)

**Tecnologias:**
- React 18.3.1
- TypeScript (shadcn/ui) ou JavaScript (legacy)
- Tailwind CSS 3.4.1
- Framer Motion 12.23.24 (marketing)
- Lucide React 0.554.0 (ícones)
- Radix UI (via shadcn/ui)

**Estrutura:**
- `components/ui/` - shadcn/ui (TypeScript)
- `components/marketing/` - Componentes marketing (TypeScript)
- `components/blog/` - Componentes blog (TypeScript)
- `components/*.jsx` - Componentes legacy (JavaScript)

---

### Banco de Dados (`/prisma`)

**Tecnologias:**
- Prisma 6.19.0
- PostgreSQL (Supabase)
- @next-auth/prisma-adapter 1.0.7

**Arquivos:**
- `prisma/schema.prisma` - Schema do banco
- `prisma/migrations/` - Migrations
- `lib/prisma.ts` - Cliente Prisma

---

### Estilos (`/styles`)

**Tecnologias:**
- Tailwind CSS 3.4.1
- PostCSS 8.5.6
- Autoprefixer 10.4.22
- CSS Variables (shadcn/ui)

**Arquivos:**
- `styles/globals.css` - Estilos globais + Tailwind
- `tailwind.config.js` - Configuração Tailwind
- `postcss.config.js` - Configuração PostCSS

---

## ⚠️ REGRAS DE COMPATIBILIDADE

### Não Misturar

1. **Não misturar Tailwind 3.x com Tailwind 4.x**
   - Atual: Tailwind 3.4.1
   - Se atualizar, atualizar tudo de uma vez

2. **Não misturar Next.js 14.x com Next.js 15.x**
   - Atual: Next.js 14.2.0
   - Next.js 15 requer migração completa

3. **Não misturar NextAuth 4.x com Auth.js (v5)**
   - Atual: NextAuth 4.24.13
   - Auth.js v5 requer migração completa

4. **Não misturar Prisma 6.x com Prisma 7.x**
   - Atual: Prisma 6.19.0
   - Prisma 7 pode ter breaking changes

### Compatibilidade Garantida

✅ **Next.js 14.2.0** + **React 18.3.1** + **TypeScript 5.4.2**  
✅ **NextAuth 4.24.13** + **Prisma 6.19.0** + **@next-auth/prisma-adapter 1.0.7**  
✅ **Tailwind CSS 3.4.1** + **PostCSS 8.5.6** + **Autoprefixer 10.4.22**  
✅ **Framer Motion 12.23.24** + **React 18.3.1**  
✅ **shadcn/ui** + **Radix UI** (versões atuais)

---

## 🔄 PROCESSO DE ATUALIZAÇÃO

### Antes de Atualizar Qualquer Tecnologia

1. **Verificar Breaking Changes**
   - Consultar changelog da tecnologia
   - Verificar compatibilidade com outras dependências

2. **Testar em Branch Separada**
   - Criar branch `update/[tecnologia]-[versão]`
   - Testar build: `npm run build`
   - Testar dev: `npm run dev`
   - Testar funcionalidades críticas

3. **Atualizar Documentação**
   - Atualizar este arquivo (`TECHNOLOGY-STACK.md`)
   - Atualizar `TECHNICAL-DOCUMENTATION.md`
   - Atualizar `PROMPT-SYSTEM.md`
   - Atualizar `.cursorrules` (se existir)

4. **Commit e Deploy**
   - Commit: `chore(deps): atualizar [tecnologia] para [versão]`
   - Deploy em staging primeiro
   - Testar em produção

### Checklist de Atualização

- [ ] Verificar breaking changes
- [ ] Testar build local
- [ ] Testar funcionalidades críticas
- [ ] Atualizar documentação
- [ ] Atualizar `.cursorrules`
- [ ] Deploy em staging
- [ ] Testar em produção
- [ ] Monitorar erros

---

## 📋 DEPENDÊNCIAS POR CATEGORIA

### Core (Não Alterar)
- next: 14.2.0
- react: 18.3.1
- react-dom: 18.3.1
- typescript: 5.4.2

### Autenticação (Não Alterar)
- next-auth: ^4.24.13
- @next-auth/prisma-adapter: ^1.0.7
- bcryptjs: ^3.0.3

### Banco de Dados (Não Alterar)
- @prisma/client: ^6.19.0
- prisma: ^6.19.0

### Estilização (Não Alterar)
- tailwindcss: ^3.4.1
- autoprefixer: ^10.4.22
- postcss: ^8.5.6
- tailwindcss-animate: ^1.0.7
- tailwind-merge: ^3.4.0
- class-variance-authority: ^0.7.1
- clsx: ^2.1.1

### UI Components (Atualizar com Cuidado)
- @radix-ui/* (todas as versões atuais)
- shadcn/ui (seguir versões do Radix)

### Animações (Atualizar com Cuidado)
- framer-motion: ^12.23.24
- lucide-react: ^0.554.0

### Conteúdo (Atualizar com Cuidado)
- @next/mdx: ^16.0.3
- react-markdown: ^10.1.0
- gray-matter: ^4.0.3
- remark-gfm: ^4.0.1
- rehype-slug: ^6.0.0

### Automação (Atualizar com Cuidado)
- openai: ^6.9.1
- node-cron: ^4.2.1
- nodemailer: ^7.0.10

---

## 🎯 RESUMO EXECUTIVO

**Stack Principal:**
- Next.js 14.2.0 (híbrido: App + Pages Router)
- React 18.3.1
- TypeScript 5.4.2
- NextAuth 4.24.13
- Prisma 6.19.0
- Tailwind CSS 3.4.1
- shadcn/ui (Radix UI)
- Framer Motion 12.23.24

**Regra de Ouro:**  
**NÃO atualize versões principais sem consenso e testes completos.**

---

**Última Verificação:** Janeiro 2025  
**Próxima Revisão:** Quando houver necessidade de atualização






