#!/bin/bash

# Script simplificado para configurar variáveis no Vercel
# Sintaxe correta: vercel env add <name> <environment>

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Configuração de Variáveis Vercel${NC}\n"

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo "❌ Faça login primeiro: vercel login"
    exit 1
fi

echo -e "${GREEN}✅ Logado como: $(vercel whoami)${NC}\n"

# Gerar NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo -e "${BLUE}🔑 NEXTAUTH_SECRET gerado: ${NEXTAUTH_SECRET}${NC}\n"

# NEXTAUTH_URL
NEXTAUTH_URL="https://smc-platform.vercel.app"

echo -e "${YELLOW}📝 COMANDOS PARA EXECUTAR:${NC}\n"

echo "# 1. NEXTAUTH_SECRET (para production):"
echo "echo '$NEXTAUTH_SECRET' | vercel env add NEXTAUTH_SECRET production"
echo ""

echo "# 2. NEXTAUTH_SECRET (para preview):"
echo "echo '$NEXTAUTH_SECRET' | vercel env add NEXTAUTH_SECRET preview"
echo ""

echo "# 3. NEXTAUTH_SECRET (para development):"
echo "echo '$NEXTAUTH_SECRET' | vercel env add NEXTAUTH_SECRET development"
echo ""

echo "# 4. NEXTAUTH_URL (para production):"
echo "echo '$NEXTAUTH_URL' | vercel env add NEXTAUTH_URL production"
echo ""

echo "# 5. NEXTAUTH_URL (para preview):"
echo "echo '$NEXTAUTH_URL' | vercel env add NEXTAUTH_URL preview"
echo ""

echo "# 6. NEXTAUTH_URL (para development):"
echo "echo '$NEXTAUTH_URL' | vercel env add NEXTAUTH_URL development"
echo ""

echo "# 7. DATABASE_URL (para production) - SUBSTITUA A URL:"
echo "echo 'postgresql://user:pass@host:port/db?sslmode=require' | vercel env add DATABASE_URL production"
echo ""

echo "# 8. DATABASE_URL (para preview) - SUBSTITUA A URL:"
echo "echo 'postgresql://user:pass@host:port/db?sslmode=require' | vercel env add DATABASE_URL preview"
echo ""

echo "# 9. DATABASE_URL (para development) - SUBSTITUA A URL:"
echo "echo 'postgresql://user:pass@host:port/db?sslmode=require' | vercel env add DATABASE_URL development"
echo ""

echo -e "${GREEN}📋 Verificar após configurar:${NC}"
echo "vercel env ls"
echo ""

echo -e "${GREEN}🚀 Deploy:${NC}"
echo "vercel --prod"

