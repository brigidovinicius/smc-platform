# Codex Nightly Cleanup Plan

**Branch:** `codex-nightly-cleanup`  
**Date:** 2025-01-XX  
**Status:** Planning Phase

## Executive Summary

This document outlines the comprehensive cleanup and reorganization plan for the CounterX repository. The goal is to standardize structure, remove duplicates, improve documentation, and enhance type safety without breaking any functionality.

## Phase 1: Archive Unused/Outdated Files

### Files to Archive (Move to `_archive/`)

#### Root Directory Markdown Files
- `AUDITORIA-PAGINAS.md` - Old audit document
- `CHANGELOG.md` - If outdated
- `counterx-migration-report.md` - Migration report (historical)
- `PROXIMOS-PASSOS-DOMINIO.md` - Old domain setup notes
- `README-DESENVOLVIMENTO.md` - Should be in docs/
- `RESUMO-CONFIGURACAO-DOMINIO.md` - Old domain config
- `TESTE-BLOG.md` - Test documentation
- `URLS-TESTE-BLOG.md` - Test URLs
- `VALIDACAO-POS-DEPLOY.md` - Post-deploy validation

#### Deprecated Library Files (After updating imports)
- `lib/design-tokens.ts` - Deprecated re-export
- `lib/fonts.ts` - Deprecated re-export
- `lib/site-config.ts` - Deprecated re-export
- `lib/utils.ts` - Deprecated re-export
- `lib/slugify.ts` - Deprecated re-export

#### Deprecated UI Components (After verifying no usage)
- `components/ui/Button.jsx` - Deprecated wrapper
- `components/ui/Skeleton.jsx` - Deprecated (but has more features - need to check)

## Phase 2: Consolidate Duplicate Files

### Library Consolidation

1. **Design Tokens**
   - ✅ Keep: `lib/config/design-tokens.ts`
   - ❌ Archive: `lib/design-tokens.ts` (after updating imports)

2. **Fonts**
   - ✅ Keep: `lib/config/fonts.ts`
   - ❌ Archive: `lib/fonts.ts` (after updating imports)

3. **Site Config**
   - ✅ Keep: `lib/config/site-config.ts`
   - ❌ Archive: `lib/site-config.ts` (after updating imports)

4. **Utils**
   - ✅ Keep: `lib/utils/utils.ts`
   - ❌ Archive: `lib/utils.ts` (after updating imports)
   - ✅ Keep: `lib/utils/slugify.ts`
   - ❌ Archive: `lib/slugify.ts` (after updating imports)

### UI Components Consolidation

1. **Button Component**
   - ✅ Keep: `components/ui/button.tsx` (shadcn)
   - ❌ Archive: `components/ui/Button.jsx` (deprecated wrapper)

2. **Skeleton Component**
   - ⚠️ Decision needed: `components/ui/Skeleton.jsx` has more features than `skeleton.tsx`
   - Option A: Enhance `skeleton.tsx` with features from `Skeleton.jsx`, then archive
   - Option B: Keep both if they serve different purposes

## Phase 3: Normalize File Naming

### Current Inconsistencies

#### Components
- Mix of `.jsx` and `.tsx` files
- Some use PascalCase (`Button.jsx`), some use kebab-case (`button.tsx`)

**Standard:**
- Use `.tsx` for TypeScript React components
- Use kebab-case for file names (shadcn convention)
- Convert remaining `.jsx` files to `.tsx` where appropriate

#### Library Files
- Mix of `.js` and `.ts` files
- Some in root `lib/`, some in `lib/config/`, some in `lib/utils/`

**Standard:**
- Use `.ts` for all library files
- Organize by domain: `lib/config/`, `lib/utils/`, `lib/services/`

## Phase 4: Fix Import Paths

### Current Issues

1. **Utils imports:**
   - Some use: `@/lib/utils` (deprecated but works)
   - Some use: `@/lib/utils/utils` (correct)
   - **Action:** Standardize to `@/lib/utils/utils` OR keep re-export and update all to `@/lib/utils`

2. **Config imports:**
   - Some use: `@/lib/site-config` (deprecated)
   - Some use: `@/lib/config/site-config` (correct)
   - **Action:** Update all to use `@/lib/config/site-config`

3. **Design tokens:**
   - Some use: `@/lib/design-tokens` (deprecated)
   - **Action:** Update all to use `@/lib/config/design-tokens`

4. **Fonts:**
   - **Action:** Update all to use `@/lib/config/fonts`

5. **Slugify:**
   - **Action:** Update all to use `@/lib/utils/slugify`

### Files Requiring Import Updates

