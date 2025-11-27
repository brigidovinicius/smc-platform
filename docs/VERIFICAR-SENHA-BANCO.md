# 🔐 Como Verificar se a Senha do Banco de Dados Está Correta

## 🚨 Problema: "Error accessing database. Check server configuration."

Se você está recebendo este erro, pode ser que:
1. A senha do banco de dados esteja incorreta na connection string
2. A senha foi resetada no Supabase mas não foi atualizada no Vercel
3. A connection string ainda tem o placeholder `[YOUR-PASSWORD]`

## ✅ Solução Passo a Passo

### 1. Verificar a Senha no Supabase

1. Acesse: https://supabase.com
2. Faça login e selecione seu projeto
3. Vá em **Settings** → **Database**
4. Role até a seção **"Database password"**
5. Verifique se você sabe a senha atual

### 2. Se Você NÃO Sabe a Senha Atual

**Opção A: Resetar a Senha**
1. Na mesma página (Settings → Database → Database password)
2. Clique em **"Reset database password"**
3. Defina uma nova senha (⚠️ **ANOTE ELA!**)
4. Copie a senha

**Opção B: Verificar a Connection String Atual**
1. Na mesma página (Settings → Database)
2. Role até **"Connection string"**
3. Clique na aba **"URI"**
4. Você verá algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Se tiver `[YOUR-PASSWORD]`, você precisa substituir pela senha real

### 3. Construir a Connection String Correta

A connection string deve ter este formato:

```
postgresql://postgres:SUASENHAAQUI@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

**Importante:**
- Substitua `SUASENHAAQUI` pela senha real (sem espaços, sem `[]`)
- Se a senha tiver caracteres especiais, pode precisar codificar (URL encode)
- Sempre adicione `?sslmode=require` no final para Supabase

### 4. Atualizar no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **smc-platform**
3. Vá em **Settings** → **Environment Variables**
4. Encontre **POSTGRES_URL_NON_POOLING**
5. Clique em **"Edit"** ou **"..."** → **"Edit"**
6. Cole a connection string COMPLETA com a senha correta
7. Clique em **"Save"**
8. **IMPORTANTE:** Verifique se está marcado para **Production**, **Preview** e **Development**

### 5. Fazer Redeploy

Após atualizar a variável:

```bash
npx vercel --prod
```

Ou:
1. No Vercel Dashboard, vá em **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **"Redeploy"**

## 🧪 Testar a Conexão

### Teste Local (se tiver .env.local)

```bash
node scripts/test-database-connection.js
```

### Teste no Vercel

Após o redeploy, teste:
1. Acesse: `https://counterx.io/auth/register`
2. Tente criar uma conta
3. Se funcionar → ✅ Senha correta!
4. Se não funcionar → Verifique os logs do Vercel

## 📊 Verificar Logs do Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto
3. Vá em **Deployments** → último deploy
4. Clique em **"View Function Logs"** ou **"Logs"**
5. Procure por:
   - `P1000` = Erro de autenticação (senha/usuário)
   - `P1001` = Erro de conexão (host/servidor)
   - `P1003` = Banco de dados não existe

## 🔍 Checklist de Verificação

- [ ] Senha do Supabase foi resetada/verificada
- [ ] Connection string tem a senha real (não `[YOUR-PASSWORD]`)
- [ ] Connection string tem `?sslmode=require` no final
- [ ] Variável atualizada no Vercel (Production + Preview + Development)
- [ ] Redeploy realizado
- [ ] Teste de cadastro/login realizado

## ⚠️ Problemas Comuns

### Erro P1000 (Autenticação)

**Causa:** Senha ou usuário incorreto

**Solução:**
1. Resetar senha no Supabase
2. Atualizar POSTGRES_URL_NON_POOLING no Vercel
3. Fazer redeploy

### Erro P1001 (Conexão)

**Causa:** Não consegue alcançar o servidor

**Solução:**
1. Verificar se o projeto Supabase não está pausado
2. Verificar se o host está correto (`db.xxxxx.supabase.co`)
3. Verificar se há firewall bloqueando

### Connection String com Placeholder

**Causa:** Connection string ainda tem `[YOUR-PASSWORD]`

**Solução:**
1. Substituir `[YOUR-PASSWORD]` pela senha real
2. Atualizar no Vercel
3. Fazer redeploy

## ✅ Próximos Passos

Após corrigir a senha:
1. ✅ Teste o cadastro
2. ✅ Teste o login
3. ✅ Verifique se as migrations foram executadas
4. ✅ Verifique se as tabelas existem

---

**Dica:** Sempre que resetar a senha no Supabase, atualize imediatamente no Vercel para evitar erros!

