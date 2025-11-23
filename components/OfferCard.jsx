import { Badge } from './ui/badge';

const formatCurrency = (value, currency = 'BRL') =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);

const OfferCard = ({ offer }) => (
  <article className="bg-[#060c1a] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-2">{offer.title}</h3>
      <Badge variant={offer.status === 'ACTIVE' ? 'default' : 'secondary'} className="w-fit text-xs">
        {offer.status}
      </Badge>
    </div>
    <p className="text-slate-300 text-sm line-clamp-2">{offer.summary}</p>
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 text-sm text-slate-200">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Ticket</p>
        <strong>{formatCurrency(offer.price ?? 0)}</strong>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Categoria</p>
        <span>{offer.classification}</span>
      </div>
    </div>
  </article>
);

export default OfferCard;
