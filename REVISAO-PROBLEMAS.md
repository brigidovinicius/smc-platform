# 🔍 REVISÃO DE PROBLEMAS - SMC Platform

**Data:** 23 de Janeiro de 2025  
**Status:** Em correção

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Duplicação de Componentes Button**
- ❌ `components/ui/Button.jsx` (legado) existe mas não está sendo usado
- ✅ `components/ui/button.tsx` (shadcn) está correto
- **Ação:** Remover `Button.jsx` ou criar wrapper de compatibilidade

### 2. **Cores Hardcoded em Componentes**
- ❌ `OfferCard.jsx`: `bg-[#060c1a]` - deveria usar tokens CSS
- ❌ `AssetCard.jsx`: `bg-[#060c1a]` - deveria usar tokens CSS
- ❌ Vários componentes usam cores hex diretas ao invés de variáveis CSS
- **Impacto:** Dificulta manutenção e dark mode inconsistente

### 3. **Inconsistência de Dark Mode**
- ⚠️ Alguns componentes não respeitam `.dark` class
- ⚠️ Cores hardcoded não mudam com dark mode
- **Impacto:** Experiência fragmentada

### 4. **Acessibilidade**
- ⚠️ Contraste baixo em alguns textos (`text-slate-300` em fundo escuro)
- ⚠️ Falta `aria-labels` em alguns componentes
- ⚠️ Focus states não sempre visíveis

### 5. **Responsividade**
- ⚠️ Alguns componentes podem quebrar em mobile
- ⚠️ Grids não sempre adaptam corretamente

---

## 🟡 PROBLEMAS MÉDIOS

### 6. **Inconsistência de Espaçamento**
- Mistura de `gap-3`, `gap-4`, `gap-6` sem padrão claro
- **Ação:** Padronizar usando design tokens

### 7. **Tipografia**
- Alguns componentes usam `text-sm`, outros `text-base` sem hierarquia clara
- **Ação:** Criar sistema de tipografia consistente

### 8. **Bordas e Radius**
- Mistura de `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- **Ação:** Padronizar usando `--radius` do design system

---

## ✅ PONTOS POSITIVOS

- ✅ Build passando sem erros
- ✅ Lint sem erros
- ✅ Componentes shadcn funcionando
- ✅ CardWrapper funcionando bem
- ✅ Badge shadcn integrado corretamente

---

## 🎯 PLANO DE CORREÇÃO

### Prioridade 1 (Crítico)
1. ✅ Remover `Button.jsx` duplicado
2. ✅ Substituir cores hardcoded por tokens CSS
3. ✅ Corrigir dark mode em `OfferCard` e `AssetCard`

### Prioridade 2 (Importante)
4. ✅ Melhorar contraste de textos
5. ✅ Adicionar aria-labels
6. ✅ Padronizar espaçamentos

### Prioridade 3 (Melhorias)
7. ✅ Padronizar tipografia
8. ✅ Padronizar border-radius
9. ✅ Melhorar focus states

---

**Próxima ação:** Iniciar correções prioritárias.

