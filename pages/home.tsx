import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const HomeAliasPage = () => (
  <Layout>
    <section className="card">
      <p>Bem-vindo ao SMC. Este é um alias em /home para a mesma experiência inicial da Home principal.</p>
    </section>
  </Layout>
);

export default HomeAliasPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return { props: { session } };
};
