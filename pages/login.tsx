import { signIn } from 'next-auth/react';

const LoginPage = () => (
  <div style={{ padding: 24 }}>
    <h1>Entrar</h1>
    <button className="button primary" onClick={() => signIn('google')}>
      Entrar com Google
    </button>
  </div>
);

export default LoginPage;
