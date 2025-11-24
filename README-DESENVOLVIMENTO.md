# 🚀 Guia de Desenvolvimento - CounterX

**Bem-vindo ao CounterX Platform!**

Este guia rápido te ajuda a começar a desenvolver no projeto.

---

## ⚡ Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Abrir http://localhost:3000
```

---

## 📚 Documentação Essencial

### Para Começar
- 📖 **[Guia Rápido](docs/GUIA-RAPIDO-DESENVOLVEDOR.md)** - Comece aqui!
- 📋 **[Convenções de Código](docs/CONVENCOES-CODIGO.md)** - Onde colocar código novo
- 🏗️ **[Arquitetura](docs/ARQUITETURA-FRONTEND-BACKEND.md)** - Entenda a estrutura
- 📚 **[Índice Completo](docs/README.md)** - Todos os documentos

### Para Desenvolver
- 📝 **[Exemplo de API Completa](docs/EXEMPLO-API-COMPLETA.md)** - Template completo
- 🔧 **[Documentação Técnica](docs/TECHNICAL-DOCUMENTATION.md)** - Detalhes técnicos
- 📊 **[Resumo de Implementação](docs/IMPLEMENTACAO-COMPLETA-REORGANIZACAO.md)** - O que foi feito

---

## 🎯 Estrutura do Projeto

```
saas-market-cap/
├── app/                    # App Router (marketing/blog)
├── pages/                  # Pages Router (rotas + APIs)
├── components/             # Componentes React
├── lib/
│   ├── api/              # Helpers de API ⭐
│   ├── config/            # Configurações ⭐
│   ├── services/         # Lógica de negócio
│   └── utils/            # Utilitários ⭐
└── docs/                  # Documentação completa
```

⭐ = Nova estrutura organizada

---

## 🔑 Conceitos Importantes

### 1. Onde Colocar Código?

| Tipo | Localização |
|------|------------|
| Componente UI | `components/ui/` |
| Nova API | `pages/api/` |
| Lógica de Negócio | `lib/services/` |
| Utilitário | `lib/utils/` |
| Configuração | `lib/config/` |

📖 **Detalhes:** [Convenções de Código](docs/CONVENCOES-CODIGO.md)

### 2. Criar Nova API

Sempre use o padrão estabelecido:

```typescript
import { apiHandler, requireMethod, getUserFromSession, successResponse } from '@/lib/api';

export default apiHandler(async (req, res) => {
  if (!requireMethod(req, res, ['GET'])) return;
  const user = await getUserFromSession(req, res);
  if (!user) return;
  // ... sua lógica
  return successResponse(res, data);
});
```

📖 **Exemplo completo:** [Exemplo de API](docs/EXEMPLO-API-COMPLETA.md)

### 3. Imports Recomendados

```typescript
// Utilitários
import { cn } from '@/lib/utils/utils';
import { slugify } from '@/lib/utils/slugify';

// Configurações
import { SITE_CONFIG } from '@/lib/config/site-config';

// API Helpers
import { apiHandler, successResponse } from '@/lib/api';
```

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run lint        # Verificar erros

# Banco de Dados
npx prisma generate  # Gerar Prisma Client
npx prisma studio    # Abrir Prisma Studio
npx prisma migrate   # Executar migrations
```

---

## 📦 Recursos Disponíveis

### Helpers de API (`lib/api/`)
- `apiHandler()` - Wrapper com tratamento de erros
- `requireMethod()` - Validação de método HTTP
- `getUserFromSession()` - Buscar usuário autenticado
- `successResponse()` / `errorResponse()` - Respostas padronizadas

### Validadores (`lib/api/validators.ts`)
- `validateEmail()` - Validação de email
- `validatePassword()` - Validação de senha
- `validateId()` - Validação de ID
- `validateToken()` - Validação de token

### Middlewares (`lib/api/middleware.ts`)
- `rateLimit()` - Rate limiting
- `logRequest()` - Logging de requisições
- `cors()` - CORS básico

---

## ✅ Checklist Antes de Commitar

- [ ] Código segue as convenções estabelecidas?
- [ ] APIs usam os helpers padronizados?
- [ ] Imports usam `@/` alias?
- [ ] TypeScript sem erros?
- [ ] Linter sem erros (`npm run lint`)?
- [ ] Testado localmente?

---

## 🆘 Precisa de Ajuda?

1. **Consulte a documentação** em `docs/`
2. **Veja exemplos** em `docs/EXEMPLO-API-COMPLETA.md`
3. **Leia as convenções** em `docs/CONVENCOES-CODIGO.md`

---

## 📝 Convenções de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
refactor: refatora código
chore: tarefas de manutenção
```

**Exemplo:**
```bash
git commit -m "feat(api): adiciona endpoint de ofertas"
```

---

## 🎉 Pronto para Desenvolver!

Agora você tem tudo que precisa para começar. Boa codificação! 🚀

**Próximos passos:**
1. Leia o [Guia Rápido](docs/GUIA-RAPIDO-DESENVOLVEDOR.md)
2. Veja o [Exemplo de API](docs/EXEMPLO-API-COMPLETA.md)
3. Consulte as [Convenções](docs/CONVENCOES-CODIGO.md)

---

**Última atualização:** Janeiro 2025

