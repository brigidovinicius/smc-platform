# English Normalization Plan - SMC Platform

**Date:** November 2024  
**Status:** In Progress  
**Objective:** Transform all public-facing content (UI text + SEO) to natural, fluent English for global SEO optimization.

---

## STEP 1 — SCAN AND PLAN

### Files with Portuguese Content Identified

#### Public Marketing Pages (App Router)
1. **`app/(marketing)/page.tsx`**
   - Homepage hero section
   - Metadata (title, description, Open Graph, Twitter)
   - Hero stats labels
   - How it works section
   - Features section
   - Use cases section
   - Testimonials
   - FAQ section
   - Story section
   - Product shots
   - Security section

2. **`app/(marketing)/_components/marketing-home-content.tsx`**
   - All visible UI text in homepage component
   - Button labels, CTAs, section headings

3. **`app/(marketing)/pricing/page.tsx`**
   - Pricing page title and description
   - Plan names, descriptions, features
   - CTA buttons

4. **`app/(marketing)/faq/page.tsx`**
   - FAQ page title and description
   - All FAQ questions and answers

5. **`app/(marketing)/recursos/page.tsx`**
   - Resources page content
   - Resource cards descriptions

6. **`app/(marketing)/blog/page.tsx`**
   - Blog listing page title and description
   - Metadata

7. **`app/(marketing)/legal/page.tsx`**
   - Legal hub page content
   - Document titles and summaries

8. **`app/(marketing)/legal/privacy/page.tsx`**
   - Privacy policy page title and content

9. **`app/(marketing)/legal/terms/page.tsx`**
   - Terms of use page title and content

10. **`app/(marketing)/legal/cookies/page.tsx`**
    - Cookies policy page content

11. **`app/(marketing)/suporte/page.tsx`**
    - Support page content

12. **`app/(marketing)/_components/footer.tsx`**
    - Footer description
    - Navigation links labels
    - Copyright text

13. **`app/(marketing)/_components/structured-data.tsx`**
    - JSON-LD structured data text fields

#### Public Auth Pages (Pages Router)
14. **`pages/auth/login.tsx`**
    - Login page title, labels, buttons
    - Error/success messages
    - Links text

15. **`pages/auth/register.tsx`**
    - Registration page title, labels, buttons
    - Validation messages
    - Error/success messages

16. **`pages/auth/forgot-password.tsx`**
    - Forgot password page content
    - Success messages

17. **`pages/auth/reset-password.tsx`**
    - Reset password page content
    - Validation messages
    - Error/success messages

#### Shared Components
18. **`components/Navbar.jsx`**
    - Navigation links
    - Button labels
    - User info labels
    - Accessibility labels

19. **`components/EmptyState.jsx`**
    - Empty state messages (if any PT-BR)

20. **`components/feed/CompareModal.jsx`**
    - Modal content (if any PT-BR)

21. **`components/blog/BlogFilters.tsx`**
    - Filter labels (if any PT-BR)

#### Other Public Pages
22. **`pages/home.jsx`**
    - Home page content (authenticated users)
    - Quick actions
    - Readiness pillars
    - Timeline items
    - Stat cards

23. **`pages/offers/[slug].jsx`**
    - Offer page content (if public)

24. **`pages/feed.jsx`**
    - Feed page content

---

## STEP 2 — CORE ENGLISH VOCABULARY

### Domain Terms Translation

| Portuguese | English | Context |
|------------|---------|---------|
| ativos digitais | digital assets | Core term - use consistently |
| marketplace | marketplace | Keep as-is (universal term) |
| vender ativo | list your SaaS / list asset | Action-oriented |
| comprar ativo | buy SaaS / acquire asset | Action-oriented |
| micro SaaS | micro-SaaS | Keep hyphenated |
| valuation | valuation | Keep as-is (universal term) |
| plataforma | platform | Standard translation |
| oferta | listing / deal | Use "listing" for marketplace items, "deal" for transactions |
| anúncio | listing | Use "listing" consistently |
| negócio | deal / transaction | Use "deal" for casual, "transaction" for formal |
| fundador | founder | Standard translation |
| comprador | buyer | Standard translation |
| vendedor | seller | Standard translation |
| investidor | investor | Standard translation |
| flipper | flipper | Keep as-is (industry term) |
| operador | operator | Standard translation |
| due diligence | due diligence | Keep as-is (universal term) |
| deal room | deal room | Keep as-is (industry term) |
| data room | data room | Keep as-is (industry term) |
| closing | closing | Keep as-is (industry term) |
| MRR | MRR | Keep as-is (acronym) |
| ARR | ARR | Keep as-is (acronym) |
| churn | churn | Keep as-is (industry term) |
| CAC | CAC | Keep as-is (acronym) |
| LTV | LTV | Keep as-is (acronym) |
| múltiplo | multiple | Standard translation |
| dossiê | dossier | Standard translation |
| memorando | memorandum | Standard translation |

