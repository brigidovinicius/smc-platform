import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();

  const callbackUrl =
    typeof router.query.callbackUrl === 'string' && router.query.callbackUrl.length > 0
      ? router.query.callbackUrl
      : '/dashboard';

  return (
    <div className="card">
      <h1 className="page-title">Entrar</h1>
      <p className="page-subtitle">Use sua conta Google para acessar o painel do SaaS Market Cap.</p>

      <button className="button primary" onClick={() => signIn('google', { callbackUrl })}>
        Entrar com Google
      </button>

      <p className="muted" style={{ marginTop: 16 }}>
        Ao entrar, você será redirecionado para o dashboard, onde pode cadastrar e gerenciar ativos.
      </p>
    </div>
  );
};

export default LoginPage;
