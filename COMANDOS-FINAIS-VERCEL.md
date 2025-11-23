# 🎯 COMANDOS FINAIS PARA CONFIGURAR VERCEL

## ✅ Status Atual

Executei tentativas de configuração. Verifique o status com:

```bash
vercel env ls
```

---

## 📋 COMANDOS PARA EXECUTAR (Copie e Cole)

### 1. NEXTAUTH_SECRET (para todos os ambientes)

```bash
# Gerar secret
SECRET=$(openssl rand -base64 32)
echo "Secret: $SECRET"

# Configurar para production
echo "$SECRET" | vercel env add NEXTAUTH_SECRET production

# Configurar para preview  
echo "$SECRET" | vercel env add NEXTAUTH_SECRET preview

# Configurar para development
echo "$SECRET" | vercel env add NEXTAUTH_SECRET development
```

### 2. NEXTAUTH_URL (para todos os ambientes)

```bash
# Production
echo "https://smc-platform.vercel.app" | vercel env add NEXTAUTH_URL production

# Preview
echo "https://smc-platform.vercel.app" | vercel env add NEXTAUTH_URL preview

# Development
echo "https://smc-platform.vercel.app" | vercel env add NEXTAUTH_URL development
```

### 3. DATABASE_URL (SUBSTITUA pela sua URL real)

```bash
# Production
echo "postgresql://usuario:senha@host:porta/database?sslmode=require" | vercel env add DATABASE_URL production

# Preview
echo "postgresql://usuario:senha@host:porta/database?sslmode=require" | vercel env add DATABASE_URL preview

# Development
echo "postgresql://usuario:senha@host:porta/database?sslmode=require" | vercel env add DATABASE_URL development
```

---

## 🔍 Verificar Configuração

```bash
vercel env ls
```

Você deve ver 3 variáveis configuradas para cada ambiente:
- ✅ DATABASE_URL
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL

---

## 🚀 Deploy

Após configurar todas as variáveis:

```bash
vercel --prod
```

---

## 📝 Script Rápido (Tudo em Um)

```bash
# Gerar e configurar NEXTAUTH_SECRET
SECRET=$(openssl rand -base64 32)
echo "$SECRET" | vercel env add NEXTAUTH_SECRET production
echo "$SECRET" | vercel env add NEXTAUTH_SECRET preview
echo "$SECRET" | vercel env add NEXTAUTH_SECRET development

# Configurar NEXTAUTH_URL
echo "https://smc-platform.vercel.app" | vercel env add NEXTAUTH_URL production
echo "https://smc-platform.vercel.app" | vercel env add NEXTAUTH_URL preview
echo "https://smc-platform.vercel.app" | vercel env add NEXTAUTH_URL development

# DATABASE_URL (SUBSTITUA)
echo "SUA_URL_POSTGRESQL" | vercel env add DATABASE_URL production
echo "SUA_URL_POSTGRESQL" | vercel env add DATABASE_URL preview
echo "SUA_URL_POSTGRESQL" | vercel env add DATABASE_URL development

# Verificar
vercel env ls

# Deploy
vercel --prod
```

---

## ⚠️ IMPORTANTE

- Cada variável precisa ser configurada **separadamente** para cada ambiente
- O `DATABASE_URL` você precisa fornecer (não pode ser gerado automaticamente)
- Mantenha os secrets seguros e nunca os commite

---

**Última atualização:** 23/01/2025

