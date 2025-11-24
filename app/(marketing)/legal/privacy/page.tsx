import { Footer } from '../../_components/footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-32">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>Your privacy is important to us. This policy explains how we collect and use your data...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
