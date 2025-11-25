#!/bin/bash

# Script rápido para configurar variáveis essenciais no Vercel
# Uso: ./scripts/config-vercel-env-now.sh

set -e

echo "🚀 Configurando Variáveis de Ambiente no Vercel"
echo "════════════════════════════════════════════════════"
echo ""

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo "❌ Você precisa fazer login no Vercel primeiro:"
    echo "   vercel login"
    exit 1
fi

# Vincular ao projeto
echo "🔗 Vinculando ao projeto..."
vercel link --project smc-platform --yes 2>&1 | grep -v "already linked" || true

# Gerar NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo ""
echo "✅ NEXTAUTH_SECRET gerado: $NEXTAUTH_SECRET"

# Configurar NEXTAUTH_URL
NEXTAUTH_URL="https://smc-platform.vercel.app"
echo "✅ NEXTAUTH_URL: $NEXTAUTH_URL"

# Adicionar variáveis
echo ""
echo "📝 Adicionando variáveis no Vercel..."
echo ""

# NEXTAUTH_SECRET
echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production preview development 2>&1 | grep -v "already exists" || echo "   ⚠️  NEXTAUTH_SECRET já existe (mantendo valor atual)"
echo "   ✅ NEXTAUTH_SECRET configurado"

# NEXTAUTH_URL
echo "$NEXTAUTH_URL" | vercel env add NEXTAUTH_URL production preview development 2>&1 | grep -v "already exists" || echo "   ⚠️  NEXTAUTH_URL já existe (mantendo valor atual)"
echo "   ✅ NEXTAUTH_URL configurado"

echo ""
echo "════════════════════════════════════════════════════"
echo "⚠️  IMPORTANTE: Você ainda precisa adicionar DATABASE_URL"
echo ""
echo "Para adicionar DATABASE_URL, execute:"
echo "  vercel env add DATABASE_URL production preview development"
echo ""
echo "Quando pedir o valor, cole sua URL do banco de dados PostgreSQL."
echo "Exemplo: postgresql://postgres:senha@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
echo ""
echo "════════════════════════════════════════════════════"
echo "✅ Variáveis configuradas:"
echo "   - NEXTAUTH_SECRET: ✅"
echo "   - NEXTAUTH_URL: ✅"
echo "   - DATABASE_URL: ⚠️  PENDENTE (adicione manualmente)"
echo ""
echo "📖 Após adicionar DATABASE_URL, faça um redeploy!"
echo "════════════════════════════════════════════════════"

