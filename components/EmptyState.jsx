const EmptyState = ({ title = 'Nada por aqui', description = 'Cadastre um ativo ou atualize filtros.' }) => (
  <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center text-slate-400">
    <p className="text-lg text-white">{title}</p>
    <p className="text-sm mt-2">{description}</p>
  </div>
);

export default EmptyState;
