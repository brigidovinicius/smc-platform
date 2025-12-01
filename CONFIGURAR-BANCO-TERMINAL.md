# 🔧 Configurar Connection String do Banco via Terminal

## Passo 1: Obter a Connection String do Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em: **Settings** → **Database**
4. Role até: **"Connection string"**
5. Clique na aba: **"URI"** (NÃO Transaction Pooler!)
6. Copie a connection string (ela terá `[YOUR-PASSWORD]` como placeholder)

## Passo 2: Verificar/Resetar a Senha (se necessário)

Se você não sabe a senha:
1. Na mesma página: **Settings** → **Database** → **"Database password"**
2. Clique em **"Reset database password"**
3. **ANOTE A SENHA** que será gerada!
4. Substitua `[YOUR-PASSWORD]` na connection string pela senha real

## Passo 3: Construir a Connection String Final

A connection string deve ter este formato:

```
postgresql://postgres:SUASENHA@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

**IMPORTANTE:**
- Substitua `SUASENHA` pela senha real (sem espaços, sem `[]`)
- Se a senha tiver caracteres especiais, pode precisar codificar (URL encode)
- Sempre adicione `?sslmode=require` no final

## Passo 4: Verificar Login no Vercel CLI

```bash
npx vercel whoami
```

Se não estiver logado:
```bash
npx vercel login
```

## Passo 5: Configurar no Vercel (Production)

```bash
echo "SUA_CONNECTION_STRING_COMPLETA_AQUI" | npx vercel env add POSTGRES_URL_NON_POOLING production
```

**Substitua** `SUA_CONNECTION_STRING_COMPLETA_AQUI` pela connection string completa!

## Passo 6: Configurar para Preview

```bash
echo "SUA_CONNECTION_STRING_COMPLETA_AQUI" | npx vercel env add POSTGRES_URL_NON_POOLING preview
```

## Passo 7: Configurar para Development

```bash
echo "SUA_CONNECTION_STRING_COMPLETA_AQUI" | npx vercel env add POSTGRES_URL_NON_POOLING development
```

## Passo 8: Verificar se Foi Configurado

```bash
npx vercel env ls | grep POSTGRES_URL_NON_POOLING
```

Deve aparecer para todos os ambientes (Production, Preview, Development).

## Passo 9: Fazer Redeploy

```bash
npx vercel --prod
```

Ou pelo Dashboard do Vercel:
1. Vá em: https://vercel.com/dashboard
2. Selecione o projeto
3. **Deployments** → último deploy → **3 pontos** → **Redeploy**

## Passo 10: Testar

Após o deploy, teste:
1. Acesse: `https://counterx.io/auth/register`
2. Tente criar uma conta
3. Se funcionar → ✅ Tudo certo!

---

## 🔍 Troubleshooting

### Erro: "already exists"

Se a variável já existe, remova primeiro:

```bash
npx vercel env rm POSTGRES_URL_NON_POOLING production --yes
npx vercel env rm POSTGRES_URL_NON_POOLING preview --yes
npx vercel env rm POSTGRES_URL_NON_POOLING development --yes
```

Depois adicione novamente com os comandos dos Passos 5-7.

### Ver todos os valores das variáveis

```bash
npx vercel env ls
```

### Testar conexão localmente (opcional)

Se tiver a connection string no `.env.local`:

```bash
node scripts/test-database-connection.js
```

---

## ⚠️ Dicas Importantes

1. **NUNCA** commite a connection string no Git
2. **SEMPRE** adicione `?sslmode=require` no final para Supabase
3. **VERIFIQUE** se a senha está correta antes de configurar
4. **TESTE** após cada configuração


