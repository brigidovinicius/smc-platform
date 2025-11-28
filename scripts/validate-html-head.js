#!/usr/bin/env node

/**
 * Script simplificado para validar HTML head renderizado
 * Extrai e valida metadata de páginas específicas
 */

const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) resolve(data);
        else reject(new Error(`HTTP ${res.statusCode}`));
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

function extractHead(html) {
  const match = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return match ? match[1] : null;
}

function validateMetadata(head, route) {
  const errors = [];
  const warnings = [];
  const found = {};

  // Title
  if (!head.match(/<title[^>]*>[\s\S]*?<\/title>/i)) {
    errors.push('Missing <title>');
  } else {
    found.title = true;
  }

  // Description
  if (!head.match(/<meta[^>]*name=["']description["'][^>]*>/i)) {
    errors.push('Missing meta description');
  } else {
    found.description = true;
  }

  // Canonical
  if (!head.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)) {
    errors.push('Missing canonical link');
  } else {
    found.canonical = true;
  }

  // Open Graph
  ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name'].forEach(prop => {
    if (!head.match(new RegExp(`<meta[^>]*property=["']${prop.replace(':', '\\:')}["'][^>]*>`, 'i'))) {
      errors.push(`Missing ${prop}`);
    } else {
      found[prop] = true;
    }
  });

  // Twitter
  ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].forEach(prop => {
    if (!head.match(new RegExp(`<meta[^>]*name=["']${prop}["'][^>]*>`, 'i'))) {
      errors.push(`Missing ${prop}`);
    } else {
      found[prop] = true;
    }
  });

  return { errors, warnings, found };
}

async function main() {
  const routes = [
    '/',
    '/blog',
    '/blog/how-to-prepare-saas-valuation-2024',
    '/feed',
    '/pricing',
    '/calculator',
    '/faq',
    '/legal',
    '/buy-saas-business',
  ];

  console.log('🔍 Validando HTML renderizado SSR...\n');

  const results = [];

  for (const route of routes) {
    try {
      const html = await fetchPage(`${BASE_URL}${route}`);
      const head = extractHead(html);
      
      if (!head) {
        results.push({ route, status: 'ERROR', error: 'No <head> found' });
        continue;
      }

      const validation = validateMetadata(head, route);
      results.push({
        route,
        status: validation.errors.length === 0 ? 'PASS' : 'FAIL',
        errors: validation.errors,
        warnings: validation.warnings,
        found: Object.keys(validation.found).length,
      });

      console.log(`${validation.errors.length === 0 ? '✅' : '❌'} ${route}`);
      if (validation.errors.length > 0) {
        validation.errors.forEach(err => console.log(`   - ${err}`));
      }
    } catch (error) {
      results.push({ route, status: 'ERROR', error: error.message });
      console.log(`❌ ${route} - ${error.message}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n📊 Resumo:');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${failed}`);
  console.log(`⚠️  Erros: ${errors}`);

  fs.writeFileSync('./validation-results.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Resultados salvos em validation-results.json');
}

main().catch(console.error);
