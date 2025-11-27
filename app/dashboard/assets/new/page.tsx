import { Metadata } from 'next';
import AssetWizard from '@/components/assets/AssetWizard';

export const metadata: Metadata = {
  title: 'Create New Asset | Dashboard | CounterX',
  description: 'Create a new asset listing',
};

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function NewAssetPage() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Asset Listing</h1>
        <p className="text-slate-400">
          Follow the steps below to list your digital asset for sale.
        </p>
      </div>
      
      <AssetWizard />
    </div>
  );
}


