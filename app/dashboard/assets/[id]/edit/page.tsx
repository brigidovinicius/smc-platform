import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AssetWizard from '@/components/assets/AssetWizard';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Edit Asset | Dashboard | CounterX`,
    description: 'Edit your asset listing',
  };
}

export default function EditAssetPage({ params }: PageProps) {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Asset Listing</h1>
        <p className="text-slate-400">
          Update your asset information below.
        </p>
      </div>
      
      <AssetWizard assetId={params.id} />
    </div>
  );
}


