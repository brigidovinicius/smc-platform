import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/login', label: 'Login' },
  { href: '/profile', label: 'Perfil' },
  { href: '/wizard', label: 'Cadastro' }
];

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #e2e8f0',
        background: '#ffffff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ fontWeight: 700 }}>SaaS Market Cap</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {status === 'loading' ? (
        <span>Carregando...</span>
      ) : session ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user?.name ?? 'Foto de perfil'}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600 }}>{session.user?.name}</span>
            <small style={{ color: '#475569' }}>{session.user?.email}</small>
            {session.user?.role && <span className="role-badge">{session.user.role}</span>}
          </div>
          <button className="button secondary" onClick={() => signOut({ callbackUrl: '/' })}>
            Sair
          </button>
        </div>
      ) : (
        <button className="button primary" onClick={() => signIn('google')}>
          Entrar
        </button>
      )}
    </nav>
  );
};

export default Navbar;
