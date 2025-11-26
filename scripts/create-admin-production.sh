#!/bin/bash

# Script para criar admin no banco de produção
# Uso: ./scripts/create-admin-production.sh "sua_url_postgres"

echo "🚀 Criando admin no banco de produção..."
echo ""

if [ -z "$1" ]; then
  echo "❌ Erro: DATABASE_URL não fornecido"
  echo ""
  echo "Uso: ./scripts/create-admin-production.sh 'postgresql://user:pass@host:port/db'"
  echo ""
  echo "💡 Para obter a DATABASE_URL:"
  echo "   1. Acesse: https://vercel.com"
  echo "   2. Vá em: Settings → Environment Variables"
  echo "   3. Copie o valor de DATABASE_URL"
  exit 1
fi

DATABASE_URL="$1"

echo "📋 Verificando usuários existentes..."
DATABASE_URL="$DATABASE_URL" node scripts/check-users.js

echo ""
echo "📝 Criando admin..."
DATABASE_URL="$DATABASE_URL" node scripts/create-admin-user.js \
  "Admin User" \
  "brigido254@gmail.com" \
  "admin123456"

echo ""
echo "✅ Verificando se foi criado..."
DATABASE_URL="$DATABASE_URL" node scripts/check-users.js

echo ""
echo "🎉 Admin criado com sucesso!"
echo ""
echo "📋 Credenciais:"
echo "   Email: brigido254@gmail.com"
echo "   Senha: admin123456"
echo ""
echo "🌐 Teste o login em: https://sua-app.vercel.app/auth/login"


