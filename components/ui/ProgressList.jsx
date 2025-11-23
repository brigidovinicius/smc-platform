const statusColors = {
  done: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  inProgress: 'text-blue-300 border-blue-500/40 bg-blue-500/10',
  pending: 'text-muted-foreground border-border bg-muted/50'
};

const ProgressList = ({ items }) => (
  <ul className="space-y-3" role="list" aria-label="Lista de tarefas de progresso">
    {items.map((item) => (
      <li
        key={item.id}
        className={`border rounded-2xl px-4 py-3 flex items-center justify-between ${statusColors[item.status] || statusColors.pending}`}
        role="listitem"
        aria-label={`Tarefa: ${item.title}, Status: ${item.statusLabel}`}
      >
        <div>
          <p className="text-foreground font-semibold">{item.title}</p>
          <p className="text-xs text-muted-foreground" aria-label={`Descrição: ${item.description}`}>
            {item.description}
          </p>
        </div>
        <span className="text-xs uppercase tracking-wide" aria-label={`Status: ${item.statusLabel}`}>
          {item.statusLabel}
        </span>
      </li>
    ))}
  </ul>
);

export default ProgressList;
