import { formatCurrency } from '@/lib/utils/formatting';
import Badge from './ui/Badge';

const OfferCard = ({ offer }) => (
  <article className="bg-[#060c1a] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">{offer.title}</h3>
      <Badge variant={offer.status === 'ACTIVE' ? 'success' : 'warning'}>{offer.status}</Badge>
    </div>
    <p className="text-slate-300 text-sm">{offer.summary}</p>
    <div className="flex flex-wrap gap-4 text-sm text-slate-200">
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
