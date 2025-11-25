#!/bin/bash

# Script para aplicar migrations do Prisma no Supabase

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Aplicar Migrations do Prisma no Supabase${NC}\n"

PROJECT_REF="eqkgcpbhsxjlzqozienv"

echo -e "${YELLOW}📝 Forneça a senha do banco PostgreSQL do Supabase:${NC}"
echo -e "${BLUE}   (Encontre em: https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database)${NC}"
echo ""
read -sp "Senha do PostgreSQL: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Senha não pode estar vazia${NC}"
    exit 1
fi

# Usar direct connection (porta 5432)
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres?sslmode=require"

echo ""
echo -e "${BLUE}🚀 Aplicando migrations...${NC}\n"

# Exportar DATABASE_URL e aplicar migrations
export DATABASE_URL

npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migrations aplicadas com sucesso!${NC}\n"
    echo -e "${BLUE}📋 Verificar no Supabase:${NC}"
    echo "https://supabase.com/dashboard/project/${PROJECT_REF}/database/migrations"
else
    echo ""
    echo -e "${RED}❌ Erro ao aplicar migrations${NC}"
    exit 1
fi




