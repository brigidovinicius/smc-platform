import { getSession } from 'next-auth/react';

const HomeAliasPage = () => (
  <section className="card">
    <p>Bem-vindo ao SMC. Este é um alias em /home para a mesma experiência inicial da Home principal.</p>
  </section>
);

export default HomeAliasPage;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    };
  }

  return { props: { session } };
};
