#!/usr/bin/env node

/**
 * Script de validação do domínio em produção
 * 
 * Verifica se todos os endpoints estão retornando URLs corretas com counterx.io
 */

const https = require('https');
const http = require('http');

const DOMAIN = process.env.DOMAIN || 'counterx.io';
const PROTOCOL = process.env.PROTOCOL || 'https';
const BASE_URL = `${PROTOCOL}://${DOMAIN}`;

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: data,
        });
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkSitemap() {
  log('\n📋 Verificando /sitemap.xml...', 'blue');
  
  try {
    const url = `${BASE_URL}/sitemap.xml`;
    const response = await fetchUrl(url);
    
    if (response.statusCode !== 200) {
      log(`❌ Sitemap retornou status ${response.statusCode}`, 'red');
      return false;
    }
    
    // Verificar se todas as URLs usam counterx.io
    const oldDomains = response.body.match(/https?:\/\/(smc-platform\.vercel\.app|saasmarketcap\.com)/g);
    if (oldDomains && oldDomains.length > 0) {
      log(`❌ Encontradas ${oldDomains.length} referências a domínios antigos:`, 'red');
      [...new Set(oldDomains)].forEach(domain => {
        log(`   - ${domain}`, 'red');
      });
      return false;
    }
    
    // Verificar se há URLs com counterx.io
    const counterxUrls = response.body.match(new RegExp(`https?://${DOMAIN}`, 'g'));
    if (!counterxUrls || counterxUrls.length === 0) {
      log(`❌ Nenhuma URL encontrada com ${DOMAIN}`, 'red');
      return false;
    }
    
    log(`✅ Sitemap OK - ${counterxUrls.length} URLs com ${DOMAIN}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erro ao verificar sitemap: ${error.message}`, 'red');
    return false;
  }
}

async function checkRobotsTxt() {
  log('\n📋 Verificando /robots.txt...', 'blue');
  
  try {
    const url = `${BASE_URL}/robots.txt`;
    const response = await fetchUrl(url);
    
    if (response.statusCode !== 200) {
      log(`❌ robots.txt retornou status ${response.statusCode}`, 'red');
      return false;
    }
    
    // Verificar se sitemap aponta para counterx.io
    const sitemapLine = response.body.match(/Sitemap:\s*(.+)/i);
    if (!sitemapLine) {
      log(`❌ Linha Sitemap não encontrada em robots.txt`, 'red');
      return false;
    }
    
    const sitemapUrl = sitemapLine[1].trim();
    if (!sitemapUrl.includes(DOMAIN)) {
      log(`❌ Sitemap aponta para: ${sitemapUrl}`, 'red');
      log(`   Esperado: https://${DOMAIN}/sitemap.xml`, 'yellow');
      return false;
    }
    
    log(`✅ robots.txt OK - Sitemap: ${sitemapUrl}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erro ao verificar robots.txt: ${error.message}`, 'red');
    return false;
  }
}

