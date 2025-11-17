import Link from 'next/link';
import { ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/login', label: 'Login' },
  { href: '/profile', label: 'Perfil' },
  { href: '/wizard', label: 'Cadastro' }
];

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="app-shell">
    <header className="app-header">
      <div className="brand">SMC</div>
      <nav>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="nav-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
    <main className="app-main">{children}</main>
  </div>
);

export default Layout;
