import RegisterWizard from '@/components/RegisterWizard';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

const VenderAtivoPage = () => {
    return (
        <>
            <Head>
                <title>Vender Ativo | SaaS Market Cap</title>
                <meta name="description" content="Cadastre seu SaaS, newsletter ou comunidade para venda no marketplace do SaaS Market Cap." />
            </Head>
            <RegisterWizard />
        </>
    );
};

export default VenderAtivoPage;

export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?callbackUrl=/vender-ativo',
                permanent: false
            }
        };
    }

    return { props: { session } };
};
