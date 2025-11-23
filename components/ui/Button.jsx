/**
 * @deprecated Este componente está deprecated. Use `@/components/ui/button` (shadcn/ui) ao invés.
 * 
 * Este arquivo existe apenas para compatibilidade com código legado.
 * Novos componentes devem usar: import { Button } from '@/components/ui/button'
 * 
 * Para migrar:
 * - Substitua imports de './ui/Button' por '@/components/ui/button'
 * - Use as variants do shadcn: default, destructive, outline, secondary, ghost, link
 * - Use os sizes: default, sm, lg, icon
 */

// Re-export shadcn Button para compatibilidade
export { Button as default, Button } from './button';
