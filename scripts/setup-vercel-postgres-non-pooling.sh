#!/bin/bash

# Script para configurar POSTGRES_URL_NON_POOLING no Vercel
# Este script ajuda a adicionar a variável de ambiente no Vercel via CLI

set -e

echo "🚀 Configuração de POSTGRES_URL_NON_POOLING no Vercel"
echo "=================================================="
echo ""

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não está instalado!"
    echo ""
    echo "📦 Instale com:"
    echo "   npm install -g vercel"
    echo ""
    echo "Ou configure manualmente no dashboard:"
    echo "   https://vercel.com/dashboard"
    exit 1
fi

echo "✅ Vercel CLI encontrado"
echo ""

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Você não está logado no Vercel CLI"
    echo ""
    echo "🔐 Faça login com:"
    echo "   vercel login"
    echo ""
    exit 1
fi

echo "✅ Logado no Vercel"
echo ""

# Solicitar connection string
echo "📝 Por favor, forneça a connection string do Supabase:"
echo ""
echo "   Como obter:"
echo "   1. Acesse: https://app.supabase.com"
echo "   2. Selecione seu projeto"
echo "   3. Settings → Database"
echo "   4. Connection string → URI (NÃO Transaction Pooler)"
echo ""
read -p "   Cole a connection string aqui: " POSTGRES_URL_NON_POOLING

if [ -z "$POSTGRES_URL_NON_POOLING" ]; then
    echo "❌ Connection string não fornecida!"
    exit 1
fi

# Validar formato
if [[ ! "$POSTGRES_URL_NON_POOLING" =~ ^postgresql:// ]] && [[ ! "$POSTGRES_URL_NON_POOLING" =~ ^postgres:// ]]; then
    echo "⚠️  Aviso: A connection string não parece ser válida (deve começar com postgresql:// ou postgres://)"
    read -p "   Continuar mesmo assim? (s/n): " CONTINUE
    if [ "$CONTINUE" != "s" ] && [ "$CONTINUE" != "S" ]; then
        exit 1
    fi
fi

echo ""
echo "🔧 Configurando POSTGRES_URL_NON_POOLING no Vercel..."
echo ""

# Adicionar para Production
echo "📦 Adicionando para Production..."
echo "$POSTGRES_URL_NON_POOLING" | vercel env add POSTGRES_URL_NON_POOLING production 2>&1 | grep -v "password" || {
    echo "⚠️  Erro ao adicionar para Production (pode já existir)"
}

# Adicionar para Preview
echo "📦 Adicionando para Preview..."
echo "$POSTGRES_URL_NON_POOLING" | vercel env add POSTGRES_URL_NON_POOLING preview 2>&1 | grep -v "password" || {
    echo "⚠️  Erro ao adicionar para Preview (pode já existir)"
}

# Adicionar para Development
echo "📦 Adicionando para Development..."
echo "$POSTGRES_URL_NON_POOLING" | vercel env add POSTGRES_URL_NON_POOLING development 2>&1 | grep -v "password" || {
    echo "⚠️  Erro ao adicionar para Development (pode já existir)"
}

echo ""
echo "✅ Variável POSTGRES_URL_NON_POOLING configurada!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Faça um Redeploy no Vercel Dashboard"
echo "   2. Ou execute: vercel --prod"
echo "   3. Verifique os logs do build"
echo ""
echo "🔍 Para verificar as variáveis:"
echo "   vercel env ls"
echo ""

