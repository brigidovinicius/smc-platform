# Context7 – Guia de Integração

Este documento resume como o Context7 foi conectado ao projeto CounterX, incluindo variáveis de ambiente, providers, rotas de API e pontos de instrumentação disponíveis para uso futuro.

## Variáveis de Ambiente

Crie um arquivo `.env.local` (não versionado) com os valores fornecidos pelo painel do Context7:

```
CONTEXT7_API_KEY="sua-api-key"
CONTEXT7_PROJECT_ID="id-do-projeto"
CONTEXT7_CLIENT_TOKEN="token-server"
CONTEXT7_BASE_URL="https://api.context7.com"
CONTEXT7_DEBUG="false"
NEXT_PUBLIC_CONTEXT7_CLIENT_TOKEN="token-publico"
NEXT_PUBLIC_CONTEXT7_PROJECT_ID="id-publico"
```

> **Importante:** sem `CONTEXT7_API_KEY` e `CONTEXT7_PROJECT_ID` a integração permanece em modo *no-op* (não envia eventos).

## Arquitetura

- `lib/context7.ts`: encapsula configuração, cliente server-side, geração de sessão/visitante, flags, experimentos e funções utilitárias (`recordServerAction`, `recordLeadEvent`, etc.).
- `components/providers/Context7Provider.tsx`: provider client-side que publica `useContext7`, rastreia page views automáticos, expõe `trackEvent`, `identifyUser`, feature flags e variantes de experimentos.
- `Context7PageTracker`: componente auxiliar para instrumentar blocos/páginas específicos em modo App Router.
- `middleware.ts`: envia telemetria de borda (SSR) para o Context7 sem bloquear a autenticação.
- Rotas App Router em `app/api/context7/*`: `events`, `identify`, `session`, `logs`, `health` – permitem ingestão segura do front-end e endpoints de debug/monitoramento.

## Fluxo SSR + CSR

1. `app/layout.tsx` coleta a sessão autenticada via NextAuth, gera cookies `ctx7_session_id` e `ctx7_visitor_id`, monta o *bootstrap* (flags, experimentos, scoring) e injeta o snippet recomendado.
2. O `Context7Provider` recebe o *bootstrap* e dispara automaticamente:
   - `identify` (quando o usuário possui `id`);
   - page views a cada mudança de rota (SSR + CSR);
   - fila de eventos customizados através de `useContext7().trackEvent`.
3. O middleware (`middleware.ts`) envia visão consolidada da requisição (IP, geo, device hints) usando `captureEdgeTelemetry`.
4. APIs críticas (`pages/api/dashboard`, `app/api/leads`) chamam `recordServerAction` e `recordLeadEvent`, garantindo métrica de ações/mutações/leads.

## Como Instrumentar

### Client-side

```tsx
import { useContext7 } from '@/components/providers/Context7Provider';

const { trackEvent, getFeatureFlag, getExperimentVariant } = useContext7();

trackEvent('cta_click', { location: 'hero', label: 'Quero vender' });
const showBetaCard = getFeatureFlag('highlightValuationCalculator');
const heroVariant = getExperimentVariant('heroExperiment');
```

### Server-side

```ts
import { recordServerAction, recordLeadEvent } from '@/lib/context7';

await recordServerAction({
  action: 'admin_asset_update',
  user: { id: userId, email },
  metadata: { assetId },
  result: 'success'
});

await recordLeadEvent({
  leadId,
  assetId,
  email,
  status: 'NEW'
});
```

### Health-check

- Endpoint: `GET /api/context7/health`
- Retorno: `{ success, status, timestamp, error? }`
- Use em monitoramentos/vercel checks para validar conectividade com o Context7.

## Recursos Extras

- **Feature flags & Experimentos:** gerados determinísticamente a partir do `visitorId`, disponíveis via `useContext7`.
- **User scoring:** cálculo heurístico exposto no bootstrap (pode ser lido no client ou server para segmentação).
- **Logs customizados:** enviar qualquer payload para `/api/context7/logs` (server ou client) para rastrear funnels específicos.

Com esses componentes é possível adicionar novos eventos sem tocar na infraestrutura principal: basta chamar `trackEvent` no client ou `recordServerAction` no server/API.


