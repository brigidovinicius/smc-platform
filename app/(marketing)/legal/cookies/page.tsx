import { Footer } from '../../_components/footer';

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="container py-32">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie Policy</h1>
                <div className="prose prose-slate max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>We use cookies to improve your browsing experience...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
