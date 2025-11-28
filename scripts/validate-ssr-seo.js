#!/usr/bin/env node

/**
 * SSR SEO Validation Script
 * 
 * Valida o HTML renderizado no servidor para garantir que todos os metadados
 * estão presentes no HTML final que o Googlebot recebe.
 */

const http = require('http');
const { parse } = require('url');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Lista de rotas para validar
const ROUTES_TO_VALIDATE = [
  '/',
  '/blog',
  '/feed',
  '/pricing',
  '/calculator',
  '/faq',
  '/legal',
  '/buy-saas-business',
  '/sell-saas',
  '/buy-website',
  '/sell-website',
  '/valuation-saas',
  '/valuation-marketplace',
  '/digital-asset-valuation',
  '/mrr-multiple-calculator',
];

// Função para fazer request HTTP
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = parse(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout: ${url}`));
    });

    req.end();
  });
}

// Função para extrair metadados usando regex simples
function extractMetadata(html, route) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) {
    return {
      route,
      errors: ['Could not find <head> section'],
      warnings: [],
    };
  }

  const head = headMatch[1];
  
  const metadata = {
    route,
    title: null,
    description: null,
    canonical: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    ogUrl: null,
    ogType: null,
    ogSiteName: null,
    twitterCard: null,
    twitterTitle: null,
    twitterDescription: null,
    twitterImage: null,
    twitterCreator: null,
    viewport: null,
    charset: null,
    jsonLd: [],
    errors: [],
    warnings: [],
  };

  // Title
  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  } else {
    metadata.errors.push('Missing <title> tag');
  }

  // Description
  const descMatch = head.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch) {
    metadata.description = descMatch[1].trim();
  } else {
    metadata.errors.push('Missing <meta name="description">');
  }

  // Canonical
  const canonMatch = head.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (canonMatch) {
    metadata.canonical = canonMatch[1];
    if (!metadata.canonical.startsWith('http')) {
      metadata.warnings.push('Canonical URL is not absolute');
    }
  } else {
    metadata.errors.push('Missing <link rel="canonical">');
  }

  // Open Graph
  const ogTitleMatch = head.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  metadata.ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;

  const ogDescMatch = head.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  metadata.ogDescription = ogDescMatch ? ogDescMatch[1].trim() : null;

  const ogImageMatch = head.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  metadata.ogImage = ogImageMatch ? ogImageMatch[1].trim() : null;

  const ogUrlMatch = head.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i);
  metadata.ogUrl = ogUrlMatch ? ogUrlMatch[1].trim() : null;

  const ogTypeMatch = head.match(/<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']+)["']/i);
  metadata.ogType = ogTypeMatch ? ogTypeMatch[1].trim() : null;

  const ogSiteMatch = head.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
  metadata.ogSiteName = ogSiteMatch ? ogSiteMatch[1].trim() : null;

  if (!metadata.ogTitle) metadata.errors.push('Missing og:title');
  if (!metadata.ogDescription) metadata.errors.push('Missing og:description');
  if (!metadata.ogImage) metadata.errors.push('Missing og:image');
  if (!metadata.ogUrl) metadata.errors.push('Missing og:url');
  if (!metadata.ogType) metadata.errors.push('Missing og:type');
  if (!metadata.ogSiteName) metadata.errors.push('Missing og:site_name');

  // Twitter Cards
  const twCardMatch = head.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']+)["']/i);
  metadata.twitterCard = twCardMatch ? twCardMatch[1].trim() : null;

  const twTitleMatch = head.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i);
  metadata.twitterTitle = twTitleMatch ? twTitleMatch[1].trim() : null;

  const twDescMatch = head.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["']/i);
  metadata.twitterDescription = twDescMatch ? twDescMatch[1].trim() : null;

  const twImageMatch = head.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  metadata.twitterImage = twImageMatch ? twImageMatch[1].trim() : null;

  const twCreatorMatch = head.match(/<meta[^>]*name=["']twitter:creator["'][^>]*content=["']([^"']+)["']/i);
  metadata.twitterCreator = twCreatorMatch ? twCreatorMatch[1].trim() : null;

  if (!metadata.twitterCard) metadata.errors.push('Missing twitter:card');
  if (!metadata.twitterTitle) metadata.errors.push('Missing twitter:title');
  if (!metadata.twitterDescription) metadata.errors.push('Missing twitter:description');
  if (!metadata.twitterImage) metadata.errors.push('Missing twitter:image');

  // Viewport
  const viewportMatch = head.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
  metadata.viewport = viewportMatch ? viewportMatch[1].trim() : null;
  if (!metadata.viewport) {
    metadata.warnings.push('Missing viewport meta tag');
  }

  // Charset
  const charsetMatch = head.match(/<meta[^>]*charset=["']([^"']+)["']/i);
  metadata.charset = charsetMatch ? charsetMatch[1].trim() : null;
  if (!metadata.charset) {
    metadata.warnings.push('Missing charset meta tag');
  }

  // JSON-LD
  const jsonLdMatches = head.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1]);
      metadata.jsonLd.push(parsed);
    } catch (e) {
      metadata.warnings.push(`Invalid JSON-LD: ${e.message}`);
    }
  }

  return metadata;
}

// Função para validar um sitemap
async function validateSitemap() {
  try {
    const url = `${BASE_URL}/sitemap.xml`;
    const html = await fetchHTML(url);
    
    if (!html.includes('<?xml') || !html.includes('<urlset')) {
      return {
        valid: false,
        error: 'Invalid XML format',
      };
    }

    const urlMatches = html.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;

    return {
      valid: true,
      urlCount,
      hasMainPages: html.includes('/blog') && html.includes('/feed'),
      hasLastMod: html.includes('<lastmod>'),
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
}

// Função para validar robots.txt
async function validateRobots() {
  try {
    const url = `${BASE_URL}/robots.txt`;
    const content = await fetchHTML(url);
    
    return {
      valid: true,
      hasUserAgent: content.includes('User-agent:'),
      hasAllow: content.includes('Allow: /'),
      hasSitemap: content.includes('Sitemap:'),
      content: content.substring(0, 500),
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
}

// Função principal
async function main() {
  console.log('🔍 Iniciando validação SSR de SEO...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  const results = {
    routes: [],
    sitemap: null,
    robots: null,
    summary: {
      total: ROUTES_TO_VALIDATE.length,
      passed: 0,
      failed: 0,
      warnings: 0,
    },
  };

  // Validar cada rota
  for (const route of ROUTES_TO_VALIDATE) {
    const url = `${BASE_URL}${route}`;
    console.log(`Validando: ${route}...`);

    try {
      const html = await fetchHTML(url);
      const metadata = extractMetadata(html, route);
      results.routes.push(metadata);

      if (metadata.errors.length === 0) {
        results.summary.passed++;
        console.log(`  ✅ PASS - ${metadata.errors.length} erros, ${metadata.warnings.length} avisos`);
      } else {
        results.summary.failed++;
        console.log(`  ❌ FAIL - ${metadata.errors.length} erros, ${metadata.warnings.length} avisos`);
        metadata.errors.forEach((err) => console.log(`    - ${err}`));
      }

      if (metadata.warnings.length > 0) {
        results.summary.warnings += metadata.warnings.length;
        metadata.warnings.forEach((warn) => console.log(`    ⚠️  ${warn}`));
      }
    } catch (error) {
      console.log(`  ❌ ERROR: ${error.message}`);
      results.routes.push({
        route,
        errors: [error.message],
        warnings: [],
      });
      results.summary.failed++;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('\n📋 Validando sitemap.xml...');
  results.sitemap = await validateSitemap();
  if (results.sitemap.valid) {
    console.log(`  ✅ Sitemap válido - ${results.sitemap.urlCount} URLs encontradas`);
  } else {
    console.log(`  ❌ Sitemap inválido: ${results.sitemap.error}`);
  }

  console.log('\n📋 Validando robots.txt...');
  results.robots = await validateRobots();
  if (results.robots.valid) {
    console.log(`  ✅ Robots.txt válido`);
    if (!results.robots.hasSitemap) {
      console.log(`  ⚠️  Sitemap não encontrado em robots.txt`);
    }
  } else {
    console.log(`  ❌ Robots.txt inválido: ${results.robots.error}`);
  }

  // Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO FINAL');
  console.log('='.repeat(60));
  console.log(`Total de rotas: ${results.summary.total}`);
  console.log(`✅ Passou: ${results.summary.passed}`);
  console.log(`❌ Falhou: ${results.summary.failed}`);
  console.log(`⚠️  Avisos: ${results.summary.warnings}`);
  console.log('='.repeat(60));

  // Detalhes das falhas
  if (results.summary.failed > 0) {
    console.log('\n❌ ROTAS COM FALHAS:');
    results.routes.forEach((route) => {
      if (route.errors && route.errors.length > 0) {
        console.log(`\n${route.route}:`);
        route.errors.forEach((err) => console.log(`  - ${err}`));
      }
    });
  }

  // Gerar relatório JSON
  const fs = require('fs');
  const reportPath = './SEO-SSR-VALIDATION-REPORT.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Relatório JSON salvo em: ${reportPath}`);

  process.exit(results.summary.failed > 0 ? 1 : 0);
}

// Verificar se o servidor está rodando
async function checkServer() {
  try {
    await fetchHTML(`${BASE_URL}/`);
    return true;
  } catch (error) {
    console.error(`❌ Erro: Não foi possível conectar ao servidor em ${BASE_URL}`);
    console.error(`   Certifique-se de que o servidor está rodando:`);
    console.error(`   npm run build && npm start`);
    console.error(`   ou`);
    console.error(`   npm run dev`);
    process.exit(1);
  }
}

// Executar
checkServer().then(() => {
  main().catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
});