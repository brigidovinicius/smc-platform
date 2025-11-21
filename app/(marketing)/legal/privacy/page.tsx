import { Footer } from '../../_components/footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-32">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Política de Privacidade</h1>
                <div className="prose prose-slate max-w-none">
                    <p>Última atualização: {new Date().toLocaleDateString()}</p>
                    <p>Sua privacidade é importante para nós. Esta política explica como coletamos e usamos seus dados...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
