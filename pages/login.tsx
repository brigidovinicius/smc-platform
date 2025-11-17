import Layout from '@/components/Layout';

const LoginPage = () => (
  <Layout>
    <section className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1>Entrar no SMC</h1>
      <p>Use sua conta segura para acessar seus ativos, favoritos e pontos.</p>
      <button className="button primary" style={{ width: '100%', margin: '1rem 0' }}>
        Continuar com e-mail
      </button>
      <button className="button secondary" style={{ width: '100%' }}>
        Entrar com Google
      </button>
      <small style={{ display: 'block', marginTop: '1rem', color: '#475569' }}>
        Utilizamos OAuth do Google para reforçar segurança e suportar contas pseudoanônimas.
      </small>
    </section>
  </Layout>
);

export default LoginPage;
