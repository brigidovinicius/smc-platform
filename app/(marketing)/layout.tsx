import '@/styles/globals.css';
import type { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#04060f] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
