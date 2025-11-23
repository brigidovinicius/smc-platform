# 🧪 Guia de Teste - Localhost

**Servidor rodando em:** http://localhost:3000

---

## ✅ O Que Testar

### 1. Homepage (`/`)

#### ✅ Marquee - Logos
- [ ] Verificar scroll infinito dos logos na seção Hero
- [ ] Testar pause on hover (deve pausar o scroll)
- [ ] Verificar responsividade em mobile

#### ✅ HowItWorks - Timeline
- [ ] Verificar animação da timeline ao scrollar
- [ ] Verificar layout alternado (esquerda/direita) em desktop
- [ ] Verificar layout vertical em mobile
- [ ] Verificar números dos steps destacados

#### ✅ GridBackground + FeatureCards
- [ ] Verificar grid background sutil na seção de features
- [ ] Verificar animação dos cards ao entrar na viewport
- [ ] Verificar hover effects nos cards
- [ ] Verificar layout responsivo (1/2/3 colunas)

---

### 2. Dashboard (`/dashboard`)

**⚠️ Requer autenticação!** Faça login primeiro em `/auth/login`

#### ✅ AppShell
- [ ] Verificar sidebar com navegação (Dashboard, Meus Ativos, Ofertas, Configurações)
- [ ] Verificar navegação ativa destacada
- [ ] Verificar menu mobile (hamburger menu)
- [ ] Verificar overlay do menu mobile
- [ ] Verificar seção de usuário no rodapé da sidebar
- [ ] Verificar header com informações do usuário
- [ ] Verificar botão de logout
- [ ] Verificar tema dark consistente

---

## 🎨 Checklist Visual

### Homepage
- [ ] Hero section com design moderno
- [ ] Logos com scroll suave
- [ ] Timeline animada e responsiva
- [ ] Features com grid background elegante
- [ ] Cards com hover effects suaves
- [ ] Animações funcionando corretamente

### Dashboard
- [ ] Layout profissional
- [ ] Sidebar funcional
- [ ] Navegação intuitiva
- [ ] Menu mobile responsivo
- [ ] Tema dark consistente

---

## 🐛 Problemas Comuns

### Se o servidor não iniciar:
```bash
# Matar processos na porta 3000
lsof -ti:3000 | xargs kill -9

# Reiniciar
npm run dev
```

### Se houver erros de build:
```bash
# Limpar cache
rm -rf .next

# Reinstalar dependências (se necessário)
npm install

# Build novamente
npm run build
```

### Se componentes não aparecerem:
- Verificar console do navegador (F12)
- Verificar se imports estão corretos
- Verificar se componentes estão em `components/marketing/`

---

## 📱 Teste Responsivo

### Mobile (< 768px)
- [ ] Menu mobile funciona
- [ ] Timeline vertical
- [ ] Features em 1 coluna
- [ ] Logos scrollando corretamente

### Tablet (768px - 1024px)
- [ ] Features em 2 colunas
- [ ] Timeline alternada funcionando
- [ ] Sidebar colapsável

### Desktop (> 1024px)
- [ ] Features em 3 colunas
- [ ] Timeline alternada completa
- [ ] Sidebar sempre visível

---

## 🎯 URLs para Testar

- **Homepage:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Dashboard:** http://localhost:3000/dashboard (requer login)
- **Feed:** http://localhost:3000/feed
- **Blog:** http://localhost:3000/blog

---

## ✨ Features para Observar

1. **Animações suaves** ao scrollar
2. **Hover effects** nos cards
3. **Scroll infinito** dos logos
4. **Timeline animada** com steps alternados
5. **Grid background** sutil nas features
6. **Sidebar responsiva** no dashboard

---

**Status:** ✅ Servidor rodando e pronto para testes!

