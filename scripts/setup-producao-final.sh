#!/bin/bash

# Script final que ignora .env.local completamente
set -e

if [ -z "$1" ]; then
  echo "❌ Erro: Senha não fornecida"
  echo ""
  echo "Uso: ./scripts/setup-producao-final.sh \"sua_senha\""
  exit 1
fi

DB_PASSWORD="$1"
SUPABASE_HOST="db.eqkgcpbhsxjlzqozienv.supabase.co"
FULL_DB_URL="postgresql://postgres:${DB_PASSWORD}@${SUPABASE_HOST}:5432/postgres"

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 CONFIGURAÇÃO DE PRODUÇÃO"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Remover .env.local temporariamente
ENV_BACKUP=""
if [ -f .env.local ]; then
  ENV_BACKUP=".env.local.backup.$$"
  mv .env.local "$ENV_BACKUP"
  echo "📝 Arquivo .env.local temporariamente renomeado"
fi

# Criar .env temporário apenas com DATABASE_URL de produção
echo "DATABASE_URL=\"$FULL_DB_URL\"" > .env.tmp

echo "📦 Aplicando migrations..."
DATABASE_URL="$FULL_DB_URL" npx prisma migrate deploy --schema=./prisma/schema.prisma

echo ""
echo "👤 Verificando usuários existentes..."
DATABASE_URL="$FULL_DB_URL" node scripts/check-users.js

echo ""
echo "👤 Criando usuário admin..."
DATABASE_URL="$FULL_DB_URL" node scripts/create-admin-user.js \
  "Admin User" \
  "brigido254@gmail.com" \
  "admin123456"

echo ""
echo "✅ Verificando admin criado..."
DATABASE_URL="$FULL_DB_URL" node scripts/check-users.js

# Restaurar .env.local se existia
if [ -n "$ENV_BACKUP" ] && [ -f "$ENV_BACKUP" ]; then
  mv "$ENV_BACKUP" .env.local
  echo "✅ Arquivo .env.local restaurado"
fi

# Limpar .env temporário
rm -f .env.tmp

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🎉 CONFIGURAÇÃO COMPLETA!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Credenciais de Login:"
echo "   Email: brigido254@gmail.com"
echo "   Senha: admin123456"
echo ""
echo "🌐 Teste o login em produção!"
echo ""

