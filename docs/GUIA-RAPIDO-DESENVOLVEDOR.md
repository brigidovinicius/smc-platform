# 🚀 Guia Rápido para Desenvolvedores - SMC Platform

**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2025

---

## 📋 Índice Rápido

1. [Estrutura do Projeto](#1-estrutura-do-projeto)
2. [Onde Colocar Código Novo](#2-onde-colocar-código-novo)
3. [Criar Nova API](#3-criar-nova-api)
4. [Criar Novo Componente](#4-criar-novo-componente)
5. [Criar Novo Service](#5-criar-novo-service)
6. [Imports Recomendados](#6-imports-recomendados)
7. [Comandos Úteis](#7-comandos-úteis)

---

## 1. ESTRUTURA DO PROJETO

```
saas-market-cap/
├── app/                    # App Router (marketing/blog)
├── pages/                  # Pages Router (rotas autenticadas + APIs)
├── components/             # Componentes React
├── lib/
│   ├── api/               # Helpers de API
│   ├── config/           # Configurações
│   ├── services/         # Lógica de negócio
│   └── utils/            # Utilitários
└── docs/                  # Documentação
```

---

## 2. ONDE COLOCAR CÓDIGO NOVO

| Tipo | Localização | Exemplo |
|------|-------------|---------|
| **Componente UI** | `components/ui/` | `Button.tsx` |
| **Componente Marketing** | `app/(marketing)/_components/` | `Hero.tsx` |
| **Nova Página (App Router)** | `app/(marketing)/` | `nova-pagina/page.tsx` |
| **Nova Página (Pages Router)** | `pages/` | `nova-pagina.jsx` |
| **Nova API** | `pages/api/` | `nova-rota.ts` |
| **Lógica de Negócio** | `lib/services/` | `nova-feature.ts` |
| **Utilitário** | `lib/utils/` | `nova-funcao.ts` |
| **Configuração** | `lib/config/` | `nova-config.ts` |

---

## 3. CRIAR NOVA API

### Template Básico

```typescript
// pages/api/exemplo/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  apiHandler,
  requireMethod,
  getUserFromSession,
  successResponse,
  errorResponse
} from '@/lib/api';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // 1. Validar método
  if (!requireMethod(req, res, ['GET', 'POST'])) {
    return;
  }

  // 2. Autenticação (se necessário)
  const user = await getUserFromSession(req, res);
  if (!user) return;

  // 3. Lógica
  if (req.method === 'GET') {
    const data = await someService();
    return successResponse(res, data);
  }

  if (req.method === 'POST') {
    // Validação e criação
    return successResponse(res, { created: true }, 201);
  }
});
```

### Recursos Disponíveis

- **Helpers:** `apiHandler`, `requireMethod`, `getUserFromSession`, `successResponse`, `errorResponse`
- **Validadores:** `validateEmail`, `validatePassword`, `validateId`, `validateToken`
- **Middlewares:** `rateLimit`, `logRequest`, `cors`

📖 **Exemplo completo:** `docs/EXEMPLO-API-COMPLETA.md`

---

## 4. CRIAR NOVO COMPONENTE

### Componente Funcional

```typescript
// components/Exemplo.tsx
import { cn } from '@/lib/utils/utils';

interface ExemploProps {
  className?: string;
  children: React.ReactNode;
}

export function Exemplo({ className, children }: ExemploProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
}
```

### Client Component

```typescript
// components/ExemploClient.tsx
'use client';

import { useState } from 'react';

export function ExemploClient() {
  const [state, setState] = useState();
  // ...
}
```

---

## 5. CRIAR NOVO SERVICE

```typescript
// lib/services/exemplo.ts
import prisma from '@/lib/prisma';

export async function getExemploData() {
  return await prisma.exemplo.findMany();
}

export async function createExemplo(data: any) {
  return await prisma.exemplo.create({ data });
}
```

---

## 6. IMPORTS RECOMENDADOS

### Utilitários
```typescript
import { cn } from '@/lib/utils/utils';
import { slugify } from '@/lib/utils/slugify';
```

### Configurações
```typescript
import { SITE_CONFIG } from '@/lib/config/site-config';
import { colors, spacing } from '@/lib/config/design-tokens';
import { fontClasses } from '@/lib/config/fonts';
```

### API Helpers
```typescript
import {
  apiHandler,
  requireMethod,
  getUserFromSession,
  successResponse,
  errorResponse
} from '@/lib/api';
```

### Services
```typescript
import { getOffers } from '@/lib/services/offers';
import { getUserProfile } from '@/lib/services/profiles';
```

---

## 7. COMANDOS ÚTEIS

### Desenvolvimento
```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build de produção
npm run lint        # Verificar erros de lint
```

### Banco de Dados
```bash
npx prisma generate  # Gerar Prisma Client
npx prisma studio    # Abrir Prisma Studio
npx prisma migrate   # Executar migrations
```

### Git
```bash
git status           # Ver status
git add .            # Adicionar arquivos
git commit -m "feat: nova feature"
git push             # Enviar para repositório
```

---

## 📚 Documentação Completa

- **Índice Geral:** [docs/README.md](./README.md) - Todos os documentos
- **Convenções:** [docs/CONVENCOES-CODIGO.md](./CONVENCOES-CODIGO.md)
- **Arquitetura:** [docs/ARQUITETURA-FRONTEND-BACKEND.md](./ARQUITETURA-FRONTEND-BACKEND.md)
- **Exemplo de API:** [docs/EXEMPLO-API-COMPLETA.md](./EXEMPLO-API-COMPLETA.md)
- **Documentação Técnica:** [docs/TECHNICAL-DOCUMENTATION.md](./TECHNICAL-DOCUMENTATION.md)

---

## ⚡ Dicas Rápidas

1. **Sempre use TypeScript** para novos arquivos
2. **Use `@/` alias** para imports internos
3. **Siga os padrões** estabelecidos nas APIs existentes
4. **Consulte a documentação** antes de criar código novo
5. **Teste localmente** antes de fazer commit

---

## 🆘 Precisa de Ajuda?

1. Consulte `docs/CONVENCOES-CODIGO.md` para convenções
2. Veja exemplos em `docs/EXEMPLO-API-COMPLETA.md`
3. Leia `docs/TECHNICAL-DOCUMENTATION.md` para detalhes técnicos

---

**Boa codificação! 🚀**

