#!/bin/bash

# Script rápido para configurar variáveis essenciais
# Uso: ./scripts/config-env-quick.sh

echo "🚀 Configuração Rápida de Variáveis Vercel"
echo ""

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo "❌ Faça login primeiro: vercel login"
    exit 1
fi

echo "✅ Logado como: $(vercel whoami)"
echo ""

# Gerar NEXTAUTH_SECRET automaticamente
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "🔑 NEXTAUTH_SECRET gerado: $NEXTAUTH_SECRET"
echo ""

# Instruções
echo "📝 Execute os comandos abaixo (substitua os valores):"
echo ""
echo "# 1. DATABASE_URL"
echo "echo 'postgresql://user:password@host:port/database?sslmode=require' | vercel env add DATABASE_URL production preview development"
echo ""
echo "# 2. NEXTAUTH_SECRET (já gerado acima)"
echo "echo '$NEXTAUTH_SECRET' | vercel env add NEXTAUTH_SECRET production preview development"
echo ""
echo "# 3. NEXTAUTH_URL"
echo "echo 'https://seu-projeto.vercel.app' | vercel env add NEXTAUTH_URL production preview development"
echo ""
echo "# 4. Verificar"
echo "vercel env ls"
echo ""

