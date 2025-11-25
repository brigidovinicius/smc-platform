# 🔧 Guia Completo: Configurar Variáveis de Ambiente no Vercel

## 📋 Variáveis Obrigatórias

Estas variáveis são **ESSENCIAIS** para o funcionamento da aplicação:

### 1. **DATABASE_URL** ⚠️ CRÍTICO
- **Descrição:** URL de conexão com o banco de dados PostgreSQL
- **Formato:** `postgresql://usuario:senha@host:porta/banco?sslmode=require`
- **Onde obter:** 
  - Supabase: Settings → Database → Connection String (URI mode)
  - Outros: Fornecido pelo seu provedor de banco de dados
- **Exemplo:** `postgresql://postgres:senha@db.xxxxx.supabase.co:5432/postgres?sslmode=require`

### 2. **NEXTAUTH_SECRET** ⚠️ CRÍTICO
- **Descrição:** Chave secreta para criptografar sessões JWT
- **Como gerar:**
  ```bash
  openssl rand -base64 32
  ```
- **Exemplo:** `NxmbIB1N7E1K/BFgRwf0vhCg1yIjcvNXd/99UK9YHYI=`

### 3. **NEXTAUTH_URL** ⚠️ CRÍTICO
- **Descrição:** URL completa da aplicação em produção
- **Formato:** `https://seu-dominio.vercel.app` (sem barra no final)
- **Exemplo:** `https://smc-platform.vercel.app`

## 📋 Variáveis Opcionais (mas recomendadas)

### 4. **GOOGLE_CLIENT_ID** (Opcional - para login com Google)
- **Descrição:** Client ID do Google OAuth
- **Onde obter:** Google Cloud Console → Credentials
- **Formato:** `xxxxx.apps.googleusercontent.com`

### 5. **GOOGLE_CLIENT_SECRET** (Opcional - para login com Google)
- **Descrição:** Client Secret do Google OAuth
- **Onde obter:** Google Cloud Console → Credentials

### 6. **NEXT_PUBLIC_SITE_URL** (Opcional)
- **Descrição:** URL pública do site (usado em emails e links)
- **Formato:** `https://seu-dominio.vercel.app`
- **Padrão:** Usa `NEXTAUTH_URL` se não configurado

### 7. **SMTP_HOST** (Opcional - para envio de emails)
- **Descrição:** Servidor SMTP para envio de emails
- **Exemplo:** `smtp.gmail.com`, `smtp.sendgrid.net`

### 8. **SMTP_PORT** (Opcional - para envio de emails)
- **Descrição:** Porta do servidor SMTP
- **Valores comuns:** `587` (TLS), `465` (SSL)

### 9. **SMTP_USER** (Opcional - para envio de emails)
- **Descrição:** Usuário do servidor SMTP

### 10. **SMTP_PASS** (Opcional - para envio de emails)
- **Descrição:** Senha do servidor SMTP

### 11. **EMAIL_FROM** (Opcional - para envio de emails)
- **Descrição:** Email remetente padrão
- **Exemplo:** `CounterX <no-reply@counterx.io>`

## 🚀 Como Configurar no Vercel

### Método 1: Via Dashboard (Recomendado)

1. **Acesse o Vercel Dashboard:**
   - Vá para: https://vercel.com/brigidovinicius-projects/smc-platform
   - Ou: https://vercel.com/dashboard → Selecione o projeto `smc-platform`

2. **Navegue até Environment Variables:**
   - Clique em **Settings** (no menu superior)
   - Clique em **Environment Variables** (no menu lateral)

3. **Adicione cada variável:**
   - Clique em **Add New**
   - Preencha:
     - **Key:** Nome da variável (ex: `DATABASE_URL`)
     - **Value:** Valor da variável
     - **Environment:** Selecione onde aplicar:
       - ✅ **Production** (produção)
       - ✅ **Preview** (branches de preview)
       - ✅ **Development** (desenvolvimento local via `vercel dev`)
   - Clique em **Save**

4. **Repita para todas as variáveis obrigatórias**

### Método 2: Via CLI (Mais Rápido)

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer login
vercel login

# Vincular ao projeto
vercel link --project smc-platform --yes

# Adicionar variáveis (substitua os valores pelos seus)
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production