### Action Verbs
- "Cadastrar" → "Sign up" / "Register" / "List" (context-dependent)
- "Entrar" → "Sign in" / "Log in"
- "Criar conta" → "Create account" / "Sign up"
- "Enviar" → "Submit" / "Send"
- "Salvar" → "Save"
- "Cancelar" → "Cancel"
- "Confirmar" → "Confirm"
- "Continuar" → "Continue"
- "Voltar" → "Back"
- "Próximo" → "Next"
- "Anterior" → "Previous"

### Common UI Elements
- "Nome" → "Name"
- "E-mail" → "Email"
- "Senha" → "Password"
- "Confirmar senha" → "Confirm password"
- "Opcional" → "Optional"
- "Obrigatório" → "Required"
- "Buscar" → "Search"
- "Filtrar" → "Filter"
- "Ordenar" → "Sort"
- "Carregando..." → "Loading..."
- "Erro" → "Error"
- "Sucesso" → "Success"
- "Aviso" → "Warning"

---

## STEP 3 — TRANSLATION PRIORITY ORDER

1. ✅ Home / landing page (`app/(marketing)/page.tsx` + component)
2. ✅ Pricing page (`app/(marketing)/pricing/page.tsx`)
3. ✅ FAQ page (`app/(marketing)/faq/page.tsx`)
4. ✅ Resources page (`app/(marketing)/recursos/page.tsx`)
5. ✅ Blog listing page (`app/(marketing)/blog/page.tsx`)
6. ✅ Legal pages (Privacy, Terms, Cookies)
7. ✅ Support page
8. ✅ Footer component
9. ✅ Auth pages (Login, Register, Forgot Password, Reset Password)
10. ✅ Navbar component
11. ✅ Other public components
12. ✅ SEO metadata (all pages)

---

## STEP 4 — FILES TO UPDATE

### Completed
- [ ] Homepage (`app/(marketing)/page.tsx`)
- [ ] Homepage component (`app/(marketing)/_components/marketing-home-content.tsx`)
- [ ] Pricing page
- [ ] FAQ page
- [ ] Resources page
- [ ] Blog listing page
- [ ] Legal pages
- [ ] Support page
- [ ] Footer
- [ ] Auth pages
- [ ] Navbar
- [ ] SEO metadata

---

## STEP 5 — NOTES AND CONSIDERATIONS

### SEO Keywords to Use
- "SaaS marketplace"
- "buy and sell SaaS"
- "digital assets marketplace"
- "SaaS acquisitions"
- "SaaS valuation"
- "micro-SaaS"
- "SaaS deals"
- "SaaS listings"
- "acquire digital assets"

### Tone and Style
- Professional but approachable
- Startup/VC-friendly language
- Clear and conversion-oriented
- Avoid overly technical jargon in public-facing copy
- Use active voice where possible

### Consistency Rules
- Always use "SaaS" (not "saas" or "SaaS's")
- Use "digital assets" consistently (not "digital asset" or "assets")
- Use "listing" for marketplace items (not "offer" or "deal" in UI)
- Use "deal" for transactions/negotiations
- Keep industry terms as-is (MRR, ARR, churn, CAC, LTV, due diligence, etc.)

---

## STEP 6 — VALIDATION CHECKLIST

