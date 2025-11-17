import Layout from '@/components/Layout';

const ProfilePage = () => (
  <Layout>
    <section className="card">
      <h1>Perfil do Criador</h1>
      <p>Nome: Exemplo Founder</p>
      <p>Nível atual: PRATA · Badge Explorador · 1.250 pontos</p>
      <p>Seguidores: 248 · Favoritos: 12</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Ofertas públicas</h2>
        <ul>
          <li>Template SaaS Billing · Destaque OURO · R$ 80k</li>
          <li>API Anti-churn · Destaque BRONZE · R$ 50k</li>
        </ul>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>Configurando venda anônima</h2>
        <p>Status: Habilitado (taxa adicional aplicada no fechamento).</p>
      </div>
    </section>
  </Layout>
);

export default ProfilePage;
