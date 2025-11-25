# Configuração do Domínio Personalizado - counterx.io

## ✅ Configuração Completa Realizada

Todo o projeto foi reconfigurado para usar o domínio personalizado `counterx.io`. Todas as URLs foram centralizadas em `lib/config/site-config.ts` como única fonte de verdade (DRY principle).

## 📋 Checklist de Configuração

### 1. Variável de Ambiente Local

**IMPORTANTE**: Configure a variável de ambiente em `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://counterx.io
```

**Como verificar:**
```bash
# Verificar se a variável está definida
grep NEXT_PUBLIC_SITE_URL .env.local

# Ou no terminal
echo $NEXT_PUBLIC_SITE_URL
```

**Nota**: O projeto usa fallback para `https://counterx.io` se a variável não estiver definida, mas é recomendado configurá-la explicitamente.

### 2. Configuração na Hospedagem (Hostinger)

Você mencionou que já configurou na hospedagem. Verifique:

- ✅ **DNS**: Domínio `counterx.io` apontando para o IP do servidor
- ✅ **SSL/HTTPS**: Certificado SSL configurado (Let's Encrypt ou similar)
- ✅ **Redirecionamento**: HTTP → HTTPS configurado
- ✅ **Variáveis de Ambiente**: `NEXT_PUBLIC_SITE_URL=https://counterx.io` configurada no painel da Hostinger

### 3. Arquivos Atualizados

Os seguintes arquivos foram atualizados para usar `counterx.io`:

- ✅ `lib/config/site-config.ts` - Fonte central de configuração
- ✅ `lib/rss.ts` - Feed RSS
- ✅ `lib/sitemap-blog.ts` - Sitemap do blog
- ✅ `app/sitemap.ts` - Sitemap principal
- ✅ `public/robots.txt` - Sitemap location
- ✅ `pages/offers/[slug].jsx` - Páginas de ofertas
- ✅ `app/(marketing)/**/page.tsx` - Todas as páginas de marketing
- ✅ `app/(marketing)/_components/structured-data.tsx` - Schema.org
- ✅ `app/(marketing)/legal/page.tsx` - Email atualizado
- ✅ `app/(marketing)/suporte/page.tsx` - Emails atualizados
- ✅ `next-sitemap.js` - Configuração (documentação)

### 4. Verificações Pós-Deploy

Após o deploy, verifique os seguintes endpoints:

#### ✅ Sitemap
```bash
# Verificar sitemap principal
curl https://counterx.io/sitemap.xml

# Verificar sitemap do blog (se aplicável)
curl https://counterx.io/sitemap-blog
```

**O que verificar:**
- Todas as URLs devem começar com `https://counterx.io`
- Não deve haver referências a `smc-platform.vercel.app` ou `saasmarketcap.com`

#### ✅ Feed RSS
```bash
curl https://counterx.io/rss
```

**O que verificar:**
- Tags `<link>` devem apontar para `https://counterx.io/blog/...`
- Tag `<channel><link>` deve ser `https://counterx.io/blog`

#### ✅ Robots.txt
```bash
curl https://counterx.io/robots.txt
```

**O que verificar:**
- Linha `Sitemap:` deve ser `Sitemap: https://counterx.io/sitemap.xml`

#### ✅ Metadata OpenGraph/Twitter Cards

Verifique o HTML de qualquer página (ex: página inicial):

```bash
curl https://counterx.io | grep -i "og:url\|twitter:site"
```

**O que verificar:**
- `<meta property="og:url" content="https://counterx.io/...">`
- `<meta name="twitter:site" content="@counterxio">`

Ou use uma ferramenta online:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

#### ✅ URLs Canônicas

Verifique se todas as páginas têm tag canonical:

```bash
curl https://counterx.io | grep -i "canonical"
```

**O que verificar:**
- `<link rel="canonical" href="https://counterx.io/...">`

### 5. Teste Local

Antes do deploy, teste localmente:

```bash
# 1. Definir variável de ambiente (temporária)
export NEXT_PUBLIC_SITE_URL=https://counterx.io

# 2. Rodar build
npm run build

# 3. Iniciar servidor de produção
npm start

# 4. Testar endpoints
curl http://localhost:3000/sitemap.xml | grep counterx.io
curl http://localhost:3000/rss | grep counterx.io
curl http://localhost:3000/robots.txt | grep counterx.io
```

### 6. Google Search Console

Após o deploy, certifique-se de:

1. **Adicionar propriedade**: `https://counterx.io`
2. **Verificar propriedade**: Usar método de verificação (HTML tag, DNS, etc.)
3. **Enviar sitemap**: `https://counterx.io/sitemap.xml`
4. **Solicitar indexação**: Para páginas importantes

### 7. Verificação de DNS

Verifique se o DNS está apontando corretamente:

```bash
# Verificar registro A
dig counterx.io A +short

# Verificar registro CNAME (se aplicável)
dig counterx.io CNAME +short

# Verificar propagação DNS
# Use: https://www.whatsmydns.net/#A/counterx.io
```

### 8. Teste de SSL

Verifique se o SSL está funcionando:

```bash
# Verificar certificado SSL
openssl s_client -connect counterx.io:443 -servername counterx.io < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Ou use ferramenta online
# https://www.ssllabs.com/ssltest/analyze.html?d=counterx.io
```

## 🔧 Solução de Problemas

### Problema: URLs ainda mostram domínio antigo

**Solução:**
1. Limpar cache do Next.js: `rm -rf .next`
2. Verificar `.env.local` tem `NEXT_PUBLIC_SITE_URL=https://counterx.io`
3. Fazer rebuild: `npm run build`
4. Verificar variáveis de ambiente no servidor (Hostinger)

### Problema: Sitemap não atualiza

**Solução:**
1. O sitemap é gerado dinamicamente, mas pode ser cached
2. Verificar `app/sitemap.ts` está importando `SITE_URL` de `@/lib/site-config`
3. Limpar cache do navegador/CDN

### Problema: Metadata OpenGraph não atualiza

**Solução:**
1. Usar Facebook Sharing Debugger para limpar cache do Facebook
2. Verificar `metadataBase` está definido nas páginas
3. Verificar `SITE_CONFIG.url` está correto

## 📝 Notas Importantes

1. **Fonte única de verdade**: Todas as URLs devem vir de `lib/config/site-config.ts`
2. **Não hardcode URLs**: Sempre use `SITE_URL` ou `SITE_CONFIG.url`
3. **Variável de ambiente**: Use `NEXT_PUBLIC_SITE_URL` para diferentes ambientes (dev, staging, prod)
4. **Fallback**: O projeto tem fallback para `https://counterx.io`, mas configure explicitamente para produção

## 🚀 Próximos Passos

1. ✅ Configurar `.env.local` com `NEXT_PUBLIC_SITE_URL=https://counterx.io`
2. ✅ Verificar DNS na Hostinger
3. ✅ Configurar SSL/HTTPS
4. ✅ Deploy na Hostinger
5. ✅ Verificar todos os endpoints listados acima
6. ✅ Configurar Google Search Console
7. ✅ Testar compartilhamento social (OpenGraph/Twitter Cards)

## 📚 Referências

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

