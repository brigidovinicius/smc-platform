#!/usr/bin/env bash
set -euo pipefail

# Variáveis obrigatórias
: "${VERCEL_TOKEN:?Defina a variável VERCEL_TOKEN}"
: "${VERCEL_SCOPE:?Defina a variável VERCEL_SCOPE (ex: seu-usuario-ou-time)}"
: "${VERCEL_LOG_ALIAS:?Defina a variável VERCEL_LOG_ALIAS (ex: smc-platform.vercel.app)}"

# Defaults
VERCEL_LOG_SINCE="${VERCEL_LOG_SINCE:-2h}"
VERCEL_PROJECT="${VERCEL_PROJECT:-saas-market-cap}"

echo "📡 Monitorando crawlers de IA no Vercel..."
echo " Projeto:  $VERCEL_PROJECT"
echo " Alias:    $VERCEL_LOG_ALIAS"
echo " Scope:    $VERCEL_SCOPE"
echo " Since:    $VERCEL_LOG_SINCE"
echo ""

# Execução do log com filtro GPTBot | CCBot
vercel logs "$VERCEL_PROJECT" \
  --since "$VERCEL_LOG_SINCE" \
  --scope "$VERCEL_SCOPE" \
  --token "$VERCEL_TOKEN" \
  --all \
  | grep -Ei "GPTBot|CCBot" || echo "⚠️ Nenhum hit de GPTBot/CCBot encontrado nesse intervalo."
