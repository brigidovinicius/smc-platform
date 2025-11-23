import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="navbar" role="banner">
      <div className="navbar-left">
        <Link href="/" className="navbar-logo" aria-label="Ir para página inicial">
          SMC
        </Link>
        <nav className="navbar-links" role="navigation" aria-label="Navegação principal">
          <Link href="/feed" aria-label="Ver ofertas disponíveis">Ofertas</Link>
          <Link href="/dashboard" aria-label="Acessar dashboard">Dashboard</Link>
          <Link href="/wizard" aria-label="Cadastrar novo ativo">Novo Ativo</Link>
          <Link href="/profile" aria-label="Acessar perfil">Perfil</Link>
        </nav>
      </div>

      <div className="navbar-right">
        {status === 'loading' && (
          <span className="navbar-text" aria-live="polite" aria-label="Carregando informações do usuário">
            Carregando...
          </span>
        )}

        {status === 'unauthenticated' && (
          <button 
            className="button primary" 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            aria-label="Entrar com Google"
          >
            Entrar
          </button>
        )}

        {status === 'authenticated' && session?.user && (
          <div className="navbar-user" role="group" aria-label="Informações do usuário">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={`Avatar de ${session.user.name || 'usuário'}`}
                className="navbar-avatar"
                width={40}
                height={40}
                style={{ borderRadius: '9999px', objectFit: 'cover' }}
                priority
                aria-hidden="false"
              />
            )}
            <div className="navbar-user-info" aria-label={`Usuário: ${session.user.name}, Email: ${session.user.email}`}>
              <span className="navbar-user-name">{session.user.name}</span>
              <span className="navbar-user-email">{session.user.email}</span>
            </div>
            <button 
              className="button ghost" 
              onClick={() => signOut({ callbackUrl: '/' })}
              aria-label="Sair da conta"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
