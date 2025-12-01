#!/bin/bash

# Script para configurar usuário via API route no Vercel
# Uso: ./scripts/setup-user-via-api.sh

echo "🚀 Configurando usuário admin via API..."
echo ""

# Aguardar um pouco para garantir que o deploy foi concluído
echo "⏳ Aguardando deploy do Vercel..."
sleep 5

# Fazer requisição para a API
echo "📡 Chamando API route..."
RESPONSE=$(curl -s -X POST https://smc-platform.vercel.app/api/admin/setup-user \
  -H "Content-Type: application/json" \
  -d '{"email":"brigido254@gmail.com","password":"admin123456"}')

echo ""
echo "📋 Resposta da API:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "✅ Concluído!"
echo ""
echo "💡 Agora você pode fazer login em:"
echo "   https://smc-platform.vercel.app/auth/login"
echo "   Email: brigido254@gmail.com"
echo "   Senha: admin123456"
echo ""



