# CounterX — Visual Identity Guidelines (v1.0)

Document prepared for implementation inside the Cursor workspace.

⸻

## 1. Brand Essence

CounterX is a global digital trading hub.

The identity must reflect:

- precision
- trust
- modern fintech aesthetics
- clean geometry
- minimalism
- global SaaS product feel

The visual language avoids noise, shadows, gradients, and unnecessary decoration.

⸻

## 2. Official Color Palette (Neo-Finance)

### Primary Color — Cobalt Trust

- **HEX:** #0044CC
- **RGB:** 0, 68, 204
- Background-safe, UI-friendly, high contrast on white or black.
- Main accent color used for logo, CTAs, highlights, and key UI elements.

### Core Neutrals

**Midnight Black**
- **HEX:** #070708
- **RGB:** 7, 7, 8
- Use for text, strong contrast, dark themes, hero sections.

**Soft Steel**
- **HEX:** #9EA3B0
- **RGB:** 158, 163, 176
- Use for secondary text, subtle UI borders, muted elements.

**Snow White**
- **HEX:** #FFFFFF
- **RGB:** 255, 255, 255
- Clean background, maximum readability.

### Color Usage Rules

- No gradients.
- Bright blue is only applied in solid blocks.
- Avoid overusing blue; reserve it for highlights.
- Light mode: lots of white space.
- Dark mode: deep black + electric blue highlights.

⸻

## 3. Logo Guidelines

### Official Logo Version (Chosen by Founder)

- **Icon:** Rounded square container
- **Inside:** minimalist geometric "X"
- **Stroke-weight:** consistent with UI line weight
- **No shadows, no glow, no gradients**
- **Primary color:** Cobalt Trust (#0044CC)
- **Monochrome variants:**
  - All black (#070708)
  - All white (#FFFFFF) for dark backgrounds

### Spacing

- Minimum safe margin: 1× width of the X's stroke.
- Never place the icon too close to other UI blocks.
- Logo must breathe.

### Forbidden alterations

- No rotation
- No outline changes
- No drop shadows
- No thin versions
- No playful, rounded X variations
- No stretching or distortion

⸻

## 4. Typography

Use only clean, global, highly legible sans-serif fonts.

### Primary Font — Inter

- **Weights used:** Regular, Medium, Semibold, Bold
- **Default for UI, docs, site, product, dashboards**
- Open-source and optimized for digital interfaces

### Premium Alternative (if upgrading)

- Satoshi
- GT America
- Suisse Int'l

(Não obrigatório — apenas para quando quiser elevar o branding.)

### Hierarchy Standards

- **H1:** Inter Bold
- **H2:** Inter Semibold
- **H3:** Inter Medium
- **Body:** Inter Regular
- **Buttons:** Inter Medium/Semibold

### Letter-Spacing

- **Headings:** -1% to 0
- **Body text:** default
- **Buttons:** +1%

⸻

## 5. Iconography

- Flat, monoline, geometric
- Stroke-width matches logo stroke scale
- No gradients
- No shadows
- Corners: slightly rounded (consistent with logo container)

⸻

## 6. UI Style

### General Rules

- Flat design
- Clear spacing (8px or 10px grid system)
- High contrast
- Minimal color usage
- Strong focus on readability
- Use negative space strategically
- Aim for a Stripe + Linear + Figma + Revolut vibe

### Components

- **Cards:** white/black backgrounds, thin Soft Steel borders
- **Buttons:** solid Cobalt Trust or black
- **Inputs:** subtle border (#9EA3B0), no shadows
- **Tables:** clean lines, lots of spacing
- **Charts:** blue highlights, dark or white neutral base

⸻

## 7. Brand Tone

- Direct
- Global
- Clean
- High-trust
- Technical, but accessible
- Zero informal excess
- No emojis in communication oficial (exceto documentação interna)

⸻

## 8. Application Examples (Guidelines for Cursor)

Use this section to orient refactors, CSS variables, and component styling.

### CSS Variables

```css
:root {
  --color-primary: #0044CC;
  --color-black: #070708;
  --color-gray: #9EA3B0;
  --color-white: #FFFFFF;
  --font-primary: 'Inter', sans-serif;
  --radius-default: 12px;
  --radius-round: 20px;
  --spacing-grid: 8px;
}
```

### Brand Structure in Repo

Recommended folder structure for Cursor:

```
/branding
   identity.md
   logo/
      counterx-primary.svg
      counterx-black.svg
      counterx-white.svg
      counterx-icon-only.svg
   colors.md
   typography.md
/docs
   design-system.md
   ui-guidelines.md
```

