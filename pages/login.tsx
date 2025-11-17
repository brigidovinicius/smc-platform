import Layout from '@/components/Layout';
import { signIn } from 'next-auth/react';

const LoginPage = () => (
  <Layout>
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h1>Entrar</h1>
      <p>Use sua conta Google para acessar o SMC.</p>

      <button
        onClick={() => signIn('google')}
        style={{
          marginTop: 20,
          padding: '12px 20px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          background: '#4285F4',
          color: '#fff'
        }}
      >
        Entrar com Google
      </button>
    </div>
  </Layout>
);

export default LoginPage;
