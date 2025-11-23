# 🖥️ GUIA DE VISUALIZAÇÃO - LOCALHOST

**Servidor:** `http://localhost:3000`  
**Status:** ✅ Rodando

---

## 🎯 PÁGINAS PARA TESTAR

### 🏠 Marketing Pages (Públicas)

1. **Homepage**
   - URL: `http://localhost:3000`
   - O que ver: Hero animado, stats, features, testimonials
   - Componentes: MagicUI Hero, FeatureCards, GridBackground

2. **Blog**
   - URL: `http://localhost:3000/blog`
   - O que ver: Lista de posts com cards shadcn
   - Componentes: BlogCard (shadcn), Breadcrumbs

3. **Post do Blog**
   - URL: `http://localhost:3000/blog/[slug]`
   - O que ver: Post completo com Badges, Separators
   - Componentes: BlogPost (shadcn), Breadcrumbs

4. **Feed de Ofertas**
   - URL: `http://localhost:3000/feed`
   - O que ver: Grid de ofertas, filtros, busca
   - Componentes: OfferCard, filtros responsivos

5. **Pricing**
   - URL: `http://localhost:3000/pricing`
   - O que ver: Planos, tabela comparativa

6. **FAQ**
   - URL: `http://localhost:3000/faq`
   - O que ver: Accordion com perguntas

### 🔐 Áreas Autenticadas

7. **Dashboard**
   - URL: `http://localhost:3000/dashboard`
   - O que ver: Cards com stats, grids responsivos
   - Componentes: CardWrapper (shadcn), Badge (shadcn)
   - **Nota:** Requer login

8. **Profile**
   - URL: `http://localhost:3000/profile`
   - O que ver: Perfil do usuário
   - **Nota:** Requer login

---

## 🎨 COMPONENTES SHADCN PARA TESTAR

### 1. Button
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: sm, md, lg, icon
- **Onde ver:** Dashboard, Blog, Feed

### 2. Card
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Onde ver:** Dashboard, Blog cards

### 3. Badge
- Variants: default, secondary, destructive, outline
- **Onde ver:** Blog categories, Dashboard badges, Offer status

### 4. Input
- Estados: focus, disabled, placeholder
- **Onde ver:** Feed search, Forms

### 5. Select
- Dropdown com Radix UI
- **Onde ver:** Feed filters

### 6. Tabs
- Tabs, TabsList, TabsTrigger, TabsContent
- **Onde ver:** (Pode ser adicionado em futuras páginas)

### 7. Accordion
- Accordion com animações
- **Onde ver:** FAQ page

### 8. Separator
- Horizontal/vertical
- **Onde ver:** BlogPost header

### 9. Breadcrumbs
- Navegação semântica
- **Onde ver:** Blog pages

### 10. Skeleton
- Loading states
- **Onde ver:** (Pode ser usado em loading states)

---

## 📱 TESTES DE RESPONSIVIDADE

### Mobile (< 640px)
- ✅ Cards em coluna única
- ✅ Textos legíveis
- ✅ Botões acessíveis
- ✅ Navegação funcional

### Tablet (640px - 1024px)
- ✅ Grids em 2 colunas
- ✅ Layouts flexíveis
- ✅ Espaçamento adequado

### Desktop (> 1024px)
- ✅ Grids em 3+ colunas
- ✅ Layouts completos
- ✅ Espaçamento generoso

---

## 🧪 CHECKLIST DE TESTES

### Visual
- [ ] Homepage carrega corretamente
- [ ] Blog lista posts
- [ ] Blog post individual funciona
- [ ] Feed de ofertas funciona
- [ ] Dashboard (se logado)
- [ ] Cards têm altura consistente
- [ ] Badges aparecem corretamente
- [ ] Breadcrumbs funcionam

### Responsividade
- [ ] Mobile (< 640px) - Testar em DevTools
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Grids adaptam corretamente
- [ ] Textos não quebram layout
- [ ] Botões acessíveis em mobile

### Interatividade
- [ ] Links funcionam
- [ ] Filtros do feed funcionam
- [ ] Busca funciona
- [ ] Hover states funcionam
- [ ] Focus states visíveis

### Performance
- [ ] Páginas carregam rápido
- [ ] Sem layout shift (CLS)
- [ ] Animações suaves
- [ ] Imagens otimizadas

---

## 🐛 PROBLEMAS CONHECIDOS

Nenhum problema crítico identificado. Build e lint passando sem erros.

---

## 💡 DICAS

1. **DevTools**: Use Chrome DevTools para testar responsividade
2. **Network**: Verifique se assets carregam corretamente
3. **Console**: Verifique se há erros no console
4. **Lighthouse**: Rode Lighthouse para performance/SEO

---

## 🚀 COMANDOS ÚTEIS

```bash
# Iniciar servidor
npm run dev

# Build de produção
npm run build

# Lint
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

---

**Servidor rodando em:** `http://localhost:3000`  
**Última atualização:** 23/01/2025

