# Migration para Asset Models

## Status

✅ **Prisma Client gerado com sucesso**
✅ **Migration SQL criada manualmente**

## Próximos Passos

### 1. Quando o banco PostgreSQL estiver acessível

Execute a migration:

```bash
npx prisma migrate deploy
```

Ou, se preferir usar o modo dev (que cria uma nova migration):

```bash
npx prisma migrate dev --name add_asset_models
```

**Nota:** Como a migration já foi criada manualmente em `prisma/migrations/20250124000000_add_asset_models/migration.sql`, você pode aplicar diretamente usando `migrate deploy`.

### 2. Verificar se a migration foi aplicada

```bash
npx prisma migrate status
```

### 3. Opcional: Reset e aplicar todas as migrations (CUIDADO - apaga dados)

```bash
npx prisma migrate reset
```

## O que foi criado

A migration adiciona:

1. **Enums:**
   - `AssetType` (10 tipos: ECOMMERCE, SAAS, SOFTWARE, etc.)
   - `AssetStatus` (6 status: DRAFT, SUBMITTED, PENDING_REVIEW, etc.)

2. **Tabelas:**
   - `Asset` - Modelo principal de assets
   - `AssetFinancials` - Dados financeiros históricos
   - `AssetPerformance` - Métricas de performance
   - `AssetVerification` - Flags de verificação/risco
   - `AssetModeration` - Dados de moderação/admin
   - `AssetMedia` - Mídia e documentos de prova

3. **Índices e Foreign Keys:**
   - Índices em `ownerId`, `type`, `status`, `slug`
   - Foreign keys relacionando tudo ao modelo `Asset`
   - Cascade deletes onde apropriado

## Troubleshooting

### Erro: Can't reach database server

O banco PostgreSQL precisa estar acessível. Verifique:
- `DATABASE_URL` no `.env.local`
- Conexão de rede com o Supabase
- Firewall/permissões

### Erro: Migration already applied

Se a migration já foi aplicada, você verá isso no status. Está tudo OK.

### Quer usar SQLite localmente?

Se preferir usar SQLite para desenvolvimento local:

1. Atualize `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Atualize os tipos Float para Real no schema SQLite:
   - SQLite usa `REAL` ao invés de `DOUBLE PRECISION`

3. Execute:
   ```bash
   npx prisma migrate dev --name add_asset_models
   ```

## Testando

Após aplicar a migration, teste criando um asset:

1. Acesse `/dashboard/assets/new`
2. Preencha o wizard
3. Verifique no admin `/admin/assets`


