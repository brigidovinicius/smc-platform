'use client';

import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface HelpTooltipProps {
  content: string;
  className?: string;
}

export function HelpTooltip({ content, className }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-center rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
        aria-label="Ajuda"
        aria-expanded={isOpen}
      >
        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
      </button>
      
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 w-72 p-4 mt-2 bg-popover border border-border rounded-lg shadow-xl left-0 top-full animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-popover-foreground leading-relaxed flex-1">{content}</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5"
              aria-label="Fechar ajuda"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="absolute -top-1.5 left-5 w-3 h-3 bg-popover border-l border-t border-border rotate-45"></div>
        </div>
      )}
    </div>
  );
}
