import Feed from './feed';
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
