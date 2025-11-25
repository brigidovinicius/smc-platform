# ✅ Como Adicionar Variáveis no Vercel (Solução Rápida)

## 🎯 Método Mais Fácil: Via CLI (Recomendado)

### Passo 1: Instalar e Fazer Login

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Fazer login
vercel login

# Vincular ao projeto
vercel link --project smc-platform --yes
```

### Passo 2: Executar Script Automático

```bash
# Executar script interativo
./scripts/setup-vercel-env.sh
```

O script vai:
- ✅ Gerar o `NEXTAUTH_SECRET` automaticamente
- ✅ Pedir sua `DATABASE_URL`
- ✅ Configurar `NEXTAUTH_URL` automaticamente
- ✅ Adicionar em todos os ambientes (Production, Preview, Development)

### Passo 3: Ou Adicionar Manualmente Via CLI

Se preferir fazer manualmente:

```bash
# 1. DATABASE_URL (cole sua URL quando pedir)
vercel env add DATABASE_URL production preview development

# 2. NEXTAUTH_SECRET (gere primeiro)
openssl rand -base64 32
# Copie o valor gerado e cole quando o comando pedir
vercel env add NEXTAUTH_SECRET production preview development

# 3. NEXTAUTH_URL
vercel env add NEXTAUTH_URL production preview development
# Digite: https://smc-platform.vercel.app
```

---

## 🌐 Método Via Interface Web (Se Preferir)

### ⚠️ IMPORTANTE: Regras para Nomes de Variáveis

**Nomes válidos:**
- ✅ `DATABASE_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `GOOGLE_CLIENT_ID`

**Nomes inválidos (causam erro):**
- ❌ `DATABASE.URL` (tem ponto)
- ❌ `DATABASE-URL` (tem hífen)
- ❌ `1DATABASE_URL` (começa com número)
- ❌ `DATABASE URL` (tem espaço)

### Passo a Passo na Interface

1. **Acesse:** https://vercel.com/brigidovinicius-projects/smc-platform
2. **Vá em:** Settings → Environment Variables
3. **Para cada variável:**

   **Variável 1: DATABASE_URL**
   - Clique em **Add New**
   - **Key:** Digite exatamente `DATABASE_URL` (maiúsculas, underscore)
   - **Value:** Cole sua URL do banco
   - **Environments:** Marque Production, Preview, Development
   - Clique em **Save**

   **Variável 2: NEXTAUTH_SECRET**
   - Clique em **Add New**
   - **Key:** Digite `NEXTAUTH_SECRET`
   - **Value:** Gere com: `openssl rand -base64 32` (ou execute `node scripts/generate-env-values.js`)
   - **Environments:** Marque todos
   - Clique em **Save**

   **Variável 3: NEXTAUTH_URL**
   - Clique em **Add New**
   - **Key:** Digite `NEXTAUTH_URL`
   - **Value:** Digite `https://smc-platform.vercel.app` (sem barra no final!)
   - **Environments:** Marque todos
   - Clique em **Save**

---

## ✅ Após Configurar

1. **Faça um Redeploy:**
   - Vercel Dashboard → Deployments → [último deploy] → Redeploy
   - Ou via git:
     ```bash
     git commit --allow-empty -m "trigger redeploy"
     git push origin main
     ```

2. **Aguarde o deploy terminar**

3. **Teste o login:**
   - Acesse: https://smc-platform.vercel.app/auth/login
   - Tente fazer login

---

## 🐛 Problemas Comuns

### Erro: "The name contains invalid characters"
- **Causa:** Nome da variável tem caracteres inválidos
- **Solução:** Use apenas letras MAIÚSCULAS, números e underscores
- **Exemplo correto:** `DATABASE_URL` (não `DATABASE.URL`)

### Não consigo adicionar variáveis na interface
- **Solução:** Use o método CLI (mais fácil e confiável):
  ```bash
  ./scripts/setup-vercel-env.sh
  ```

### Variáveis adicionadas mas login ainda não funciona
- **Verifique:** Fez um redeploy após adicionar?
- **Verifique:** As variáveis estão marcadas para "Production"?
- **Verifique:** `NEXTAUTH_URL` está sem barra no final?

---

## 📋 Checklist

- [ ] `DATABASE_URL` configurada
- [ ] `NEXTAUTH_SECRET` gerado e configurado
- [ ] `NEXTAUTH_URL` configurado (sem barra no final)
- [ ] Todas marcadas para "Production"
- [ ] Redeploy feito
- [ ] Login testado

---

## 🔗 Links

- **Vercel Dashboard:** https://vercel.com/brigidovinicius-projects/smc-platform
- **Guia Completo:** `/docs/CONFIGURAR-VARIAVEIS-VERCEL.md`
- **Guia Rápido:** `/docs/GUIA-RAPIDO-VERCEL-ENV.md`