async function checkRssFeed() {
  log('\n📋 Verificando /rss...', 'blue');
  
  try {
    const url = `${BASE_URL}/rss`;
    const response = await fetchUrl(url);
    
    if (response.statusCode !== 200) {
      log(`❌ RSS retornou status ${response.statusCode}`, 'red');
      return false;
    }
    
    // Verificar se há URLs antigas
    const oldDomains = response.body.match(/https?:\/\/(smc-platform\.vercel\.app|saasmarketcap\.com)/g);
    if (oldDomains && oldDomains.length > 0) {
      log(`❌ Encontradas referências a domínios antigos no RSS`, 'red');
      return false;
    }
    
    // Verificar se channel link usa counterx.io
    const channelLink = response.body.match(/<link>([^<]+)<\/link>/);
    if (channelLink && !channelLink[1].includes(DOMAIN)) {
      log(`❌ Channel link não usa ${DOMAIN}: ${channelLink[1]}`, 'red');
      return false;
    }
    
    // Contar URLs com counterx.io
    const counterxUrls = response.body.match(new RegExp(`https?://${DOMAIN}`, 'g'));
    if (!counterxUrls || counterxUrls.length === 0) {
      log(`⚠️  Nenhuma URL encontrada com ${DOMAIN} no RSS`, 'yellow');
    } else {
      log(`✅ RSS OK - ${counterxUrls.length} URLs com ${DOMAIN}`, 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ Erro ao verificar RSS: ${error.message}`, 'red');
    return false;
  }
}

async function checkHomepageMetadata() {
  log('\n📋 Verificando metadata na página inicial...', 'blue');
  
  try {
    const url = `${BASE_URL}/`;
    const response = await fetchUrl(url);
    
    if (response.statusCode !== 200) {
      log(`❌ Página inicial retornou status ${response.statusCode}`, 'red');
      return false;
    }
    
    let allPassed = true;
    
    // Verificar og:url
    const ogUrl = response.body.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
    if (ogUrl) {
      if (ogUrl[1].includes(DOMAIN)) {
        log(`✅ og:url OK: ${ogUrl[1]}`, 'green');
      } else {
        log(`❌ og:url não usa ${DOMAIN}: ${ogUrl[1]}`, 'red');
        allPassed = false;
      }
    } else {
      log(`⚠️  og:url não encontrado`, 'yellow');
    }
    
    // Verificar canonical
    const canonical = response.body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (canonical) {
      if (canonical[1].includes(DOMAIN)) {
        log(`✅ canonical OK: ${canonical[1]}`, 'green');
      } else {
        log(`❌ canonical não usa ${DOMAIN}: ${canonical[1]}`, 'red');
        allPassed = false;
      }
    } else {
      log(`⚠️  canonical não encontrado`, 'yellow');
    }
    
    // Verificar twitter:site ou twitter:creator
    const twitterSite = response.body.match(/<meta\s+name=["']twitter:(site|creator)["']\s+content=["']([^"']+)["']/i);
    if (twitterSite) {
      log(`✅ Twitter metadata encontrado: ${twitterSite[2]}`, 'green');
    } else {
      log(`⚠️  Twitter metadata não encontrado`, 'yellow');
    }
    
    // Verificar se há URLs antigas
    const oldDomains = response.body.match(/https?:\/\/(smc-platform\.vercel\.app|saasmarketcap\.com)/g);
    if (oldDomains && oldDomains.length > 0) {
      log(`❌ Encontradas referências a domínios antigos na página inicial`, 'red');
      allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    log(`❌ Erro ao verificar página inicial: ${error.message}`, 'red');
    return false;
  }
}

async function checkSSL() {
  log('\n📋 Verificando SSL/HTTPS...', 'blue');
  
  if (PROTOCOL !== 'https') {
    log(`⚠️  Verificando HTTP (não HTTPS)`, 'yellow');
    return true;
  }
  
  try {
    const https = require('https');
    const url = require('url');
    const parsedUrl = url.parse(BASE_URL);
    
    return new Promise((resolve) => {
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        method: 'HEAD',
        rejectUnauthorized: false, // Para verificar mesmo com certificado auto-assinado
      };
      
      const req = https.request(options, (res) => {
        log(`✅ SSL OK - Status: ${res.statusCode}`, 'green');
        resolve(true);
      });
      
      req.on('error', (error) => {
        log(`❌ Erro SSL: ${error.message}`, 'red');
        resolve(false);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        log(`❌ Timeout ao verificar SSL`, 'red');
        resolve(false);
      });
      
      req.end();
    });
  } catch (error) {
    log(`❌ Erro ao verificar SSL: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log(`\n🔍 Validação do Domínio em Produção: ${DOMAIN}`, 'cyan');
  log('='.repeat(60), 'cyan');
  
  log(`\n🌐 Base URL: ${BASE_URL}`, 'blue');
  
  const results = {
    ssl: await checkSSL(),
    sitemap: await checkSitemap(),
    robotsTxt: await checkRobotsTxt(),
    rss: await checkRssFeed(),
    homepage: await checkHomepageMetadata(),
  };
  
  const allPassed = Object.values(results).every(r => r);
  
  log('\n' + '='.repeat(60), 'cyan');
  
  if (allPassed) {
    log('\n✅ TODAS AS VALIDAÇÕES PASSARAM!', 'green');
    log('\n🎉 Seu domínio está configurado corretamente!', 'green');
    log('\n📝 Próximos passos sugeridos:', 'blue');
    log('1. Adicionar propriedade no Google Search Console', 'blue');
    log('2. Enviar sitemap: https://counterx.io/sitemap.xml', 'blue');
    log('3. Testar compartilhamento social (OpenGraph/Twitter Cards)', 'blue');
    log('4. Monitorar erros no Google Search Console', 'blue');
    process.exit(0);
  } else {
    log('\n⚠️  ALGUMAS VALIDAÇÕES FALHARAM', 'yellow');
    log('\n📝 Revise os itens acima e corrija os problemas encontrados.', 'yellow');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  process.exit(1);
});



