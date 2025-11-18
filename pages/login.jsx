import { getProviders, signIn } from 'next-auth/react';

const LoginPage = ({ providers }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      <h1>Entrar no SaaS Market Cap</h1>
      {Object.values(providers ?? {}).map((provider) => (
        <div key={provider.name}>
          <button className="button primary" onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}>
            Entrar com {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers }
  };
};

export default LoginPage;
