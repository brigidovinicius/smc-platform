import RegisterWizard from '@/components/RegisterWizard';
import { getSession } from 'next-auth/react';

const WizardPage = () => <RegisterWizard />;

export default WizardPage;

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
