# Configuração de Usuário Administrador

## Criar Usuário Admin

Execute o script para criar um usuário administrador:

```bash
# Modo interativo (o script pergunta os dados)
node scripts/create-admin-user.js

# Modo não-interativo (forneça os dados)
node scripts/create-admin-user.js "Nome Completo" "email@exemplo.com" "senha123"
```

## Verificar Usuários no Banco

Para listar todos os usuários e seus perfis:

```bash
node scripts/check-users.js
```

## Credenciais Padrão

Após executar o script com os valores padrão, as credenciais são:

- **Email:** `admin@counterx.com`
- **Senha:** `admin123456`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login em produção!

## Fazer Login

1. Acesse: `http://localhost:3001/auth/login`
2. Use as credenciais criadas
3. Você será redirecionado para `/dashboard`

## Funcionalidades Admin

Com o role `ADMIN`, você tem acesso a:

- `/admin/assets` - Gerenciar assets (aprovar/publicar)
- `/admin/leads` - Visualizar e gerenciar leads
- Todas as rotas protegidas do sistema

## Troubleshooting

### Login não funciona

1. Verifique se o usuário existe: `node scripts/check-users.js`
2. Verifique se o perfil tem role ADMIN
3. Verifique os logs do servidor para erros
4. Reinicie o servidor após criar usuário

### Erro de conexão com banco

```bash
# Inicie o PostgreSQL Docker
docker compose up -d db

# Verifique se está rodando
docker ps | grep db
```

### Atualizar usuário existente para Admin

```bash
node scripts/create-admin-user.js
# Quando perguntar, informe o email do usuário existente
# O script detectará e perguntará se deseja torná-lo admin
```



