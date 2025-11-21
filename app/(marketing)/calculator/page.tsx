import { Footer } from '../_components/footer';

export default function CalculatorPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-32">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Calculadora de Valuation</h1>
                <p className="text-xl text-slate-600">Descubra quanto vale o seu SaaS em poucos minutos.</p>
                <div className="mt-8 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 italic">Ferramenta em desenvolvimento...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
