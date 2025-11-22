import RegisterWizard from '@/components/RegisterWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vender Ativo | SaaS Market Cap',
    description: 'Cadastre seu SaaS, newsletter ou comunidade para venda no marketplace do SaaS Market Cap.',
};

export default function VenderAtivoPage() {
    return <RegisterWizard />;
}
