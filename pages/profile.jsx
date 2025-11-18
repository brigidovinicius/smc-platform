import { getSession, signIn, signOut, useSession } from 'next-auth/react';

const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Carregando sessão...</p>;
  }

  if (!session) {
    return (
      <div className="card">
        <p>Você precisa estar logado.</p>
        <button className="button primary" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <section className="card">
      <h1>Perfil</h1>
      <p>Nome: {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
      {session.user?.role && <p>Função: {session.user.role}</p>}
      {session.user?.id && <p>ID do perfil: {session.user.id}</p>}
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
  );
};

export default ProfilePage;

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

  return { props: { session } };
};
