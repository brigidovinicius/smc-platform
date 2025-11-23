#!/bin/bash

# Script para configurar DATABASE_URL no Vercel

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🗄️  Configuração de DATABASE_URL no Vercel${NC}\n"

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Faça login primeiro: vercel login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logado como: $(vercel whoami)${NC}\n"

# Solicitar DATABASE_URL
echo -e "${YELLOW}📝 Forneça a URL do PostgreSQL:${NC}"
echo -e "${BLUE}   Formato: postgresql://usuario:senha@host:porta/database?sslmode=require${NC}"
echo ""
read -p "DATABASE_URL: " DB_URL

if [ -z "$DB_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL não pode estar vazio${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Configurando DATABASE_URL para todos os ambientes...${NC}\n"

# Production
echo -e "${YELLOW}Configurando para Production...${NC}"
echo "$DB_URL" | vercel env add DATABASE_URL production 2>&1 | grep -v "^$" || true
echo ""

# Preview
echo -e "${YELLOW}Configurando para Preview...${NC}"
echo "$DB_URL" | vercel env add DATABASE_URL preview 2>&1 | grep -v "^$" || true
echo ""

# Development
echo -e "${YELLOW}Configurando para Development...${NC}"
echo "$DB_URL" | vercel env add DATABASE_URL development 2>&1 | grep -v "^$" || true
echo ""

echo -e "${GREEN}✅ DATABASE_URL configurada para todos os ambientes!${NC}\n"

echo -e "${BLUE}📋 Verificar configuração:${NC}"
vercel env ls

echo ""
echo -e "${GREEN}🎉 Configuração concluída!${NC}"
echo -e "${BLUE}🚀 Próximo passo: vercel --prod${NC}"

