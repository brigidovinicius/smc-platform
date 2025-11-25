# ✅ Validação Pós-Deploy - counterx.io

## 🚀 Domínio Apontado!

Agora que o domínio está apontado e configurado, vamos validar se tudo está funcionando corretamente.

## 🔍 Script de Validação Automática

Execute o script de validação para verificar todos os endpoints:

```bash
# Validar domínio em produção (padrão: counterx.io)
npm run validate:production

# Ou especificar domínio diferente
DOMAIN=seu-dominio.com npm run validate:production

# Validar via HTTP (útil para testes locais)
PROTOCOL=http DOMAIN=localhost:3000 npm run validate:production
```

## 📋 Checklist Manual

Se preferir verificar manualmente, use este checklist:

### 1. ✅ Sitemap Principal
```bash
curl https://counterx.io/sitemap.xml | grep counterx.io
```

**O que verificar:**
- ✅ Todas as URLs começam com `https://counterx.io`
- ✅ Não há referências a `smc-platform.vercel.app` ou `saasmarketcap.com`
- ✅ Status HTTP 200

### 2. ✅ Feed RSS
```bash
curl https://counterx.io/rss
```

**O que verificar:**
- ✅ Tag `<channel><link>` contém `counterx.io`
- ✅ Tags `<item><link>` usam `counterx.io/blog/...`
- ✅ Não há URLs antigas

### 3. ✅ Robots.txt
```bash
curl https://counterx.io/robots.txt
```

**O que verificar:**
- ✅ Linha `Sitemap: https://counterx.io/sitemap.xml`
- ✅ Não aponta para domínio antigo

### 4. ✅ Página Inicial - Metadata
```bash
curl https://counterx.io | grep -E "og:url|canonical|twitter"
```

**O que verificar:**
- ✅ `<meta property="og:url" content="https://counterx.io/...">`
- ✅ `<link rel="canonical" href="https://counterx.io/...">`
- ✅ `<meta name="twitter:site" content="@counterxio">` ou similar

### 5. ✅ SSL/HTTPS
```bash
curl -I https://counterx.io
```

**O que verificar:**
- ✅ Status 200 ou 301/302 (redirecionamento)
- ✅ Certificado SSL válido
- ✅ Redirecionamento HTTP → HTTPS configurado

### 6. ✅ Blog Posts
```bash
# Se tiver posts, verificar um exemplo
curl https://counterx.io/blog/[slug-do-post] | grep -E "og:url|canonical"
```

**O que verificar:**
- ✅ URLs canônicas usam `counterx.io`
- ✅ OpenGraph URLs corretas

## 🛠️ Ferramentas Online de Validação

### OpenGraph (Facebook/Meta)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Cole a URL: `https://counterx.io`

**O que verificar:**
- ✅ Imagem OpenGraph aparece
- ✅ Título e descrição corretos
- ✅ URL usa `counterx.io`

### Twitter Cards
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- Cole a URL: `https://counterx.io`

**O que verificar:**
- ✅ Card preview aparece
- ✅ Imagem, título e descrição corretos

### Google Search Console
1. Acesse: [Google Search Console](https://search.google.com/search-console)
2. Adicione propriedade: `https://counterx.io`
3. Verifique propriedade (via HTML tag, DNS, etc.)
4. Envie sitemap: `https://counterx.io/sitemap.xml`

### SSL/TLS
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- Cole o domínio: `counterx.io`

**O que verificar:**
- ✅ Nota A ou superior
- ✅ Certificado válido
- ✅ Suporte a TLS 1.2 e 1.3

### DNS
- [What's My DNS](https://www.whatsmydns.net/)
- Verifique propagação do registro A para `counterx.io`

## 🐛 Solução de Problemas

### Problema: Sitemap não retorna URLs corretas

**Solução:**
1. Verificar variável de ambiente `NEXT_PUBLIC_SITE_URL` no servidor
2. Limpar cache: `rm -rf .next` e fazer rebuild
3. Verificar se `lib/config/site-config.ts` tem fallback correto

### Problema: RSS mostra domínio antigo

**Solução:**
1. Verificar `lib/rss.ts` está usando `SITE_URL` ou `SITE_CONFIG`
2. Rebuild da aplicação
3. Limpar cache do CDN (se houver)

### Problema: SSL não funciona

**Solução:**
1. Verificar certificado SSL na Hostinger
2. Verificar DNS aponta corretamente
3. Aguardar propagação (pode levar até 48h)

### Problema: Metadata OpenGraph não atualiza

**Solução:**
1. Usar Facebook Sharing Debugger para limpar cache
2. Adicionar query string: `?v=2` na URL para forçar atualização
3. Verificar se `metadataBase` está definido nas páginas

## 📊 Monitoramento Contínuo

Após validação inicial, monitore:

1. **Google Search Console**
   - Erros de rastreamento
   - Cobertura de indexação
   - Performance de busca

2. **Analytics**
   - Tráfego orgânico
   - Conversões
   - Páginas mais visitadas

3. **Uptime Monitoring**
   - Disponibilidade do site
   - Tempo de resposta
   - Status de SSL

## ✅ Checklist Final

- [ ] Script de validação executado com sucesso
- [ ] Sitemap acessível e com URLs corretas
- [ ] RSS feed funcionando
- [ ] robots.txt correto
- [ ] Metadata OpenGraph validado
- [ ] Twitter Cards validado
- [ ] SSL/HTTPS funcionando
- [ ] Google Search Console configurado
- [ ] Sitemap enviado ao Google
- [ ] DNS propagado corretamente

## 🎉 Pronto!

Se todas as validações passaram, seu domínio está configurado e funcionando corretamente!

**Próximos passos:**
1. Monitorar Google Search Console
2. Configurar Google Analytics (se ainda não tiver)
3. Criar redirecionamentos 301 do domínio antigo (se aplicável)
4. Atualizar links externos para usar `counterx.io`

---

**Última atualização**: Domínio apontado e validado! 🚀