# Para adicionar em todos os ambientes de uma vez:
vercel env add DATABASE_URL production preview development
```

### Método 3: Via Arquivo (Bulk Import)

1. **Crie um arquivo `.env.production` localmente:**
   ```bash
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=seu_secret_aqui
   NEXTAUTH_URL=https://smc-platform.vercel.app
   GOOGLE_CLIENT_ID=seu_client_id
   GOOGLE_CLIENT_SECRET=seu_client_secret
   ```

2. **Use o script de importação:**
   ```bash
   # O Vercel CLI não suporta bulk import direto, mas você pode usar:
   while IFS='=' read -r key value; do
     vercel env add "$key" production <<< "$value"
   done < .env.production
   ```

## ✅ Checklist de Verificação

Após configurar, verifique:

- [ ] **DATABASE_URL** está configurada e acessível
- [ ] **NEXTAUTH_SECRET** foi gerado com `openssl rand -base64 32`
- [ ] **NEXTAUTH_URL** aponta para a URL correta (sem barra no final)
- [ ] Todas as variáveis estão marcadas para **Production**
- [ ] Se usar Google OAuth, **GOOGLE_CLIENT_ID** e **GOOGLE_CLIENT_SECRET** estão configuradas
- [ ] Se usar emails, variáveis **SMTP_*** estão configuradas

## 🔄 Sincronizar Variáveis Localmente

Após configurar no Vercel, você pode baixar para desenvolvimento local:

```bash
# Baixar variáveis de produção
vercel env pull .env.local --environment=production --yes

# Ou baixar variáveis de preview
vercel env pull .env.local --environment=preview --yes
```

⚠️ **ATENÇÃO:** O arquivo `.env.local` está no `.gitignore` e não deve ser commitado!

## 🧪 Testar Configuração

Após configurar as variáveis:

1. **Faça um novo deploy:**
   ```bash
   git push origin main
   ```
   Ou force um redeploy no Vercel Dashboard

2. **Verifique os logs do deploy:**
   - Vercel Dashboard → Deployments → [último deploy] → Logs
   - Procure por erros relacionados a variáveis de ambiente

3. **Teste o login:**
   - Acesse: `https://smc-platform.vercel.app/auth/login`
   - Tente fazer login
   - Se falhar, verifique os logs do servidor no Vercel

## 🔍 Troubleshooting

### Erro: "NEXTAUTH_SECRET is missing"
- **Solução:** Adicione `NEXTAUTH_SECRET` no Vercel
- **Como gerar:** `openssl rand -base64 32`

### Erro: "Database connection failed"
- **Solução:** Verifique se `DATABASE_URL` está correta
- **Teste:** Tente conectar ao banco com um cliente PostgreSQL

### Erro: "Invalid NEXTAUTH_URL"
- **Solução:** Verifique se `NEXTAUTH_URL` está sem barra no final
- **Correto:** `https://smc-platform.vercel.app`
- **Errado:** `https://smc-platform.vercel.app/`

### Login não funciona após configurar variáveis
- **Solução:** 
  1. Verifique se fez um novo deploy após adicionar as variáveis
  2. Verifique se o usuário admin existe no banco de produção
  3. Execute o script de diagnóstico:
     ```bash
     DATABASE_URL="sua_url_prod" node scripts/test-login-diagnostic.js "email@exemplo.com" "senha"
     ```

## 📝 Valores de Referência (do projeto anterior)

Se você tinha um projeto anterior, estes eram os valores:

| Variável | Valor (exemplo) |
|----------|----------------|
| `DATABASE_URL` | `postgresql://postgres:#CypherPunk2030@db.eqkgcpbhsxjlzqozienv.supabase.co:5432/postgres?sslmode=require` |
| `NEXTAUTH_SECRET` (Prod) | `4URgInKVZm+fw9qtAleBcxHou+4T14KTbQBdXlI5nwc=` |
| `NEXTAUTH_SECRET` (Dev/Preview) | `NxmbIB1N7E1K/BFgRwf0vhCg1yIjcvNXd/99UK9YHYI=` |
| `NEXTAUTH_URL` | `https://smc-platform.vercel.app` |

⚠️ **IMPORTANTE:** Gere novos secrets para produção! Não reutilize secrets antigos.

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/brigidovinicius-projects/smc-platform
- **Documentação Vercel:** https://vercel.com/docs/concepts/projects/environment-variables
- **Guia de Deploy:** `/docs/DEPLOY-CHECKLIST.md`
- **Setup de Admin:** `/docs/ADMIN-SETUP.md`

