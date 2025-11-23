#!/bin/bash

# Script para configurar DATABASE_URL do Supabase no Vercel

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🗄️  Configuração de DATABASE_URL (Supabase) no Vercel${NC}\n"

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Faça login primeiro: vercel login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logado como: $(vercel whoami)${NC}\n"

# Project ref do Supabase
PROJECT_REF="eqkgcpbhsxjlzqozienv"

echo -e "${BLUE}📋 Projeto Supabase: ${PROJECT_REF}${NC}\n"

echo -e "${YELLOW}📝 Forneça a senha do banco PostgreSQL do Supabase:${NC}"
echo -e "${BLUE}   (Encontre em: https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database)${NC}"
echo ""
read -sp "Senha do PostgreSQL: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Senha não pode estar vazia${NC}"
    exit 1
fi

# Perguntar qual tipo de conexão
echo ""
echo -e "${YELLOW}Escolha o tipo de conexão:${NC}"
echo "1) Direct connection (porta 5432) - Recomendado para desenvolvimento"
echo "2) Connection pooling (porta 6543) - Recomendado para produção"
read -p "Escolha (1 ou 2): " CONNECTION_TYPE

if [ "$CONNECTION_TYPE" = "2" ]; then
    echo -e "${YELLOW}📝 Forneça a região do Supabase (ex: us-east-1, eu-west-1):${NC}"
    read -p "Região: " REGION
    
    if [ -z "$REGION" ]; then
        REGION="us-east-1"
        echo -e "${BLUE}Usando região padrão: ${REGION}${NC}"
    fi
    
    DB_URL="postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-${REGION}.pooler.supabase.com:6543/postgres?sslmode=require"
else
    DB_URL="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres?sslmode=require"
fi

echo ""
echo -e "${BLUE}🚀 Configurando DATABASE_URL para todos os ambientes...${NC}\n"
echo -e "${YELLOW}URL: ${DB_URL//:${DB_PASSWORD}@/:****@}${NC}\n"

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
vercel env ls | grep -E "DATABASE|name"

echo ""
echo -e "${GREEN}🎉 Configuração concluída!${NC}"
echo -e "${BLUE}🚀 Próximo passo: vercel --prod${NC}"

