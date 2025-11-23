#!/bin/bash

# Script automático para configurar Supabase com valores padrão

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🗄️  Configuração Automática de DATABASE_URL (Supabase)${NC}\n"

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Faça login primeiro: vercel login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logado como: $(vercel whoami)${NC}\n"

PROJECT_REF="eqkgcpbhsxjlzqozienv"
REGION="us-east-1"  # Região padrão mais comum

echo -e "${BLUE}📋 Projeto Supabase: ${PROJECT_REF}${NC}"
echo -e "${BLUE}🌍 Região: ${REGION} (padrão)${NC}\n"

echo -e "${YELLOW}📝 Forneça a senha do banco PostgreSQL do Supabase:${NC}"
echo -e "${BLUE}   (Encontre em: https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database)${NC}"
echo ""
read -sp "Senha do PostgreSQL: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Senha não pode estar vazia${NC}"
    exit 1
fi

# Usar Connection Pooling (recomendado para produção)
DB_URL="postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-${REGION}.pooler.supabase.com:6543/postgres?sslmode=require"

echo ""
echo -e "${BLUE}🚀 Configurando DATABASE_URL (Connection Pooling) para todos os ambientes...${NC}\n"
echo -e "${YELLOW}URL: ${DB_URL//:${DB_PASSWORD}@/:****@}${NC}\n"

# Production
echo -e "${YELLOW}Configurando para Production...${NC}"
echo "$DB_URL" | vercel env add DATABASE_URL production 2>&1 | grep -E "Added|Saving|Error" || true
echo ""

# Preview
echo -e "${YELLOW}Configurando para Preview...${NC}"
echo "$DB_URL" | vercel env add DATABASE_URL preview 2>&1 | grep -E "Added|Saving|Error" || true
echo ""

# Development
echo -e "${YELLOW}Configurando para Development...${NC}"
echo "$DB_URL" | vercel env add DATABASE_URL development 2>&1 | grep -E "Added|Saving|Error" || true
echo ""

echo -e "${GREEN}✅ DATABASE_URL configurada para todos os ambientes!${NC}\n"

echo -e "${BLUE}📋 Verificar configuração:${NC}"
vercel env ls | grep -E "DATABASE|name" | head -10

echo ""
echo -e "${GREEN}🎉 Configuração concluída!${NC}"
echo -e "${BLUE}🚀 Próximo passo: vercel --prod${NC}"

