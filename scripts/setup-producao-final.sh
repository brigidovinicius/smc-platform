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

# Escapar caracteres especiais na senha (especialmente #)
ESCAPED_PASSWORD=$(printf '%s' "$DB_PASSWORD" | sed 's/#/%23/g' | sed 's/@/%40/g' | sed 's/:/%3A/g' | sed 's/\//%2F/g' | sed 's/ /%20/g')
FULL_DB_URL="postgresql://postgres:${ESCAPED_PASSWORD}@${SUPABASE_HOST}:5432/postgres"

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 CONFIGURAÇÃO DE PRODUÇÃO"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Remover .env.local e .env temporariamente
ENV_LOCAL_BACKUP=""
ENV_BACKUP=""
if [ -f .env.local ]; then
  ENV_LOCAL_BACKUP=".env.local.backup.$$"
  mv .env.local "$ENV_LOCAL_BACKUP"
  echo "📝 Arquivo .env.local temporariamente renomeado"
fi
if [ -f .env ]; then
  ENV_BACKUP=".env.backup.$$"
  mv .env "$ENV_BACKUP"
  echo "📝 Arquivo .env temporariamente renomeado"
fi

# Criar .env temporário apenas com DATABASE_URL de produção
echo "DATABASE_URL=\"$FULL_DB_URL\"" > .env

# Garantir que a variável está exportada
export DATABASE_URL="$FULL_DB_URL"

echo "📦 Regenerando Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

echo ""
echo "📦 Aplicando migrations..."
echo "🔗 URL: ${FULL_DB_URL%%@*}@..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo ""
echo "👤 Verificando usuários existentes..."
node scripts/check-users.js

echo ""
echo "👤 Criando usuário admin..."
node scripts/create-admin-user.js \
  "Admin User" \
  "brigido254@gmail.com" \
  "admin123456"

echo ""
echo "✅ Verificando admin criado..."
node scripts/check-users.js

# Restaurar arquivos se existiam
if [ -n "$ENV_LOCAL_BACKUP" ] && [ -f "$ENV_LOCAL_BACKUP" ]; then
  rm -f .env.local
  mv "$ENV_LOCAL_BACKUP" .env.local
  echo "✅ Arquivo .env.local restaurado"
fi
if [ -n "$ENV_BACKUP" ] && [ -f "$ENV_BACKUP" ]; then
  rm -f .env
  mv "$ENV_BACKUP" .env
  echo "✅ Arquivo .env restaurado"
elif [ -f .env ]; then
  # Se criamos .env temporário e não havia backup, remover
  rm -f .env
  echo "✅ Arquivo .env temporário removido"
fi

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

