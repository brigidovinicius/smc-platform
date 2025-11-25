# 🎨 Implementação shadcn/ui + MagicUI + Aceternity + OpenProps

**Data:** Janeiro 2025  
**Status:** 🚧 Em Progresso

---

## 📋 Visão Geral

Transformando o SMC em um "lego moderno" de componentes usando:
1. **shadcn/ui** como fundação do design system
2. **MagicUI + Aceternity** para animações e componentes especiais
3. **OpenProps** para animações CSS avançadas
4. **Taxonomy** como referência para blog/SEO

---

## ✅ Passo 1: shadcn/ui - Fundação

### Instalação Completa

```bash
# Dependências base (já instaladas)
npm install class-variance-authority clsx tailwind-merge

# Instalar OpenProps
npm install open-props

# Adicionar componentes shadcn
npx shadcn@latest add button card input dialog table badge avatar
```

### Componentes Base Necessários

- ✅ `button` - Botões padronizados
- ✅ `card` - Cards consistentes
- ✅ `input` - Inputs de formulário
- ✅ `dialog` - Modais e dialogs
- ✅ `table` - Tabelas de dados
- ✅ `badge` - Badges e tags
- ✅ `avatar` - Avatares de usuário

### Estrutura Criada

```
components/
├── ui/              # Componentes shadcn
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   └── avatar.tsx
├── layout/          # Layouts usando shadcn
│   └── AppShell.tsx # Dashboard layout
└── marketing/        # Componentes de marketing
    └── Hero.tsx     # Hero com MagicUI
```

---

## 🎯 Passo 2: MagicUI - Animações de Marketing

### Componentes Planejados

1. **Hero Animado** (`components/marketing/Hero.tsx`)
   - Animação de entrada suave
   - CTA destacado
   - Background animado

2. **Grid Background** (`components/marketing/GridBackground.tsx`)
   - Grid animado para seções
   - Efeito parallax sutil

3. **Marquee** (`components/marketing/Marquee.tsx`)
   - Logos de ferramentas SaaS
   - Scroll infinito

### Integração

- Copiar código de `magicui.design`
- Adaptar para tema do SMC
- Usar tokens do shadcn

---

## 🎨 Passo 3: Aceternity UI - Componentes Especiais

### Componentes Planejados

1. **Feature Cards Animados** (`components/marketing/FeatureCards.tsx`)
   - Cards de features com hover effects
   - Animações suaves

2. **Timeline/Steps** (`components/marketing/HowItWorks.tsx`)
   - Timeline "Como funciona o SMC"
   - Steps animados

### Integração

- Copiar código de `ui.aceternity.com`
- Adaptar conteúdo para SMC
- Manter consistência visual

---

## ⚡ Passo 4: OpenProps - Animações CSS

### Configuração

```css
/* styles/globals.css */
@import "open-props/normalize";
@import "open-props";
@import "open-props/animations";
```

### Uso

```css
.btn-glow {
  box-shadow: var(--shadow-3);
  transition: box-shadow 150ms var(--ease-out-3), transform 150ms var(--ease-out-3);
}

.btn-glow:hover {
  box-shadow: var(--shadow-5);
  transform: translateY(-1px);
}
```

---

## 📚 Passo 5: Taxonomy - Referência Blog/SEO

### Estrutura Baseada em Taxonomy

```
app/
├── (marketing)/
│   ├── blog/
│   │   ├── page.tsx          # Lista de posts
│   │   └── [slug]/
│   │       └── page.tsx      # Post individual
│   └── layout.tsx
```

### Features

- Server Components
- Metadata otimizada
- `generateStaticParams` para SSG
- Layout com sidebar (se necessário)

---

## 🚀 Roteiro de Implementação

### Fase 1: Fundação (shadcn) ✅
- [x] Instalar dependências
- [x] Configurar `components.json`
- [x] Criar `lib/utils.ts`
- [x] Adicionar variáveis CSS do shadcn
- [ ] Adicionar componentes base

### Fase 2: Layouts
- [ ] Criar `AppShell` para dashboard
- [ ] Migrar Navbar para usar shadcn
- [ ] Criar layout de marketing

### Fase 3: Componentes de Marketing
- [ ] Hero com MagicUI
- [ ] Grid Background
- [ ] Marquee de logos
- [ ] Feature Cards (Aceternity)
- [ ] Timeline/Steps (Aceternity)

### Fase 4: OpenProps
- [ ] Configurar imports
- [ ] Criar classes utilitárias
- [ ] Aplicar em componentes

### Fase 5: Blog/SEO (Taxonomy)
- [ ] Estruturar rotas de blog
- [ ] Criar componentes de post
- [ ] Otimizar metadata

### Fase 6: Migração
- [ ] Migrar componentes existentes
- [ ] Substituir componentes antigos
- [ ] Testar tudo

---

## 📝 Notas Técnicas

### Compatibilidade

- ✅ Next.js 14.2.0
- ✅ Tailwind CSS 4.1.17
- ✅ TypeScript
- ✅ App Router
- ✅ Server Components

### Path Aliases

```json
{
  "@/*": ["*"],
  "@/components": ["components"],
  "@/lib": ["lib"],
  "@/hooks": ["hooks"]
}
```

---

## 🎯 Próximos Passos

1. Adicionar componentes shadcn base
2. Criar AppShell layout
3. Integrar primeiro componente MagicUI
4. Configurar OpenProps
5. Estruturar blog baseado em Taxonomy

---

**Status:** 🚧 Implementação em andamento




