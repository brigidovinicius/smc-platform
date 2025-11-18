import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';

const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Layout>
        <p>Carregando sessão...</p>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <p>Você precisa estar logado.</p>
        <button className="button primary" onClick={() => signIn('google')}>
          Entrar com Google
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="card">
        <h1>Perfil</h1>
        <p>Nome: {session.user?.name}</p>
        <p>Email: {session.user?.email}</p>
        {session.user?.image && (
          <img
            src={session.user.image}
            alt="Avatar"
            style={{ width: 80, height: 80, borderRadius: '50%', marginTop: 16 }}
          />
        )}

        <button className="button secondary" onClick={() => signOut()} style={{ marginTop: 20 }}>
          Sair
        </button>
      </section>
    </Layout>
  );
};

export default ProfilePage;

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
