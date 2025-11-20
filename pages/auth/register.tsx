import { useState } from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Erro ao criar conta');
      return;
    }

    setSuccess('Conta criada. Verifique seu e-mail para ativar a conta.');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Criar conta</h1>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {success && <p style={{ color: '#10b981' }}>{success}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Nome (opcional)
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
        </label>
        <button type="submit" className="button primary">
          Criar conta
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Já tem conta? <Link href="/auth/login">Entrar</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
