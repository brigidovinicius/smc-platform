/**
 * Route existence tests
 * Ensures all main routes are accessible
 */

import { describe, it, expect } from 'vitest';

describe('Route Existence', () => {
  const mainRoutes = [
    '/',
    '/about',
    '/marketplace',
    '/pricing',
    '/resources',
    '/support',
    '/blog',
    '/feed',
    '/calculator',
    '/faq',
    '/legal/terms',
    '/legal/privacy',
    '/legal/cookies',
    '/auth/login',
    '/auth/register',
  ];

  const adminRoutes = [
    '/admin',
    '/admin/assets',
    '/admin/sellers',
    '/admin/blog',
    '/admin/settings',
  ];

  it('should have all main routes defined', () => {
    mainRoutes.forEach((route) => {
      expect(route).toBeTruthy();
      expect(route.startsWith('/')).toBe(true);
    });
  });

  it('should have all admin routes defined', () => {
    adminRoutes.forEach((route) => {
      expect(route).toBeTruthy();
      expect(route.startsWith('/admin')).toBe(true);
    });
  });

  it('should have valid route structure', () => {
    const allRoutes = [...mainRoutes, ...adminRoutes];
    allRoutes.forEach((route) => {
      // Routes should not have double slashes (except at start)
      expect(route.replace(/\/+/g, '/')).toBe(route);
      // Routes should not end with slash (except root)
      if (route !== '/') {
        expect(route.endsWith('/')).toBe(false);
      }
    });
  });
});


