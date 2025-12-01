# 🚀 Execute o SQL no Supabase - AGORA

## SQL para Copiar e Colar:

```sql
UPDATE "User" 
SET password = '$2b$10$hftS1P5l/UltVL6ASmmTl.yI11HQSqelFJkHYXm1SWD1iJy35V7GW' 
WHERE email = 'brigido254@gmail.com';
```

---

## 📋 Passo a Passo:

### 1. Acesse o Supabase
- Vá em: **https://app.supabase.com**
- Faça login se necessário

### 2. Selecione o Projeto
- Clique no projeto que contém o banco de dados

### 3. Abra o SQL Editor
- No menu lateral esquerdo, clique em **"SQL Editor"**
- Ou acesse diretamente: **https://app.supabase.com/project/[SEU-PROJECT-ID]/sql/new**

### 4. Cole o SQL
- Cole o SQL acima na área de edição
- Clique em **"Run"** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### 5. Verifique o Resultado
- Deve aparecer: `Success. No rows returned` ou similar
- Isso significa que a senha foi atualizada!

### 6. Teste o Login
- Email: `brigido254@gmail.com`
- Senha: `Teste1234`

---

## ✅ Confirmação

Após executar, você pode verificar se funcionou:

```sql
SELECT email, name, 
       CASE WHEN password IS NOT NULL THEN 'Senha configurada' ELSE 'Sem senha' END as status
FROM "User" 
WHERE email = 'brigido254@gmail.com';
```

---

## 🆘 Problemas?

- **Erro de permissão?** Certifique-se de estar logado no Supabase
- **Projeto não encontrado?** Verifique se está no projeto correto
- **SQL não executa?** Verifique se as aspas estão corretas (use aspas duplas para nomes de tabelas)

---

**💡 Dica:** Depois de executar, teste o login imediatamente para confirmar que funcionou!


