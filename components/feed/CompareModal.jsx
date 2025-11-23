import { X, Download, Trash2, GitCompare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function CompareModal({ offers, isOpen, onClose, onRemove, onExport }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0b1230] border border-white/10 rounded-3xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Comparar Ofertas</h2>
              <p className="text-slate-400 text-sm mt-1">
                {offers.length} {offers.length === 1 ? 'oferta selecionada' : 'ofertas selecionadas'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {offers.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onExport}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              )}
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {offers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhuma oferta selecionada para comparar.</p>
              <p className="text-slate-500 text-sm mt-2">Selecione ofertas usando o botão de comparação nos cards.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-slate-400 text-sm font-semibold">Oferta</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-semibold">Investimento</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-semibold">MRR</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-semibold">Múltiplo</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-semibold">Nicho</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div>
                          <h3 className="text-white font-semibold mb-1">{offer.title}</h3>
                          <p className="text-slate-400 text-sm line-clamp-2">{offer.summary}</p>
                          <Badge variant="default" size="sm" className="mt-2">
                            {offer.classification}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 text-white">
                        {offer.investmentRange
                          ? `R$ ${(offer.investmentRange.min / 1000).toFixed(0)}k – R$ ${(offer.investmentRange.max / 1000).toFixed(0)}k`
                          : 'Sob consulta'}
                      </td>
                      <td className="p-4 text-white">{offer.revenueRange}</td>
                      <td className="p-4 text-white">{offer.valuationMultiple}</td>
                      <td className="p-4 text-slate-300">{offer.niche}</td>
                      <td className="p-4">
                        <button
                          onClick={() => onRemove(offer.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Remover da comparação"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

