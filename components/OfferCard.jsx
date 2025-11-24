import { Badge } from './ui/badge';

const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

const OfferCard = ({ offer }) => (
  <article 
    className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-3"
    aria-label={`Offer: ${offer.title}`}
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2">{offer.title}</h3>
      <Badge 
        variant={offer.status === 'ACTIVE' ? 'default' : 'secondary'} 
        className="w-fit text-xs"
        aria-label={`Status: ${offer.status}`}
      >
        {offer.status}
      </Badge>
    </div>
    <p className="text-muted-foreground text-sm line-clamp-2" aria-label={`Description: ${offer.summary}`}>
      {offer.summary}
    </p>
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 text-sm text-foreground" role="list">
      <div role="listitem">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" aria-label="Ticket value">Ticket</p>
        <strong className="text-foreground" aria-label={`Value: ${formatCurrency(offer.price ?? 0)}`}>
          {formatCurrency(offer.price ?? 0)}
        </strong>
      </div>
      <div role="listitem">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground" aria-label="Offer category">Category</p>
        <span className="text-foreground" aria-label={`Category: ${offer.classification}`}>
          {offer.classification}
        </span>
      </div>
    </div>
  </article>
);

export default OfferCard;
