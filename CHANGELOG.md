# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2025-01-XX

### 🎉 Lançamento Inicial com Refatoração Completa

### ✨ Adicionado
- **Navbar unificado** com Tailwind puro, menu mobile responsivo e melhorias de acessibilidade
- **Componente Button** padronizado com múltiplos variants e estados
- **Sistema de design tokens** centralizado (`lib/design-tokens.ts`)
- **Configuração de fontes** centralizada (`lib/fonts.ts`)
- **Barrel exports** para componentes de UI (`components/ui/index.js`)
- **Arquivo de configuração Vercel** (`vercel.json`) para deploy otimizado
- **Guia completo de deploy** (`DEPLOY.md`)
- **Documentação de refatoração** (`docs/refactoring-2025-01.md`)

### 🔄 Modificado
- **Navbar** (`components/Navbar.jsx`) - Refatoração completa para Tailwind puro
- **Badge** (`components/ui/Badge.jsx`) - Adicionados variants e suporte a dark mode
- **Card** (`components/ui/Card.jsx`) - Adicionados variants e melhor estrutura semântica
- **Layout** (`components/Layout.jsx`) - Migrado para Tailwind puro
- **LayoutShell** (`components/LayoutShell.jsx`) - Migrado para Tailwind puro
- **Tailwind Config** (`tailwind.config.js`) - Expandido com design tokens e animações
- **Next Config** (`next.config.mjs`) - Desabilitado typedRoutes experimental para compatibilidade híbrida
- **App Layout** (`app/(marketing)/layout.tsx`) - Usa fontes centralizadas
- **Pages App** (`pages/_app.js`) - Usa fontes centralizadas

### 🐛 Corrigido
- Erro de build relacionado ao typedRoutes experimental
- Duplicação de configuração de fontes
- Classes CSS customizadas substituídas por Tailwind

### 📚 Documentação
- Adicionado guia completo de deploy (`DEPLOY.md`)
- Adicionada documentação de refatoração (`docs/refactoring-2025-01.md`)
- Criado template de variáveis de ambiente (`.env.example`)

### 🔧 Técnico
- Zero erros de lint
- Build de produção funcionando
- Preparado para deploy na Vercel
- Suporte a dark mode (preparado)
- Melhorias de acessibilidade (WCAG 2.1)

---

## Formato

Este projeto segue [Semantic Versioning](https://semver.org/).

Tipos de mudanças:
- `✨ Adicionado` - Novas funcionalidades
- `🔄 Modificado` - Mudanças em funcionalidades existentes
- `🐛 Corrigido` - Correções de bugs
- `🗑️ Removido` - Funcionalidades removidas
- `📚 Documentação` - Mudanças na documentação
- `🔧 Técnico` - Mudanças técnicas/infraestrutura




