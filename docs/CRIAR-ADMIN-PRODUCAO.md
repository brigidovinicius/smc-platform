# 🚀 Como Criar Admin no Banco de Produção

## ⚠️ Importante

Se você está testando na URL oficial (produção), o banco de dados de produção é **diferente** do banco local. O admin que criamos localmente **não existe** no banco de produção!

## 📋 Passo a Passo

### Opção 1: Script Automático (Recomendado)

1. **Obter DATABASE_URL de produção:**
   - Acesse: https://vercel.com
   - Vá em: **Settings → Environment Variables**
   - Copie o valor de `DATABASE_URL`

2. **Executar o script:**
   ```bash
   ./scripts/create-admin-production.sh "postgresql://user:pass@host:port/db"
   ```
   
   **Substitua a URL** pela URL real do seu banco de produção.

### Opção 2: Comando Direto

```bash
# 1. Defina a DATABASE_URL de produção
export DATABASE_URL="postgresql://user:pass@host:port/db"

# 2. Crie o admin
node scripts/create-admin-user.js \
  "Admin User" \
  "brigido254@gmail.com" \
  "admin123456"

# 3. Verifique se foi criado
node scripts/check-users.js
```

### Opção 3: Via Prisma Studio

1. **Abra o Prisma Studio apontando para produção:**
   ```bash
   DATABASE_URL="sua_url_producao" npx prisma studio
   ```

2. **Na tabela User:**
   - Clique em "Add record"
   - Preencha:
     - `name`: Admin User
     - `email`: brigido254@gmail.com
     - `emailVerified`: (data atual)
     - `password`: (use o script para gerar hash)

3. **Na tabela Profile:**
   - Clique em "Add record"
   - Preencha:
     - `userId`: (ID do usuário criado acima)
     - `role`: ADMIN

⚠️ **Nota:** Gerar o hash da senha manualmente é complexo. Use o script!

## 🔐 Gerar Hash de Senha Manualmente

Se precisar gerar o hash manualmente:

```javascript
// Execute no Node.js
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123456', 10).then(console.log);
```

## ✅ Verificar se Funcionou

Após criar o admin:

1. **Verifique no banco:**
   ```bash
   DATABASE_URL="sua_url_producao" node scripts/check-users.js
   ```

2. **Teste o login:**
   - Acesse: https://sua-app.vercel.app/auth/login
   - Email: `brigido254@gmail.com`
   - Senha: `admin123456`

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

**Causa:** DATABASE_URL incorreto ou banco inacessível.

**Solução:**
- Verifique se a URL está correta
- Verifique se o banco está online (Supabase, Railway, etc.)
- Verifique se há firewall bloqueando a conexão

### Erro: "Authentication failed"

**Causa:** Credenciais do banco incorretas.

**Solução:**
- Verifique usuário e senha na DATABASE_URL
- Regenere as credenciais se necessário

### Erro: "Database does not exist"

**Causa:** Nome do banco incorreto.

**Solução:**
- Verifique o nome do banco na DATABASE_URL
- Crie o banco se não existir

## 📝 Credenciais Padrão

- **Email:** `brigido254@gmail.com`
- **Senha:** `admin123456`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login em produção!

1. Faça login
2. Acesse `/profile`
3. Use o formulário "Alterar Senha"

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com
- **Documentação Admin:** `docs/ADMIN-SETUP.md`
- **Reset de Senha:** `docs/RESET-SENHA-PRODUCAO.md`


