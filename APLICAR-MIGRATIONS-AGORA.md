# 🚀 Aplicar Migrations Agora - Guia Rápido

## ✅ Método Mais Fácil: Via Supabase SQL Editor

### Passo a Passo

1. **Abra o arquivo SQL:**
   ```
   prisma/migrations/APPLY-ALL-MIGRATIONS.sql
   ```

2. **Copie TODO o conteúdo** do arquivo

3. **Acesse o Supabase Dashboard:**
   https://supabase.com/dashboard/project/eqkgcpbhsxjlzqozienv

4. **Vá em:** SQL Editor (menu lateral)

5. **Cole o conteúdo** na área de texto

6. **Clique em:** Run (ou pressione Ctrl+Enter)

7. **Aguarde** a execução (deve levar alguns segundos)

8. **Verifique** se apareceu "Success" ou mensagem de sucesso

---

## ✅ Verificar se Funcionou

### No Supabase Dashboard

1. Vá em: **Database** → **Tables**
2. Você deve ver estas tabelas:
   - `User`
   - `Account`
   - `Session`
   - `VerificationToken`
   - `Profile`
   - `SaaSAsset`
   - `Offer`
   - `Transaction`
   - `_prisma_migrations`

### Via SQL

Execute no SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

## 🔄 Método Alternativo: Script Interativo

Se preferir usar o script:

```bash
./scripts/apply-migrations-supabase.sh
```

O script vai pedir a senha do banco e aplicar automaticamente.

---

## ⚠️ Se Houver Erros

### Erro: "relation already exists"
- Significa que algumas tabelas já existem
- Isso é normal se você já tentou aplicar antes
- O script usa `CREATE TABLE IF NOT EXISTS`, então é seguro executar novamente

### Erro: "permission denied"
- Verifique se está logado no Supabase
- Verifique se tem permissões no projeto

---

## ✅ Após Aplicar

1. ✅ Verifique se as tabelas foram criadas
2. ✅ Teste a aplicação
3. ✅ Verifique se autenticação funciona
4. ✅ Teste criação de dados

---

**Última atualização:** 23/01/2025

