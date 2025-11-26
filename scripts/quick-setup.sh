#!/bin/bash
# Script rápido para configurar POSTGRES_URL_NON_POOLING

echo "🚀 Configuração Rápida - POSTGRES_URL_NON_POOLING"
echo "================================================"
echo ""
echo "📝 Cole a connection string do Supabase (URI, não Transaction Pooler):"
read -r CONNECTION_STRING

if [ -z "$CONNECTION_STRING" ]; then
    echo "❌ Connection string não fornecida!"
    exit 1
fi

echo ""
echo "🔧 Configurando no Vercel..."

for env in production preview development; do
    echo "📦 Adicionando para $env..."
    echo "$CONNECTION_STRING" | npx vercel env add POSTGRES_URL_NON_POOLING "$env" 2>&1 | grep -v "password" || echo "   (pode já existir)"
done

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Faça um Redeploy no Vercel"
echo "   2. Verifique os logs do build"
echo "   3. Teste cadastro/login"
