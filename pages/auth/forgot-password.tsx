import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao enviar email de recuperação.');
      }
    } catch (err) {
      setError('Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card" style={{ maxWidth: 400, margin: '4rem auto' }}>
        <h1>Email enviado!</h1>
        <p>
          Se existe uma conta com o email <strong>{email}</strong>, você receberá instruções para redefinir sua
          senha.
        </p>
        <Link href="/auth/login" className="button primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Voltar para login
        </Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h1>Recuperar senha</h1>
      <p>Digite seu email para receber instruções de recuperação de senha.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="input"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginTop: '0.5rem' }}
        />

        {error && <p className="input-error">{error}</p>}

        <button type="submit" className="button primary" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
          {loading ? 'Enviando...' : 'Enviar email de recuperação'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link href="/auth/login" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Voltar para login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
