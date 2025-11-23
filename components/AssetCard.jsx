import { Badge } from './ui/badge';

const AssetCard = ({ asset }) => (
  <article className="bg-[#060c1a] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
      <Badge variant="default">{asset.category}</Badge>
    </div>
    <p className="text-slate-300 text-sm">{asset.description}</p>
    <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">MRR</p>
        <strong>{asset.mrr}</strong>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Churn</p>
        <strong>{asset.churn}</strong>
      </div>
    </div>
  </article>
);

export default AssetCard;
