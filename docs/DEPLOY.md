# Deploy & Infra – SaaS Market Cap

## Projeto oficial no Vercel
- **Projeto ativo:** `smc-platform` (`https://smc-platform.vercel.app`)
- **Escopo:** `brigidovinicius-projects`
- **Como vincular o repositório local:**  
  ```bash
  vercel link --project smc-platform --yes
  ```
- **Domínios/aliases:**
  - `smc-platform.vercel.app` (domínio padrão)
  - `saas-market-cap.vercel.app` (alias apontado com `vercel alias set smc-platform.vercel.app saas-market-cap.vercel.app`)
  - adicione novos domínios customizados sempre neste projeto.

## Variáveis de ambiente
As credenciais que estavam no projeto legado `saas-market-cap` foram copiadas para `smc-platform`.

| Nome             | Dev | Preview | Prod | Observações |
| ---------------- | --- | ------- | ---- | ----------- |
| `DATABASE_URL`   | ✅  | ✅      | ✅   | Supabase `postgresql://postgres:#CypherPunk2030@db.eqkgcpbhsxjlzqozienv.supabase.co:5432/postgres?sslmode=require` |
| `NEXTAUTH_SECRET`| ✅  | ✅      | ✅   | Preview/Dev usam `NxmbIB1N7E1K/BFgRwf0vhCg1yIjcvNXd/99UK9YHYI=`; Produção usa `4URgInKVZm+fw9qtAleBcxHou+4T14KTbQBdXlI5nwc=` |
| `NEXTAUTH_URL`   | ✅  | ✅      | ✅   | Sempre `https://smc-platform.vercel.app` |

### Como sincronizar localmente
```bash
# Baixar variáveis de desenvolvimento do projeto oficial
vercel env pull .env.local --yes
```

Para copiar variáveis de outros ambientes utilize:
```bash
vercel env pull .env.preview --environment=preview --yes
vercel env pull .env.production --environment=production --yes
```

## Build legado
- O projeto `saas-market-cap` foi removido após migrar envs e aliases.  
- Caso seja necessário recuperar o bundle antigo, utilize o painel do Vercel (Deployments → Download Build) antes de remover deployments específicos.

## Fluxo de deploy recomendado
1. **Local:** `npm run dev`, `npm run lint`.
2. **Commit** em `main`.
3. **Deploy:** `vercel --prod` (ou rely no Git deploy automático do projeto).
4. Após o deploy, os domínios `smc-platform.vercel.app` e `saas-market-cap.vercel.app` já apontam para o mesmo deployment.


