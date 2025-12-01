# 🎯 Plano de Ação SMC - Janeiro 2025

**Status:** 🟢 Em Execução  
**Última Atualização:** Janeiro 2025

---

## ✅ Melhorias Já Implementadas

### Componentes e Design System
- ✅ **Navbar refatorado** - Tailwind puro, responsivo, acessível
- ✅ **Componentes UI padronizados** - Badge, Card, Button
- ✅ **Design tokens centralizados** - `lib/design-tokens.ts`
- ✅ **Fontes centralizadas** - `lib/fonts.ts`
- ✅ **Build otimizado** - Configuração para produção

### Documentação
- ✅ **Guia de deploy** - `DEPLOY.md`
- ✅ **Revisão do sistema de usuários** - `docs/USER-SYSTEM-REVIEW.md`
- ✅ **Documentação de refatoração** - `docs/refactoring-2025-01.md`

---

## 🔴 PRIORIDADE ALTA - Próximas Ações

### 1. Criar Conteúdo para Páginas Vazias

#### `/pricing` - Página de Planos
**Status:** ⚠️ Placeholder apenas  
**Ação:** Criar página completa com:
- Tabela comparativa de planos (Free, Pro, Enterprise)
- Features por plano
- CTAs claros
- Design alinhado com marketing

#### `/faq` - Perguntas Frequentes
**Status:** ⚠️ Apenas 2 perguntas  
**Ação:** Expandir com todas as 10 perguntas da homepage:
- Formato accordion
- SEO otimizado
- Design consistente

#### `/calculator` - Calculadora de Valuation
**Status:** ⚠️ Placeholder  
**Ação:** Implementar calculadora funcional OU melhorar placeholder com:
- Informações sobre como funciona
- CTA para entrar em contato
- Preview da ferramenta

### 2. Unificar Design Visual

#### Decisão Estratégica Necessária
- **Opção A:** Migrar tudo para App Router (recomendado)
- **Opção B:** Unificar design mantendo Pages Router

**Recomendação:** Opção B (mais rápida) - Unificar design mantendo Pages Router

#### Páginas a Atualizar
- `/feed` - Aplicar design system unificado
- `/dashboard` - Design consistente
- `/wizard` - Melhorar visual
- `/profile` - Design consistente
- `/home` - Design consistente

### 3. Correções Técnicas

#### `/marketplace`
- Converter para página standalone (evitar re-export)
- Garantir que não quebra como `/vender-ativo` quebrou antes

#### Redirecionamentos
- Verificar `/wizard`, `/profile`, `/home`
- Garantir redirecionamento correto para `/auth/login`

---

## ⚠️ PRIORIDADE MÉDIA

### 4. Melhorar Componentes Visuais
- Revisar `components/ui/*` restantes
- Melhorar RegisterWizard (cores, espaçamento)
- Adicionar loading states

### 5. Expandir Conteúdo
- Revisar páginas legais (`/legal/*`)
- Melhorar `/suporte`
- Melhorar `/recursos`

### 6. Responsividade
- Testar todas as páginas em mobile
- Ajustar layouts quebrados
- Otimizar touch targets

---

## 📋 Checklist de Progresso

### Conteúdo
- [ ] `/pricing` completa
- [ ] `/faq` expandida (10 perguntas)
- [ ] `/calculator` funcional ou melhorado
- [ ] Páginas legais revisadas

### Design
- [ ] Design system aplicado em todas as páginas
- [ ] `/feed` atualizado
- [ ] `/dashboard` atualizado
- [ ] `/wizard` atualizado
- [ ] `/profile` atualizado
- [ ] `/home` atualizado
- [ ] `/marketplace` convertido

### Técnico
- [ ] Redirecionamentos verificados
- [ ] Build funcionando
- [ ] Lint sem erros
- [ ] Mobile testado

---

## 🚀 Próximos Passos Imediatos

1. **Criar página `/pricing` completa** (2-3 horas)
2. **Expandir `/faq`** com todas as perguntas (1-2 horas)
3. **Melhorar `/calculator`** com melhor placeholder (1 hora)
4. **Unificar design** das páginas Pages Router (4-6 horas)
5. **Converter `/marketplace`** para standalone (30 min)

---

**Total Estimado:** 8-12 horas de trabalho

---

## 📊 Métricas de Sucesso

### Antes
- 3 páginas sem conteúdo real
- 2 sistemas de design diferentes
- Experiência fragmentada

### Depois (Meta)
- 0 páginas sem conteúdo
- 1 sistema de design unificado
- Experiência fluida e consistente

---

**Documento criado em:** Janeiro 2025  
**Próxima revisão:** Após conclusão das tarefas de prioridade alta







