/**
 * Barrel export for UI components
 * Simplifies imports: import { Button, Card, Badge } from '@/components/ui'
 * 
 * NOTE: shadcn components (button.tsx, card.tsx, badge.tsx) use named exports
 * Legacy components use default exports
 */

// Legacy components (default exports)
export { default as StatBlock } from './StatBlock';
export { default as ProgressList } from './ProgressList';
export { default as Skeleton, SkeletonGroup } from './Skeleton';
export { default as Spinner } from './Spinner';

