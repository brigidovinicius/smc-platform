/**
 * next-sitemap configuration
 * 
 * NOTE: This project uses Next.js 14 native sitemap.ts (app/sitemap.ts)
 * instead of next-sitemap package. This file is kept for documentation purposes.
 * 
 * If you need to switch to next-sitemap in the future, install the package:
 * npm install --save-dev next-sitemap
 * 
 * Then configure it here and update package.json scripts:
 * "postbuild": "next-sitemap"
 */

const { SITE_URL } = require('./lib/config/site-config');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL || 'https://counterx.io',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/auth/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL || 'https://counterx.io'}/sitemap.xml`,
      `${SITE_URL || 'https://counterx.io'}/sitemap-blog`,
    ],
  },
  exclude: ['/api/*', '/admin/*', '/auth/*', '/dashboard/*'],
};



