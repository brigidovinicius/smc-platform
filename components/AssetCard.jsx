import { Badge } from './ui/badge';

const AssetCard = ({ asset }) => (
  <article className="bg-[#060c1a] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-2">{asset.name}</h3>
      <Badge variant="default" className="w-fit text-xs">{asset.category}</Badge>
    </div>
    <p className="text-slate-300 text-sm line-clamp-2">{asset.description}</p>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm text-slate-200">
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
