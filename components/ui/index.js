/**
 * Barrel export for UI components
 * Simplifies imports: import { Button, Card, Badge } from '@/components/ui'
 * 
 * NOTE: shadcn components (button.tsx, card.tsx, badge.tsx) use named exports
 * Legacy components use default exports
 */

// shadcn/ui components (para uso direto quando necessário)
// Use: import Button from '@/components/ui/button'
// OU use os componentes legados: import Button from '@/components/ui/Button'
export { Avatar, AvatarImage, AvatarFallback } from './avatar';
export { Input } from './input';
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog';
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from './table';

// Legacy components (default exports)
export { default as StatBlock } from './StatBlock';
export { default as ProgressList } from './ProgressList';
export { default as Skeleton, SkeletonGroup } from './Skeleton';
export { default as Spinner } from './Spinner';

