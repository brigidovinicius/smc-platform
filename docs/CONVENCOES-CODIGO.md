# 📋 Convenções de Código - CounterX

**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2025  
**Branch Ativa:** `codex-nightly`

---

## 📋 ÍNDICE

1. [Estrutura de Pastas](#1-estrutura-de-pastas)
2. [Onde Colocar Código Novo](#2-onde-colocar-código-novo)
3. [Convenções de Nomenclatura](#3-convenções-de-nomenclatura)
4. [Padrões de API](#4-padrões-de-api)
5. [Padrões de Componentes](#5-padrões-de-componentes)
6. [Imports e Exports](#6-imports-e-exports)
7. [TypeScript vs JavaScript](#7-typescript-vs-javascript)

---

## 1. ESTRUTURA DE PASTAS

### 1.1 Visão Geral

```
saas-market-cap/
│
├── 🎨 FRONTEND
│   ├── app/                    # App Router (marketing/blog)
│   ├── pages/                  # Pages Router (rotas autenticadas)
│   └── components/             # Componentes React reutilizáveis
│
├── 🔧 BACKEND
│   ├── pages/api/              # API Routes
│   └── lib/services/           # Services Layer (lógica de negócio)
│
├── 🗄️ DATA
│   ├── lib/prisma.ts           # Prisma Client
│   └── prisma/                 # Schema e migrations
│
└── 🔄 COMPARTILHADO
    ├── lib/utils/              # Utilitários
    ├── lib/config/             # Configurações
    ├── lib/api/                # Helpers de API
    └── lib/types/              # Tipos TypeScript
```

### 1.2 Estrutura Detalhada de `lib/`

```
lib/
├── services/          # 🔧 BACKEND - Lógica de negócio
│   ├── assets.ts
│   ├── offers.ts
│   ├── profiles.ts
│   ├── dashboard.ts
│   └── favorites.ts
│
├── utils/            # 🔄 COMPARTILHADO - Utilitários
│   ├── utils.ts     # cn(), helpers gerais
│   ├── slugify.ts   # Função slugify
│   └── index.ts     # Re-exports
│
├── config/          # 🔄 COMPARTILHADO - Configurações
│   ├── site-config.ts
│   ├── design-tokens.ts
│   ├── fonts.ts
│   └── index.ts     # Re-exports
│
├── api/             # 🔧 BACKEND - Helpers de API
│   ├── helpers.ts   # apiHandler, requireAuth, etc.
│   └── index.ts     # Re-exports
│
├── types/           # 🔄 COMPARTILHADO - Tipos TypeScript
│   └── ...
│
└── [arquivos raiz]  # 🔄 COMPARTILHADO - Helpers específicos
    ├── prisma.ts    # Cliente Prisma (backend)
    ├── blog.ts      # Helpers blog (compartilhado)
    ├── email.ts     # Envio de emails (backend)
    └── ...
```

---

## 2. ONDE COLOCAR CÓDIGO NOVO

### 2.1 Guia Rápido

| Tipo de Código | Localização | Exemplo |
|---------------|-------------|---------|
| **Novo componente UI** | `components/` ou `app/(marketing)/_components/` | `components/ui/Button.tsx` |
| **Nova página (App Router)** | `app/` | `app/(marketing)/nova-pagina/page.tsx` |
| **Nova página (Pages Router)** | `pages/` | `pages/nova-pagina.jsx` |
| **Nova API endpoint** | `pages/api/` ou `app/api/` | `pages/api/nova-rota.ts` |
| **Nova lógica de negócio** | `lib/services/` | `lib/services/nova-feature.ts` |
| **Novo utilitário** | `lib/utils/` | `lib/utils/nova-funcao.ts` |
| **Nova configuração** | `lib/config/` | `lib/config/nova-config.ts` |
| **Novo tipo TypeScript** | `lib/types/` ou `src/types/` | `lib/types/nova-feature.ts` |
| **Helper de API** | `lib/api/` | `lib/api/validators.ts` |

### 2.2 Decisões por Contexto

#### Componente React
- **Reutilizável em múltiplas páginas?** → `components/`
- **Específico do marketing?** → `app/(marketing)/_components/`
- **Componente UI base (shadcn)?** → `components/ui/`

#### Lógica de Negócio
- **Acessa banco de dados?** → `lib/services/`
- **Função pura sem dependências?** → `lib/utils/`
- **Validação de dados?** → `lib/api/validators.ts` (criar se necessário)

#### Configuração
- **Configuração do site?** → `lib/config/site-config.ts`
- **Design tokens?** → `lib/config/design-tokens.ts`
- **Fontes?** → `lib/config/fonts.ts`

---

## 3. CONVENÇÕES DE NOMENCLATURA

### 3.1 Arquivos e Pastas

- **Componentes React:** PascalCase (`Button.tsx`, `BlogCard.tsx`)
- **Utilitários:** camelCase (`utils.ts`, `slugify.ts`)
- **Services:** camelCase (`offers.ts`, `profiles.ts`)
- **Configurações:** kebab-case ou camelCase (`site-config.ts`, `design-tokens.ts`)
- **Tipos TypeScript:** PascalCase (`User.ts`, `Offer.ts`)

### 3.2 Variáveis e Funções

- **Variáveis:** camelCase (`userName`, `offerList`)
- **Funções:** camelCase (`getUserById`, `createOffer`)
- **Constantes:** UPPER_SNAKE_CASE (`SITE_URL`, `MAX_PAGE_SIZE`)
- **Tipos/Interfaces:** PascalCase (`User`, `OfferData`)

### 3.3 Componentes React

- **Nome do componente:** PascalCase (`Button`, `BlogCard`)
- **Props interface:** `ComponentNameProps` (`ButtonProps`, `BlogCardProps`)

---

## 4. PADRÕES DE API

### 4.1 Estrutura Padrão

Use os helpers de `lib/api/`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  apiHandler,
  requireMethod,
  getUserFromSession,
  successResponse,
  errorResponse
} from '@/lib/api';
import { validateRegisterBody } from '@/lib/api/validators';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // 1. Validar método HTTP
  if (!requireMethod(req, res, ['GET', 'POST'])) {
    return;
  }

  // 2. Autenticação (se necessário)
  const user = await getUserFromSession(req, res);
  if (!user) return;

  // 3. Validação de dados
  const validation = validateRegisterBody(req.body);
  if (!validation.valid) {
    return errorResponse(res, validation.error, 400, 'VALIDATION_ERROR');
  }

  // 4. Lógica de negócio
  try {
    const data = await someService(validation.data);
    return successResponse(res, data);
  } catch (error: any) {
    return errorResponse(res, error.message, 500, 'INTERNAL_ERROR');
  }
});
```

### 4.2 Respostas Padronizadas

**Sucesso:**
```typescript
{
  success: true,
  data: { ... }
}
```

**Erro:**
```typescript
{
  success: false,
  error: "Mensagem de erro",
  code: "ERROR_CODE"
}
```

### 4.3 Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Não encontrado
- `405` - Método não permitido
- `500` - Erro interno do servidor

---

## 5. PADRÕES DE COMPONENTES

### 5.1 Componente Funcional

```typescript
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function Component({ className, children }: ComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
}
```

### 5.2 Client Component

```typescript
'use client';

import { useState } from 'react';

export function ClientComponent() {
  const [state, setState] = useState();
  // ...
}
```

### 5.3 Server Component (App Router)

```typescript
// Sem 'use client' - Server Component por padrão
import { getData } from '@/lib/services/someService';

export async function ServerComponent() {
  const data = await getData();
  return <div>{data}</div>;
}
```

---

## 6. IMPORTS E EXPORTS

### 6.1 Ordem de Imports

1. **Bibliotecas externas** (React, Next.js, etc.)
2. **Bibliotecas internas** (componentes, utils)
3. **Tipos** (se necessário)
4. **Estilos** (se necessário)

```typescript
// 1. Externas
import { useState } from 'react';
import { NextApiRequest, NextApiResponse } from 'next';

// 2. Internas
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// 3. Tipos
import type { User } from '@/lib/types';

// 4. Estilos (se necessário)
import styles from './Component.module.css';
```

### 6.2 Path Aliases

Use sempre `@/` para imports internos:

- ✅ `import { cn } from '@/lib/utils';`
- ✅ `import { Button } from '@/components/ui/button';`
- ❌ `import { cn } from '../../lib/utils';`

### 6.3 Exports

- **Named exports** para funções/componentes
- **Default export** apenas para páginas (`page.tsx`, `[...nextauth].ts`)

```typescript
// ✅ Named export
export function myFunction() { }

// ✅ Default export (apenas páginas)
export default function Page() { }
```

---

## 7. TYPESCRIPT VS JAVASCRIPT

### 7.1 Quando Usar TypeScript

- ✅ **Novos arquivos:** Sempre TypeScript (`.ts`, `.tsx`)
- ✅ **APIs:** Sempre TypeScript
- ✅ **Services:** Sempre TypeScript
- ✅ **Componentes novos:** TypeScript (`.tsx`)

### 7.2 Quando Usar JavaScript

- ⚠️ **Arquivos legados:** Manter JavaScript até migração gradual
- ⚠️ **Scripts simples:** JavaScript aceitável
- ⚠️ **Configurações:** JavaScript aceitável (`next.config.mjs`)

### 7.3 Migração Gradual

- Novos arquivos sempre em TypeScript
- Migrar arquivos JavaScript quando houver modificações
- Não migrar tudo de uma vez (risco alto)

---

## 8. CHECKLIST PARA CÓDIGO NOVO

Antes de criar um novo arquivo, verifique:

- [ ] Localização correta conforme este guia?
- [ ] Nomenclatura seguindo convenções?
- [ ] Imports usando `@/` alias?
- [ ] TypeScript (se aplicável)?
- [ ] Exports corretos (named vs default)?
- [ ] Tratamento de erros (APIs)?
- [ ] Documentação/comentários quando necessário?

---

## 9. EXEMPLOS PRÁTICOS

### 9.1 Criar Nova API

```typescript
// pages/api/example/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  apiHandler,
  requireMethod,
  getUserFromSession,
  successResponse,
  errorResponse
} from '@/lib/api';
import { validateId } from '@/lib/api/validators';
import { exampleService } from '@/lib/services/example';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Validar método
  if (!requireMethod(req, res, ['GET'])) {
    return;
  }

  // Autenticação
  const user = await getUserFromSession(req, res);
  if (!user) return;

  // Validação de parâmetros
  const idValidation = validateId(req.query.id, 'ID');
  if (!idValidation.valid) {
    return errorResponse(res, idValidation.error!, 400);
  }

  // Lógica
  const data = await exampleService(idValidation.id!);
  return successResponse(res, data);
});
```

### 9.2 Criar Novo Service

```typescript
// lib/services/example.ts
import prisma from '@/lib/prisma';

export async function getExampleData() {
  return await prisma.example.findMany();
}
```

### 9.3 Criar Novo Componente

```typescript
// components/Example.tsx
import { cn } from '@/lib/utils';

interface ExampleProps {
  className?: string;
}

export function Example({ className }: ExampleProps) {
  return <div className={cn("base-classes", className)}>Example</div>;
}
```

---

## 10. REFERÊNCIAS

- **Documentação Técnica:** `docs/TECHNICAL-DOCUMENTATION.md`
- **Arquitetura Frontend/Backend:** `docs/ARQUITETURA-FRONTEND-BACKEND.md`
- **Stack Tecnológico:** `docs/TECHNOLOGY-STACK.md`

---

**Última atualização:** Janeiro 2025

