import { Badge } from './ui/badge';

const AssetCard = ({ asset }) => (
  <article 
    className="bg-card border border-border rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col gap-2 sm:gap-3"
    aria-label={`Asset: ${asset.name}`}
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2">{asset.name}</h3>
      <Badge 
        variant="default" 
        className="w-fit text-xs"
        aria-label={`Category: ${asset.category}`}
      >
        {asset.category}
      </Badge>
    </div>
    <p className="text-muted-foreground text-sm line-clamp-2" aria-label={`Description: ${asset.description}`}>
      {asset.description}
    </p>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm text-foreground" role="list">
      <div role="listitem">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" aria-label="Monthly recurring revenue">MRR</p>
        <strong className="text-foreground" aria-label={`MRR: ${asset.mrr}`}>
          {asset.mrr}
        </strong>
      </div>
      <div role="listitem">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" aria-label="Cancellation rate">Churn</p>
        <strong className="text-foreground" aria-label={`Churn: ${asset.churn}`}>
          {asset.churn}
        </strong>
      </div>
    </div>
  </article>
);

export default AssetCard;
