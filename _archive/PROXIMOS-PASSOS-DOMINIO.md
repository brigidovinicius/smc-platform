# 🚀 Próximos Passos - Domínio counterx.io Apontado

## ✅ Status Atual

- ✅ Domínio apontado na hospedagem (Hostinger)
- ✅ Todo código reconfigurado para usar `counterx.io`
- ✅ Arquivos de configuração atualizados

## ⏰ Aguardando Propagação

Após apontar o domínio, pode levar algumas horas (até 48h) para:
- Propagação DNS completa
- Configuração SSL/HTTPS
- Deploy da aplicação

## 📋 Checklist de Verificação

### 1. Verificar Propagação DNS

```bash
# Verificar registro A
dig counterx.io A +short

# Verificar via nslookup
nslookup counterx.io

# Verificar propagação global
# Acesse: https://www.whatsmydns.net/#A/counterx.io
```

**O que verificar:**
- ✅ DNS retorna o IP do servidor correto
- ✅ Propagação em diferentes servidores DNS

### 2. Verificar SSL/HTTPS

```bash
# Testar conexão HTTPS
curl -I https://counterx.io

# Verificar certificado
openssl s_client -connect counterx.io:443 -servername counterx.io < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

**Ferramentas online:**
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/analyze.html?d=counterx.io)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html#hostname=counterx.io)

**O que verificar:**
- ✅ Certificado SSL válido
- ✅ Sem erros de certificado
- ✅ HTTPS funcionando

### 3. Verificar Deploy

Assim que o DNS propagar e SSL estiver ativo:

```bash
# Validar automaticamente
npm run validate:production

# Ou verificar manualmente
curl https://counterx.io
curl https://counterx.io/sitemap.xml
curl https://counterx.io/rss
curl https://counterx.io/robots.txt
```

## 🔧 Configurações Necessárias na Hostinger

### 1. Variável de Ambiente

No painel da Hostinger, certifique-se de ter configurado:

```
NEXT_PUBLIC_SITE_URL=https://counterx.io
```

**Como encontrar:**
- Painel Hostinger → Seu projeto → Variáveis de Ambiente
- Ou na configuração do servidor/deploy

### 2. Redirecionamento HTTP → HTTPS

Configure redirecionamento automático de HTTP para HTTPS:

```
http://counterx.io → https://counterx.io (301)
www.counterx.io → counterx.io (301) [opcional]
```

**No Next.js**, você pode fazer isso via `next.config.mjs`:

```javascript
async redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'header',
          key: 'x-forwarded-proto',
          value: 'http',
        },
      ],
      destination: 'https://counterx.io/:path*',
      permanent: true,
    },
  ];
}
```

### 3. Configurar www (opcional)

Se quiser usar `www.counterx.io` também:

1. **Opção A**: Redirecionar www → non-www (recomendado)
   ```
   www.counterx.io → counterx.io (301)
   ```

2. **Opção B**: Usar ambos (configurar DNS para ambos)

## ✅ Validação Pós-Deploy

### Quando DNS e SSL estiverem prontos:

```bash
# 1. Validar tudo automaticamente
npm run validate:production

# 2. Testar endpoints manualmente
curl https://counterx.io/sitemap.xml | head -20
curl https://counterx.io/rss | head -20
curl https://counterx.io/robots.txt

# 3. Verificar metadata
curl https://counterx.io | grep -E "og:url|canonical|twitter"
```

### Ferramentas de Validação Online:

1. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Cole: `https://counterx.io`
   - Verifica OpenGraph metadata

2. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Cole: `https://counterx.io`
   - Verifica Twitter Cards

3. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Cole: `https://counterx.io`
   - Verifica structured data

4. **W3C Markup Validator**
   - https://validator.w3.org/
   - Cole: `https://counterx.io`
   - Valida HTML

## 🔍 Monitoramento

### Google Search Console

1. **Adicionar propriedade:**
   - Acesse: https://search.google.com/search-console
   - Adicione: `https://counterx.io`

2. **Verificar propriedade:**
   - Método recomendado: **Tag HTML**
   - Adicione a tag no `<head>` de `app/(marketing)/layout.tsx` ou `pages/_app.js`

3. **Enviar sitemap:**
   - Após verificação, envie: `https://counterx.io/sitemap.xml`

### Google Analytics (se aplicável)

Atualize a URL do site no Google Analytics para `counterx.io`

### Verificação Regular

Execute semanalmente:
```bash
npm run validate:production
```

## 🐛 Problemas Comuns

### DNS ainda não propagou

**Solução:** Aguarde até 48h. Verifique em: https://www.whatsmydns.net/

### SSL não funciona

**Solução:**
1. Verifique se o certificado está instalado na Hostinger
2. Aguarde até 24h após instalação
3. Limpe cache do navegador

### Site não carrega

**Solução:**
1. Verifique se o deploy foi feito
2. Verifique logs de erro na Hostinger
3. Verifique variáveis de ambiente
4. Teste localmente primeiro: `npm run build && npm start`

### URLs ainda mostram domínio antigo

**Solução:**
1. Limpe cache: `rm -rf .next`
2. Verifique `.env.local` tem `NEXT_PUBLIC_SITE_URL=https://counterx.io`
3. Faça rebuild: `npm run build`
4. Verifique variáveis no servidor

## 📝 Timeline Esperada

| Etapa | Tempo Estimado |
|-------|---------------|
| Propagação DNS | 1-48 horas |
| SSL/HTTPS | 1-24 horas |
| Deploy | Imediato |
| **Total** | **1-48 horas** |

## ✅ Checklist Final

Aguarde DNS e SSL, depois verifique:

- [ ] DNS propagado (verificar com `dig` ou ferramenta online)
- [ ] SSL/HTTPS funcionando
- [ ] Site carregando em `https://counterx.io`
- [ ] Variável `NEXT_PUBLIC_SITE_URL` configurada no servidor
- [ ] Deploy realizado com sucesso
- [ ] Validação automática passou: `npm run validate:production`
- [ ] Sitemap acessível: `https://counterx.io/sitemap.xml`
- [ ] RSS acessível: `https://counterx.io/rss`
- [ ] robots.txt correto: `https://counterx.io/robots.txt`
- [ ] OpenGraph validado (Facebook Sharing Debugger)
- [ ] Twitter Cards validado
- [ ] Google Search Console configurado
- [ ] Sitemap enviado ao Google

## 🎉 Próximos Passos

1. **Aguardar propagação DNS** (1-48h)
2. **Aguardar SSL** (1-24h)
3. **Fazer deploy** na Hostinger
4. **Validar** com `npm run validate:production`
5. **Configurar Google Search Console**
6. **Monitorar** regularmente

---

**Status:** Aguardando propagação DNS e SSL 🔄

**Ação:** Aguarde algumas horas e rode `npm run validate:production` novamente!


