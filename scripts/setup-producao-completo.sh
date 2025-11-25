#!/bin/bash

# Script completo para configurar produção
# Uso: ./scripts/setup-producao-completo.sh

set -e

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 CONFIGURAÇÃO COMPLETA DE PRODUÇÃO"
echo "═══════════════════════════════════════════════════════════"
echo ""

# URL base do Supabase (já temos do usuário)
SUPABASE_HOST="db.eqkgcpbhsxjlzqozienv.supabase.co"
SUPABASE_USER="postgres"
SUPABASE_DB="postgres"
SUPABASE_PORT="5432"

# Solicitar senha
echo "📝 Por favor, insira a SENHA do banco de dados do Supabase:"
read -s DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
  echo "❌ Erro: Senha não fornecida"
  exit 1
fi

# Montar DATABASE_URL completa
DATABASE_URL="postgresql://${SUPABASE_USER}:${DB_PASSWORD}@${SUPABASE_HOST}:${SUPABASE_PORT}/${SUPABASE_DB}"

echo "✅ DATABASE_URL montada com sucesso!"
echo ""

# Perguntar se quer adicionar no Vercel
echo "🔧 Deseja adicionar DATABASE_URL no Vercel? (s/n)"
read -r ADD_VERCEL

if [ "$ADD_VERCEL" = "s" ] || [ "$ADD_VERCEL" = "S" ] || [ "$ADD_VERCEL" = "y" ] || [ "$ADD_VERCEL" = "Y" ]; then
  echo ""
  echo "📝 Verificando login no Vercel..."
  
  # Verificar se está logado
  if ! npx vercel whoami &>/dev/null; then
    echo "⚠️  Você precisa fazer login no Vercel primeiro"
    echo "📝 Executando: npx vercel login"
    npx vercel login
  fi
  
  echo ""
  echo "📝 Atualizando DATABASE_URL no Vercel..."
  echo "   (Se já existir, vamos remover e adicionar novamente)"
  
  # Remover se existir
  echo "$DATABASE_URL" | npx vercel env rm DATABASE_URL production --yes 2>/dev/null || true
  echo "$DATABASE_URL" | npx vercel env rm DATABASE_URL preview --yes 2>/dev/null || true
  echo "$DATABASE_URL" | npx vercel env rm DATABASE_URL development --yes 2>/dev/null || true
  
  # Adicionar novamente
  echo ""
  echo "📝 Adicionando DATABASE_URL para Production..."
  echo "$DATABASE_URL" | npx vercel env add DATABASE_URL production 2>/dev/null || true
  
  echo ""
  echo "📝 Adicionando DATABASE_URL para Preview..."
  echo "$DATABASE_URL" | npx vercel env add DATABASE_URL preview 2>/dev/null || true
  
  echo ""
  echo "📝 Adicionando DATABASE_URL para Development..."
  echo "$DATABASE_URL" | npx vercel env add DATABASE_URL development 2>/dev/null || true
  
  echo ""
  echo "✅ DATABASE_URL configurada no Vercel!"
  echo "💡 Se já existia, foi atualizada. Se não existia, foi criada."
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  📦 APLICANDO MIGRATIONS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Usar DATABASE_URL diretamente no comando para sobrescrever .env.local
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  👤 VERIFICANDO USUÁRIOS EXISTENTES"
echo "═══════════════════════════════════════════════════════════"
echo ""

DATABASE_URL="$DATABASE_URL" node scripts/check-users.js

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  👤 CRIANDO USUÁRIO ADMIN"
echo "═══════════════════════════════════════════════════════════"
echo ""

DATABASE_URL="$DATABASE_URL" node scripts/create-admin-user.js \
  "Admin User" \
  "brigido254@gmail.com" \
  "admin123456"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ VERIFICANDO ADMIN CRIADO"
echo "═══════════════════════════════════════════════════════════"
echo ""

DATABASE_URL="$DATABASE_URL" node scripts/check-users.js

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🎉 CONFIGURAÇÃO COMPLETA!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Credenciais de Login:"
echo "   Email: brigido254@gmail.com"
echo "   Senha: admin123456"
echo ""
echo "🌐 Teste o login em produção:"
echo "   https://sua-app.vercel.app/auth/login"
echo ""
echo "✅ Tudo pronto! Você já pode fazer login."
echo ""

