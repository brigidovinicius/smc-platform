import { Footer } from '../../_components/footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-32">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Termos de Uso</h1>
                <div className="prose prose-slate max-w-none">
                    <p>Última atualização: {new Date().toLocaleDateString()}</p>
                    <p>Bem-vindo ao SaaS Market Cap. Ao utilizar nossa plataforma, você concorda com estes termos...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
