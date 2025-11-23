# 🔐 VARIÁVEIS DE AMBIENTE - VERCEL

**Guia completo para configurar variáveis de ambiente no Vercel**

---

## 📋 VARIÁVEIS OBRIGATÓRIAS

### 1. **DATABASE_URL** ⚠️ CRÍTICA

**O que é:** URL de conexão com o banco de dados PostgreSQL

**Como obter:**
- Se usar **Vercel Postgres**: 
  1. Vá em **Storage** → **Create Database** → **Postgres**
  2. Após criar, vá em **Settings** → **.env.local**
  3. Copie a variável `POSTGRES_URL` ou `DATABASE_URL`

- Se usar **banco externo**:
  ```
  postgresql://usuario:senha@host:porta/database?sslmode=require
  ```

**Formato:**
```
postgresql://user:password@host:5432/database?sslmode=require
```

**Onde configurar:** Vercel Dashboard → Settings → Environment Variables

---

### 2. **NEXTAUTH_SECRET** ⚠️ CRÍTICA

**O que é:** Chave secreta para criptografar tokens JWT do NextAuth

**Como gerar:**
```bash
openssl rand -base64 32
```

**Exemplo:**
```
aBc123XyZ789Def456Ghi012Jkl345Mno678Pqr901Stu234Vwx567
```

**Importante:** 
- ⚠️ Use uma chave diferente para cada ambiente (dev, preview, production)
- ⚠️ Nunca compartilhe ou commite essa chave
- ⚠️ Se mudar, todos os usuários precisarão fazer login novamente

---

### 3. **NEXTAUTH_URL** ⚠️ CRÍTICA

**O que é:** URL pública da aplicação

**Valor:**
```
https://seu-projeto.vercel.app
```

**Exemplos:**
- Production: `https://smc-platform.vercel.app`
- Preview: `https://smc-platform-git-codex-nightly.vercel.app`
- Development: `http://localhost:3000`

**Importante:** 
- Use a URL exata do seu projeto Vercel
- Sem `http://` ou `https://` no final
- Sem barra `/` no final

---

### 4. **GOOGLE_CLIENT_ID** (Se usar Google OAuth)

**O que é:** ID do cliente OAuth do Google

**Como obter:**
1. Acesse: https://console.cloud.google.com/
2. Crie um projeto ou selecione existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized redirect URIs: 
     - `https://seu-projeto.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (dev)
6. Copie o **Client ID**

**Formato:**
```
123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

---

### 5. **GOOGLE_CLIENT_SECRET** (Se usar Google OAuth)

**O que é:** Segredo do cliente OAuth do Google

**Como obter:**
- Mesmo lugar do `GOOGLE_CLIENT_ID`
- Após criar OAuth client, copie o **Client Secret**

**Formato:**
```
GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

**Importante:** 
- ⚠️ Nunca compartilhe ou commite essa chave
- ⚠️ Mantenha segredo e seguro

---

## 🔧 VARIÁVEIS OPCIONAIS

### 6. **NEXT_PUBLIC_SITE_URL**

**O que é:** URL pública do site (usado em `lib/site-config.ts`)

**Valor:**
```
https://seu-projeto.vercel.app
```

**Padrão:** Se não configurado, usa `https://smc-platform.vercel.app`

---

### 7. **OPENAI_API_KEY** (Se usar scripts de conteúdo)

**O que é:** Chave da API da OpenAI para gerar posts do blog

**Como obter:**
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave
3. Copie a chave (ela só aparece uma vez!)

**Formato:**
```
sk-proj-abcdefghijklmnopqrstuvwxyz1234567890
```

**Importante:** 
- ⚠️ Configure limites de uso na OpenAI
- ⚠️ Não exponha essa chave publicamente

---

### 8. **POSTGRES_URL** ou **POSTGRES_URL_NON_POOLING**

**O que é:** URLs alternativas do Vercel Postgres

**Quando usar:**
- Se usar Vercel Postgres, essas variáveis são criadas automaticamente
- Podem ser usadas como alternativa ao `DATABASE_URL`

---

## 📝 COMO CONFIGURAR NO VERCEL

### Passo a Passo

1. **Acesse o Dashboard:**
   - https://vercel.com/dashboard
   - Selecione o projeto `smc-platform`

2. **Vá em Settings:**
   - Clique no projeto
   - Clique em **Settings** (no menu superior)
   - Clique em **Environment Variables** (menu lateral)

3. **Adicione cada variável:**
   - Clique em **Add New**
   - **Key:** Nome da variável (ex: `DATABASE_URL`)
   - **Value:** Valor da variável
   - **Environment:** Selecione onde aplicar:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Clique em **Save**

4. **Repita para todas as variáveis:**
   - Adicione todas as variáveis obrigatórias
   - Adicione variáveis opcionais conforme necessário

5. **Redeploy:**
   - Após adicionar variáveis, faça um novo deploy
   - Ou aguarde o próximo commit (deploy automático)

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

### Variáveis Obrigatórias
- [ ] `DATABASE_URL` - URL do PostgreSQL
- [ ] `NEXTAUTH_SECRET` - Chave secreta gerada
- [ ] `NEXTAUTH_URL` - URL da aplicação
- [ ] `GOOGLE_CLIENT_ID` - Se usar Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - Se usar Google OAuth

### Variáveis Opcionais
- [ ] `NEXT_PUBLIC_SITE_URL` - URL pública do site
- [ ] `OPENAI_API_KEY` - Se usar scripts de conteúdo
- [ ] `POSTGRES_URL` - Se usar Vercel Postgres

---

## 🔍 VERIFICAR SE ESTÁ CONFIGURADO

### No Vercel Dashboard
1. Vá em **Settings** → **Environment Variables**
2. Verifique se todas as variáveis aparecem na lista
3. Confirme que estão marcadas para os ambientes corretos

### No Build Log
- Se uma variável obrigatória estiver faltando, o build falhará
- Verifique os logs do deploy para erros relacionados a variáveis

---

## 🐛 TROUBLESHOOTING

### Build falha por variável não encontrada

**Solução:**
1. Verifique se a variável está configurada no Vercel
2. Confirme que está marcada para o ambiente correto (Production/Preview)
3. Faça um novo deploy após adicionar variáveis

### Erro de autenticação

**Solução:**
1. Verifique se `NEXTAUTH_SECRET` está configurado
2. Verifique se `NEXTAUTH_URL` está correto
3. Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos

### Erro de conexão com banco

**Solução:**
1. Verifique se `DATABASE_URL` está configurado
2. Confirme que a URL está correta
3. Teste a conexão localmente com a mesma URL

---

## 📚 REFERÊNCIAS

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth Configuration](https://next-auth.js.org/configuration/options)
- [Prisma Environment Variables](https://www.prisma.io/docs/concepts/components/prisma-schema/environment-variables)

---

**Última atualização:** 23/01/2025

