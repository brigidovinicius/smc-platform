import { Footer } from '@/app/(marketing)/_components/footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-32">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Use</h1>
                <div className="prose prose-slate max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>Welcome to CounterX. By using our platform, you agree to these terms...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
