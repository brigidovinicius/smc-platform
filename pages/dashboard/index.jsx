import { getSession, useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="stack-lg">
      <section className="card">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral dos seus ativos e do funil de negociação.</p>
        {session && (
          <p className="muted">
            Logado como <strong>{session.user?.name}</strong> ({session.user?.email})
          </p>
        )}
      </section>

      <section className="card">
        <h2 className="page-title" style={{ fontSize: 18 }}>
          Próximos passos
        </h2>
        <div className="stack">
          <p className="muted">
            • Criar o fluxo de cadastro de ativo (Wizard) <br />• Listar ativos já cadastrados com status e métricas <br />• Conectar o banco para salvar esses dados
          </p>
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/dashboard',
        permanent: false
      }
    };
  }

  return {
    props: { session }
  };
}
