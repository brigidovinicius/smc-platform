#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel via CLI
# Uso: ./scripts/setup-vercel-env.sh

set -e

echo "🚀 Configuração de Variáveis de Ambiente no Vercel"
echo "════════════════════════════════════════════════════"
echo ""

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não está instalado."
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

# Verificar se está logado
echo "🔐 Verificando login no Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Você precisa fazer login no Vercel."
    echo "🔑 Executando: vercel login"
    vercel login
fi

# Vincular ao projeto
echo ""
echo "🔗 Vinculando ao projeto smc-platform..."
vercel link --project smc-platform --yes

echo ""
echo "════════════════════════════════════════════════════"
echo "📋 Variáveis que serão configuradas:"
echo ""
echo "1. DATABASE_URL (obrigatória)"
echo "2. NEXTAUTH_SECRET (obrigatória - será gerada automaticamente)"
echo "3. NEXTAUTH_URL (obrigatória)"
echo ""
echo "════════════════════════════════════════════════════"
echo ""

# Perguntar se quer continuar
read -p "Deseja continuar? (s/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operação cancelada."
    exit 1
fi

# 1. DATABASE_URL
echo ""
echo "1️⃣  Configurando DATABASE_URL..."
echo "   Por favor, forneça a URL do seu banco de dados PostgreSQL:"
echo "   (Formato: postgresql://usuario:senha@host:porta/banco?sslmode=require)"
read -p "   DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não pode estar vazia!"
    exit 1
fi

echo "   ✅ Adicionando DATABASE_URL..."
echo "$DATABASE_URL" | vercel env add DATABASE_URL production preview development

# 2. NEXTAUTH_SECRET
echo ""
echo "2️⃣  Gerando e configurando NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "   ✅ Secret gerado: $NEXTAUTH_SECRET"
echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production preview development
echo "   ✅ NEXTAUTH_SECRET adicionado!"

# 3. NEXTAUTH_URL
echo ""
echo "3️⃣  Configurando NEXTAUTH_URL..."
NEXTAUTH_URL="https://smc-platform.vercel.app"
echo "   ✅ URL: $NEXTAUTH_URL"
echo "$NEXTAUTH_URL" | vercel env add NEXTAUTH_URL production preview development
echo "   ✅ NEXTAUTH_URL adicionado!"

# Variáveis opcionais
echo ""
echo "════════════════════════════════════════════════════"
read -p "Deseja configurar variáveis opcionais? (Google OAuth, SMTP) (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    # GOOGLE_CLIENT_ID
    echo ""
    read -p "GOOGLE_CLIENT_ID (ou Enter para pular): " GOOGLE_CLIENT_ID
    if [ ! -z "$GOOGLE_CLIENT_ID" ]; then
        echo "$GOOGLE_CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID production preview development
        echo "   ✅ GOOGLE_CLIENT_ID adicionado!"
    fi

    # GOOGLE_CLIENT_SECRET
    echo ""
    read -p "GOOGLE_CLIENT_SECRET (ou Enter para pular): " GOOGLE_CLIENT_SECRET
    if [ ! -z "$GOOGLE_CLIENT_SECRET" ]; then
        echo "$GOOGLE_CLIENT_SECRET" | vercel env add GOOGLE_CLIENT_SECRET production preview development
        echo "   ✅ GOOGLE_CLIENT_SECRET adicionado!"
    fi
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "✅ Configuração concluída!"
echo ""
echo "📋 Resumo das variáveis configuradas:"
echo "   - DATABASE_URL: ✅"
echo "   - NEXTAUTH_SECRET: ✅ ($NEXTAUTH_SECRET)"
echo "   - NEXTAUTH_URL: ✅ ($NEXTAUTH_URL)"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Faça um redeploy no Vercel ou:"
echo "      git commit --allow-empty -m 'trigger redeploy' && git push"
echo "   2. Aguarde o deploy terminar"
echo "   3. Teste o login em: https://smc-platform.vercel.app/auth/login"
echo ""
echo "📖 Para mais informações: docs/GUIA-RAPIDO-VERCEL-ENV.md"
echo "════════════════════════════════════════════════════"

