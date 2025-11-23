feat: reorganização completa de lib/ e padronização de APIs

## Reorganização de Estrutura

- Criada estrutura organizada em lib/ com subpastas:
  - lib/utils/ - Utilitários compartilhados (cn, slugify)
  - lib/config/ - Configurações (site-config, design-tokens, fonts)
  - lib/api/ - Helpers de API (helpers, validators, middleware)
- Mantida compatibilidade via re-exports nos arquivos antigos
- Atualizados imports em componentes UI críticos

## Padronização de APIs

- Criados helpers padronizados em lib/api/helpers.ts:
  - apiHandler() - Wrapper com tratamento de erros
  - requireMethod() - Validação de método HTTP
  - getUserFromSession() - Busca usuário autenticado
  - successResponse() / errorResponse() - Respostas padronizadas
- Criados validadores em lib/api/validators.ts:
  - Validação de email, senha, nome, token, ID
  - Validação completa de body de registro
- Criados middlewares em lib/api/middleware.ts:
  - rateLimit() - Rate limiting simples
  - cors() - CORS básico
  - logRequest() - Logging de requisições
- Padronizadas APIs:
  - pages/api/auth/register.ts
  - pages/api/auth/verify.ts
  - pages/api/favorites/* (já padronizadas)

## Documentação Completa

- Criado README-DESENVOLVIMENTO.md - Ponto de entrada principal
- Criado docs/GUIA-RAPIDO-DESENVOLVEDOR.md - Guia rápido completo
- Criado docs/EXEMPLO-API-COMPLETA.md - Exemplo completo de API
- Criado docs/CONVENCOES-CODIGO.md - Convenções detalhadas
- Criado docs/ARQUITETURA-FRONTEND-BACKEND.md - Análise de arquitetura
- Criado docs/QUICK-START.md - Quick start em 5 minutos
- Criado docs/README.md - Índice geral da documentação
- Criado docs/INDICE-DOCUMENTACAO.md - Índice completo
- Criados resumos de implementação:
  - docs/RESUMO-REORGANIZACAO-LIB.md
  - docs/RESUMO-PADRONIZACAO-APIS.md
  - docs/IMPLEMENTACAO-COMPLETA-REORGANIZACAO.md
  - docs/RESUMO-FINAL-CONTINUACAO.md
- Atualizada docs/TECHNICAL-DOCUMENTATION.md com referências

## Melhorias

- Estrutura mais organizada e fácil de navegar
- APIs consistentes e padronizadas
- Documentação completa e acessível
- Exemplos práticos disponíveis
- Base sólida para crescimento futuro

## Breaking Changes

Nenhum - compatibilidade mantida via re-exports

