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
        <nav className="navbar-links" role="navigation" aria-label="Main navigation">
          <Link href="/feed" aria-label="View available listings">Listings</Link>
          <Link href="/dashboard" aria-label="Access dashboard">Dashboard</Link>
          <Link href="/wizard" aria-label="List new asset">New Asset</Link>
          <Link href="/profile" aria-label="Access profile">Profile</Link>
        </nav>
      </div>

      <div className="navbar-right">
        {status === 'loading' && (
          <span className="navbar-text" aria-live="polite" aria-label="Loading user information">
            Loading...
          </span>
        )}

        {status === 'unauthenticated' && (
          <button 
            className="button primary" 
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            aria-label="Sign in with Google"
          >
            Sign in
          </button>
        )}

        {status === 'authenticated' && session?.user && (
          <div className="navbar-user" role="group" aria-label="User information">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={`Avatar of ${session.user.name || 'user'}`}
                className="navbar-avatar"
                width={40}
                height={40}
                style={{ borderRadius: '9999px', objectFit: 'cover' }}
                priority
                aria-hidden="false"
              />
            )}
            <div className="navbar-user-info" aria-label={`User: ${session.user.name}, Email: ${session.user.email}`}>
              <span className="navbar-user-name">{session.user.name}</span>
              <span className="navbar-user-email">{session.user.email}</span>
            </div>
            <button 
              className="button ghost" 
              onClick={() => signOut({ callbackUrl: '/' })}
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
