# ⚡ Configurar com Connection String

## Opção 1: Executar Script Diretamente

Se você tem a connection string no terminal, execute:

```bash
./scripts/setup-now.sh "sua-connection-string-aqui"
```

**Exemplo:**
```bash
./scripts/setup-now.sh "postgresql://postgres:senha@db.abc123.supabase.co:5432/postgres?sslmode=require"
```

---

## Opção 2: Me Enviar a Connection String

Se preferir, me envie a connection string e eu configuro para você!

**Formato esperado:**
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require
```

---

## Opção 3: Configuração Manual Rápida

Execute estes 3 comandos (substitua `[SUA_STRING]` pela connection string):

```bash
echo "[SUA_STRING]" | npx vercel env add POSTGRES_URL_NON_POOLING production
echo "[SUA_STRING]" | npx vercel env add POSTGRES_URL_NON_POOLING preview
echo "[SUA_STRING]" | npx vercel env add POSTGRES_URL_NON_POOLING development
```

---

## ✅ Após Configurar

1. Faça um **Redeploy** no Vercel Dashboard
2. Verifique os logs do build
3. Teste cadastro/login