**Utils:**
- `components/layout/AppShell.tsx`
- `components/Logo.tsx`
- `components/marketing/Hero.tsx`
- `components/blog/Breadcrumbs.tsx`
- `components/ui/input.tsx`
- `components/ui/separator.tsx`
- `components/ui/tabs.tsx`
- `components/ui/accordion.tsx`
- `components/ui/select.tsx`
- `components/ui/label.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/HelpTooltip.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`

**Site Config:**
- `app/(marketing)/_components/structured-data.tsx`
- `app/(marketing)/page.tsx`
- `app/(marketing)/feed/page.tsx`
- `pages/offers/[slug].jsx`
- `app/(marketing)/blog/page.tsx`
- `app/(marketing)/blog/[slug]/page.tsx`
- `app/sitemap.ts`

## Phase 5: Improve Documentation

### Add JSDoc/TSDoc Comments

**Priority Files:**
1. `lib/config/site-config.ts` - ✅ Already has comments
2. `lib/config/design-tokens.ts` - ✅ Already has comments
3. `lib/config/fonts.ts` - ✅ Already has comments
4. `lib/utils/utils.ts` - Add JSDoc
5. `lib/utils/slugify.ts` - Add JSDoc
6. `lib/prisma.ts` - Add JSDoc
7. `lib/email.ts` - Add JSDoc
8. `components/layout/AppShell.tsx` - Add JSDoc
9. `middleware.js` - Add JSDoc

### File Header Comments

Add descriptive headers to:
- All files in `lib/api/`
- All files in `lib/services/`
- Important components in `components/`

## Phase 6: Type Safety Improvements

### Convert JS to TS (Safe Conversions)

**Low Risk:**
- `lib/blogPosts.js` → `lib/blogPosts.ts`
- `lib/offers.js` → `lib/offers.ts`
- `lib/profiles.js` → `lib/profiles.ts`
- `lib/wizardSteps.js` → `lib/wizardSteps.js` (keep if used in JSX)

**Components:**
- `components/AssetCard.jsx` → `components/AssetCard.tsx`
- `components/EmptyState.jsx` → `components/EmptyState.tsx`
- `components/Layout.jsx` → `components/Layout.tsx`
- `components/MarketGrid.jsx` → `components/MarketGrid.tsx`
- `components/Navbar.jsx` → `components/Navbar.tsx`
- `components/OfferCard.jsx` → `components/OfferCard.tsx`
- `components/RegisterWizard.jsx` → `components/RegisterWizard.tsx`
- `components/feed/CompareModal.jsx` → `components/feed/CompareModal.tsx`

**Pages:**
- `pages/_app.js` → `pages/_app.tsx`
- `pages/dashboard/index.jsx` → `pages/dashboard/index.tsx`
- `pages/home.jsx` → `pages/home.tsx`
- `pages/login.jsx` → Keep (redirect page)
- `pages/register.jsx` → Keep (redirect page)
- `pages/profile.jsx` → `pages/profile.tsx`
- `pages/wizard.jsx` → `pages/wizard.tsx`
- `pages/vender-ativo.jsx` → Check if used
- `pages/offers/[slug].jsx` → `pages/offers/[slug].tsx`

**Hooks:**
- `hooks/useFavorites.js` → `hooks/useFavorites.ts`

## Phase 7: Organize Root Directory

### Move to `docs/`:
- `README-DESENVOLVIMENTO.md`
- Any other markdown files that are documentation

### Archive:
- Migration reports
- Old audit files
- Test documentation
- Old domain setup files

## Phase 8: Package.json Cleanup

- Update `name` from `"smc-platform"` to `"counterx"` or `"counterx-platform"`

## Execution Order

1. ✅ Create cleanup plan (this document)
2. Create `_archive/` folder
3. Update all imports to use correct paths
4. Archive deprecated files
5. Convert JS to TS (one file at a time, test after each)
6. Add documentation
7. Run lint + build after each phase
8. Create cleanup report

## Testing Strategy

After each phase:
1. Run `npm run lint`
2. Run `npm run build`
3. Fix any errors immediately
4. Document issues in cleanup report

## Risk Assessment

**Low Risk:**
- Archiving deprecated re-export files (after updating imports)
- Adding documentation
- Normalizing import paths

**Medium Risk:**
- Converting JS to TS (need to test thoroughly)
- Removing duplicate components (need to verify no usage)

**High Risk:**
- None identified (we're not touching auth, database, or core logic)

## Notes

- `pages/login.jsx` and `pages/register.jsx` are intentional redirect pages - keep them
- `pages/home.jsx` is actively used - keep it
- `pages/wizard.jsx` is actively used - keep it
- `components/ui/Skeleton.jsx` has more features - need to decide on approach


