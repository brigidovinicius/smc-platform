import Layout from '@/components/Layout';
import RegisterWizard from '@/components/RegisterWizard';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const WizardPage = () => (
  <Layout>
    <RegisterWizard />
  </Layout>
);

export default WizardPage;

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
