# 🚀 Guia Rápido: Configurar Variáveis no Vercel

## ⚠️ Regras Importantes

**Nomes de variáveis devem:**
- ✅ Conter apenas letras, números e underscores (_)
- ✅ NÃO começar com número
- ✅ NÃO conter espaços, pontos, hífens ou outros caracteres especiais

**Exemplos:**
- ✅ `DATABASE_URL` (correto)
- ✅ `NEXTAUTH_SECRET` (correto)
- ✅ `GOOGLE_CLIENT_ID` (correto)
- ❌ `DATABASE.URL` (errado - tem ponto)
- ❌ `DATABASE-URL` (errado - tem hífen)
- ❌ `1DATABASE_URL` (errado - começa com número)

## 📝 Passo a Passo no Vercel

### 1. Acesse o Projeto
- Vá para: https://vercel.com/brigidovinicius-projects/smc-platform
- Ou: Vercel Dashboard → Selecione `smc-platform`

### 2. Abra Environment Variables
- Clique em **Settings** (menu superior)
- Clique em **Environment Variables** (menu lateral esquerdo)

### 3. Adicione Cada Variável (uma por vez)

#### Variável 1: DATABASE_URL

1. Clique em **Add New** (ou **Add Another** se já houver variáveis)
2. No campo **Key**, digite exatamente: `DATABASE_URL`
   - ✅ Use letras maiúsculas
   - ✅ Use underscore (_) entre palavras
   - ❌ NÃO use espaços, pontos ou hífens
3. No campo **Value**, cole sua URL do banco:
   - Exemplo: `postgresql://postgres:senha@db.xxxxx.supabase.co:5432/postgres?sslmode=require`
4. Em **Environments**, selecione:
   - ✅ Production
   - ✅ Preview (opcional)
   - ✅ Development (opcional)
5. Clique em **Save**

#### Variável 2: NEXTAUTH_SECRET

1. Clique em **Add New** novamente
2. No campo **Key**, digite: `NEXTAUTH_SECRET`
3. No campo **Value**, cole o secret gerado:
   - Execute: `node scripts/generate-env-values.js`
   - Ou gere manualmente: `openssl rand -base64 32`
4. Selecione os ambientes (Production, Preview, Development)
5. Clique em **Save**

#### Variável 3: NEXTAUTH_URL

1. Clique em **Add New** novamente
2. No campo **Key**, digite: `NEXTAUTH_URL`
3. No campo **Value**, digite: `https://smc-platform.vercel.app`
   - ⚠️ IMPORTANTE: Sem barra (/) no final!
4. Selecione os ambientes
5. Clique em **Save**

## 🔧 Método Alternativo: Via CLI (Mais Fácil)

Se estiver tendo problemas com a interface web, use a CLI:

### 1. Instalar Vercel CLI (se não tiver)
```bash
npm i -g vercel
```

### 2. Fazer Login
```bash
vercel login
```

### 3. Vincular ao Projeto
```bash
vercel link --project smc-platform --yes
```

### 4. Adicionar Variáveis (uma por uma)

```bash
# DATABASE_URL (substitua pela sua URL real)
vercel env add DATABASE_URL production
# Quando pedir o valor, cole sua DATABASE_URL e pressione Enter

# NEXTAUTH_SECRET (gere primeiro)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "Use este valor: $NEXTAUTH_SECRET"
vercel env add NEXTAUTH_SECRET production
# Cole o valor gerado acima

# NEXTAUTH_URL
vercel env add NEXTAUTH_URL production
# Digite: https://smc-platform.vercel.app
```

### 5. Adicionar em Múltiplos Ambientes

Para adicionar a mesma variável em todos os ambientes:

```bash
vercel env add DATABASE_URL production preview development
```

## ✅ Verificar se Funcionou

Após adicionar as variáveis:

1. **No Dashboard:**
   - Volte para Environment Variables
   - Você deve ver as 3 variáveis listadas
   - Verifique se estão marcadas para "Production"

2. **Fazer Redeploy:**
   - Vá em **Deployments**
   - Clique nos 3 pontos (...) do último deploy
   - Clique em **Redeploy**
   - Ou faça um commit vazio:
     ```bash
     git commit --allow-empty -m "trigger redeploy"
     git push origin main
     ```

3. **Testar:**
   - Aguarde o deploy terminar
   - Acesse: https://smc-platform.vercel.app/auth/login
   - Tente fazer login

## 🐛 Problemas Comuns

### Erro: "The name contains invalid characters"
- **Causa:** Nome da variável tem caracteres inválidos
- **Solução:** Use apenas letras, números e underscores
- **Exemplo correto:** `DATABASE_URL` (não `DATABASE.URL` ou `DATABASE-URL`)

### Erro: "Variable already exists"
- **Causa:** Variável já foi adicionada
- **Solução:** Edite a variável existente em vez de criar nova

### Variáveis não aparecem após adicionar
- **Solução:** 
  1. Recarregue a página
  2. Verifique se selecionou os ambientes corretos
  3. Verifique se clicou em "Save"

### Login ainda não funciona após configurar
- **Solução:**
  1. Verifique se fez um redeploy após adicionar as variáveis
  2. Verifique os logs do deploy no Vercel
  3. Execute o script de diagnóstico:
     ```bash
     DATABASE_URL="sua_url" node scripts/test-login-diagnostic.js "email@exemplo.com" "senha"
     ```

## 📋 Checklist Final

Antes de testar, verifique:

- [ ] `DATABASE_URL` está configurada e acessível
- [ ] `NEXTAUTH_SECRET` foi gerado e adicionado
- [ ] `NEXTAUTH_URL` está sem barra no final
- [ ] Todas as variáveis estão marcadas para "Production"
- [ ] Foi feito um redeploy após adicionar as variáveis
- [ ] O deploy foi concluído com sucesso

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/brigidovinicius-projects/smc-platform
- **Documentação Vercel:** https://vercel.com/docs/concepts/projects/environment-variables
- **Guia Completo:** `/docs/CONFIGURAR-VARIAVEIS-VERCEL.md`

