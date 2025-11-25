import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'primary' | 'black' | 'white' | 'icon-only';
  className?: string;
  href?: string;
  width?: number;
  height?: number;
}

const logoMap = {
  primary: '/counterx-primary.svg',
  black: '/counterx-black.svg',
  white: '/counterx-white.svg',
  'icon-only': '/counterx-icon-only.svg',
};

export function Logo({ 
  variant = 'primary', 
  className,
  href = '/',
  width,
  height
}: LogoProps) {
  const logoPath = logoMap[variant];
  const defaultWidth = variant === 'icon-only' ? 48 : 200;
  const defaultHeight = variant === 'icon-only' ? 48 : 48;

  const logoElement = (
    <Image
      src={logoPath}
      alt="CounterX"
      width={width || defaultWidth}
      height={height || defaultHeight}
      className={cn('h-auto', className)}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}



