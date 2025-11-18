import Link from 'next/link';
import { ReactNode } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/login', label: 'Login' },
  { href: '/profile', label: 'Perfil' },
  { href: '/wizard', label: 'Cadastro' }
];

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { data: session, status } = useSession();

  return (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'loading' && <span>Carregando...</span>}
          {status !== 'loading' && session && (
            <>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  style={{ width: 36, height: 36, borderRadius: '50%' }}
                />
              )}
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600 }}>{session.user?.name}</div>
                <div style={{ fontSize: 12 }}>{session.user?.email}</div>
              </div>
              <button className="button secondary" onClick={() => signOut()}>
                Sair
              </button>
            </>
          )}
          {status !== 'loading' && !session && (
            <button className="button primary" onClick={() => signIn('google')}>
              Entrar
            </button>
          )}
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

export default Layout;
