# Lead Flow – CounterX

## Data Model
- `Lead`: representa manifestações de interesse em um `Asset`.
  - `assetId` relaciona com `Asset`.
  - Campos principais: `name`, `email`, `buyerType`, `budgetRange`, `message`, `status`, `source`.
  - Enums: `LeadBuyerType` (`INVESTOR`, `COMPANY`, `INDIVIDUAL`, `OTHER`) e `LeadStatus` (`NEW`, `IN_CONTACT`, `PROPOSAL_SENT`, `WON`, `LOST`).
  - Índices em `assetId`, `status` e `createdAt` para filtros rápidos no admin.

## Como o lead é criado
1. Usuário acessa `/assets/[slug]` (marketplace público).
2. CTA “Quero saber mais” abre o formulário inline (`components/marketplace/LeadInterestForm`).
3. Campos: nome, e-mail, perfil do comprador, faixa de orçamento e mensagem.
4. O submit faz `POST /api/leads` (App Router) com `assetId`.
5. O handler valida dados, garante que o asset está `PUBLISHED`, cria o registro e retorna sucesso.

## Gestão interna (Admin)
- Nova página `app/admin/leads/page.tsx`.
- Lista leads com colunas: data, asset, comprador, email, perfil, budget, mensagem e status.
- Filtro rápido por status (`Todos`, `NEW`, `IN_CONTACT`, `PROPOSAL_SENT`, `WON`, `LOST`).
- Atualização de status via `select` que aciona `PATCH /api/leads/[id]`.
- A rota `/api/leads` (GET) e `/api/leads/[id]` (PATCH) exigem sessão com perfil `ADMIN`.

## Extensão / Automação futura
- Função `handleNewLeadSideEffects` em `lib/leads/sideEffects.ts`.
- Atualmente apenas realiza logging interno, mas é o ponto para adicionar:
  - Envio de e-mails ou notificações internas.
  - Webhooks para automação (n8n, Make, GoHighLevel, CRMs, etc.).
  - Criação de tarefas em pipelines de vendas.

