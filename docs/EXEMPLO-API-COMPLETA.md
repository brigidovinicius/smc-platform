# 📝 Exemplo de API Completa - Padrão SMC

Este documento mostra um exemplo completo de API usando todos os recursos disponíveis.

---

## 🎯 API de Exemplo: Gerenciar Ofertas

Vamos criar uma API completa para gerenciar ofertas, usando todos os helpers, validadores e middlewares disponíveis.

---

## 📁 Estrutura de Arquivos

```
pages/api/offers/
├── index.ts          # Listar e criar ofertas
└── [id].ts           # Obter, atualizar e deletar oferta específica
```

---

## 📄 `pages/api/offers/index.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  apiHandler,
  requireMethod,
  getUserFromSession,
  successResponse,
  errorResponse,
  validateQuery
} from '@/lib/api';
import { validateId } from '@/lib/api/validators';
import { rateLimit, logRequest } from '@/lib/api/middleware';
import { listOffers, createOffer } from '@/lib/services/offers';
import type { ApiResponse } from '@/lib/api';

/**
 * GET /api/offers - Listar ofertas
 * POST /api/offers - Criar nova oferta
 */
export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // 1. Logging (opcional, útil para debug)
  logRequest(req);

  // 2. Rate limiting (proteção contra abuso)
  if (!rateLimit(100, 60000)(req, res)) {
    return; // Rate limit excedido, resposta já enviada
  }

  // 3. GET - Listar ofertas
  if (req.method === 'GET') {
    // Validar query parameters
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 12;
    const status = req.query.status as string | undefined;

    if (page < 1) {
      return errorResponse(res, 'Página deve ser maior que 0', 400, 'INVALID_PAGE');
    }

    if (pageSize < 1 || pageSize > 100) {
      return errorResponse(res, 'Tamanho da página deve estar entre 1 e 100', 400, 'INVALID_PAGE_SIZE');
    }

    try {
      const result = await listOffers({
        page,
        pageSize,
        status: status as any
      });

      return successResponse(res, {
        offers: result.items,
        pagination: {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: Math.ceil(result.total / result.pageSize)
        }
      });
    } catch (error: any) {
      return errorResponse(res, error.message || 'Erro ao listar ofertas', 500, 'LIST_ERROR');
    }
  }

  // 4. POST - Criar nova oferta
  if (req.method === 'POST') {
    // Validar método
    if (!requireMethod(req, res, ['POST'])) {
      return;
    }

    // Autenticação obrigatória para criar oferta
    const user = await getUserFromSession(req, res);
    if (!user) return;

    // Validação do body
    const { assetId, price } = req.body;

    if (!assetId || typeof assetId !== 'string') {
      return errorResponse(res, 'assetId é obrigatório', 400, 'MISSING_ASSET_ID');
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return errorResponse(res, 'Preço deve ser um número positivo', 400, 'INVALID_PRICE');
    }

    try {
      const offer = await createOffer({
        asset: { connect: { id: assetId } },
        seller: { connect: { id: user.id } },
        price,
        status: 'ACTIVE'
      });

      return successResponse(res, { offer }, 201);
    } catch (error: any) {
      // Tratamento específico de erros do Prisma
      if (error.code === 'P2002') {
        return errorResponse(res, 'Oferta já existe', 409, 'OFFER_EXISTS');
      }

      if (error.code === 'P2025') {
        return errorResponse(res, 'Ativo não encontrado', 404, 'ASSET_NOT_FOUND');
      }

      return errorResponse(res, error.message || 'Erro ao criar oferta', 500, 'CREATE_ERROR');
    }
  }

  // 5. Método não suportado
  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});
```

---

## 📄 `pages/api/offers/[id].ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  apiHandler,
  requireMethod,
  getUserFromSession,
  successResponse,
  errorResponse
} from '@/lib/api';
import { validateId } from '@/lib/api/validators';
import { rateLimit, logRequest } from '@/lib/api/middleware';
import { getOfferById, updateOffer, deleteOffer } from '@/lib/services/offers';
import type { ApiResponse } from '@/lib/api';

/**
 * GET /api/offers/[id] - Obter oferta específica
 * PATCH /api/offers/[id] - Atualizar oferta
 * DELETE /api/offers/[id] - Deletar oferta
 */
