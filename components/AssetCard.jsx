import { Badge } from './ui/badge';

const AssetCard = ({ asset }) => (
  <article className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2">{asset.name}</h3>
      <Badge variant="default" className="w-fit text-xs">{asset.category}</Badge>
    </div>
    <p className="text-muted-foreground text-sm line-clamp-2">{asset.description}</p>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm text-foreground">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">MRR</p>
        <strong className="text-foreground">{asset.mrr}</strong>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Churn</p>
        <strong className="text-foreground">{asset.churn}</strong>
      </div>
    </div>
  </article>
);

export default AssetCard;
