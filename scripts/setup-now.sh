#!/bin/bash

# Script para configurar POSTGRES_URL_NON_POOLING rapidamente
# Uso: ./scripts/setup-now.sh "postgresql://..."

if [ -z "$1" ]; then
    echo "❌ Erro: Connection string não fornecida!"
    echo ""
    echo "Uso: ./scripts/setup-now.sh \"postgresql://postgres:senha@host:5432/postgres?sslmode=require\""
    exit 1
fi

CONNECTION_STRING="$1"

echo "🚀 Configurando POSTGRES_URL_NON_POOLING no Vercel..."
echo ""

# Validar formato
if [[ ! "$CONNECTION_STRING" =~ ^postgresql:// ]] && [[ ! "$CONNECTION_STRING" =~ ^postgres:// ]]; then
    echo "⚠️  Aviso: Connection string não parece ser válida"
    echo "   (deve começar com postgresql:// ou postgres://)"
    read -p "   Continuar mesmo assim? (s/n): " CONTINUE
    if [ "$CONTINUE" != "s" ] && [ "$CONTINUE" != "S" ]; then
        exit 1
    fi
fi

echo "📦 Adicionando para Production..."
echo "$CONNECTION_STRING" | npx vercel env add POSTGRES_URL_NON_POOLING production 2>&1 | grep -v "password" || echo "   (pode já existir)"

echo "📦 Adicionando para Preview..."
echo "$CONNECTION_STRING" | npx vercel env add POSTGRES_URL_NON_POOLING preview 2>&1 | grep -v "password" || echo "   (pode já existir)"

echo "📦 Adicionando para Development..."
echo "$CONNECTION_STRING" | npx vercel env add POSTGRES_URL_NON_POOLING development 2>&1 | grep -v "password" || echo "   (pode já existir)"

echo ""
echo "✅ POSTGRES_URL_NON_POOLING configurado!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Faça um Redeploy no Vercel Dashboard"
echo "   2. Verifique os logs do build"
echo "   3. Teste cadastro/login"
echo ""

