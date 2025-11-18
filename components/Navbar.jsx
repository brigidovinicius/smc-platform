import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link href="/" className="navbar-logo">
          SMC
        </Link>
        <nav className="navbar-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/wizard">Novo Ativo</Link>
          <Link href="/profile">Perfil</Link>
        </nav>
      </div>

      <div className="navbar-right">
        {status === 'loading' && <span className="navbar-text">Carregando...</span>}

        {status === 'unauthenticated' && (
          <button className="button primary" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            Entrar
          </button>
        )}

        {status === 'authenticated' && session?.user && (
          <div className="navbar-user">
            {session.user.image && (
              <img src={session.user.image} alt={session.user.name || 'Avatar'} className="navbar-avatar" />
            )}
            <div className="navbar-user-info">
              <span className="navbar-user-name">{session.user.name}</span>
              <span className="navbar-user-email">{session.user.email}</span>
            </div>
            <button className="button ghost" onClick={() => signOut({ callbackUrl: '/' })}>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
