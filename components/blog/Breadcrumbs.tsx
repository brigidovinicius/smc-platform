import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm', className)}>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label="Home"
      >
        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 sm:space-x-2">
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

