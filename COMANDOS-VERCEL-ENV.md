# 🚀 COMANDOS PARA CONFIGURAR VARIÁVEIS NO VERCEL

**Execute estes comandos no terminal:**

---

## 📋 PASSO A PASSO

### 1. Verificar/Instalar Vercel CLI

```bash
# Verificar se está instalado
vercel --version

# Se não estiver, instalar
npm install -g vercel
# ou
npx vercel@latest
```

### 2. Fazer Login

```bash
vercel login
```

### 3. Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

**Copie o valor gerado** - você precisará dele no próximo passo.

### 4. Configurar Variáveis

#### DATABASE_URL
```bash
# Substitua pela sua URL do PostgreSQL
echo "postgresql://user:password@host:port/database?sslmode=require" | vercel env add DATABASE_URL production preview development
```

#### NEXTAUTH_SECRET
```bash
# Use o valor gerado no passo 3
echo "cole-aqui-o-valor-gerado" | vercel env add NEXTAUTH_SECRET production preview development
```

#### NEXTAUTH_URL
```bash
# Substitua pela URL do seu projeto
echo "https://smc-platform.vercel.app" | vercel env add NEXTAUTH_URL production preview development
```

#### GOOGLE_CLIENT_ID (opcional)
```bash
echo "seu-google-client-id" | vercel env add GOOGLE_CLIENT_ID production preview development
```

#### GOOGLE_CLIENT_SECRET (opcional)
```bash
echo "seu-google-client-secret" | vercel env add GOOGLE_CLIENT_SECRET production preview development
```

### 5. Verificar Variáveis Configuradas

```bash
vercel env ls
```

### 6. Fazer Deploy

```bash
vercel --prod
```

---

## 🎯 COMANDOS RÁPIDOS (Copie e Cole)

```bash
# 1. Login
vercel login

# 2. Gerar secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "Secret gerado: $NEXTAUTH_SECRET"

# 3. Configurar (SUBSTITUA OS VALORES)
echo "postgresql://..." | vercel env add DATABASE_URL production preview development
echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production preview development
echo "https://seu-projeto.vercel.app" | vercel env add NEXTAUTH_URL production preview development

# 4. Verificar
vercel env ls

# 5. Deploy
vercel --prod
```

---

## 📝 SCRIPTS DISPONÍVEIS

### Script Interativo
```bash
./scripts/setup-vercel-env.sh
```

### Script Rápido (gera secret e mostra comandos)
```bash
./scripts/config-env-quick.sh
```

---

## ⚠️ IMPORTANTE

- Substitua todos os valores de exemplo pelos valores reais
- `DATABASE_URL` deve ser a URL completa do seu PostgreSQL
- `NEXTAUTH_URL` deve ser a URL exata do seu projeto Vercel
- Mantenha os secrets seguros e nunca os commite

---

**Última atualização:** 23/01/2025

