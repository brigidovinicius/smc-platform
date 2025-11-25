#!/bin/bash

# Script para configurar admin em produção
# Uso: ./scripts/setup-production-admin.sh

set -e

echo "🔧 Configuração de Admin em Produção"
echo "════════════════════════════════════════════════════"
echo ""

# Ler DATABASE_URL do .env.production
if [ ! -f .env.production ]; then
    echo "❌ Arquivo .env.production não encontrado!"
    echo "   Execute: vercel env pull .env.production --environment=production"
    exit 1
fi

DATABASE_URL=$(grep DATABASE_URL .env.production | sed 's/.*=//' | tr -d '"' | sed 's/\\n//' | sed 's/^"//' | sed 's/"$//')

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não encontrada no .env.production"
    exit 1
fi

echo "✅ DATABASE_URL encontrada"
echo ""

# Perguntar email
read -p "📧 Qual email você está usando para login? " EMAIL

if [ -z "$EMAIL" ] || [[ ! "$EMAIL" == *"@"* ]]; then
    echo "❌ Email inválido"
    exit 1
fi

# Perguntar senha
read -sp "🔑 Qual senha você quer usar? (admin123456): " PASSWORD
echo ""

if [ -z "$PASSWORD" ]; then
    PASSWORD="admin123456"
fi

if [ ${#PASSWORD} -lt 8 ]; then
    echo "❌ Senha deve ter no mínimo 8 caracteres"
    exit 1
fi

echo ""
echo "🚀 Configurando usuário no banco de produção..."
echo ""

# Executar script Node
DATABASE_URL="$DATABASE_URL" node scripts/fix-production-login.js "$EMAIL" "$PASSWORD"

echo ""
echo "✅ Concluído!"
echo ""
echo "💡 Agora você pode fazer login em:"
echo "   https://smc-platform.vercel.app/auth/login"
echo "   Email: $EMAIL"
echo "   Senha: $PASSWORD"
echo ""

