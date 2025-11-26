# Configuração no Vercel - Projeto SMC/CounterX

Este guia é específico para projetos que podem estar nomeados como **SMC** ou **smc-platform** no Vercel.

## ⚠️ Importante

O **nome do projeto** (SMC, CounterX, smc-platform) **NÃO importa** para as variáveis de ambiente.

O que importa é o **NOME DA VARIÁVEL**: `POSTGRES_URL_NON_POOLING`

## Como Verificar e Configurar

### Passo 1: Acessar o Projeto no Vercel

1. Acesse: https://vercel.com/dashboard
2. Procure pelo projeto:
   - Pode estar como **"smc-platform"** 
   - Ou **"SMC"**
   - Ou **"CounterX"**
   - Ou qualquer outro nome

### Passo 2: Verificar Variáveis Existentes

1. No projeto, vá em **Settings** → **Environment Variables**
2. Procure por variáveis relacionadas a banco de dados:
   - `DATABASE_URL`
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`
   - Qualquer variável que contenha "POSTGRES" ou "DATABASE"

### Passo 3: Adicionar POSTGRES_URL_NON_POOLING

Se você **NÃO** encontrar `POSTGRES_URL_NON_POOLING`:

1. Clique em **Add New**
2. Configure:
   - **Key (Nome):** `POSTGRES_URL_NON_POOLING` ⚠️ **EXATO, case-sensitive**
   - **Value (Valor):** Cole a connection string do Supabase
   - **Environment:** Selecione todas:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

3. Clique em **Save**

### Passo 4: Obter Connection String do Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto (pode estar como "SMC" ou outro nome)
3. Vá em **Settings** → **Database**
4. Role até **Connection string**
5. Selecione **URI** (NÃO Transaction Pooler)
6. Copie a string completa

Formato esperado:
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require
```

### Passo 5: Reusar Variável Existente (Opcional)

Se você já tem `DATABASE_URL` ou `POSTGRES_URL` configurada:

1. **Copie o valor** da variável existente
2. **Adicione** `POSTGRES_URL_NON_POOLING` com o mesmo valor
3. **Mantenha** a variável antiga por enquanto (para não quebrar)
4. Após testar, você pode remover a variável antiga

## Verificação

### Opção 1: Verificar no Vercel

Após adicionar a variável, faça um **Redeploy**:

1. Vá em **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **Redeploy**
4. Verifique os logs do build

Você deve ver:
```
✅ Using POSTGRES_URL_NON_POOLING (recomendado para Supabase) for Prisma Client generation
```

### Opção 2: Script Local

Se você tem acesso local ao projeto:

```bash
# Configure a variável localmente (apenas para teste)
export POSTGRES_URL_NON_POOLING="sua-connection-string-aqui"

# Execute o script de verificação
node scripts/verify-vercel-env.js
```

## Troubleshooting

### "Não encontro o projeto no Vercel"

- Verifique se você está logado na conta correta
- Procure por diferentes nomes: SMC, smc-platform, CounterX
- Verifique em **Teams** se o projeto está em uma organização

### "A variável não está sendo usada"

- Verifique se o nome está **exatamente** como `POSTGRES_URL_NON_POOLING` (case-sensitive)
- Verifique se está marcada para o ambiente correto (Production, Preview, Development)
- Faça um **Redeploy** após adicionar a variável

### "Já tenho DATABASE_URL configurada"

- **Adicione** `POSTGRES_URL_NON_POOLING` com o mesmo valor
- O código priorizará `POSTGRES_URL_NON_POOLING` automaticamente
- Você pode manter `DATABASE_URL` como fallback ou removê-la depois

### "Não sei qual connection string usar"

- Use sempre a **URI** (não Transaction Pooler)
- Formato: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require`
- Se não tiver `?sslmode=require`, adicione manualmente

## Prioridade de Variáveis

O código verifica nesta ordem:

1. ✅ `POSTGRES_URL_NON_POOLING` (usado se existir)
2. ⚠️ `POSTGRES_URL` (fallback)
3. ⚠️ `DATABASE_URL` (fallback final)

## Checklist Final

- [ ] Acessei o projeto no Vercel (pode estar como SMC/smc-platform)
- [ ] Verifiquei variáveis existentes
- [ ] Adicionei `POSTGRES_URL_NON_POOLING` com a connection string do Supabase
- [ ] Marquei para todos os ambientes (Production, Preview, Development)
- [ ] Fiz um Redeploy
- [ ] Verifiquei os logs do build
- [ ] Testei cadastro/login

## Próximos Passos

Após configurar:

1. ✅ O código usará automaticamente `POSTGRES_URL_NON_POOLING`
2. ✅ Cadastro e login devem funcionar
3. ✅ Todas as funcionalidades do banco estarão ativas

## Suporte

- 📖 Guia completo: `docs/SUPABASE-SETUP.md`
- 🔧 Script de verificação: `node scripts/verify-vercel-env.js`
- 📋 Checklist: `DEPLOY-CHECKLIST.md`

