import { getSession, useSession } from 'next-auth/react';

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <section className="card">
      <h1>Painel do usuário</h1>
      {session ? (
        <div style={{ marginTop: '1rem' }}>
          <p>Bem-vindo, {session.user?.name}!</p>
          <p>Email: {session.user?.email}</p>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user?.name ?? 'Foto de perfil'}
              style={{ marginTop: '1rem', width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
        </div>
      ) : (
        <p>Carregando dados do usuário...</p>
      )}
    </section>
  );
};

export default DashboardPage;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
};
