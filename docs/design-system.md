# CounterX Design System

## Overview

CounterX follows a clean, minimal fintech aesthetic with emphasis on precision, trust, and global SaaS product feel.

## Colors

### Primary
- **Cobalt Trust:** `#0044CC` - Used for logo, CTAs, highlights, key UI elements

### Neutrals
- **Midnight Black:** `#070708` - Text, strong contrast, dark themes
- **Soft Steel:** `#9EA3B0` - Secondary text, subtle borders, muted elements
- **Snow White:** `#FFFFFF` - Clean backgrounds

### Usage
- ❌ No gradients
- ✅ Solid color blocks only
- ✅ Reserve blue for highlights
- ✅ High contrast for readability

## Typography

**Primary Font:** Inter
- Regular (400) - Body text
- Medium (500) - H3, buttons
- Semibold (600) - H2, buttons
- Bold (700) - H1

## Logo

Use the `Logo` component from `@/components/Logo`:

```tsx
import { Logo } from '@/components/Logo';

// Primary (blue icon)
<Logo variant="primary" />

// Black (for light backgrounds)
<Logo variant="black" />

// White (for dark backgrounds)
<Logo variant="white" />

// Icon only
<Logo variant="icon-only" />
```

## Spacing

8px grid system:
- `--spacing-grid: 8px`
- Use multiples of 8px for consistent spacing

## Border Radius

- Default: `12px` (`--radius-default`)
- Round: `20px` (`--radius-round`)

## Components

### Buttons
- Solid Cobalt Trust (`#0044CC`) or black
- Inter Medium/Semibold
- No shadows, flat design

### Cards
- White/black backgrounds
- Thin Soft Steel borders (`#9EA3B0`)
- Clean spacing

### Inputs
- Subtle border (`#9EA3B0`)
- No shadows
- High contrast

## References

- Full guidelines: `/branding/identity.md`
- Colors: `/branding/colors.md`
- Typography: `/branding/typography.md`


