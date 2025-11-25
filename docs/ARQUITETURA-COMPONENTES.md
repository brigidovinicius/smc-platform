# 🏗️ Arquitetura de Componentes - SMC Platform

**Data:** Janeiro 2025  
**Status:** ✅ Base Implementada

---

## 📦 Estrutura de Componentes

### 1. shadcn/ui (Fundação) ✅

**Localização:** `components/ui/`

**Componentes Instalados:**
- ✅ `button.tsx` - Botões padronizados
- ✅ `card.tsx` - Cards consistentes
- ✅ `badge.tsx` - Badges e tags
- ✅ `avatar.tsx` - Avatares de usuário
- ✅ `input.tsx` - Inputs de formulário
- ✅ `dialog.tsx` - Modais e dialogs
- ✅ `table.tsx` - Tabelas de dados

**Uso:**
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

---

### 2. MagicUI (Animações Marketing) ✅

**Localização:** `components/marketing/`

**Componentes Criados:**
- ✅ `Hero.tsx` - Hero animado com Framer Motion
  - Background grid animado
  - Sparkles effect
  - CTAs com animação
  - Stats section

**Próximos:**
- ⏳ `GridBackground.tsx` - Grid animado reutilizável
- ⏳ `Marquee.tsx` - Scroll infinito de logos

---

### 3. Componentes Legados (Migração Pendente)

**Localização:** `components/ui/` (arquivos `.jsx`)

**Componentes Antigos:**
- `Button.jsx` - Substituir por `button.tsx` (shadcn)
- `Card.jsx` - Substituir por `card.tsx` (shadcn)
- `Badge.jsx` - Substituir por `badge.tsx` (shadcn)
- `Skeleton.jsx` - Manter ou migrar para shadcn
- `Spinner.jsx` - Manter ou migrar para shadcn
- `StatBlock.jsx` - Manter (específico do SMC)
- `ProgressList.jsx` - Manter (específico do SMC)

---

## 🎯 Estratégia de Migração

### Fase 1: Coexistência (Atual)
- ✅ shadcn instalado e funcionando
- ✅ Componentes antigos ainda funcionam
- ✅ Novos componentes usam shadcn

### Fase 2: Migração Gradual
- [ ] Migrar páginas de marketing primeiro
- [ ] Migrar dashboard depois
- [ ] Remover componentes antigos quando não usados

### Fase 3: Consolidação
- [ ] Todos os componentes usando shadcn
- [ ] Componentes antigos removidos
- [ ] Design system unificado

---

## 📁 Estrutura de Pastas

```
components/
├── ui/                    # shadcn/ui base
│   ├── button.tsx        ✅
│   ├── card.tsx          ✅
│   ├── badge.tsx         ✅
│   ├── avatar.tsx        ✅
│   ├── input.tsx         ✅
│   ├── dialog.tsx        ✅
│   └── table.tsx         ✅
│
├── marketing/            # Componentes de marketing
│   ├── Hero.tsx          ✅ (MagicUI)
│   ├── GridBackground.tsx  ⏳
│   ├── Marquee.tsx      ⏳
│   ├── FeatureCards.tsx ⏳ (Aceternity)
│   └── HowItWorks.tsx   ⏳ (Aceternity)
│
├── layout/              # Layouts
│   └── AppShell.tsx     ⏳ (Dashboard com shadcn)
│
└── [legacy]/            # Componentes antigos (migrar)
    ├── Button.jsx
    ├── Card.jsx
    └── Badge.jsx
```

---

## 🎨 Design Tokens

### CSS Variables (shadcn)
```css
--background
--foreground
--primary
--secondary
--muted
--accent
--destructive
--border
--input
--ring
--radius
```

### OpenProps
```css
--shadow-3, --shadow-5
--ease-out-3
--animate-*
```

---

## 🚀 Próximos Passos

1. **Criar AppShell** para dashboard
2. **Integrar mais componentes MagicUI**
3. **Adicionar componentes Aceternity**
4. **Migrar páginas existentes**
5. **Estruturar blog baseado em Taxonomy**

---

**Status:** ✅ Base implementada, migração em progresso





