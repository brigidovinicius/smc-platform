# Configuração do Supabase no Vercel

Este guia explica como configurar o Supabase com o CounterX no Vercel.

## Variáveis de Ambiente do Supabase

O Supabase fornece duas URLs de conexão:

1. **`POSTGRES_URL_NON_POOLING`** ⭐ **RECOMENDADO**
   - Sem connection pooling
   - Melhor para Prisma e migrations
   - Use esta para o CounterX

2. **`POSTGRES_URL`**
   - Com connection pooling
   - Melhor para aplicações que fazem muitas conexões curtas
   - Não recomendado para Prisma

## Prioridade de Variáveis

O código do CounterX verifica as variáveis nesta ordem:

1. `POSTGRES_URL_NON_POOLING` (prioridade máxima - recomendado)
2. `POSTGRES_URL` (fallback)
3. `DATABASE_URL` (fallback final)

## Como Configurar no Vercel

### Passo 1: Obter a Connection String do Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Role até a seção **Connection string**
5. Selecione **URI** (não Transaction Pooler)
6. Copie a connection string (formato: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`)

### Passo 2: Configurar no Vercel

1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto CounterX
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:

   **Nome:** `POSTGRES_URL_NON_POOLING`
   
   **Valor:** Cole a connection string copiada do Supabase
   
   **Environment:** Selecione todas as opções (Production, Preview, Development)

5. Clique em **Save**

### Passo 3: Verificar Configuração

Após adicionar a variável, faça um novo deploy:

```bash
# Ou simplesmente faça push para o repositório
git push origin main
```

O Vercel irá:
1. Executar `prisma generate` usando `POSTGRES_URL_NON_POOLING`
2. Executar `prisma migrate deploy` para aplicar migrations
3. Fazer build da aplicação

## Verificar se Está Funcionando

### Opção 1: Logs do Vercel

Verifique os logs do build no Vercel. Você deve ver:

```
✅ Using POSTGRES_URL_NON_POOLING (recomendado para Supabase) for Prisma Client generation
✅ Prisma Client generated successfully
```

### Opção 2: Testar Cadastro/Login

1. Acesse `https://counterx.io/auth/register`
2. Tente criar uma conta
3. Se funcionar, o banco está configurado corretamente

### Opção 3: Script de Diagnóstico (Local)

Se quiser testar localmente:

```bash
# Configure a variável
export POSTGRES_URL_NON_POOLING="sua-connection-string-aqui"

# Execute o script de diagnóstico
node scripts/check-database.js
```

## Troubleshooting

### Erro: "Can't reach database server"

- Verifique se o projeto Supabase não está pausado
- Verifique se a connection string está correta
- Certifique-se de usar `POSTGRES_URL_NON_POOLING` (não `POSTGRES_URL`)

### Erro: "Authentication failed"

- Verifique se a senha na connection string está correta
- No Supabase, você pode resetar a senha em **Settings** → **Database** → **Database password**

### Erro: "Database does not exist"

- Verifique se o nome do banco na connection string está correto
- Geralmente é `postgres` para projetos Supabase

### Migrations não executam

- Verifique se `POSTGRES_URL_NON_POOLING` está configurada
- Verifique os logs do build no Vercel
- Certifique-se de que o projeto Supabase está ativo (não pausado)

## Formato da Connection String

A connection string do Supabase deve ter este formato:

```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require
```

Exemplo:

```
postgresql://postgres:abc123xyz@db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require
```

## Importante

- **Sempre use `POSTGRES_URL_NON_POOLING`** para o CounterX
- Não use `POSTGRES_URL` (tem pooling e pode causar problemas com Prisma)
- A connection string contém credenciais sensíveis - nunca commite no Git
- Mantenha a variável apenas no Vercel (Environment Variables)

## Próximos Passos

Após configurar o banco:

1. ✅ Cadastro e login devem funcionar
2. ✅ Dashboard deve carregar dados do banco
3. ✅ Todas as funcionalidades que dependem do banco estarão ativas