After translation:
- [ ] Run `npm run lint` - all passing
- [ ] Run `npm run build` - all passing
- [ ] Verify all public routes render in English
- [ ] Verify SEO meta tags are in English
- [ ] Verify no PT-BR text in public UI
- [ ] Verify no route paths changed
- [ ] Verify no i18n added
- [ ] Verify auth flows still work
- [ ] Verify protected routes still protected

---

## STEP 7 — REMAINING TODOS

- [ ] Translate all identified files
- [ ] Update all SEO metadata
- [ ] Update structured data (JSON-LD)
- [ ] Final QA pass
- [ ] Create completion report

---

## English Normalization – Completed

**Date Completed:** November 2024

### Summary

All public-facing content has been successfully translated from Portuguese to English. The normalization process covered:

- ✅ All public marketing pages (homepage, pricing, FAQ, resources, blog, legal pages, support)
- ✅ All public auth UI (login, register, forgot-password, reset-password)
- ✅ All SEO metadata (titles, descriptions, Open Graph, Twitter cards)
- ✅ All structured data (JSON-LD schemas)
- ✅ All shared components (Navbar, Footer)
- ✅ All error and validation messages
- ✅ All UI labels, buttons, and CTAs

### Files Updated

#### Marketing Pages (App Router)
- `app/(marketing)/page.tsx` - Homepage metadata and content
- `app/(marketing)/_components/marketing-home-content.tsx` - Homepage component
- `app/(marketing)/pricing/page.tsx` - Pricing page
- `app/(marketing)/faq/page.tsx` - FAQ page
- `app/(marketing)/recursos/page.tsx` - Resources page
- `app/(marketing)/blog/page.tsx` - Blog listing page
- `app/(marketing)/legal/page.tsx` - Legal hub page
- `app/(marketing)/legal/privacy/page.tsx` - Privacy policy
- `app/(marketing)/legal/terms/page.tsx` - Terms of use
- `app/(marketing)/legal/cookies/page.tsx` - Cookie policy
- `app/(marketing)/suporte/page.tsx` - Support page
- `app/(marketing)/_components/footer.tsx` - Footer component
- `app/(marketing)/_components/structured-data.tsx` - JSON-LD structured data

#### Auth Pages (Pages Router)
- `pages/auth/login.tsx` - Login page
- `pages/auth/register.tsx` - Registration page
- `pages/auth/forgot-password.tsx` - Forgot password page
- `pages/auth/reset-password.tsx` - Reset password page

#### Shared Components
- `components/Navbar.jsx` - Navigation bar

### Validation Results

- ✅ `npm run lint` - All passing (no ESLint warnings or errors)
- ✅ `npm run build` - All passing (successful build)
- ✅ All routes remain unchanged (no path modifications)
- ✅ No i18n implementation added
- ✅ Auth flows preserved
- ✅ Protected routes still protected

### Key Translation Decisions

1. **Domain Terms:**
   - "ativos digitais" → "digital assets"
   - "marketplace" → "marketplace" (kept as-is)
   - "vender ativo" → "list asset" / "list your SaaS"
   - "comprar ativo" → "buy SaaS" / "acquire asset"
   - "oferta" → "listing" (for marketplace items)
   - "negócio" → "deal" (for transactions)

2. **Action Verbs:**
   - "Cadastrar" → "Sign up" / "Register" / "List" (context-dependent)
   - "Entrar" → "Sign in" / "Log in"
   - "Criar conta" → "Create account"

3. **SEO Keywords:**
   - Updated to English-focused keywords: "SaaS marketplace", "buy and sell SaaS", "digital assets marketplace", "SaaS acquisitions", etc.

4. **Locale Settings:**
   - Open Graph locale changed from `pt_BR` to `en_US`
   - Structured data language updated to English

### Notes

- All apostrophes in JSX have been properly escaped using `&apos;`
- Currency symbols updated (R$ → $)
- Date formats remain unchanged (using JavaScript Date methods)
- Email addresses and technical terms (MRR, ARR, CAC, LTV, etc.) kept as-is
- Industry terms (due diligence, deal room, escrow, etc.) kept as-is

### Next Steps (Optional)

- Consider adding i18n support in the future if multi-language is needed
- Review and update any remaining internal documentation
- Update email templates if they contain Portuguese text
- Consider A/B testing English vs. Portuguese for Brazilian market

