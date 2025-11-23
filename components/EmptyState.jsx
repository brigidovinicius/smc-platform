const EmptyState = ({ title = 'Nada por aqui', description = 'Cadastre um ativo ou atualize filtros.' }) => (
  <div 
    className="border border-dashed border-border rounded-2xl p-6 text-center text-muted-foreground"
    role="status"
    aria-live="polite"
    aria-label={`Estado vazio: ${title}`}
  >
    <p className="text-lg text-foreground">{title}</p>
    <p className="text-sm mt-2">{description}</p>
  </div>
);

export default EmptyState;
