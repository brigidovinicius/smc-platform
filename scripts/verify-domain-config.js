#!/usr/bin/env node

/**
 * Script de verificação da configuração do domínio
 * 
 * Verifica se todas as configurações necessárias para o domínio counterx.io estão corretas
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkEnvFile() {
  log('\n📋 Verificando arquivo .env.local...', 'blue');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('⚠️  Arquivo .env.local não encontrado', 'yellow');
    log('   Crie o arquivo e adicione: NEXT_PUBLIC_SITE_URL=https://counterx.io', 'yellow');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasSiteUrl = envContent.includes('NEXT_PUBLIC_SITE_URL');
  
  if (!hasSiteUrl) {
    log('⚠️  NEXT_PUBLIC_SITE_URL não encontrado em .env.local', 'yellow');
    log('   Adicione: NEXT_PUBLIC_SITE_URL=https://counterx.io', 'yellow');
    return false;
  }
  
  const siteUrlMatch = envContent.match(/NEXT_PUBLIC_SITE_URL=(.+)/);
  if (siteUrlMatch) {
    const siteUrl = siteUrlMatch[1].trim().replace(/['"]/g, '');
    if (siteUrl === 'https://counterx.io') {
      log('✅ NEXT_PUBLIC_SITE_URL configurado corretamente', 'green');
      return true;
    } else {
      log(`⚠️  NEXT_PUBLIC_SITE_URL=${siteUrl}`, 'yellow');
      log('   Esperado: NEXT_PUBLIC_SITE_URL=https://counterx.io', 'yellow');
      return false;
    }
  }
  
  return false;
}

function checkSiteConfig() {
  log('\n📋 Verificando lib/config/site-config.ts...', 'blue');
  
  const configPath = path.join(process.cwd(), 'lib', 'config', 'site-config.ts');
  
  if (!fs.existsSync(configPath)) {
    log('❌ lib/config/site-config.ts não encontrado', 'red');
    return false;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Verificar se tem fallback para counterx.io
  const hasCounterxFallback = configContent.includes("'https://counterx.io'");
  
  if (hasCounterxFallback) {
    log('✅ Site config tem fallback para counterx.io', 'green');
  } else {
    log('⚠️  Site config não tem fallback para counterx.io', 'yellow');
  }
  
  return hasCounterxFallback;
}

function checkRobotsTxt() {
  log('\n📋 Verificando public/robots.txt...', 'blue');
  
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  
  if (!fs.existsSync(robotsPath)) {
    log('⚠️  public/robots.txt não encontrado', 'yellow');
    return false;
  }
  
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  const hasCounterxSitemap = robotsContent.includes('https://counterx.io/sitemap.xml');
  
  if (hasCounterxSitemap) {
    log('✅ robots.txt aponta para sitemap correto', 'green');
  } else {
    log('⚠️  robots.txt não aponta para counterx.io/sitemap.xml', 'yellow');
  }
  
  return hasCounterxSitemap;
}

function checkRssFeed() {
  log('\n📋 Verificando lib/rss.ts...', 'blue');
  
  const rssPath = path.join(process.cwd(), 'lib', 'rss.ts');
  
  if (!fs.existsSync(rssPath)) {
    log('⚠️  lib/rss.ts não encontrado', 'yellow');
    return false;
  }
  
  const rssContent = fs.readFileSync(rssPath, 'utf8');
  const usesSiteConfig = rssContent.includes('SITE_URL') || rssContent.includes('SITE_CONFIG');
  
  if (usesSiteConfig) {
    log('✅ RSS feed usa configuração centralizada', 'green');
  } else {
    log('⚠️  RSS feed pode ter URLs hardcoded', 'yellow');
  }
  
  return usesSiteConfig;
}

function checkOldDomainReferences() {
  log('\n📋 Verificando referências a domínios antigos...', 'blue');
  
  const oldDomains = ['smc-platform.vercel.app', 'saasmarketcap.com'];
  const filesToCheck = [
    'lib/config/site-config.ts',
    'lib/rss.ts',
    'lib/sitemap-blog.ts',
    'app/sitemap.ts',
    'public/robots.txt',
  ];
  
  let foundOldDomains = false;
  
  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      oldDomains.forEach(oldDomain => {
        if (content.includes(oldDomain)) {
          log(`⚠️  ${file} contém referência a ${oldDomain}`, 'yellow');
          foundOldDomains = true;
        }
      });
    }
  });
  
  if (!foundOldDomains) {
    log('✅ Nenhuma referência a domínios antigos encontrada', 'green');
  }
  
  return !foundOldDomains;
}

function main() {
  log('🔍 Verificação da Configuração do Domínio counterx.io', 'blue');
  log('=' .repeat(50), 'blue');
  
  const results = {
    envFile: checkEnvFile(),
    siteConfig: checkSiteConfig(),
    robotsTxt: checkRobotsTxt(),
    rssFeed: checkRssFeed(),
    noOldDomains: checkOldDomainReferences(),
  };
  
  const allPassed = Object.values(results).every(r => r);
  
  log('\n' + '='.repeat(50), 'blue');
  
  if (allPassed) {
    log('✅ Todas as verificações passaram!', 'green');
    log('\n📝 Próximos passos:', 'blue');
    log('1. Configure NEXT_PUBLIC_SITE_URL no painel da Hostinger', 'blue');
    log('2. Faça deploy da aplicação', 'blue');
    log('3. Verifique os endpoints após deploy:', 'blue');
    log('   - https://counterx.io/sitemap.xml', 'blue');
    log('   - https://counterx.io/rss', 'blue');
    log('   - https://counterx.io/robots.txt', 'blue');
    process.exit(0);
  } else {
    log('⚠️  Algumas verificações falharam. Revise os itens acima.', 'yellow');
    process.exit(1);
  }
}

main();


