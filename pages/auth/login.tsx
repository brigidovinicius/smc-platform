import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifiedMessage, setVerifiedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.verified === '1') {
      setVerifiedMessage('E-mail verificado com sucesso. Faça login para continuar.');
    }
  }, [router.query]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Entrar</h1>
      {verifiedMessage && <p style={{ color: '#10b981' }}>{verifiedMessage}</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </label>
        <button type="submit" className="button primary">
          Entrar
        </button>
      </form>
      <button className="button secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => signIn('google', { callbackUrl: '/' })}>
        Entrar com Google
      </button>
      <p style={{ marginTop: '1rem' }}>
        Não tem conta? <Link href="/auth/register">Cadastre-se</Link>
      </p>
    </div>
  );
};

export default LoginPage;
