# 🔗 Como Obter Connection String do Supabase

## 📋 Passo a Passo Visual

### 1. Acessar o Supabase

1. Acesse: https://supabase.com
2. Faça login na sua conta
3. Selecione o projeto existente

### 2. Acessar as Configurações do Database

**Método 1:**
- No menu lateral esquerdo, clique no ícone de **engrenagem** ⚙️ (Settings)
- Clique em **"Database"**

**Método 2:**
- No menu lateral esquerdo, clique em **"Project Settings"**
- Clique em **"Database"**

### 3. Encontrar Connection String

Na página de Database Settings, role para baixo até encontrar a seção:

**"Connection string"** ou **"Connection info"**

Você verá algumas abas:
- **URI** ← Use esta!
- **JDBC**
- **Connection Pooling**

### 4. Copiar a URI

1. Clique na aba **"URI"**
2. Você verá algo assim:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
3. **COPIE** essa string completa

### 5. Substituir a Senha

A string tem `[YOUR-PASSWORD]` como placeholder. Você precisa substituir pela senha real:

1. Se você **lembra a senha** do banco:
   - Substitua `[YOUR-PASSWORD]` pela senha real
   - Exemplo: Se sua senha é `minhasenha123`, a URL fica:
     ```
     postgresql://postgres:minhasenha123@db.xxxxx.supabase.co:5432/postgres
     ```

2. Se você **NÃO lembra a senha**:
   - Vá em: Settings → Database → Database password
   - Clique em "Reset database password"
   - Defina uma nova senha (ANOTE!)
   - Use essa senha na URL

### 6. URL Final

A URL final deve ter este formato:

```
postgresql://postgres:SUASENHAAQUI@db.xxxxx.supabase.co:5432/postgres
```

⚠️ **IMPORTANTE:** 
- A URL deve ter a senha REAL, não `[YOUR-PASSWORD]`
- Não compartilhe essa URL publicamente!
- Mantenha-a segura

## 🔒 Segurança

- ✅ A URL contém a senha do banco - mantenha privada
- ✅ No Vercel, você pode marcar como "Sensitive" para ocultar
- ✅ Nunca commite essa URL no Git

## ✅ Próximos Passos

Após obter a URL:

1. Adicione no Vercel (Environment Variables)
2. Execute as migrations
3. Crie o admin
4. Teste o login

Veja: `docs/CONFIGURAR-DATABASE-VERCEL.md`