export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // 1. Logging
  logRequest(req);

  // 2. Rate limiting
  if (!rateLimit(100, 60000)(req, res)) {
    return;
  }

  // 3. Validar ID
  const idValidation = validateId(req.query.id, 'ID da oferta');
  if (!idValidation.valid) {
    return errorResponse(res, idValidation.error!, 400, 'INVALID_ID');
  }

  const { id } = idValidation;

  // 4. GET - Obter oferta
  if (req.method === 'GET') {
    try {
      const offer = await getOfferById(id!);

      if (!offer) {
        return errorResponse(res, 'Oferta não encontrada', 404, 'OFFER_NOT_FOUND');
      }

      return successResponse(res, { offer });
    } catch (error: any) {
      return errorResponse(res, error.message || 'Erro ao buscar oferta', 500, 'GET_ERROR');
    }
  }

  // 5. PATCH - Atualizar oferta
  if (req.method === 'PATCH') {
    // Autenticação obrigatória
    const user = await getUserFromSession(req, res);
    if (!user) return;

    // Buscar oferta para verificar permissões
    const offer = await getOfferById(id!);
    if (!offer) {
      return errorResponse(res, 'Oferta não encontrada', 404, 'OFFER_NOT_FOUND');
    }

    // Verificar se usuário é o dono da oferta
    if (offer.sellerId !== user.id) {
      return errorResponse(res, 'Você não tem permissão para atualizar esta oferta', 403, 'FORBIDDEN');
    }

    // Validação do body
    const { price, status } = req.body;
    const updateData: any = {};

    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return errorResponse(res, 'Preço deve ser um número positivo', 400, 'INVALID_PRICE');
      }
      updateData.price = price;
    }

    if (status !== undefined) {
      const validStatuses = ['ACTIVE', 'UNDER_NEGOTIATION', 'SOLD', 'ARCHIVED'];
      if (!validStatuses.includes(status)) {
        return errorResponse(res, `Status inválido. Use: ${validStatuses.join(', ')}`, 400, 'INVALID_STATUS');
      }
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return errorResponse(res, 'Nenhum campo para atualizar', 400, 'NO_UPDATES');
    }

    try {
      const updatedOffer = await updateOffer(id!, updateData);
      return successResponse(res, { offer: updatedOffer });
    } catch (error: any) {
      return errorResponse(res, error.message || 'Erro ao atualizar oferta', 500, 'UPDATE_ERROR');
    }
  }

  // 6. DELETE - Deletar oferta
  if (req.method === 'DELETE') {
    // Autenticação obrigatória
    const user = await getUserFromSession(req, res);
    if (!user) return;

    // Buscar oferta para verificar permissões
    const offer = await getOfferById(id!);
    if (!offer) {
      return errorResponse(res, 'Oferta não encontrada', 404, 'OFFER_NOT_FOUND');
    }

    // Verificar se usuário é o dono da oferta
    if (offer.sellerId !== user.id) {
      return errorResponse(res, 'Você não tem permissão para deletar esta oferta', 403, 'FORBIDDEN');
    }

    try {
      await deleteOffer(id!);
      return successResponse(res, { deleted: true });
    } catch (error: any) {
      return errorResponse(res, error.message || 'Erro ao deletar oferta', 500, 'DELETE_ERROR');
    }
  }

  // 7. Método não suportado
  return errorResponse(res, 'Método não permitido', 405, 'METHOD_NOT_ALLOWED');
});
```

---

## 🔑 Pontos-Chave do Exemplo

### 1. **Estrutura Consistente**
- Sempre usar `apiHandler()` como wrapper
- Sempre validar método HTTP primeiro
- Sempre tratar erros adequadamente

### 2. **Segurança**
- Rate limiting em todas as rotas
- Autenticação quando necessário
- Validação de permissões (ownership)
- Validação de entrada rigorosa

### 3. **Validação**
- Usar validadores do `lib/api/validators`
- Validar query parameters
- Validar body parameters
- Mensagens de erro claras

### 4. **Respostas Padronizadas**
- Sempre usar `successResponse()` para sucesso
- Sempre usar `errorResponse()` para erros
- Sempre incluir código de erro quando aplicável

### 5. **Tratamento de Erros**
- Capturar erros específicos (ex: Prisma)
- Códigos de erro descritivos
- Mensagens amigáveis ao usuário

---

## 📚 Referências

- **Helpers:** `lib/api/helpers.ts`
- **Validadores:** `lib/api/validators.ts`
- **Middlewares:** `lib/api/middleware.ts`
- **Convenções:** `docs/CONVENCOES-CODIGO.md`

---

**Use este exemplo como referência ao criar novas APIs!**





