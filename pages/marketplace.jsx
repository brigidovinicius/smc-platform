import Feed from './feed';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

const MarketplacePage = () => {
    return (
        <>
            <Head>
                <title>Marketplace | SaaS Market Cap</title>
                <meta name="description" content="Explore ativos digitais verificados, SaaS e newsletters à venda." />
            </Head>
            <Feed />
        </>
    );
};

export default MarketplacePage;

export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?callbackUrl=/marketplace',
                permanent: false
            }
        };
    }

    return { props: { session } };
};
