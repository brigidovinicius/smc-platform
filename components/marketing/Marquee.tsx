'use client';

import { motion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  itemClassName?: string;
}

export function Marquee({
  items,
  speed = 30,
  direction = 'left',
  className = '',
  itemClassName = ''
}: MarqueeProps) {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />
      
      <motion.div
        className="flex w-max gap-12"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {duplicatedItems.map((item, i) => (
          <span
            key={i}
            className={`text-lg font-semibold text-white/40 whitespace-nowrap ${itemClassName}`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
