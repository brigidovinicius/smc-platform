import { Footer } from '../_components/footer';

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-32">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Perguntas Frequentes</h1>
                <p className="text-xl text-slate-600 mb-12">Tire suas dúvidas sobre o SaaS Market Cap.</p>

                <div className="space-y-6 max-w-3xl">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Como funciona a avaliação?</h3>
                        <p className="text-slate-600">Nossa metodologia utiliza múltiplos de mercado baseados em receita, churn e crescimento.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">É seguro conectar minhas métricas?</h3>
                        <p className="text-slate-600">Sim, utilizamos criptografia de ponta a ponta e acesso apenas de leitura às suas contas Stripe/Paddle.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
