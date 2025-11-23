#!/bin/bash

# Script automático para configurar variáveis de ambiente no Vercel
# Lê valores do .env.local (se existir) ou pede ao usuário

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Configuração Automática de Variáveis Vercel${NC}\n"

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Faça login primeiro: vercel login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Logado como: $(vercel whoami)${NC}\n"

# Ler .env.local se existir
if [ -f .env.local ]; then
    echo -e "${BLUE}📄 Lendo .env.local...${NC}\n"
    source .env.local
fi

# Função para adicionar variável
add_env_var() {
    local VAR_NAME=$1
    local VAR_VALUE=$2
    local PROMPT=$3
    
    if [ -z "$VAR_VALUE" ]; then
        read -p "$PROMPT: " VAR_VALUE
    fi
    
    if [ ! -z "$VAR_VALUE" ]; then
        echo "$VAR_VALUE" | vercel env add "$VAR_NAME" production preview development 2>&1 | grep -v "^$" || true
        echo -e "${GREEN}✅ $VAR_NAME configurada${NC}\n"
    else
        echo -e "${YELLOW}⏭️  $VAR_NAME pulada${NC}\n"
    fi
}

# DATABASE_URL
add_env_var "DATABASE_URL" "$DATABASE_URL" "DATABASE_URL (PostgreSQL)"

# NEXTAUTH_SECRET
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo -e "${BLUE}🔑 NEXTAUTH_SECRET gerado automaticamente${NC}"
fi
add_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "NEXTAUTH_SECRET (Enter para usar o gerado)"

# NEXTAUTH_URL
if [ -z "$NEXTAUTH_URL" ]; then
    # Tentar descobrir a URL do projeto
    PROJECT_URL=$(vercel project ls 2>/dev/null | grep -i "saas-market-cap" | head -1 | awk '{print $NF}' || echo "")
    if [ ! -z "$PROJECT_URL" ]; then
        NEXTAUTH_URL="https://$PROJECT_URL.vercel.app"
        echo -e "${BLUE}🌐 NEXTAUTH_URL detectada: $NEXTAUTH_URL${NC}"
    fi
fi
add_env_var "NEXTAUTH_URL" "$NEXTAUTH_URL" "NEXTAUTH_URL"

# GOOGLE_CLIENT_ID (opcional)
add_env_var "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_ID (opcional, Enter para pular)"

# GOOGLE_CLIENT_SECRET (opcional)
add_env_var "GOOGLE_CLIENT_SECRET" "$GOOGLE_CLIENT_SECRET" "GOOGLE_CLIENT_SECRET (opcional, Enter para pular)"

echo -e "${GREEN}🎉 Configuração concluída!${NC}\n"
echo -e "${BLUE}📋 Verificar variáveis:${NC}"
vercel env ls

echo ""
echo -e "${BLUE}🚀 Próximo passo:${NC}"
echo "vercel --prod"

