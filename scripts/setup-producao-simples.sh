#!/bin/bash

# Script simplificado - recebe senha como parâmetro
# Uso: ./scripts/setup-producao-simples.sh "sua_senha_aqui"

set -e

if [ -z "$1" ]; then
  echo "❌ Erro: Senha não fornecida"
  echo ""
  echo "Uso: ./scripts/setup-producao-simples.sh \"sua_senha\""
  echo ""
  echo "Exemplo:"
  echo "  ./scripts/setup-producao-simples.sh \"minhasenha123\""
  exit 1
fi

DB_PASSWORD="$1"
SUPABASE_HOST="db.eqkgcpbhsxjlzqozienv.supabase.co"
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@${SUPABASE_HOST}:5432/postgres"

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 CONFIGURAÇÃO DE PRODUÇÃO"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "📦 Aplicando migrations..."
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy

echo ""
echo "👤 Verificando usuários existentes..."
DATABASE_URL="$DATABASE_URL" node scripts/check-users.js

echo ""
echo "👤 Criando usuário admin..."
DATABASE_URL="$DATABASE_URL" node scripts/create-admin-user.js \
  "Admin User" \
  "brigido254@gmail.com" \
  "admin123456"

echo ""
echo "✅ Verificando admin criado..."
DATABASE_URL="$DATABASE_URL" node scripts/check-users.js

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

