#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configurando variáveis de ambiente no Vercel...${NC}\n"

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você precisa fazer login primeiro:${NC}"
    echo "vercel login"
    exit 1
fi

echo -e "${GREEN}✅ Logado no Vercel como: $(vercel whoami)${NC}\n"

# Variáveis obrigatórias
echo -e "${BLUE}📝 Configure as variáveis obrigatórias:${NC}\n"

# DATABASE_URL
echo -e "${YELLOW}1. DATABASE_URL${NC}"
read -p "   URL do PostgreSQL (ou Enter para pular): " DB_URL
if [ ! -z "$DB_URL" ]; then
    echo "$DB_URL" | vercel env add DATABASE_URL production preview development
    echo -e "${GREEN}   ✅ DATABASE_URL configurada${NC}\n"
else
    echo -e "${YELLOW}   ⏭️  Pulado${NC}\n"
fi

# NEXTAUTH_SECRET
echo -e "${YELLOW}2. NEXTAUTH_SECRET${NC}"
read -p "   Secret (Enter para gerar automaticamente): " NEXTAUTH_SECRET
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo -e "${BLUE}   🔑 Gerado: ${NEXTAUTH_SECRET}${NC}"
fi
echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production preview development
echo -e "${GREEN}   ✅ NEXTAUTH_SECRET configurada${NC}\n"

# NEXTAUTH_URL
echo -e "${YELLOW}3. NEXTAUTH_URL${NC}"
read -p "   URL da aplicação (ex: https://smc-platform.vercel.app): " NEXTAUTH_URL
if [ ! -z "$NEXTAUTH_URL" ]; then
    echo "$NEXTAUTH_URL" | vercel env add NEXTAUTH_URL production preview development
    echo -e "${GREEN}   ✅ NEXTAUTH_URL configurada${NC}\n"
else
    echo -e "${YELLOW}   ⏭️  Pulado${NC}\n"
fi

# GOOGLE_CLIENT_ID (opcional)
echo -e "${YELLOW}4. GOOGLE_CLIENT_ID (opcional)${NC}"
read -p "   Google Client ID (ou Enter para pular): " GOOGLE_CLIENT_ID
if [ ! -z "$GOOGLE_CLIENT_ID" ]; then
    echo "$GOOGLE_CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID production preview development
    echo -e "${GREEN}   ✅ GOOGLE_CLIENT_ID configurada${NC}\n"
else
    echo -e "${YELLOW}   ⏭️  Pulado${NC}\n"
fi

# GOOGLE_CLIENT_SECRET (opcional)
echo -e "${YELLOW}5. GOOGLE_CLIENT_SECRET (opcional)${NC}"
read -p "   Google Client Secret (ou Enter para pular): " GOOGLE_CLIENT_SECRET
if [ ! -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "$GOOGLE_CLIENT_SECRET" | vercel env add GOOGLE_CLIENT_SECRET production preview development
    echo -e "${GREEN}   ✅ GOOGLE_CLIENT_SECRET configurada${NC}\n"
else
    echo -e "${YELLOW}   ⏭️  Pulado${NC}\n"
fi

echo -e "${GREEN}🎉 Configuração concluída!${NC}\n"
echo -e "${BLUE}📋 Verificar variáveis configuradas:${NC}"
echo "vercel env ls"
echo ""
echo -e "${BLUE}🚀 Fazer deploy:${NC}"
echo "vercel --prod"

