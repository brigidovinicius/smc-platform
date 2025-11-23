#!/bin/bash

# Script principal - Execute este para configurar tudo automaticamente

echo "🚀 CONFIGURAÇÃO AUTOMÁTICA VERCEL"
echo "=================================="
echo ""

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "❌ Faça login primeiro:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Logado como: $(vercel whoami)"
echo ""

# Detectar projeto
PROJECT_NAME=$(vercel project ls 2>/dev/null | grep -i "saas-market-cap" | head -1 | awk '{print $1}' || echo "saas-market-cap")
echo "📦 Projeto: $PROJECT_NAME"
echo ""

# Gerar NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "🔑 NEXTAUTH_SECRET gerado"
echo ""

# Detectar URL
NEXTAUTH_URL="https://smc-platform.vercel.app"
echo "🌐 NEXTAUTH_URL: $NEXTAUTH_URL"
echo ""

echo "📝 CONFIGURE AS VARIÁVEIS:"
echo ""
echo "1. DATABASE_URL (obrigatório):"
echo "   echo 'postgresql://user:pass@host:port/db?sslmode=require' | vercel env add DATABASE_URL production preview development"
echo ""
echo "2. NEXTAUTH_SECRET:"
echo "   echo '$NEXTAUTH_SECRET' | vercel env add NEXTAUTH_SECRET production preview development"
echo ""
echo "3. NEXTAUTH_URL:"
echo "   echo '$NEXTAUTH_URL' | vercel env add NEXTAUTH_URL production preview development"
echo ""
echo "4. Verificar:"
echo "   vercel env ls"
echo ""
echo "5. Deploy:"
echo "   vercel --prod"
echo ""

# Perguntar se quer executar automaticamente
read -p "Deseja configurar automaticamente? (s/N): " AUTO
if [[ "$AUTO" =~ ^[Ss]$ ]]; then
    echo ""
    echo "⚠️  Você precisará fornecer os valores:"
    echo ""
    
    # DATABASE_URL
    read -p "DATABASE_URL: " DB_URL
    if [ ! -z "$DB_URL" ]; then
        echo "$DB_URL" | vercel env add DATABASE_URL production preview development
        echo "✅ DATABASE_URL configurada"
    fi
    
    # NEXTAUTH_SECRET
    echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production preview development
    echo "✅ NEXTAUTH_SECRET configurada"
    
    # NEXTAUTH_URL
    echo "$NEXTAUTH_URL" | vercel env add NEXTAUTH_URL production preview development
    echo "✅ NEXTAUTH_URL configurada"
    
    echo ""
    echo "🎉 Variáveis configuradas!"
    echo ""
    echo "📋 Verificar:"
    vercel env ls
    
    echo ""
    read -p "Deseja fazer deploy agora? (s/N): " DEPLOY
    if [[ "$DEPLOY" =~ ^[Ss]$ ]]; then
        echo ""
        echo "🚀 Fazendo deploy..."
        vercel --prod
    fi
else
    echo ""
    echo "📋 Copie e execute os comandos acima manualmente"
fi

